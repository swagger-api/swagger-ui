# Fix for Issue #10574: Include oauth2-redirect.js in npm package

## Problem
The `oauth2-redirect.js` file was missing from the npm package distribution, even though it exists in the repository and is referenced by `oauth2-redirect.html`. This caused OAuth2 authentication to fail when using the npm package.

## Root Cause
The `.npmignore` file had a whitelist approach (excluding everything with `*` and then including specific files with `!`). The file included `!dist/oauth2-redirect.html` but was missing `!dist/oauth2-redirect.js`.

## Solution
Added `!dist/oauth2-redirect.js` to the `.npmignore` file to ensure it's included in the npm package.

## Files Changed
- `.npmignore`: Added `!dist/oauth2-redirect.js` to the whitelist

## Verification
After this fix, running `npm pack swagger-ui` should include:
- `dist/oauth2-redirect.html` ✅ (already included)
- `dist/oauth2-redirect.js` ✅ (now included)

## Impact
- OAuth2 authentication will now work properly when using the npm package
- No breaking changes - this is purely additive
- Maintains backward compatibility

This is a simple but critical fix for OAuth2 functionality in the npm distribution.