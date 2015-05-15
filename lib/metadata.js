var metadata = {
    "Insertion Order":{
        "datasource_name" : "cmpgn_hlth_insertion_order_f"
        , "fields" : {
            "Advertiser": {
                "column_name":"advertiser_name"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Netflix Campaign": {
                "column_name":"nflx_campaign_desc"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Netflix Subcampaign": {
                "column_name":"nflx_subcampaign_desc"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Insertion Order ID": {
                "column_name":"insertion_order_id"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Insertion Order": {
                "column_name":"insertion_order_name"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Budget Start" : {
                "column_name" : "overall_budget_start_time_usec"
                , "type" : "dimension"
                , "agg" : "none" 
            }
            , "Budget End" : {
                "column_name" : "overall_budget_end_time_usec"
                , "type" : "dimension"
                , "agg" : "none" 
            }
            , "UTC Date" : {
                "column_name":"timestamp"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Region Date" : {
                "column_name":"event_region_date"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Creative Type" : {
                "column_name":"creative_type"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Universal Site ID" : {
                "column_name":"universal_site_id"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Site Name": {
                "column_name":"site_name"
                , "type":"dimension"
                , "agg":"none"
            }
            , "Country Code" : {
                "column_name":"country_iso_code"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Country" : {
                "column_name":"country_desc"
                , "type":"dimension"
                , "agg":"none" 
            }
            , "Network" : {
                "column_name" : "dcm_network_code"
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "Spend" : {
                "column_name":"total_media_cost_usd"
                , "type":"metric"
                , "agg":"longSum" 
            }
            , "Reach" : {
                "column_name":"imp_user_id"
                , "type":"metric"
                , "agg":"hyperUnique" 
            }
            , "Impressions" : {
                "column_name":"imp_user_id"
                , "type":"metric"
                , "agg":"count" 
            }
            , "Clicks" : {
                "column_name":"clk_user_id"
                , "type":"metric"
                , "agg":"count" 
            }
            , "Viewability" : {
                "column_name":"viewability"
                , "type":"metric"
                , "agg":"longSum" 
            }
            , "Measureable" : {
                "column_name":"is_measureable"
                , "type":"metric"
                , "agg":"longSum" 
            }
            , "Ad Exposure (min)" : {
                "column_name":"total_exposure_mins"
                , "type":"metric"
                , "agg":"longSum" 
            }
            , "Conversions" : {
                "column_name":"account_id"
                , "type":"metric"
                , "agg":"hyperUnique" 
            }
            , "LTV m60" : {
                "column_name":"ltv_m60_sum"
                , "type":"metric"
                , "agg":"longSum" 
            }
            , "Count" : {
                "column_name":"count"
                , "type":"metric"
                , "agg":"count" 
            }
            , "Percent Completed": {
                "column_name":""
                , "type":"metric"
                , "agg":"none"
            }
            , "Frequency": {
                "column_name":""
                , "type":"metric"
                , "agg":"average"
            }
            , "CPM": {
                "column_name":""
                , "type":"metric"
                , "agg":"average"
            }
            , "CTR": {
                "column_name":""
                , "type":"metric"
                , "agg":"average"
            }
            , "Top Country": {
                "column_name":""
                , "type":"metric"
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
    , "UI Events" : {
        "datasource_name" : "cl_uievents" 
        , "fields" : {
            "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
            , "" : {
                "column_name" : ""
                , "type" : "dimension"
                , "agg" : "none"
            }
        }
    }
}

var datasources = [
    "Insertion Order"
    , "Ignite Sample"
    , "UI Events"
    , "DBM Impressions"
    , "DCM Impressions"
    ] ;
