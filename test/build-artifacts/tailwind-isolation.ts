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
      if (/--tw-/.test(decl.prop) || /--tw-/.test(decl.value)) {
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
        .filter((selector) => !selector.startsWith('.sui\\:'))
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
});
