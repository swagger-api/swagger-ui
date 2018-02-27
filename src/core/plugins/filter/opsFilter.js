export default function(taggedOps, phrase) {
  return taggedOps.filter((tagObj, tag) => tag.indexOf(phrase) !== -1)
}
