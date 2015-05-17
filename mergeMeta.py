#!/usr/bin/env python

import json
import sys

try :
    fileNames = sys.argv[1:]
except IndexError :
    sys.stderr.write("USAGE: mergeMeta.py 1.meta.json 2.meta.json ... n.meta.json\n")
    sys.stderr.write("Outputs metadata.json\n")
    sys.exit(1)

metadata = {}
for ifn in fileNames :
    fp = open(ifn, 'r')
    metadata.update(json.load(fp))
    fp.close()

metadata_str = json.dumps(metadata, indent=4)
datasources = metadata.keys()

ofp = open("merged.js", 'w')
ofp.write(metadata_str+"\n")
ofp.write("datasources = [\n")
ofp.write("    \""+datasources[0]+"\"\n")
for src in datasources[1:] :
    ofp.write("    \""+src+"\"\n")
ofp.write("    ]\n")

ofp.close()



