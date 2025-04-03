/**
 * @prettier
 */

module.exports = {
  plugins: ["stylelint-prettier"],
  customSyntax: "postcss-scss",
  rules: {
    "prettier/prettier": [true, { requirePragma: false, insertPragma: false }],
  },
}
