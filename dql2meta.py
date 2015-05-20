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

src = dql["dataSource"]
dims = dql["dataSpec"]["dimensions"]
aggs = dql["rollupSpec"]["aggs"]

#print dims
#print aggs

# output structure
#{
#    source_name : {
#        fields : [
#            db_column_name : {
#                column_name : alias
#                , type : (dimension | metric | derived)
#                , agg : agg_type
#            ]
#        }
#    }
#}
    
meta = {}
meta[src] = {}
meta[src]["datasource_name"] = src
meta[src]["fields"] = []
for dim in dims :
    meta[src]["fields"].append({dim : {"column_name":dim, "type":"dimension", "agg":"none"}})
for agg in aggs :
    meta[src]["fields"].append({agg["fieldName"] : {"column_name":agg["fieldName"], "type":"metric", "agg":agg["type"]}})

print json.dumps(meta, indent=4)


