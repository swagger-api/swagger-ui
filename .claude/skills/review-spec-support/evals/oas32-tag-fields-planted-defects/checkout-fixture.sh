#!/usr/bin/env bash
# Puts swagger-ui at the fixture commit into the run directory: a shared clone of the checkout
# this case lives in (set SWAGGER_UI_REPO to use another clone), with `main` at the fixture.
# Fixture: ee02195f (main on 2026-10-22, before the rebuilt skills).
set -eu
FIXTURE=ee02195f2796cd2a565c36cdb0a466e8f638bc81
here="$(cd "$(dirname "$0")" && pwd)"
repo="${SWAGGER_UI_REPO:-$(git -C "$here" rev-parse --show-toplevel)}"
tmp="$(mktemp -d)"
git clone --quiet --shared --no-checkout "$repo" "$tmp/repo"
git -C "$tmp/repo" checkout --quiet -B main "$FIXTURE"
# Keep only `main`: other branches and release tags newer than the fixture contain the answers.
git -C "$tmp/repo" remote remove origin
git -C "$tmp/repo" for-each-ref --format='%(refname)' refs/heads refs/tags |
  while read -r ref; do
    [ "$ref" = refs/heads/main ] || git -C "$tmp/repo" update-ref -d "$ref"
  done
cp -R "$tmp/repo/." .
rm -rf "$tmp"

# The branch under review: the planted-defects patch on top of main, committed.
git checkout --quiet -b feat/oas32-tag-fields
git apply "$here/files/planted-defects.patch"
git add -A
git -c user.name=fixture -c user.email=fixture@example.invalid commit --quiet -m "feat(oas32): render Tag summary, kind and parent"
