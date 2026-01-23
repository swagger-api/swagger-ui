# OpenAPI 3.2.0 Specification Analysis

## Version Information
- **Version**: 3.2.0
- **Release Date**: September 2025
- **Previous Version**: 3.1.0
- **JSON Schema Version**: Draft 2020-12 (same as 3.1.x)
- **Specification URL**: https://spec.openapis.org/oas/v3.2.0.html

## Summary

OpenAPI 3.2.0 is a **minor version** update that adds backward-compatible features to OAS 3.1.x. Key additions focus on:
- Self-referencing URIs for base URI resolution
- Custom HTTP method support (QUERY and custom methods)
- Enhanced component reusability (mediaTypes, pathItems)
- Relaxed required fields constraint

## New Top-Level Fields

### 1. `$self` (OpenAPI Object)
- **Location**: Root level (sibling to `openapi`, `info`, `paths`, etc.)
- **Type**: `string` (URI reference)
- **Required**: No (optional)
- **Purpose**: Provides the self-assigned URI of the document, serving as its base URI
- **Swagger UI Impact**: Display in info section, use for reference resolution
- **Example**:
```yaml
openapi: 3.2.0
$self: "https://apidescriptions.example.com/my-api"
info:
  title: My API
```

## New Path Item Object Fields

### 2. `query` Operation
- **Location**: Path Item Object (sibling to `get`, `post`, etc.)
- **Type**: Operation Object
- **Required**: No (optional)
- **Purpose**: Supports QUERY HTTP method per draft-ietf-httpbis-safe-method-w-body
- **Swagger UI Impact**: Render as new operation type (similar to GET/POST), add to operation list
- **Example**:
```yaml
paths:
  /search:
    query:
      summary: Search with query payload
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Search results
```

### 3. `additionalOperations` Field
- **Location**: Path Item Object
- **Type**: Map[`string`, Operation Object]
- **Required**: No (optional)
- **Purpose**: Allows defining custom HTTP methods beyond standard ones
- **Swagger UI Impact**: Render custom operations with method name displayed
- **Example**:
```yaml
paths:
  /resource:
    additionalOperations:
      COPY:
        summary: Copy resource
        responses:
          '200':
            description: Resource copied
      LOCK:
        summary: Lock resource
        responses:
          '200':
            description: Resource locked
```

## New Components Object Fields

### 4. `mediaTypes` Field
- **Location**: Components Object
- **Type**: Map[`string`, Media Type Object | Reference Object]
- **Required**: No (optional)
- **Purpose**: Holds reusable Media Type Objects for component-level reference
- **Swagger UI Impact**: Display in components section (similar to schemas, responses)
- **Example**:
```yaml
components:
  mediaTypes:
    JsonError:
      schema:
        $ref: '#/components/schemas/Error'
      examples:
        genericError:
          $ref: '#/components/examples/GenericError'
```

### 5. `pathItems` Field
- **Location**: Components Object
- **Type**: Map[`string`, Path Item Object]
- **Required**: No (optional)
- **Purpose**: Provides reusable Path Item Objects for consistent endpoint definitions
- **Swagger UI Impact**: Display in components section, render as path templates
- **Example**:
```yaml
components:
  pathItems:
    UserEndpoint:
      get:
        summary: Get user
        responses:
          '200':
            description: Success
      put:
        summary: Update user
        responses:
          '200':
            description: Updated
```

## Modified Existing Fields

### 6. OpenAPI Object Requirements
- **Change**: Modified constraint on required fields
- **Previous (3.1)**: Required `paths` OR `webhooks` (at least one)
- **Current (3.2)**: Required at least one of `components`, `paths`, OR `webhooks`
- **Purpose**: Greater flexibility for component-only specifications
- **Swagger UI Impact**: Update validation logic, handle component-only specs
- **Example**:
```yaml
# Valid OAS 3.2 spec with only components
openapi: 3.2.0
info:
  title: Shared Components
  version: 1.0.0
components:
  schemas:
    User:
      type: object
  # No paths or webhooks required!
```

## Features Already in OAS 3.1 (No Implementation Needed)

The following features are already supported by the existing OAS 3.1 plugin:
- ✅ `webhooks` - Already implemented in OAS 3.1
- ✅ `jsonSchemaDialect` - Already implemented in OAS 3.1
- ✅ `mutualTLS` authentication - Already implemented in OAS 3.1
- ✅ JSON Schema 2020-12 support - Already implemented in OAS 3.1
- ✅ `info.summary` - Already implemented in OAS 3.1
- ✅ `license.identifier` - Already implemented in OAS 3.1

## Swagger UI Component Mapping

| OAS 3.2 Feature | Component Type | Implementation Approach |
|----------------|----------------|------------------------|
| **`$self`** | Simple display component | New component: `SelfUri.jsx`, selector: `selectSelfUriField`, display in info section |
| **`query` operation** | Extend Operations component | Wrap Operations component to include QUERY method in operation list, add QUERY button style |
| **`additionalOperations`** | Extend Operations component | Wrap Operations component to render custom operations from map, display custom method names |
| **`mediaTypes` in Components** | Components list display | New component: `MediaTypes.jsx`, selector: `selectMediaTypes`, render as collapsible list |
| **`pathItems` in Components** | Components list display | New component: `PathItems.jsx`, selector: `selectPathItems`, render as collapsible path list |
| **Modified requirements** | Validation logic | Update spec validation, ensure component-only specs render correctly |

## Implementation Priority

### High Priority (Core Functionality)
1. **`query` operation** - Visible feature, affects API exploration
2. **`additionalOperations`** - Visible feature, enables custom methods
3. **Version detection** - Required for all features to work

### Medium Priority (Reusability)
4. **`mediaTypes` in Components** - Improves component reusability
5. **`pathItems` in Components** - Improves component reusability

### Low Priority (Metadata)
6. **`$self`** - Metadata field, low user impact but useful for reference resolution

### Validation Updates
7. **Modified requirements** - Update validation logic to accept component-only specs

## Breaking Changes

**None** - OAS 3.2.0 is fully backward compatible with OAS 3.1.x

## Deprecated Features

**None** - No features were deprecated in OAS 3.2.0

## Implementation Strategy

Since OAS 3.2 is a **minor version update** with backward-compatible additions:

1. **Reuse OAS 3.1 base** - Extend from OAS 3.1 plugin rather than reimplementing
2. **Lightweight components** - Only implement new features, reuse existing components
3. **Minimal wrapping** - Only wrap components that need modification (Operations)
4. **Selector additions** - Add selectors for new fields, avoid modifying existing selectors
5. **Version detection regex** - `/^3\.2\.(?:[1-9]\d*|0)$/`

## Testing Requirements

### Unit Tests
- Version detection (isOAS32) with various version strings
- Selector tests for new fields ($self, mediaTypes, pathItems)
- Component rendering tests for each new feature

### E2E Tests
- OAS 3.2 spec with `query` operations
- OAS 3.2 spec with `additionalOperations` (COPY, LOCK methods)
- OAS 3.2 spec with `mediaTypes` in components
- OAS 3.2 spec with `pathItems` in components
- Component-only spec (no paths or webhooks)
- OAS 3.2 spec with `$self` URI

### Test Fixtures
Create example OAS 3.2 specs in `test/e2e-cypress/static/documents/oas32/`:
- `query-operation.yaml` - Demonstrates QUERY method
- `additional-operations.yaml` - Demonstrates custom HTTP methods
- `components-reusable.yaml` - Demonstrates mediaTypes and pathItems
- `component-only.yaml` - Spec with only components, no paths
- `complete-example.yaml` - Comprehensive example with all new features

## Notes

- OAS 3.2 maintains the same JSON Schema version (2020-12) as OAS 3.1
- No new authentication types were introduced
- No new security schemes were added
- No changes to callback or link objects
- The specification document emphasizes enhanced reference resolution mechanisms
