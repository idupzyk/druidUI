#!/usr/bin/python

import csv
import json
import sys

try :
    fileName = sys.argv[1]
except IndexError :
    sys.stderr.write("USAGE: csv2json.py filename.csv")
    sys.exit(1)

fp = open(fileName, 'r')

reader = csv.reader(fp)

obj = []

first = True

for line in reader :
    if first :
        first = False
        columns = line
        print line
    else :
        dictLine = {}
        for i in range(len(line)) :
            dictLine[columns[i]] = line[i]

        obj.append(dictLine)

outFileName = fileName.rsplit(".", 1)[0] + ".json"

fpo = open(outFileName, 'w')
json.dump(obj, fpo, indent = 4)
fpo.close()
