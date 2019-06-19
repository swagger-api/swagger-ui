COUNT=$(grep -c '^@font-face' src/fontello/css/fontello-embedded.css)

function parse {
  sed -in-place -e '1,8d;12d' -e '11s/\,$/\;/' src/fontello/css/fontello-embedded.css
}

if [ $COUNT == 2 ]; then parse; fi