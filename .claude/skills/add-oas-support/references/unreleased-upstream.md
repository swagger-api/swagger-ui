# Unreleased Upstream

How a step starts before the swagger-client release it needs (for standalone JSON Schema: the
`json-schema-<dialect>-apidom` strategy, `/add-json-schema-support` decision 5). The
swagger-client PR must be ready: its exit gate passes and its fresh-context review is clean. This
repository then installs a tarball packed from that PR's branch, opens its own PR as a draft, and
merges only after the swagger-client release, with the tarball replaced by it. Without a ready
swagger-client PR, the work waits for it.

npm can't take swagger-client from a git URL: `lib/` and `es/` aren't committed, and it has no
`prepare` script.

## 1. Pack the swagger-client Branch

Keep the repositories, worktrees and tarballs side by side (`~/WebstormProjects/{swagger-ui,
swagger-client, upstream-tarballs, ...}`), so relative `file:` paths resolve from every checkout
and worktree, the swagger-client branch's own included.

```bash
git -C ../swagger-client fetch origin <branch>
git -C ../swagger-client worktree add ../swagger-client-pr-<n> FETCH_HEAD
cd ../swagger-client-pr-<n> && npm ci && npm run build   # npm pack doesn't build
sha=$(git rev-parse --short HEAD); out="$(cd .. && pwd)/upstream-tarballs"; mkdir -p "$out"
f=$(npm pack --silent --pack-destination "$out") && mv "$out/$f" "$out/${f%.tgz}-$sha.tgz"
```

When that branch itself uses ApiDOM tarballs (its `spec-status.mjs` lists them as `UNRELEASED`),
they are already in `../upstream-tarballs/`; its `npm ci` needs them there.

Keep the commit in the file name. npm caches a tarball's content by the integrity in the
lockfile, so a rebuilt tarball under the same name installs the old code, with `npm ci` too.

## 2. Wire Them

Wire the swagger-client tarball and every ApiDOM tarball its branch uses: the swagger-client
tarball's `package.json` names those by paths that only resolve in its own checkout.

- **The spec goes in the root.** `file:../upstream-tarballs/<file>.tgz` in `dependencies` for
  `swagger-client` (already listed there), in `devDependencies` for the ApiDOM packages (they
  reach this repository only through swagger-client).
- **A `$` override for each.** Add `"<name>": "$<name>"` to `overrides`, so every copy in the
  tree takes the tarball, the path inside the swagger-client tarball too. npm refuses a plain
  override of a direct dependency (`EOVERRIDE`), and once a lockfile exists it resolves a relative
  `file:` path written inside `overrides` from `node_modules/` (`ENOENT`), so the paths stay in
  the root fields.

Then `npm install` and check the strategy again
(`ls node_modules/swagger-client/es/resolver/strategies`). `check-plugin-conventions.mjs` reports
each tarball as an `UNRELEASED` warning. Commit `package.json` and `package-lock.json` on their
own: `build(deps): use unreleased swagger-client from swagger-api/swagger-client#<n> (drop before
merge)`. CI can't reach the tarballs, so the PR stays a draft until the release.

## 3. When the swagger-client PR Changes

Pack again (the new commit gives new file names), point the specs at the new files,
`npm install`, and re-run the gates.

## 4. Before Merging

Once the swagger-client release is out, drop the tarball commit, bump `swagger-client` to the
release, `npm install`, and run every gate again. `check-plugin-conventions.mjs` must report no
`UNRELEASED` warning. The release can differ from the branch this PR was built on (review changes
land after "ready"), so the gates run on the release, not on the tarballs.

## Downstream

SwaggerEditor takes this repository's PR the same way before a Swagger UI release, as a
swagger-ui-react tarball built by `flavors/swagger-ui-react/release/run.sh` (its
`references/unreleased-upstream.md`). The tarballs this PR uses reach SwaggerEditor inside that
tarball's `package.json`, so it wires them too; the `UNRELEASED` warnings list them.
