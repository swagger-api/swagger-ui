import SwaggerUI from '../../dist/swagger-ui-bundle';

describe('webpack browser umd build', () => {
  test.skip('should export a function for (umd) bundle', () => {
    expect(SwaggerUI).toBeInstanceOf(Function);
  });
});
