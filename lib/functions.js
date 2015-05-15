/* 
 * Author: Ian Dupzyk
 *
 * To Do:
 * wrap the rows of the table in a different div
 * so they can scroll without the column headers 
 * scrolling vertically
 *
 * add another pane under the column list with a 
 * list of the available sources in druid
 *
 * create an aggregation function to properly agg
 * the column the user would like to see
 *
 */

var field = '' ;
var columnWidths = [] ;
var columnPos = [] ;
var columnNames = [] ;
var rowSpacing = 27;
var labelSpacing = 26 ;
var charWidth = 8 ;
var minLength = 10 ;
var totalWidth = 0 ;
var topOffset = 0;
var horizOffset = 0 ;

var globalDataObj = [] ;
var checkedCols = [] ;
var datasrc = 'init' ;

function getFilterKeys(column, jsonObj) {
    var temp = {} ;

    for (var i=0; i<jsonObj.length; i++) {
        temp[jsonObj[i]["result"][column]] = 0 ;
    }

    var uni = [] ;
    for (var key in temp) {
        uni.push(key) ;
    }
    
    return uni ;
}

function loadKeys(col) {
    var keyList = getFilterKeys(col, sampleData) ;

    //for (var j=0 ; j<keyList.length ; j++) {
    //    console.log(keyList[j]) ;
    //}

    d3.select("#sidePane")
        .selectAll("div")
        .data(keyList)
        .enter()
        .append("div")
        .html(function (d) {return "<input id=\"checkbox"+d+"\" type=\"checkbox\" checked>"+d}) ;
}

function isInt(value) {
    return !isNaN(parseInt(value)) ;
}

function isFloat(value) {
    return !isNaN(parseFloat(value)) ;
}

function linearScale (rowData, field, outRange) {
    var tmp = {} ;
    //console.log("length: "+rowData.length) ;
    for (var rec in rowData) {
        if (isInt(rowData[rec][field])) {
            tmp[parseInt(rowData[rec][field])] = 0 ;
        }
        if (isFloat(rowData[rec][field])) {
            tmp[parseFloat(rowData[rec][field])] = 0 ;
        }
    }

    var j = 0 ;
    var tmpMin = 0 ;
    var tmpMax = 0 ;
    for (var k in tmp) {
        j = parseInt(k) ;
        if (j > tmpMax) {
            tmpMax = j ;
        }
        if (j < tmpMin) {
            tmpMin = j ;
        }
    }

    return d3.scale.linear().domain([tmpMin, tmpMax]).range(outRange) ;
}

var clickScale = linearScale(sampleData, 'clicks', [0,20])

function round(value, places) {
    mult = Math.pow(10, places) ;
    return Math.round(value * mult)/mult ;
}

function process(rawData, cols) {
    // use the datasrc and the columns to 
    // get the names and order of the database cols to parse out
    // build out arrays of column start and width
    var sk = 0 ;
    var colMap = {} ;

    // clear the column widths and positions 
    columnWidths = [] ;
    columnPos = []

    for (var i=0; i< cols.length; i++) {
        if (cols[i].length > minLength) {
            columnWidths.push(cols[i].length) ;
        } else {
            columnWidths.push(minLength)
        }
    }

    for (var col in metadata[datasrc]["fields"]) {
        colMap[col] = metadata[datasrc]["fields"][col]["column_name"]
    }
    var retainedCols = [] ;
    for (var col in cols) {
        //console.log("col: "+col) ;
        retainedCols.push(colMap[cols[col]]) ;
    }
    //console.log("retained cols:") ;
    //console.log(retainedCols) ;

    var processed = [] ;

    // iterate over the data to process
    for (var i=0; i<rawData.length; i++) {
        var row = {} ;
        for (var j=0; j<cols.length; j++) {
            row[cols[j]] = rawData[i]["event"][retainedCols[j]] ;

            // check the column width
            if (row[cols[j]].length > columnWidths[j] ) {
                columnWidths[j] = row[cols[j]].length ;
            }
        }
        row["skey"] = sk ;
        sk += 1 ;
        processed.push(row) ;
    }
    //console.log(processed) ;
    //console.log("END OF PROCESSING") ;

    // set the columnPos array
    var sum = 0 ;
    for (var idx=0; idx < columnWidths.length; idx += 1) {
        columnPos.push(sum * charWidth) ;
        sum += columnWidths[idx] ;
    }
    //console.log("column Width and Pos: ") ;
    //console.log(columnWidths) ;
    //console.log(columnPos) ;
    // return data
    return processed ;
}

function processData(rawData) {
    columnNames = ["Advertiser", "Netflix Subcampaign", "Insertion Order", "Percent Completed", "Spend", "Impressions", "Reach", "Frequency", "CPM", "CTR", "Top Country", "Top Site"] ;
    for (var i=0; i< columnNames.length; i++) {
        if (columnNames[i].length > minLength) {
            columnWidths.push(columnNames[i].length) ;
        } else {
            columnWidths.push(minLength)
        }
    }
    var processed = [] ;

    var sk = 0 ;

    for (var i in rawData) {
        var row = rawData[i] ;
        var advertiser = row["advertiser_name"] ;
        var netflix_subcampaign = row["nflx_subcampaign_desc"] ;
        var today = new Date() ;
        var budget_start = Date.parse(row["budget_start_date"]) ;
        var budget_end = Date.parse(row["budget_end_date"]) ;
        var event_date = Date.parse(row["event_date"]) ;
        var pct_duration_complete = round((today - budget_start)/(budget_end - budget_start),2) ;
        var spend = parseFloat(row["total_spend"]);
        var impressions = parseFloat(row["impressions"]) ;
        var reach_ident = parseFloat(row["imp_rch_ident"]) ;
        var imp_ident = parseFloat(row["imp_ident"]) ;
        var frequency = round(imp_ident/reach_ident, 3) ;
        var cpm = round((spend / impressions) * 1000, 3) ;
        var clicks = parseFloat(row["clicks"]) ;
        var ctr = round(clicks/impressions, 3) ;
        var top_country = row["top_country_code"] ;
        var top_site = row["top_site_name"] ;
        var insertion_order = row["insertion_order_name"] ;

        var rowOut = {}
        rowOut["Advertiser"] = advertiser ;
        rowOut["Netflix Subcampaign"] = netflix_subcampaign ;
        rowOut["Insertion Order"] = insertion_order ;
        rowOut["Percent Completed"] = pct_duration_complete ;
        rowOut["Spend"] = spend ;
        rowOut["Impressions"] = impressions ;
        rowOut["Reach"] = reach_ident ;
        rowOut["Frequency"] = frequency ;
        rowOut["CPM"] = cpm ;
        rowOut["CTR"] = ctr ;
        rowOut["Top Country"] = top_country ;
        rowOut["Top Site"] = top_site ;
        rowOut["skey"] = sk ;
        sk += 1 ;

        // populate the widths of the columns
        for (var j=0; j<columnNames.length;j++) {
            if (rowOut[columnNames[j]].length > columnWidths[j] ) {
                columnWidths[j] = rowOut[columnNames[j]].length ;
            }
        }
        globalDataObj.push(rowOut) ;
    }

    var sum = 0 ;
    for (var idx=0; idx < columnWidths.length; idx += 1) {
        columnPos.push(sum * charWidth) ;
        sum += columnWidths[idx] ;
    }

    totalWidth = sum ;
}

function update() {
    field = d3.select("#sortColumnName").text(+this.value) ;
}
    
       
function sortSheet(field) {
    var dir = "desc" ;
    var dataset = d3.selectAll("div.datarow").data() ;

    dataset.sort(function (a,b) {
        var a = a[field] ;
        var b = b[field] ;

        if (dir.toLowerCase() == 'asc') {
            return a>b ? 1 : (a<b ? -1 : 0) ;
        }
        else {
            return a<b ? 1 : (a>b ? -1 : 0) ;
        }
    }) ;

    d3.selectAll("div.datarow")
        .data(dataset, function(d) {return d["skey"];})
        .transition()
        .duration(1000)
        .style("top", function (d,i) { return (2*rowSpacing+(i*rowSpacing)+topOffset) + "px";}) ;

} ;

// Called when the user presses the update button, generates 
// or regenerates the table view
function getCheckedCols() {
    // clear checked Cols
    checkedCols = [] ;
    var inputs = document.getElementsByClassName("columnSelector") ;
    for (var i=0; i<inputs.length;i++) {
        if (inputs[i].checked) {
            checkedCols.push(inputs[i].name) ;
        }
    }

    populateData(globalDataObj, checkedCols) ;
}

function keys(dict) {
    var key = [] ;
    for (k in dict) {
        key.push(k);
    }
    return key ;
}

// generates the side pane with selectors for source and columns
function populateCols (src) {
    // initialize columns
    if (src == 'init') {
        datasrc = datasources[0] ;
        columnNames = keys(metadata[datasources[0]]["fields"]) ;
    } else {
        datasrc = src ;
        d3.select("div.container").remove() ;
        columnNames = keys(metadata[datasrc]["fields"]) ;
    }

    d3.select("div.sourceName").html("Druid View: "+datasrc) ;

    // generate the overall container
    d3.select("body")
        .append("div")
        .attr("class", "container") ;

    d3.select("div.container")
        .append("div")
        .attr("class", "sidePane") ;

    // populate the different sources
    d3.select("div.sidePane")
        .append("div")
        .attr("class", "srcSelector") ;
    
    d3.select("div.srcSelector") 
        .selectAll("div.srcRow")
        .data(datasources)
        .enter()
        .append("div")
        .attr("class", "srcRow") ;

    d3.selectAll("div.srcRow")
        .selectAll("div.src")
        .data(function(d) { return [d];})
        .enter()
        .append("button")
        .style("width", "168px") 
        .on("click", function(d) { populateCols(d);})
        .html(function (d) {return d;}) ;

    // generate the column selector
    d3.select("div.sidePane")
        .append("div")
        .attr("class", "selector") ;

    d3.select("div.selector") 
        .selectAll("div.labelRow")
        .data(columnNames)
        .enter()
        .append("div")
        .attr("class", "labelRow") ;
        //.style("width", "300px") ;
        //.style("top", function (d,i) { return (i*labelSpacing+5) + "px";}) ;

    d3.selectAll("div.labelRow")
        .selectAll("div.label")
        .data(function(d) { /*console.log("vaule of d: "+d);*/ return [d]; })
        .enter()
        .append("div")
        .attr("class", "label")
        .html(function (d,i) {
            if (metadata[datasrc]["fields"][d]["type"] == "dimension") {
                return "<input type=\"checkbox\" class=\"columnSelector\" name=\""+d+"\" >&nbsp<b>"+d+"</b>" ;
            } else {
                return "<input type=\"checkbox\" class=\"columnSelector\" name=\""+d+"\" >&nbsp"+d ;
            }
        }) ;
        //.style("left", function (d,i, j) {return (i*150)+"px";})

}

function columnSubset(d,cols) {
    var out = []
    for (key in d) {
        if (cols.indexOf(d[key]["key"]) != -1) {
            out.push(d[key]) ;
        }
    }
    return out ;
}

function csvExport() {
    var dataset = d3.selectAll("div.datarow").data() ;
    var csv = [] ;
    var row = [] ;
    csv.push("\""+checkedCols.join("\",\"")+"\"") ;
    for (var i=0; i<dataset.length;i++) {
        row = [] ;
        for (var j=0; j<checkedCols.length;j++) {
            var innerValue = dataset[i][checkedCols[j]] ;
            try {
                var result = innerValue.replace(/"/g, '""') ;
                if (result.search(/("|,|\n)/g) >= 0) {
                    result = '"' + result + '"' ;
                }
            } catch(err) {
                var result = innerValue ;
            }
            row.push(result) ;
        }
        csv.push(row.join(",")) ;
    }

    output = csv.join("\n") ;
    //console.log(output) ;

    var file = document.createElement('a') ;
    file.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(output));
    file.setAttribute('download', 'data.csv');
    file.click() ;
}

function setColumnPositions(cols) {
    var newPos = [] ;
    var widths = [] ;

    sum = 0 ;
    for (var i=0;i<cols.length;i++) {
        newPos.push(sum) ;
        sum += columnWidths[cols.indexOf(cols[i])]*charWidth ;
    }
    // last item is the total length
    newPos.push(sum) ;

    return newPos ;
}

function makeHttpObject() {
    try {
        return new XMLHttpRequest();
    }
    catch (error) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (error) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (error) {}

    throw new Error("Could not create HTTP request object.");
}

function aggregate(data, cols, metadata) {
}

function queryDruid(cols) {
    var colMap = {} ;
    for (var col in metadata[datasrc]["fields"]) {
        colMap[col] = metadata[datasrc]["fields"][col]["column_name"]
    }
    var retainedCols = [] ;
    for (var col in cols) {
        //console.log("col: "+col) ;
        retainedCols.push(colMap[cols[col]]) ;
    }
    var env = "test" ;
    var datastore = "http://ec2-54-145-95-188.compute-1.amazonaws.com:3000/query" ;
    //var datastore = "http://druid-broker.us-east-1.dyn"+env+".netflix.net:7103/druid/v2/?pretty" ;

    var dimensions = [] ;
    var metrics = [] ;
    for (var i=0; i<cols.length; i++) {
        //console.log(cols[i]) ;
        //console.log(metadata[datasrc]["fields"][cols[i]]) ;
        if (metadata[datasrc]["fields"][cols[i]]["type"] == 'dimension') {
            dimensions.push(retainedCols[i]) ;
        }
        if (metadata[datasrc]["fields"][cols[i]]["type"] == 'metric') {
            metrics.push({
                "name":retainedCols[i]
                , "type":metadata[datasrc]["fields"][cols[i]]["agg"]
                , "fieldName":retainedCols[i]}) ;
        }
    }

    var query = {
        "queryType": "groupBy",
        "dataSource": metadata[datasrc]["datasource_name"] ,
        "granularity": "all",
        "dimensions": dimensions,
        "aggregations": metrics,
        "intervals": ["2015-01-10T00:00/2015-05-18T00:00"]
    }
    //  "filter": {
    //    "type":"and", "fields": [
    //        {"type":"selector", "dimension":"test_id", "value":"6073"}
    //      ]
    //    },

    //console.log(query) ;

    var request = new XMLHttpRequest() ;
    request.open("POST", datastore, false) ;
    request.setRequestHeader("Content-Type",  "application/json") ;

    var data ;

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            data = JSON.parse(request.responseText) ;

            //console.log("Response:") ; 
            //console.log(request.response) ;
            //console.log("data: "+typeof data) ;
            //console.log("|"+data+"|") ;
        
            //console.log("status: " + request.status + " " + request.statusText) ;

            //return data ;
        }
    }
    request.send(JSON.stringify(query)) ;

    return data ;
}

function populateData (rowData, cols) {
    d3.select("div.table").remove() ;

    //query for the new data
    data = queryDruid(cols) ;
    console.log("Length of data: "+data.length) ;
    console.log("Data:") ;
    console.log(data) ;

    rowData = process(data, cols) ;
    //console.log("Length of data: "+rowData.length) ;
    //console.log(rowData) ;

    // reset the widths and positions
    position = setColumnPositions(cols) ;
    //console.log("positions") ;
    //console.log(cols) ;
    //console.log(position) ;
    tableWidth = position[position.length-1] ;
    //console.log("tableWidth: "+tableWidth) ;

    // generate the table container
    var table = d3.select("div.container")
        .append("div")
        .attr("class", "table") ;
        //.style("left", horizOffset) ;

    // generate the table header
    d3.select("div.table")
        .append("div")
        .attr("class", "head")
        .selectAll("div.data")
        .data(cols)
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d;})
        .style("top", function (d) { return (topOffset)+"px" ;}) 
        .style("left", function (d,i) { return (position[i]+horizOffset) + "px"; }) ;

    // generate the sort buttons
    d3.select("div.table")
        .append("div")
        .attr("class", "buttons")
        .selectAll("div.data")
        .data(cols)
        .enter()
        .append("div")
        .attr("class", "sort")
        .style("left", function (d,i) { return (position[i]+horizOffset) + "px"; }) 
        .style("top", function (d) { return (rowSpacing+topOffset)+"px" ;}) 
        .append("button", ".table")
        .on("click", function(d) { sortSheet(d) ;})
        .html("sort") ;

    // build the data rows
    d3.select("div.table")
        .selectAll("div.datarow")
        .data(rowData, function(d) {/*console.log("HELLO"); console.log(d) ;*/ return d["skey"];})
        .enter()
        .append("div")
        .attr("class", "datarow")
        .style("top", function (d,i) { return (2*rowSpacing+(i*rowSpacing)+topOffset+6) + "px";}) 
        .style("width", function () { return (tableWidth)+"px"; }) ;
        //.append("div")
        //.attr("class", "tableData")
        //.style("top", function (d) { return ((2*rowSpacing)+topOffset)+"px" ;}) 

    // build the fields in the data rows
    d3.selectAll("div.datarow")
        .selectAll("div.data")
        .data(function(d) { /*console.log("subset") ; console.log(columnSubset(d3.entries(d), cols));*/ return columnSubset(d3.entries(d), cols); })
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d.value;})
        .style("left", function(d,i,j) { return (position[i]+horizOffset) + "px";}) ;
}
