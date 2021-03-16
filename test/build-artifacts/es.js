import { describe, expect, test } from '@jest/globals';
import SwaggerUI from '../../es';

describe('webpack browser es build', () => {
  test('should export a function for es-bundle', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });
});
