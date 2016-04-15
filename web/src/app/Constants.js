/**
 * Global application constants
 */
namespace("app.constants");




app.constants.youtube = {
    MAX_RESULTS : 10,
    ORDER_BY : "date",
    KEYS : {
        ANDROID : {
            YOUTUBE_API : "AIzaSyAhwrG6u-2IPkf6czJOLm_BaXOplqqBN9w"
        },
        IOS : {
            YOUTUBE_API: "AIzaSyAhwrG6u-2IPkf6czJOLm_BaXOplqqBN9w"
        },
        COMMON : {
            "YOUTUBE_API": "AIzaSyAhwrG6u-2IPkf6czJOLm_BaXOplqqBN9w"
        }
    }
};

app.constants.oauth = {
    KEEP_TEMP_TOKEN_IN_URL: false,
    SESSION_EXPIRED_MSG : "Session Expired. Login to Coninue?",
    PROVIDERS : {
        GOOGLE : {
            SECRET : "Pb-9UK1XOByYlcPrUy9Zs3Xv",
            CLIENT_ID: "767465948567-1sn41l7o67n68dt3igr0tspv0c2p4om7.apps.googleusercontent.com",
            REDIRECT_URI : "http://localhost:3000/web",
            PARAM_NAMES : {
                TEMP_TOKEN : "code",
                ERROR : "error",
                CLIENT_ID : "client_id",
                CLIENT_SECRET : "client_secret",
                REDIRECT_URI : "redirect_uri",
                GRANT_TYPE : "grant_type",
                REFRESH_TOKEN : "refresh_token",
                RESPONSE_TYPE: "response_type",

            }
        }
    }
};



app.constants.company = {
	CUSTOMER_SUPPORT_PHONE : "1-555-555-5555"
};


app.constants.DEFAULT_HOME_APP = "apps/Desktop";
