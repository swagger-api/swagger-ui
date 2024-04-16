/**
 * @prettier
 */

const InlinePluginFactorization = (options) => () => ({
  fn: options.fn,
  components: options.components,
  state: options.state,
})

export default InlinePluginFactorization
