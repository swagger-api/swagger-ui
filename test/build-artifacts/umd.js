import { describe, expect, test } from '@jest/globals';
import SwaggerUI from '../../dist/swagger-ui-bundle';

describe('webpack browser umd build', () => {
  test('should export a function for (umd) bundle', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });
});
