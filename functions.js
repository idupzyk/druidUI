function sayHi() {
    d3.select("body").append("div")
        .style("border", "1px black solid")
        .html("hello world") ;
}

var field = '' ;
var columnWidths = [] ;
var columnPos = [] ;
var columnNames = [] ;
var rowSpacing = 26 ;
var labelSpacing = 21 ;
var charWidth = 8 ;
var minLength = 10 ;
var totalWidth = 0 ;
var topOffset = 200 ;

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
        .html(function (d) {return "<input id=\"checkbox"+d+"\" type=\"checkbox\">"+d}) ;
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

function processData(rawData) {
    columnNames = ["Advertiser", "Netflix Subcampaign", "Insertion Order", "Percent Completed", "Spend", "Impressions", "Reach", "Frequency", "CPM", "CTR", "Top Country", "Top Site", "skey"] ;
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
        processed.push(rowOut) ;
    }

    var sum = 0 ;
    for (var idx=0; idx < columnWidths.length; idx += 1) {
        columnPos.push(sum * charWidth) ;
        sum += columnWidths[idx] ;
    }

    totalWidth = sum ;

    return processed ;
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


function restoreSheet() {
    //TBW
} ;


function populateData (rowData) {
    topOffset = columnNames.length * labelSpacing
    // generate the column selector
    d3.select("body")
        .append("div")
        .attr("class", "selector") ;

    d3.select("div.selector") 
        .selectAll("div.labelRow")
        .data(columnNames)
        .enter()
        .append("div")
        .attr("class", "labelRow")
        .style("width", "300px")
        .style("top", function (d,i) { return (i*labelSpacing) + "px";}) ;

    d3.selectAll("div.labelRow")
        .selectAll("div.label")
        .data(function(d) { console.log("vaule of d: "+d); return [d, d]; })
        .enter()
        .append("div")
        .attr("class", "label")
        .style("left", function (d,i, j) {return (i*150)+"px";})
        .html(function (d,i) {return d ;}) ;


    //d3.select("body")
    //    .append("div")
    //    .attr("class", "div.selector")
    //    .selectAll("div.columnSelectors")
    //    .data(columnNames)
    //    .enter()
    //    .append("div")
    //    .attr("class", "div.columnSelectors")
    //    .append("input")
    //    .attr("type", "checkbox")
    //    .attr("checked", "true")
    //    .attr("id", function (d) {return d;}) 
    //    .style("top", function (d,i) { return (i*rowSpacing)+"px";}) ;

    //d3.select("body")
    //    .append("div")
    //    .attr("class", "div.selectLabel")
    //    .selectAll("div.inputLabel")
    //    .data(columnNames)
    //    .enter()
    //    .append("div")
    //    .attr("class", "inputLabel")
    //    .html(function (d) {return d;}) 
    //    .style("top", function (d,i) { console.log((i*rowSpacing)+"px") ; return (i*rowSpacing)+"px";})
    //    .style("left", "20px") ;

    // generate the table container
    var table = d3.select("body")
        .append("div")
        .attr("class", "table") ;

    // generate the table header
    d3.select("div.table")
        .append("div")
        .attr("class", "head")
        .selectAll("div.data")
        .data(columnNames)
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d;})
        .style("top", function (d) { return (topOffset)+"px" ;}) 
        .style("left", function (d,i) { return columnPos[i] + "px"; }) ;

    // generate the sort buttons
    d3.select("div.table")
        .append("div")
        .attr("class", "buttons")
        .selectAll("div.data")
        .data(columnNames)
        .enter()
        .append("div")
        .attr("class", "sort")
        .style("left", function (d,i) { return columnPos[i] + "px"; }) 
        .style("top", function (d) { return (rowSpacing+topOffset)+"px" ;}) 
        .append("button", ".table")
        .on("click", function(d) { sortSheet(d) ;})
        .html("sort") ;

    // build the data rows
    d3.select("div.table")
        .selectAll("div.datarow")
        .data(rowData, function(d) {return d["skey"];})
        .enter()
        .append("div")
        .attr("class", "datarow")
        .style("top", function (d,i) { return (2*rowSpacing+(i*rowSpacing)+topOffset) + "px";}) 
        .style("width", function () { return (totalWidth*charWidth)+"px"; }) ;

    // build the fields in the data rows
    d3.selectAll("div.datarow")
        .selectAll("div.data")
        .data(function(d) { return d3.entries(d); })
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d.value;})
        .style("left", function(d,i,j) { return columnPos[i] + "px";}) ;

    }
