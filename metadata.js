var metadata = {
    "Insertion Order":{
        "datasource_name" : "cmpgn_hlth_insertion_order_f"
        , "fields" : {
            "Advertiser": {
                "type":"dimension"
                , "agg":"none"
            }
            , "Netflix Subcampaign": {
                "type":"dimension"
                , "agg":"none"
            }
            , "Insertion Order": {
                "type":"dimension"
                , "agg":"none"
            }
            , "Percent Completed": {
                "type":"dimension"
                , "agg":"none"
            }
            , "Spend": {
                "type":"dimension"
                , "agg":"none"
            }
            , "Impressions": {
                "type":"dimension"
                , "agg":"sum"
            }
            , "Reach": {
                "type":"dimension"
                , "agg":"count distinct"
            }
            , "Frequency": {
                "type":"metric"
                , "agg":"average"
            }
            , "CPM": {
                "type":"dimension"
                , "agg":"average"
            }
            , "CTR": {
                "type":"dimension"
                , "agg":"average"
            }
            , "Top Country": {
                "type":"dimension"
                , "agg":"max"
            }
            , "Top Site": {
                "type":"dimension"
                , "agg":"max"
            }
        }
    }
    , "DBM Impressions":{
        "col1":1
        , "col2":1
        , "col3":1
        , "col4":1
        , "col5":1
        , "col6":1
        , "col7":1
        , "col8":1
        , "col9":1
        , "col10":1
        , "col11":1
        , "col12":1
        , "col13":1
        , "col14":1
        , "col15":1
        , "col16":1
        , "col17":1
        , "col18":1
        , "col19":1
        , "col20":1
        , "col21":1
    }
    , "Ignite Sample": {
        "datasource_name" : "ignite_retention_cube_t35"
        , "fields" : {
            "Test ID" : {
                "column_name" : "test_id"
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "Test Cell Number" : {
                "column_name" : "test_cell_nbr"
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "Allocation Count" : {
                "column_name" : "allocation_cnt"
                , "type" : "metric"
                , "agg" : "longSum"
            }
            , "Subscription Count" : {
                "column_name" : "subscrn_cnt"
                , "type" : "metric"
                , "agg" : "longSum"
            }
            , "Non-zero Price Plan Count" : {
                "column_name" : "nonzero_price_plan_cnt"
                , "type" : "metric"
                , "agg" : "longSum"
            }
            , "Predicted Tenure (Months)" : {
                "column_name" : "predicted_tenure_months"
                , "type" : "metric"
                , "agg" : "doubleSum"
            }
        }
    }
}

var datasources = [
    "Insertion Order",
    "Ignite Sample",
    "DBM Impressions",
    "DCM Impressions",
    "Other Source 1",
    "Other Source 2",
    "Other Source 3",
    "Other Source 4",
    "Other Source 5",
    "Other Source 6"
    ] ;
