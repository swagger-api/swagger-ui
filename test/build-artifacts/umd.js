import { describe, expect, test } from '@jest/globals';
import SwaggerUI from '../../dist/swagger-ui-bundle';
import SwaggerUICore from '../../dist/swagger-ui';

describe('webpack browser umd build', () => {
  test('should export a function for (umd) bundle', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });
});

describe('webpack browser umd build', () => {
  test('should export a function for (umd) bundle', () => {
    expect(SwaggerUICore).toBeInstanceOf(Function);
  });
});
