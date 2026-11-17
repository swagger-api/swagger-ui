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

// Tailwind wraps some utility selectors, e.g. `:where(.sui\:space-x-2 > :not(:last-child))`.
const SUI_UTILITY_SELECTOR = /^(?::(?:where|is)\()?\.sui\\:/;

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
        .filter((selector) => !SUI_UTILITY_SELECTOR.test(selector))
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
      const { selectors } = rule;
      // Tailwind's own `*, ::before, ::after, ::backdrop` rule initializes the
      // `--sui-tw-*` variables, in the properties layer.
      const isResetOfEveryElement =
        selectors.includes('*') &&
        selectors.includes('::before') &&
        selectors.includes('::after') &&
        enclosingLayer(rule) !== 'swagger-ui.properties';
      if (
        isResetOfEveryElement ||
        selectors.some((selector) => selector.includes('::file-selector-button'))
      ) {
        offenders.push(rule.selector);
      }
    });

    expect(offenders).toEqual([]);
  });
});
