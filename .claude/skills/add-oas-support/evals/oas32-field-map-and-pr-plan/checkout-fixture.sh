#!/usr/bin/env bash
# Puts swagger-ui at the fixture commit into the run directory: a shared clone of the checkout
# this case lives in (set SWAGGER_UI_REPO to use another clone), with `main` at the fixture.
# Fixture: a398208d (state before PR #10721 (basic OAS 3.2 support)).
set -eu
FIXTURE=a398208d1723ce5dae956cb2a060864092d436c0
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
