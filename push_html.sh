#!/bin/bash

ROOT=/var/www/druidview_v1
HTML=$ROOT/public
LIB=$ROOT/public/lib
IMG=$ROOT/public/img

if [ ! -e $LIB ]
then
    echo "Making $LIB"
    sudo mkdir $LIB
fi

if [ ! -e $IMG ]
then
    echo "Making $IMG"
    sudo mkdir $IMG
fi

sudo cp druidview.html $HTML/.

sudo cp lib/d3.js lib/metadata.js lib/functions.js lib/data.js lib/druidview.css $LIB/.

sudo cp img/glass.png $IMG/.

sudo cp app.js $ROOT/.
