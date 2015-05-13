#!/bin/bash

ROOT=/var/www/druidConnector
HTML=$ROOT/public
LIB=$ROOT/public/lib
IMG=$ROOT/public/img

sudo cp druidview.html $HTML/.

sudo cp lib/d3.js lib/metadata.js lib/functions.js lib/data.js lib/druidview.css $LIB/.

sudo cp img/glass.png $IMG/.

sudo cp app.js $ROOT/.
