# Contributing

Contributing to the opsdroid ecosystem is strongly encouraged and every little bit counts! There are so many ways to contribute to opsdroid:

- Write code to [solve issues](https://github.com/opsdroid/opsdroid-web/issues) in the opsdroid core repository
- Contribute to [opsdroid](https://github.com/opsdroid/opsdroid) directly (Python)
- Improve the [official documentation](https://github.com/opsdroid/opsdroid/tree/master/docs) to help others get started
- Write [skills](https://docs.opsdroid.dev/en/stable/skills/index.html), [connectors](https://docs.opsdroid.dev/en/stable/connectors/index.html) or [database](https://docs.opsdroid.dev/en/stable/databases/index.html) modules
- Contribute to the [opsdroid home page](https://github.com/opsdroid/opsdroid.github.io) (it's a Jekyll website)
- Post about your experience using opsdroid on your own blog
- Submit lots of useful issues
- Create [logo variations and banners](https://github.com/opsdroid/style-guidelines) for promotion
- Contribute to [opsdroid desktop](https://github.com/opsdroid/opsdroid-desktop) (electron and react app)
- Promote opsdroid in a meaningful way

## Development

1. Fork the repository ([quicklink](https://github.com/opsdroid/opsdroid-web/fork))
2. Clone your fork locally with `https://github.com/<your username>/opsdroid-web`
3. Create a new branch for your feature `git checkout -b <branch name>`
4. install the dependencies with `yarn install` or `npm install`
5. install pre-commit locally (only need to be done once) with `pre-commit install`
6. Start the development server with `yarn start`

### Testing

This project uses [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/) for testing. You should run the tests before opening a PR when developing new features or fixing bugs. You should also add tests or update existing ones when appropriate.

You can run the tests with the command:

- `yarn test` / `npm run test`

## Available scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `yarn lint`

Runs eslint on all the files under `scr/` and informs you of any linting issues.

### `yarn lintfix`

Because fixing lint manually is so 2000, you can run this command to automatically fix all the lint issues that your files may have.

### `yarn build-check`

Runs the typescript compiler to confirm that all files are typed correctly and don't have any issues.
Note: This is the script run with pre-commit.

## Making a Release

Maintainers and project owners can make a new release of the app. This section describes the steps to make such release.

1. Safety Checks
   - `git pull main` (if you are using a fork use `git pull upstream main`)
   - `git status` (confirm that there aren't uncommitted changes if they are `git diff`)
   - `yarn test` (double check that tests are still green)
2. Prepare the release
   - `yarn build` (confirm that the app builds without errors/warnings)
3. Update the [changelog](./CHANGELOG.md)
4. Update the version number
   - `npm version`
5. Publish to npm (you might need to be added to npm)
   - `npm publish`
6. Publish to Github
   - `git push --tags`
