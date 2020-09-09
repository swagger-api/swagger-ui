import { describe, expect, test } from '@jest/globals';
import SwaggerUI from '../../dist/swagger-ui-es-bundle-core';

describe('webpack browser es-bundle-core build', () => {
  test('should export a function for es-bundle-core', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });
});
