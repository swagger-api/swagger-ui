module.exports.indent = function indent(str, len, fromLine = 0) {

  return str
    .split("\n")
    .map((line, i) => {
      if (i + 1 >= fromLine) {
        return `${Array(len + 1).join(" ")}${line}`
      } else {
        return line
      }
    })
    .join("\n")
}