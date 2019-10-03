echo "_No release summary included._\n\n#### Changelog\n"

PREV_RELEASE_REF=$(git log --pretty=oneline | grep ' release: ' | head -n 2 | tail -n 1 | cut -f 1 -d " ")

git log --pretty=oneline $PREV_RELEASE_REF..HEAD | awk '{ $1=""; print}' | sed -e 's/^[ \t]*//' | sed 's/^feat/0,feat/' | sed 's/^improve/1,improve/' | sed 's/^fix/2,fix/'| sort | sed 's/^[0-2],//' | sed 's/^/* /'
