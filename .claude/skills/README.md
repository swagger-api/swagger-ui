# Swagger UI Claude Skills

This directory contains custom skills for working with the Swagger UI codebase in Claude Code.

## Available Skills

### `/add-oas-support` - Add OpenAPI Specification Version Support

Comprehensive skill for adding support for a new OpenAPI Specification version to Swagger UI.

**Usage:**
```
/add-oas-support --version 4.0 --type major
/add-oas-support --version 3.2 --type minor
```

**Parameters:**
- `--version` (required): The OpenAPI version to add support for (e.g., "3.2", "4.0")
- `--type` (optional): Version type - "major" or "minor" (default: "minor")

**Structure:**
The skill includes both a **Quick Reference** section at the top for experienced developers, and a **comprehensive guide** below for detailed implementation instructions.

**What it does:**
1. **Analyzes the target OAS version specification using WebFetch**
   - Fetches official spec from https://spec.openapis.org/
   - Systematically identifies new/modified/removed fields
   - Maps specification changes to Swagger UI components
   - Creates specification change document
2. Creates the plugin directory structure
3. Implements version detection logic
4. Creates selector factories and component wrappers
5. Implements new feature components based on spec analysis
6. Handles authentication changes
7. Registers plugin in presets
8. Adds unit and E2E tests
9. Updates documentation
10. Runs full test suite

**Key Features:**
- ✅ **Quick Reference** section for rapid development
- ✅ Comprehensive specification analysis workflow using WebFetch
- ✅ Detailed mapping table from spec changes → components (15+ change types)
- ✅ Real examples from OAS 3.1 implementation (6 detailed examples)
- ✅ Iterative spec-driven development approach
- ✅ Component-by-component verification checklist
- ✅ Best practices for continuous spec reference
- ✅ WebFetch query templates for spec analysis
- ✅ Common pitfalls and solutions
- ✅ Pre-submit checklist

**Based on:**
This skill follows the patterns established by the OAS 3.1 implementation (commit history analyzed from `src/core/plugins/oas31/`).

**Key patterns:**
- Plugin-based architecture with Redux state management
- Selector factories for version-specific logic
- Component wrapping for conditional rendering
- afterLoad lifecycle hooks for function overrides
- Plugin loading order (new version loaded LAST)

**Prerequisites:**
- Understanding of Swagger UI plugin architecture
- Access to the new OAS specification document
- All existing tests passing

**Example workflow:**

Adding OAS 4.0 support:
```
# Start the skill
/add-oas-support --version 4.0 --type major

# Claude will:
# 1. Ask about new features in OAS 4.0
# 2. Create plugin directory structure
# 3. Generate boilerplate code
# 4. Guide through implementation
# 5. Add tests
# 6. Update documentation
# 7. Verify build
```

## Creating New Skills

To create a new skill for Swagger UI:

1. Create a markdown file in `.claude/skills/`
2. Add frontmatter with skill metadata:
   ```yaml
   ---
   name: skill-name
   description: Brief description
   args:
     param1:
       description: "Parameter description"
       required: true
       type: string
   ---
   ```
3. Write comprehensive instructions following the patterns in existing skills
4. Document common pitfalls and best practices
5. Include code templates with placeholders
6. Add to this README

## Skill Development Guidelines

When creating skills for Swagger UI:

1. **Follow project conventions:**
   - No semicolons
   - Double quotes
   - @prettier pragma in all new files
   - .jsx extension for React components

2. **Use the plugin architecture:**
   - Don't modify core unnecessarily
   - Follow established patterns
   - Load new plugins at the end of presets

3. **Include comprehensive tests:**
   - Unit tests for logic
   - Component tests for UI
   - E2E tests for integration

4. **Document thoroughly:**
   - Update CLAUDE.md
   - Update relevant docs
   - Add inline JSDoc comments

5. **Security first:**
   - Use DOMPurify for HTML
   - Validate all input
   - Follow OWASP guidelines

## Contributing

To contribute new skills:

1. Fork the repository
2. Create skill in `.claude/skills/`
3. Test thoroughly
4. Update this README
5. Submit pull request

## Resources

- **CLAUDE.md** - Comprehensive codebase guide
- **Plugin API** - `docs/customization/plugin-api.md`
- **Development Setup** - `docs/development/setting-up.md`
- **Contributing Guide** - https://github.com/swagger-api/.github/blob/HEAD/CONTRIBUTING.md
