/**
 * @prettier
 */

const InlinePluginFactorization = (options) => () => ({
  fn: options.fn,
  components: options.components,
})

export default InlinePluginFactorization
