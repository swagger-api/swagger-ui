JSDIR="../src/main/html/javascript"
CSSDIR="../src/main/html/style"

YUI_COMPRESSOR="../build/yuicompressor-2.4.6.jar"

echo "5. Combining Javascript"
# Combine all the javascript to a single temporary file
cat $JSDIR/jquery-1.6.2.min.js \
$JSDIR/jquery-ui-1.8.14.custom.min.js \
$JSDIR/jquery.ba-bbq.min.js \
$JSDIR/jquery.slideto.min.js \
$JSDIR/jquery.tmpl.js \
$JSDIR/jquery.wiggle.min.js \
$JSDIR/chosen.jquery.js \
$JSDIR/doc.js \
$JSDIR/spine.js > $JSDIR/app.ext.js

cat $JSDIR/swagger-ui.js > $JSDIR/app.js

echo "4. Combining Stylesheets"
cat $CSSDIR/chosen.css \
$CSSDIR/ie.css \
$CSSDIR/ie6.css \
$CSSDIR/screen.css > $CSSDIR/app.ext.css

cat $CSSDIR/main.css > $CSSDIR/app.css

echo "3. Compressing Javascripts"
java -jar $YUI_COMPRESSOR --type js -o $JSDIR/app.ext.min.js $JSDIR/app.ext.js
java -jar $YUI_COMPRESSOR --type js -o $JSDIR/app.min.js $JSDIR/app.js

echo "2. Compressing Stylesheets"
java -jar $YUI_COMPRESSOR --type css -o $CSSDIR/app.min.css $CSSDIR/app.css
java -jar $YUI_COMPRESSOR --type css -o $CSSDIR/app.ext.min.css $CSSDIR/app.ext.css
java -jar $YUI_COMPRESSOR --type css -o $CSSDIR/smoothness/jquery-ui-1.8.14.custom.min.css $CSSDIR/smoothness/jquery-ui-1.8.14.custom.css

echo "1. Cleaning up"
rm -f $JSDIR/app.js
rm -f $JSDIR/app.ext.js
rm -f $CSSDIR/app.css
rm -f $CSSDIR/app.ext.css
