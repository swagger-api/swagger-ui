# Error transformers

Error transformers provide a standard interface for making generated error messages more useful to end users.

### Inputs & outputs

Each transformer's `transform` function is given an Immutable List of Immutable Maps as its first argument.

It is expected that each `transform` function returns a List of similarly-formed Maps.

These errors originate from the Redux error actions that add errors to state. Errors are transformed before being passed into the reducer.

It's important that all the keys present in each error (specifically, `line`, `level`, `message`, `source`, and `type`) are present when the transformer is finished.

##### Deleting an error

If you want to delete an error completely, you can overwrite it with `null`. The null value will be filtered out of the transformed error array before the errors are returned.
å

### Example transformer

This transformer will increase all your line numbers by 10.

```
export function transform(errors) {
  return errors.map(err => {
    err.line += 10
    return err
  })
}
```
