var metadata = {
    "Insertion Order":{
        "Advertiser": {"type":"dimension", "agg":"none"}
        , "Netflix Subcampaign": {"type":"dimension", "agg":"none"}
        , "Insertion Order": {"type":"dimension", "agg":"none"}
        , "Percent Completed": {"type":"dimension", "agg":"none"}
        , "Spend": {"type":"dimension", "agg":"none"}
        , "Impression": {"type":"dimension", "agg":"sum"}
        , "Reach": {"type":"dimension", "agg":"count distinct"}
        , "Frequency": {"type":"metric", "agg":"average"}
        , "CPM": {"type":"dimension", "agg":"average"}
        , "CTR": {"type":"dimension", "agg":"average"}
        , "Top Country": {"type":"dimension", "agg":"max"}
        , "Top Site": {"type":"dimension", "agg":"max"}
    }
    , "blah":{
        "col1":1
        , "col2":1
        , "col3":1
        , "col4":1
        , "col5":1
    }
}

var datasources = [
    "Insertion Order",
    "blah",
    "DBM Impressions",
    "DCM Impressions" ] ;
