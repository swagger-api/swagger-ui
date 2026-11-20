import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import Sass from 'sass.js';
import SwaggerUI from '../../dist/swagger-ui-bundle';

describe('webpack browser umd build', () => {
  test('should export a function for (umd) bundle', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });

  test('should allow LibSass consumers to compress the bundled stylesheet', async () => {
    const css = fs.readFileSync(path.join(__dirname, '../../dist/swagger-ui.css'), 'utf8');
    const result = await new Promise((resolve) => {
      Sass.compile(css, { style: Sass.style.compressed }, resolve);
    });

    expect(result.formatted).toBeUndefined();
    expect(result.status).toBe(0);
  });
});
