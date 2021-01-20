export const extractTagsFromOperations = (operations) => {
  return operations
    .flatMap(method => method.map(op => op.get("tags")))
}
