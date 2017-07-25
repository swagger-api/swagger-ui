## Contributing to Swagger-UI

#### Environment setup

0. Install Node.js (4 or newer) and npm (3 or newer).
1. Fork Swagger-UI, and clone your fork.
2. Run `npm install` in your Swagger-UI directory.
3. Run `npm run dev`. `localhost:3200` should open automatically.
4. You're ready to go!

#### Branching model

Feature branches should be prefixed with `ft/`.

Bugfix branches should be prefixed with `bug/`.

After the forward slash, include a short description of what you're fixing. For example: `bug/fix-everything-that-was-broken`.

If there's an issue filed that you're addressing in your branch, include the issue number directly after the forward slash. For example: `bug/1234-fix-all-the-other-things`.

#### Filing issues

- **Do** include the Swagger-UI build you're using - you can find this by opening your console and checking `window.versions.swaggerUi`
- **Do** include a spec that demonstrates the issue you're experiencing.
- **Do** include screenshots, if needed. GIFs are even better!
- **Do** place code inside of a pre-formatted container by surrounding the code with triple backticks.
- **Don't** open tickets discussing issues with the Swagger/OpenAPI specification itself, or for issues with projects that use Swagger-UI.
- **Don't** open an issue without searching the issue tracker for duplicates first.

#### Committing

- Break your commits into logical atomic units. Well-segmented commits make it _much_ easier for others to step through your changes.
- Limit your subject (first) line to 50 characters (GitHub truncates more than 70).
- Provide a body if you'd like to explain your commit in detail.
- Separate the subject from the body with a blank line, for readability.
- Capitalize the beginning of your subject line.
- Do not end the subject line with a period.
- Use the imperative mood in your subject lines, as if you were giving the code an order in your subject line.
  - This mimics what Git does for you automatically: "Merge develop", "Revert f570ffc", etc
  - Simple trick... your subject line should complete this sentence: `If applied, this commit will [your subject line].`
- Don't use [magic GitHub words](https://help.github.com/articles/closing-issues-using-keywords/) in your commits to close issues - do that in the pull request for your code instead.

_Adapted from [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/#seven-rules)._

#### Making pull requests

- **Do** summarize your changes in the PR body. If in doubt, write a bullet-point list titled `This PR does the following:`.
- **Do** include references to issues that your PR solves, and use [magic GitHub words](https://help.github.com/articles/closing-issues-using-keywords/) to close those issues automatically when your PR is merged.
- **Do** include tests that cover new or changed functionality.
- **Do** be careful to follow our ESLint style rules. We recommend installing an ESLint plugin if you use a graphical code editor.
- **Do** make sure that tests and the linter are passing by running `npm test` locally, otherwise we can't merge your pull request.
- **Don't** include any changes to files in the `dist/` directory - we update those files only during releases.
- **Don't** mention maintainers in your original PR body - we probably would've seen it anyway, so it just increases the noise in our inboxes. Do feel free to ping maintainers if a week has passed and you've heard nothing from us.
- **Don't** open PRs for custom functionality that only serves a small subset of our users - custom functionality should be implemented outside of our codebase, via a plugin.
