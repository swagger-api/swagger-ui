export const copyToClipboard = str => {
  // adapted from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  const el = document.createElement("textarea")
  el.value = str
  el.setAttribute("readonly", "")
  el.style.position = "absolute"
  el.style.left = "-9999px"

  document.body.appendChild(el)
  // preserve selection
  const selected =
    document.getSelection().rangeCount > 0
    ? document.getSelection().getRangeAt(0)
    : false
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}
