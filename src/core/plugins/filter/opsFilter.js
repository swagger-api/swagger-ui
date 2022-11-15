export default function(taggedOps, phrase) {
  return taggedOps.filter(
    (tagObj, tag) =>
    {
      console.log(tagObj)

      const operations = tagObj.get("operations")
      let is_operation_filtered = false

      operations.forEach(operation => {
        console.log(operation)
        console.log(operation.get("path"))
        console.log(operation.get("id"))

        const is_path_filtered = operation.get("path").toLowerCase().includes(phrase.toLowerCase())
        const is_id_filtered = operation.get("id").toLowerCase().includes(phrase.toLowerCase())

        is_operation_filtered ||= (is_path_filtered || is_id_filtered)
      })

      const is_tag_filtered = tag.includes(phrase.toLowerCase())

      return is_operation_filtered || is_tag_filtered
    }

  )
}
