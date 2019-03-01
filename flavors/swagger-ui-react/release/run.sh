# Deploy `swagger-ui-react` to npm.

# Parameter Expansion: http://stackoverflow.com/questions/6393551/what-is-the-meaning-of-0-in-a-bash-script
cd "${0%/*}"

mkdir ../dist

# Copy UI's dist files to our directory
cp ../../../dist/swagger-ui.js ../dist
cp ../../../dist/swagger-ui.css ../dist

# Create a releasable package manifest
node create-manifest.js > ../dist/package.json

# Transpile our top-level component
../../../node_modules/.bin/babel ../index.js > ../dist/index.js

# Copy our README into the dist folder for npm
cp ../README.md ../dist

# Run the release from the dist folder
cd ../dist

if [ "$PUBLISH_FLAVOR_REACT" = "true" ] ; then
  npm publish .
else
  npm pack .
fi
