#!/usr/bin/env python

import json
import sys

try :
    ifn = sys.argv[1]
    ofn = ifn.rsplit('.', 1)[0]+".json"
except IndexError :
    sys.stderr.write("USAGE: dql2meta.js\n")
    sys.exit(0)

ifp = open(ifn, 'r')
dql = json.load(ifp)
ifp.close()

dims = dql["dataSpec"]["dimensions"]
aggs = dql["rollupSpec"]["aggs"]

print dims
print aggs
