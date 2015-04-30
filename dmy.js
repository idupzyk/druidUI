function sayHi() {
    d3.select("body").append("div")
        .style("border", "1px black solid")
        .html("hello world") ;
}

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

    for (var j=0 ; j<keyList.length ; j++) {
        console.log(keyList[j]) ;
    }

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
    console.log("length: "+rowData.length) ;
    for (var rec in rowData) {
        //console.log("new_row") ;
        //for (var key in rec) {
        //    console.log(key) ;
        //}
        //console.log(rowData[rec]) ;
        //console.log(rec[field]+" "+isInt(rec[field])+" "+isFloat(rec[field])) ;
        if (isInt(rowData[rec][field])) {
            //console.log("in int") ;
            tmp[parseInt(rowData[rec][field])] = 0 ;
        }
        if (isFloat(rowData[rec][field])) {
            //console.log("in float") ;
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

    console.log("min: "+tmpMin) ;
    console.log("max: "+tmpMax) ;
    return d3.scale.linear().domain([tmpMin, tmpMax]).range(outRange) ;
}

var clickScale = linearScale(sampleData, 'clicks', [0,20])

function round(value, places) {
    mult = Math.pow(10, places) ;
    return Math.round(value * mult)/mult ;
}

function processData(rawData) {
    var processed = [] ;

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

        var rowOut = {}
        rowOut["Advertiser"] = advertiser ;
        rowOut["Netflix Subcampaign"] = netflix_subcampaign ;
        rowOut["Percent Completed"] = pct_duration_complete ;
        rowOut["Spend"] = spend ;
        rowOut["Impressions"] = impressions ;
        rowOut["Reach"] = reach_ident ;
        rowOut["Frequency"] = frequency ;
        rowOut["CPM"] = cpm ;
        rowOut["CTR"] = ctr ;
        rowOut["Top Country"] = top_country ;
        rowOut["Top Site"] = top_site ;

        processed.push(rowOut) ;

        //colums = ["Advertiser", "Netflix Subcampaign", "Percent Completed", "Spend", "Impressions", "Reach", "Frequency", "CPM", "CTR", "Top Country", "Top Site"] ;
    }

    return processed ;
}
       
//d3.select("body")
//    .insert("button", ".table")
//    .on("click", sortSheet).html("sort") ;
//
//d3.select("body")
//    .insert("button", ".table")
//    .on("click", restoreSheet).html("restore") ;

function sortSheet() {
    var dataset = d3.selectAll("div.datarow").data() ;

    console.log(dataset[0]) ;

    dataset.sort(function (a,b) {
        var a = a["Impressions"] ;
        var b = b["Impressions"] ;

        return a<b ? 1 : (a>b ? -1 : 0) ;
    }) ;

    for (var idx in dataset) {
        console.log(dataset[idx]["Impressions"]) ;
    }

    d3.select("div.table")
        .selectAll("div.datarow")
        .data(dataset)
        .transition()
        .duration(2000)
        .style("top", function (d,i) { return (40+(i*40)) + "px";}) ;
}

function restoreSheet() {
}

function populateData (rowData) {

    //var headerValues = d3.keys(rowData[0]) ;
    var headerValues = ["Advertiser", "Nflx Subcampaign", "Pct Completed", "Spend", "Impressions", "Reach", "Frequency", "CPM", "CTR", "Top Country", "Top Site"] ;

    var table = d3.select("body")
        .append("div")
        .attr("class", "table") ;

    // generate the table header
    d3.select("div.table")
        .append("div")
        .attr("class", "head")
        .selectAll("div.data")
        .data(headerValues)
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d;})
        .style("left", function (d,i) { return (i*100) + "px"; }) ;

    d3.select("div.table")
        .selectAll("div.datarow")
        .data(rowData)
        .enter()
        .append("div")
        .attr("class", "datarow")
        .style("top", function (d,i) { return (40+(i*40)) + "px";}) ;

    d3.selectAll("div.datarow")
        .selectAll("div.data")
        .data(function(d) { return d3.entries(d); })
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {return d.value;})
        .style("left", function(d,i,j) { return (i*100) + "px";}) ;

    //var header = table.append("tr")
    //    .attr("class", "head")
    //    .selectAll("th")
    //    .data(headerValues)
    //    .enter()
    //    .append("th")
    //    .html(function (d) {return d;}) ;


    //var trows = table.selectAll("tr")
    //    .data(rowData)
    //    .enter()
    //    .append("tr") ;

    //var cells = trows.selectAll("td") 
    //    .data(function(d) { return d3.entries(d); })
    //    .enter()
    //    .append("td")
    //    .html(function (d) { return d.value; }) ;
}
