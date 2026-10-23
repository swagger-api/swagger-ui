# Claude Code Skills for Swagger UI

Skills for the two kinds of specification work in this repository: adding an OpenAPI version,
and rendering standalone JSON Schema documents. They are modelled on the ApiDOM skills
(`swagger-api/apidom`, `.claude/skills/`), which cover the upstream half of the same work.

## Recent Updates

**2026-10-22**: Rebuilt from the reviews of the OAS 3.2 PRs (#10721, #11090, #10956, #11099).

- `/add-oas-support` replaces the 2,300-line flat `add-oas-support.md` (which Claude Code never
  discovered as a skill, because skills are directories) with a phased workflow: an investigation
  built on a field-level diff of the two versions (`diff-spec-versions.mjs`), a basic-support PR
  that is parity with the previous version only, then one PR per new feature and, for a major
  version, one per breaking change. References are copied from the oas32 plugin.
- New `/add-json-schema-support` for the "Standalone JSON Schema" design doc.
- New `/review-spec-support`, the fresh-context spec review both skills run as a gate.
- Evals in skill-creator's case-folder format, on fixture commits, including cases for versions
  no skill mentions.
- Removed `SKILL_USAGE_EXAMPLE.md` (a fictional OAS 4.0 walkthrough).

## Skill Layout

```
{skill}/
├── SKILL.md        workflow, rules, checklist (loaded on invocation)
├── references/     templates and detailed guidance, read at the step that names them
├── scripts/        deterministic gates (add-oas-support only; the other skills call them)
└── evals/{case}/   prompt.md, case.yaml, graders/, checkout-fixture.sh, files/
```

## Skills

| Skill | Use it for | Chains to |
|-------|------------|-----------|
| `/add-oas-support` | A new OAS version (patch, minor or major), or a single new field of a recent version. Phase 0 checks the swagger-client/ApiDOM prerequisites; Phase 1 diffs the versions into a field map with a compatibility classification and a one-feature-per-PR plan in an uncommitted `ADD-OAS-{X.Y}.md`; Phase 2 is PR 1, basic support (parity with the previous version, for a major its backward-compatible part); Phase 3 is one PR per new feature, changed field and breaking change. Every PR is gated. | `/review-spec-support` per PR; ApiDOM `/add-spec-version` when the prerequisites are missing |
| `/add-json-schema-support` | Standalone JSON Schema documents per draft (2020-12 first). Puts the design decisions to the user, builds a keyword map in `ADD-JSON-SCHEMA-{DRAFT}.md` against the 2020-12 renderer, then detection and keyword PRs. | `/review-spec-support` per PR; SwaggerEditor and ApiDOM work items |
| `/review-spec-support` | Reviewing a branch against the spec, run in a fresh subagent: field set, semantics, version gating, integration points, URLs, tests. Every finding cites the spec. | - |

The work that a new OAS version needs before Swagger UI can support it (ApiDOM namespace,
parser adapters, reference support, then a swagger-client release with the resolve strategy) is
done in the ApiDOM and swagger-js repositories. `/add-oas-support` checks for it in Step 0 and
stops when it's missing.

## Scripts

Run from the repository root.

| Script | Checks |
|--------|--------|
| `add-oas-support/scripts/check-plugin-conventions.mjs [--base main]` | Branch diff: `DIST`, `NOT-TS`, `PRAGMA`, `CROSS-IMPORT`, `HAND-GUARD`, `CORE-TOUCH`. Whole tree: `DIALECT`, `PRESET-ORDER`, `EXPORT`. |
| `add-oas-support/scripts/diff-spec-versions.mjs <old> <new> [--rename "A Object=B Object"]` | Field-level diff of two OAS versions' Fixed/Patterned Fields tables (by version number or file): `NEW`, `REMOVED` with "moved?" hints, `CHANGED-TYPE`, `CHANGED-REQUIRED`, `REVIEW` with added/removed value tokens; printed as a field map draft. Tested on 3.1.2→3.2.0, 3.2.0→3.2.1 and 2.0→3.0.4. |
| `add-oas-support/scripts/check-field-coverage.mjs <doc> --plugin <dir> [--scope "PR n"]` | Every in-scope `NEW` / `CHANGED-TYPE` / `MOVED` row of a field map, or `NEW` / `CHANGED-SHAPE` / `RENAMED` row of a keyword map, appears in source, a test and a fixture; `--scope` checks one PR's rows. |
| `add-oas-support/scripts/verify-urls.mjs <paths>` or `--diff main` | HTTP status and `#anchor` existence. |
| `add-oas-support/scripts/test/smoke.sh` | The four scripts: `--help`, bad arguments, and real runs with known findings (the diff on offline fixtures in `scripts/test/fixtures/`, the conventions check on the planted-defects branch). `SMOKE_OFFLINE=1` skips the network checks. Keep it passing after changing a script. |

`node <script> --help` documents each script's codes and exit codes.

## Evaluating Skills

Each case folder follows the skill-creator case format (`schema_version: "1.1"`). Its
`checkout-fixture.sh` (the `context.scaffold_script`) fills an empty run directory with a shared
clone of this checkout at the fixture commit, with only `main` left (other branches and tags
contain the answers); the review case also commits the planted-defects patch on a branch.

| Skill | Case | Fixture | Kind |
|-------|------|---------|------|
| add-oas-support | `oas32-field-map-and-pr-plan`: OAS 3.2 field map and one-feature-per-PR plan (findings of the #10721 review, plus table changes only the diff shows) | `a398208d` (before #10721) | regression |
| add-oas-support | `oas33-not-released`: Phase 0 stops for a version that isn't published, and previews its development draft | `ee02195f` | unseen |
| add-oas-support | `oas40-no-stable-draft`: a request to prepare for 4.0 while only a non-consensus draft exists | `ee02195f` | unseen, major |
| add-oas-support | `oas321-patch-release`: a patch release of a supported line | `ee02195f` | unseen |
| add-json-schema-support | `json-schema-2020-12-standalone-plan`: plan per the design doc | `ee02195f` | regression |
| add-json-schema-support | `json-schema-draft-7-keyword-map`: Draft 7 against the 2020-12 renderer | `ee02195f` | unseen |
| review-spec-support | `oas32-tag-fields-planted-defects`: 8 planted defects in a Tag fields branch | `ee02195f` + `files/planted-defects.patch` | planted defects |

`oas33-not-released` and `oas40-no-stable-draft` read live upstream state (released versions, the
`v3.3-dev` branch, the Moonwalk draft), and their expected outcomes describe it as of 2026-10-22.
Check that state before running them, and update the case when a 3.3 or 4.0 release (or a 4.0
draft with Fixed Fields tables) appears.

"Regression" cases replay findings that the skills' references mention, so they measure whether
the skill keeps steering to them more than whether it generalises. The "unseen" cases use versions
and drafts whose answers are in no skill, `CLAUDE.md` or reference; keep it that way and put
lessons from them into rules, not answers.

### Run Plan

The runs are real model runs with web access (spec markdown, npm registry) and long transcripts;
ask before starting them.

1. Workspace outside the repository: `~/WebstormProjects/swagger-ui-skills-workspace/iteration-N/{case}/{config}/`.
2. Per case and configuration, run the case's `checkout-fixture.sh` in an empty `repo/` directory
   there. The fixtures have no `node_modules`; allow `npm ci` in the run, or expect the skill's
   fallbacks (lockfile, registry).
3. Configurations: `with_skill` (the skill path in this checkout; its scripts are called by that
   path, since fixtures don't contain them) and `without_skill`. For add-oas-support, optionally
   `old_skill`: the previous flat file, `git show ee02195f:.claude/skills/add-oas-support.md`,
   saved outside the repo and handed to the run as instructions.
4. Spawn every configuration of a case in the same turn, with the prompt from `prompt.md`;
   grade each `graders/*.md` statement against the transcript and the files in `repo/`
   (`ADD-*.md`, the diff); aggregate and review with skill-creator's `aggregate_benchmark` and
   `eval-viewer/generate_review.py`.
5. Alternative with Claude Code v2.1.269 or later: `claude plugin eval . --scaffold --allow-tools Write,Edit,Bash`
   from a skill directory runs its cases with and without the skill.

Not run yet: no case has results, and the skill descriptions haven't been through skill-creator's
trigger optimisation.

## Creating New Skills

1. Create `.claude/skills/{skill-name}/SKILL.md` with `name` and a `description` that says what
   the skill does and when to use it, including phrasings that don't name the skill.
2. Keep `SKILL.md` to the workflow, rules and checklist, well under 500 lines. Put templates and
   long material in `references/` and say at which step each is read. Put mechanical checks in
   `scripts/`.
3. Add at least one case folder under `evals/` on a fixture commit, and run it against a
   baseline before relying on the skill.

## Development Guidelines

1. **Templates come from real files.** Copy a template from the code and name the file next to
   it, so it can be diffed when the code moves on.
2. **Never name a function, selector, script or file you haven't checked exists.**
3. **One rule, one place.** Code conventions live in `CLAUDE.md` (TypeScript for new files,
   `@prettier`, no semicolons, double quotes, no cross-plugin imports); skills point to it rather
   than restating it. Review lessons live in `add-oas-support/references/review-lessons.md`.
4. **Prefer a script to a prose check**, and keep `scripts/test/smoke.sh` passing.
5. **Every "ask the user" has a fallback.** Skills also run as subagents that can't ask; each
   question says what to record and where to stop.
6. **Lessons go into rules, answers don't**, or the unseen evals stop measuring anything.

## Related Documentation

- `CLAUDE.md`: codebase guide and conventions.
- `FOLLOW-UPS.md`: problems found in the repository while building the skills, and open work.
- `docs/customization/plugin-api.md`: the plugin system.
