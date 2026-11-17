import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import postcss from 'postcss';
import type { AtRule, Root } from 'postcss';

const cssPath = path.join(__dirname, '..', '..', 'dist', 'swagger-ui.css');

const loadCss = (): Root => postcss.parse(fs.readFileSync(cssPath, 'utf8'));

const enclosingLayer = (node: { parent?: unknown }): string | undefined => {
  let current = node.parent as AtRule | Root | undefined;
  while (current && current.type !== 'root') {
    if (current.type === 'atrule' && current.name === 'layer') {
      return current.params;
    }
    current = current.parent as AtRule | Root | undefined;
  }
  return undefined;
};

// Same grammar as the namespace pass in webpack/stylesheets.js: a `--tw-` inside
// a string or a `url()` is content, not a variable.
const stripLiterals = (value: string): string =>
  value.replace(
    /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|url\((?:"[^"]*"|'[^']*'|[^)]*)\)/gi,
    ''
  );

// A utility selector must not match an element that has no `sui:` class. It is checked by
// reducing it to the parts that decide what it matches: a `sui:` class scopes it, and so
// does a `:is()` or `:where()` whose alternatives all do. Tailwind wraps some selectors in
// them: `:where(.sui\:space-x-2 > :not(:last-child))` and
// `:is(:where(.sui\:peer\/x):hover ~ .sui\:peer-hover\/x\:block)`. A `sui:` class that is
// only mentioned, as in `:is(.sui\:flex, button)` or `:not(.sui\:hidden)`, does not scope.
const SCOPED = '{scoped}'; // a part of a selector that requires a `sui:` class
const NOT_SCOPED = '{not scoped}'; // any other part (a `{` can't occur in a selector)
const POSITIVE_FUNCTION = /^(is|where|matches|-webkit-any|-moz-any)$/;

const isSuiScoped = (selector: string): boolean => {
  // Strings are emptied and a `sui:` class becomes a marker, escapes inside its name
  // included. Any other escape (`\(`, `\,`) becomes a plain character, so that it is not
  // taken for syntax.
  let rest = selector
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""')
    .replace(/\.sui\\:(?:\\.|[^\s.:#>+~,()[\]\\])*/g, SCOPED)
    .replace(/\\./g, '_');

  // The innermost `:name(...)` group is replaced by a marker, until no group is left. Only
  // `:is()` and `:where()` can pass the scope on, and only when every alternative has it.
  const group = /:([\w-]+)\(([^()]*)\)/;
  while (group.test(rest)) {
    rest = rest.replace(group, (_, name: string, args: string) =>
      POSITIVE_FUNCTION.test(name) &&
      postcss.list.comma(args).every((part) => part.includes(SCOPED))
        ? SCOPED
        : NOT_SCOPED
    );
  }

  // A parenthesis left over is a shape this function does not model, so it fails.
  if (/[()]/.test(rest)) return false;

  return postcss.list.comma(rest).every((branch) => branch.includes(SCOPED));
};

// The keyframes of Tailwind's default theme (`spin`, `ping`, ...): global names that
// would collide with a host page's own animations.
const tailwindKeyframeNames = (): string[] => {
  const names: string[] = [];
  postcss
    .parse(fs.readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8'))
    .walkAtRules('keyframes', (atRule) => {
      names.push(atRule.params);
    });
  return names;
};

describe('swagger-ui.css Tailwind isolation', () => {
  const root = loadCss();

  test('contains the Tailwind output', () => {
    expect(root.toString()).toContain('tailwindcss v4');
  });

  test('declares only cascade layers in the swagger-ui namespace', () => {
    const layerNames: string[] = [];
    root.walkAtRules('layer', (atRule) => {
      atRule.params
        .split(',')
        .map((name) => name.trim())
        .forEach((name) => layerNames.push(name));
    });

    expect(layerNames.length).toBeGreaterThan(0);
    expect(
      layerNames.filter(
        (name) =>
          ![
            'swagger-ui.properties',
            'swagger-ui.theme',
            'swagger-ui.utilities',
          ].includes(name)
      )
    ).toEqual([]);
  });

  test('leaks no unprefixed Tailwind custom properties', () => {
    const leaks: string[] = [];
    root.walkDecls((decl) => {
      if (/--tw-/.test(decl.prop) || /--tw-/.test(stripLiterals(decl.value))) {
        leaks.push(`${decl.prop}: ${decl.value}`);
      }
    });
    root.walkAtRules('property', (atRule) => {
      if (!atRule.params.startsWith('--sui-')) leaks.push(atRule.params);
    });

    expect(leaks).toEqual([]);
  });

  test('styles only sui-prefixed classes in the utilities layer (no preflight)', () => {
    const offenders: string[] = [];
    root.walkRules((rule) => {
      if (enclosingLayer(rule) !== 'swagger-ui.utilities') return;
      rule.selectors
        .filter((selector) => !isSuiScoped(selector))
        .forEach((selector) => offenders.push(selector));
    });

    expect(offenders).toEqual([]);
  });

  test('defines only sui-prefixed theme variables', () => {
    const offenders: string[] = [];
    root.walkDecls((decl) => {
      if (enclosingLayer(decl) !== 'swagger-ui.theme') return;
      if (!decl.prop.startsWith('--sui-')) offenders.push(decl.prop);
    });

    expect(offenders).toEqual([]);
  });

  test('declares no unprefixed Tailwind keyframes', () => {
    const tailwind = tailwindKeyframeNames();
    const found: string[] = [];
    root.walkAtRules('keyframes', (atRule) => {
      if (tailwind.includes(atRule.params)) found.push(atRule.params);
    });

    expect(tailwind.length).toBeGreaterThan(0);
    expect(found).toEqual([]);
  });

  test('includes no Tailwind preflight', () => {
    const offenders: string[] = [];
    root.walkRules((rule) => {
      // The minified CSS writes `:before` and `:after` for `::before` and `::after`.
      const selectors = rule.selectors.map((selector) =>
        selector.replace(/::(before|after)/g, ':$1')
      );
      // Tailwind's own `*, ::before, ::after, ::backdrop` rule initializes the
      // `--sui-tw-*` variables, in the properties layer.
      const isResetOfEveryElement =
        selectors.includes('*') &&
        selectors.includes(':before') &&
        selectors.includes(':after') &&
        enclosingLayer(rule) !== 'swagger-ui.properties';
      // `sui:file:` utilities style `::file-selector-button` of their own element.
      const stylesEveryFileButton = rule.selectors.some(
        (selector) =>
          selector.includes('::file-selector-button') && !isSuiScoped(selector)
      );
      if (isResetOfEveryElement || stylesEveryFileButton) {
        offenders.push(rule.selector);
      }
    });

    expect(offenders).toEqual([]);
  });
});

describe('isSuiScoped', () => {
  test.each([
    ['.sui\\:flex'],
    ['.sui\\:x:where(.dark-mode, .dark-mode *)'],
    ['.dark-mode .sui\\:x'],
    ['.sui\\:x:is(.a, .b)'],
    ['.sui\\:w-0\\.5'],
    ['.sui\\:bg-\\[url\\(x\\)\\]'],
    ['.sui\\:x[data-a="b,c"]'],
    ['.sui\\:x::file-selector-button'],
    ['a:is(.sui\\:x):not(.y)'],
    [':is(.sui\\:a, .sui\\:b) > *'],
    [':is(.x :where(.sui\\:a), .sui\\:b)'],
    [':where(.sui\\:space-x-2 > :not(:last-child))'],
    [':where(.sui\\:group):hover .sui\\:y'],
    [':is(:where(.sui\\:a):hover ~ *)'],
    ['.sui\\:peer-hover\\/ref\\:block:is(:where(.sui\\:peer\\/ref):hover ~ *)'],
  ])('accepts %s', (selector) => {
    expect(isSuiScoped(selector)).toBe(true);
  });

  test.each([
    ['*'],
    [':root'],
    ['button'],
    ['.dark-mode'],
    ['.foo .bar'],
    ['::file-selector-button'],
    [':is(.sui\\:flex, button)'],
    [':is(:not(.sui\\:a), .sui\\:b)'],
    [':not(.sui\\:hidden)'],
    ['*:not(.sui\\:x)'],
    ['.a:not(.sui\\:b)'],
    ['button:has(.sui\\:x)'],
    ['[data-x=".sui\\:fake"]'],
    ['button[title="a,b"]'],
    ['.a[title="x\\"y("]'],
    ['(.sui\\:x'],
    ['.sui\\:x:is('],
    [':is(.sui\\:a))'],
  ])('rejects %s', (selector) => {
    expect(isSuiScoped(selector)).toBe(false);
  });
});
