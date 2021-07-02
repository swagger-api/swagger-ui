# Advanced Filter Core Plugin
Use the advanced filter to filter the complete spec.
## Introduction
This plugin reflects common filtering, like we all know from IDE's.  
To enable it use the following configuration. 
```js
const ui = SwaggerUIBundle({
  advancedFilter: {
    enabled: true
  },
  //...
})
```
The focus of this plugin is to implement a base for filtering that can be extended easily using the plugin system.

## Documentation
- [Configuration](#Configuration)
- [Plug Points](#plug-points)
- [Types](#Types)
  -  [AdvancedFilterConfiguration](#AdvancedFilterConfiguration)
  -  [MatcherOptions](#MatcherOptions)
  -  [Matchers](#Matchers)
  -  [BaseMatcherState](#BaseMatcherState)
### Configuration
The advanced filter plugin can be configured using the global SwaggerUI configuration.
To do so you can override the [`AdvancedFilterConfiguration`](#AdvancedFilterConfiguration) defaults (see below), using the key `advancedFilter`.
```js
advancedFilter: {
  phrase: "",
  enabled: false,
  matcherOptions: {
    matchCase: true,
    matchWholeWord: false
  },
  matchers: {
    operations: {
      isActive: true
    },
    tags: {
      isActive: true
    },
    definitions: {
      isActive: true
    }
  }
}
```
### Plug Points
The Advanced Filter fully integrates into the swagger plugin system.
#### Modify spec selectors
In order to apply the filtered spec the advanced filter plugin overrides spec selectors:

```js
...
statePlugins: {
  advancedFilter: {
  ...
  },
  spec: {
    selectors: {
      taggedOperations: (state) => ({ getSystem }) => {
        const { advancedFilterSelectors } = getSystem()
        if (advancedFilterSelectors.isEnabled() && advancedFilterSelectors.getPhrase() !== "") {
          const filteredSpec = advancedFilterSelectors.getFilteredSpec()
          state = state.set("resolvedSubtrees", filteredSpec)
          state = state.set("json", filteredSpec)
        }
        return taggedOperations(state)(getSystem())
      },
      definitions: (state) => ({ getSystem }) => {
        const { advancedFilterSelectors } = getSystem()
        if (advancedFilterSelectors.isEnabled() && advancedFilterSelectors.getPhrase() !== "") {
          const filteredSpec = advancedFilterSelectors.getFilteredSpec()
          state = state.set("resolvedSubtrees", filteredSpec)
          state = state.set("json", filteredSpec)
        }
        return definitions(state)
      },
    },
  },
}
...
```

In this way future matcher results can be reflected back into the spec state selection process too.

#### MatcherOption Conventions
[`MatcherOptions`](#MatcherOptions) keys are mapped to a components via convention below, e.g. `MatcherOption_matchCase`:
```
MatcherOption_{key}
```
These components should renderer the options state. In case of a two-state state a toggle button could be used.

#### Matcher Conventions
In order to maintain the isActive state each matcher must have a component named via convention below, e.g. `MatcherSelectOption_operations` (the keys of [`Matchers`](#Matchers) are used):
```
MatcherSelectOption_{key}
```

#### Matcher fn
Each matcher has a corresponding fn to generate the filtered subset of the current spec for its context.
The fn has following naming convention, e.g. `advancedFilterMatcher_operations`:
```
advancedFilterMatcher_{key}
```
The fn gets called with these arguments `(spec, options, phrase, system)` and should return a `Map` containing the subset of the filtered spec.
#### Creating a matcher plugin
Example for matching operation summary:

```js
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
const opSummaryPlugin = (system) => ({
  components: {
    MatcherSelectOption_operationSummary: ({ getComponent, matcherKey }) => {
      const MatcherSelectOption = getComponent("MatcherSelectOption", true)
      return (
        <MatcherSelectOption matcherKey={matcherKey} label="operation summary" />
      )
    }
  },
  fn: {
    advancedFilterMatcher_operationSummary: (spec, options, phrase, { getSystem }) => {
      const system = getSystem()
      const expr = system.fn.getRegularFilterExpr(options, escapeRegExp(phrase))
      if (expr) {
        return system.fn.getMatchedOperationsSpec(
          (ops) => ops.map(path => path
            .filter(op =>  expr.test(op.get("summary")))
          ),
          spec, system,
        )
      }
    }
  }
})
const ui = SwaggerUIBundle({
  advancedFilter: {
    enabled: true,
    matchers: {
      operationSummary: {
        isActive: true
      }
    }
  },
  plugins: [opSummaryPlugin],
  ....
```

### Types
#### AdvancedFilterConfiguration
This is the public interface model for configuring the advanced filter.
Property | Type | Default | Description
--------- | ------ | ------- | ------------
phrase | `string` | `""` | This is the state for the filter phrase. By default it is a empty string. Empty string will result in not filtering the spec.
enabled | `boolean` | `false` | By default the advanced filter is not enabled. When set to `true` the advanced filter components are rendered and filtering logic is executed.
matcherOptions | [`MatcherOptions`](#MatcherOptions) | see [type](#MatcherOptions) | This is the plug point for configuring matching behavior. This is the state that will be considered by each matcher.
matchers | [`Matchers`](#Matchers) | see [type](#Matchers) | This is the plug point to register matchers. A matcher is able to filter the current OpenAPI Specification, while respecting the matcher options provided.

#### MatcherOptions
This is a dictionary to store the state of each matcher option. Each key will be used to evaluate the corresponding component (see [conventions](#MatcherOption-Conventions)).
Property | Type | Default | Description
--------- | ------ | ------- | ------------
matchCase | `boolean` | `true` | By default the matchers will match case-sensitive. If set to `false` it will rely on regex flag ignore case.
matchWholeWord | `boolean` | `false` | If set to `true` the matchers will only match full words. The matching logic is based on regex and will wrap the escaped phrase with `\b`.

#### Matchers
This is a dictionary to store the state of each matcher. Each key will be used to evaluate the corresponding matcher select option component (see [conventions](#Matcher-Conventions)).
This is the plug point to register matchers. A matcher is able to filter the current OpenAPI Specification, while respecting the matcher options provided. Each matcher has a context e.g. operations matcher - will match the operations and will return updated subset of the spec. The subsets returned by all matchers will be deep assigned with each other. The new filtered spec will be provided to the state in the `advancedFilter` namespace.
Property | Type | Default | Description
--------- | ------ | ------- | ------------
operations | [`BaseMatcherState`](#BaseMatcherState) | `true` | The operations matcher is capable of matching operation paths. In order to keep the spec clean it will add all tags of the filtered operations to the partial spec result. In addition it will add all top level requestBody and response schemas of the filtered operations to the partial spec result(to `#/definitions` or `#/components/schemas`). The filtered spec should include all matching opartions, only used tags and only the models that are used in the operations.
tags | [`BaseMatcherState`](#BaseMatcherState) | `true` | The tags matcher matches is capable of matching tags. The filtered spec will include all operations with a matching tag, all matching tags and all models / schemas used in filtered operations.
definitions | [`BaseMatcherState`](#BaseMatcherState) | `true` | The definitions matcher matches is capable of matching models / schemas by name / title. The filtered spec will include all models / schemas that have matching name / title.

#### BaseMatcherState
This is the base for all matchers.

Property | Type | Default | Description
--------- | ------ | ------- | ------------
isActive | `boolean` | see individual matcher state | This will enable filtering for the matchers context if set to `true`.  
