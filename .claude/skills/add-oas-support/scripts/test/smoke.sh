#!/usr/bin/env bash
# Smoke test for the add-oas-support scripts: --help, bad arguments, and real invocations whose
# findings are known, checking exit codes and key output lines. check-plugin-conventions runs on
# a scratch clone with the review-spec-support planted-defects patch applied, so its diff checks
# (HAND-GUARD, NOT-TS, CORE-TOUCH) and tree checks (DIALECT, EXPORT) all have a real trigger.
#
# Usage: bash .claude/skills/add-oas-support/scripts/test/smoke.sh   (from any directory)
#        SMOKE_OFFLINE=1 skips the verify-urls checks that need the network.
# Exit codes: 0 all checks passed, 1 a check failed.
set -uo pipefail

SCRIPTS=$(cd "$(dirname "$0")/.." && pwd)
ROOT=$(cd "$SCRIPTS/../../../.." && pwd)
PATCH="$ROOT/.claude/skills/review-spec-support/evals/oas32-tag-fields-planted-defects/files/planted-defects.patch"
FIXTURE=ee02195f2796cd2a565c36cdb0a466e8f638bc81
FIXTURES="$SCRIPTS/test/fixtures"
cd "$ROOT" || exit 1
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
FAILED=0

# check <name> <expected exit codes, e.g. "0" or "0|1"> <command...>; output in $TMP/out
check() {
  local name=$1 expected=$2
  shift 2
  "$@" >"$TMP/out" 2>&1
  local code=$?
  if [[ "|$expected|" == *"|$code|"* ]]; then
    printf 'ok    %-58s exit %s\n' "$name" "$code"
  else
    printf 'FAIL  %-58s exit %s, expected %s\n' "$name" "$code" "$expected"
    sed 's/^/      /' "$TMP/out" | tail -5
    FAILED=1
  fi
}
# expect_output <name> <grep -E pattern>: asserts on the last check's output
expect_output() {
  if grep -qE "$2" "$TMP/out"; then
    printf 'ok    %-58s\n' "$1"
  else
    printf 'FAIL  %-58s pattern not found: %s\n' "$1" "$2"
    FAILED=1
  fi
}

for script in check-plugin-conventions check-field-coverage diff-spec-versions verify-urls; do
  check "$script --help" 0 node "$SCRIPTS/$script.mjs" --help
  expect_output "$script --help documents exit codes" 'Exit codes'
  check "$script --bogus" 2 node "$SCRIPTS/$script.mjs" --bogus
done
check 'check-field-coverage (no arguments)' 2 node "$SCRIPTS/check-field-coverage.mjs"
check 'check-field-coverage (no --plugin)' 2 node "$SCRIPTS/check-field-coverage.mjs" README.md
check 'verify-urls (no arguments)' 2 node "$SCRIPTS/verify-urls.mjs"
check 'diff-spec-versions (one argument)' 2 node "$SCRIPTS/diff-spec-versions.mjs" 3.2.0
check 'diff-spec-versions --rename without Object' 2 node "$SCRIPTS/diff-spec-versions.mjs" \
  "$FIXTURES/spec-old.md" "$FIXTURES/spec-new.md" --rename "Root=Document"
check 'diff-spec-versions on a non-spec file' 2 node "$SCRIPTS/diff-spec-versions.mjs" README.md README.md

# diff-spec-versions: offline fixtures exercising every status, 2.0-style rows and --rename
check 'diff-spec-versions on the fixtures (--rename)' 0 node "$SCRIPTS/diff-spec-versions.mjs" \
  "$FIXTURES/spec-old.md" "$FIXTURES/spec-new.md" --rename "Root Object=Document Object"
expect_output 'counts per status (^x- rows skipped)' '3 NEW, 3 REMOVED, 1 CHANGED-TYPE, 1 CHANGED-REQUIRED, 2 REVIEW, 2 INHERITED'
expect_output 'renamed object compared in place' '^\| Document \| items \| Item Object → Item Object \\\| Reference Object \|.*CHANGED-TYPE'
expect_output 'field removed here, new elsewhere: moved? hint' '^\| Item \| note \|.*REMOVED \(moved\? Server Object\)'
expect_output '2.0-style required marker read' '^\| Item \| name \|.*CHANGED-REQUIRED \(required → optional\)'
expect_output 'widened value set listed as an added token' 'added tokens: `querystring`'
expect_output 'removed object listed' '^\| Old Thing Object \| REMOVED \|'
expect_output 'four-column table: required read from Description' '^\| Scheme \| type \| `string` \| yes \| REVIEW'
expect_output 'four-column table: value tokens compared' 'removed tokens: `basic`'
if grep -q 'No Server Object' "$TMP/out"; then
  printf 'FAIL  %-58s\n' 'example heading without fields is not an object'
  FAILED=1
else
  printf 'ok    %-58s\n' 'example heading without fields is not an object'
fi
check 'diff-spec-versions on the fixtures (no --rename)' 0 node "$SCRIPTS/diff-spec-versions.mjs" \
  "$FIXTURES/spec-old.md" "$FIXTURES/spec-new.md"
expect_output 'without --rename the root is REMOVED with a moved? hint' '^\| Root \| version \|.*REMOVED \(moved\? Document Object\)'

# check-field-coverage: a field map and a keyword map; one row covered, one not, rest skipped
cat >"$TMP/map.md" <<'EOF'
| Object | Field | Type | Required | Status | UI impact | Scope |
|--------|-------|------|----------|--------|-----------|-------|
| Path Item | additionalOperations | Map[string, Operation] | no | NEW | operations | PR 2 |
| Path Item | zzzNotAFieldAnywhere | string | no | NEW | none | PR 2 |
| Info | summary | string | no | INHERITED (3.1) | info | - |
| Server | name | string | no | NEW | servers | deferred (later) |
| {Object} | {field} | {type} | no | NEW | {component} | PR 2 |

| Vocabulary | Keyword | Value shape | Status | Baseline behaviour | Target behaviour | Scope |
|------------|---------|-------------|--------|--------------------|------------------|-------|
| applicator | `prefixItems` | [schema] | NEW | x | y | PR 3 |
| applicator | `items` | schema or [schema] (2020-12: schema) | CHANGED-SHAPE | x | y | PR 3 |
| core | `definitions` | {schema} | RENAMED → `$defs` | x | y | PR 3 |
| unevaluated | `unevaluatedItems` | - | NOT-IN-DRAFT | x | y | PR 1 |
EOF
check 'check-field-coverage on a synthetic map' 1 node "$SCRIPTS/check-field-coverage.mjs" \
  "$TMP/map.md" --plugin src/core/plugins/oas32 --plugin src/core/plugins/json-schema-2020-12
expect_output 'covered field is ok' '^ok +Path Item\.additionalOperations'
expect_output 'uncovered field is MISSING' '^MISSING src, test, fixture +Path Item\.zzzNotAFieldAnywhere'
expect_output 'keyword map rows are read' 'applicator\.prefixItems'
expect_output 'CHANGED-SHAPE keyword rows are checked' 'applicator\.items +\[CHANGED-SHAPE\]'
expect_output 'RENAMED keyword rows are checked' 'core\.definitions +\[RENAMED'
expect_output 'INHERITED, NOT-IN-DRAFT, deferred, placeholder rows skipped' '^5 row\(s\) in scope'
check 'check-field-coverage --scope "PR 2"' 1 node "$SCRIPTS/check-field-coverage.mjs" \
  "$TMP/map.md" --plugin src/core/plugins/oas32 --scope "PR 2"
expect_output '--scope keeps only that PR'"'"'s rows' '^2 row\(s\) in scope'
check 'check-field-coverage --scope with no rows' 2 node "$SCRIPTS/check-field-coverage.mjs" \
  "$TMP/map.md" --plugin src/core/plugins/oas32 --scope "PR 20"

# check-plugin-conventions: the planted-defects branch on a scratch clone of the fixture
if [[ -f "$PATCH" ]] && git cat-file -e "$FIXTURE^{commit}" 2>/dev/null; then
  git clone --quiet --shared --no-checkout "$ROOT" "$TMP/clone"
  git -C "$TMP/clone" checkout --quiet -B main "$FIXTURE"
  git -C "$TMP/clone" apply "$PATCH"
  # DIALECT only reads changed files; the fixture's model.jsx carries the wrong URL already, so touch it
  echo '// touched' >>"$TMP/clone/src/core/plugins/oas32/wrap-components/model.jsx"
  # parent shell, not a subshell, so check's FAILED=1 survives
  pushd "$TMP/clone" >/dev/null || exit 1
  check 'check-plugin-conventions on the planted branch' 1 \
    node "$SCRIPTS/check-plugin-conventions.mjs" --base main
  popd >/dev/null || exit 1
  expect_output 'HAND-GUARD in the hand-written wrapper' 'WARNING +HAND-GUARD +src/core/plugins/oas32/wrap-components/operation-tag\.tsx'
  expect_output 'NOT-TS for the plain-JS Playwright spec' 'ERROR +NOT-TS +test/e2e-playwright/features/oas32/oas32-tag-fields\.spec\.js'
  expect_output 'CORE-TOUCH for the shared component' 'NOTE +CORE-TOUCH +src/core/components/operation-tag\.jsx'
  expect_output 'DIALECT for the oas32 document-schema URL' 'ERROR +DIALECT +src/core/plugins/oas32/wrap-components/model\.jsx'
  expect_output 'EXPORT for the missing OpenAPI32 entry' 'NOTE +EXPORT +src/core/plugins/oas32'
  if grep -q 'PRAGMA' "$TMP/out"; then
    printf 'FAIL  %-58s\n' 'no PRAGMA finding (every new file has the pragma)'
    FAILED=1
  else
    printf 'ok    %-58s\n' 'no PRAGMA finding (every new file has the pragma)'
  fi
else
  printf 'skip  %-58s (patch or fixture commit missing)\n' 'check-plugin-conventions on the planted branch'
fi

# verify-urls: one good anchor, one missing anchor
if [[ -z "${SMOKE_OFFLINE:-}" ]]; then
  printf '%s\n' 'good https://spec.openapis.org/oas/v3.2.0.html#tag-parent' \
    'bad https://spec.openapis.org/oas/v3.2.0.html#tag-object-fields' >"$TMP/urls.md"
  check 'verify-urls on a good and a broken anchor' 1 node "$SCRIPTS/verify-urls.mjs" "$TMP/urls.md"
  expect_output 'missing anchor is BROKEN' '^BROKEN +https://spec\.openapis\.org/oas/v3\.2\.0\.html#tag-object-fields'
  expect_output 'only one URL broken' '1 broken'
fi

exit $FAILED
