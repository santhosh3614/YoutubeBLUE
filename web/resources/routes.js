
ROUTES = {
    apps : {
        VideoDetails: {
            dev : appconfig.apppath + "apps/VideoDetails/main.js",
            staging : appconfig.apppath + "apps/VideoDetails/main.js",
            test : appconfig.apppath + "apps/VideoDetails/main.js",
            prod: appconfig.apppath + "apps/VideoDetails/main.js"
        },
        Favorites: {
            dev : appconfig.apppath + "apps/Favorites/main.js",
            staging : appconfig.apppath + "apps/Favorites/main.js",
            test : appconfig.apppath + "apps/Favorites/main.js",
            prod: appconfig.apppath + "apps/Favorites/main.js"
        },
        Desktop: {
            dev : appconfig.apppath + "apps/Desktop/main.js",
            staging : appconfig.apppath + "apps/Desktop/main.js",
            test : appconfig.apppath + "apps/Desktop/main.js",
            prod: appconfig.apppath + "apps/Desktop/main.js"
        },
        Privacy: {
            dev : appconfig.apppath + "apps/Privacy/main.js",
            staging : appconfig.apppath + "apps/Privacy/main.js",
            test : appconfig.apppath + "apps/Privacy/main.js",
            prod : appconfig.apppath + "apps/Privacy/main.js"
        },
        About: {
            dev : appconfig.apppath + "apps/About/main.js",
            staging : appconfig.apppath + "apps/About/main.js",
            test:appconfig.apppath + "apps/About/main.js",
            prod:appconfig.apppath + "apps/About/main.js"
        },
        SearchResults: {
            dev : appconfig.apppath + "apps/SearchResults/main.js",
            staging : appconfig.apppath + "apps/SearchResults/main.js",
            test : appconfig.apppath + "apps/SearchResults/main.js",
            prod: appconfig.apppath + "apps/SearchResults/main.js"
        },
        Login: {
            dev : appconfig.apppath + "apps/Login/main.js",
            staging : appconfig.apppath + "apps/Login/main.js",
            test : appconfig.apppath + "apps/Login/main.js",
            prod: appconfig.apppath + "apps/Login/main.js"
        }
    },
    
    HTML : {
        DESKTOP : {
            dev: appconfig.apppath + "apps/Desktop/index.html",
            staging: appconfig.apppath + "apps/Desktop/index.html",
            test : appconfig.apppath + "apps/Desktop/index.html",
            prod : appconfig.apppath + "apps/Desktop/index.html"
        },

        FAVORITES : {
            dev: appconfig.apppath + "apps/Favorites/index.html",
            staging: appconfig.apppath + "apps/Favorites/index.html",
            test : appconfig.apppath + "apps/Favorites/index.html",
            prod : appconfig.apppath + "apps/Favorites/index.html"
        },
        VIDEO_DETAILS : {
            dev: appconfig.apppath + "apps/VideoDetails/index.html",
            staging: appconfig.apppath + "apps/VideoDetails/index.html",
            test : appconfig.apppath + "apps/VideoDetails/index.html",
            prod : appconfig.apppath + "apps/VideoDetails/index.html"
        },
        
        PRIVACY: {
            dev : appconfig.apppath + "apps/Privacy/index.html",
            staging : appconfig.apppath + "apps/Privacy/index.html",
            test : appconfig.apppath + "apps/Privacy/index.html",
            prod : appconfig.apppath + "apps/Privacy/index.html"
        },

        ABOUT: {
            dev : appconfig.apppath + "apps/About/index.html",
            staging : appconfig.apppath + "apps/About/index.html",
            test : appconfig.apppath + "apps/About/index.html",
            prod : appconfig.apppath + "apps/About/index.html"
        },
        
        SEARCH_RESULTS: {
            dev : appconfig.apppath + "apps/SearchResults/index.html",
            staging : appconfig.apppath + "apps/SearchResults/index.html",
            test : appconfig.apppath + "apps/SearchResults/index.html",
            prod : appconfig.apppath + "apps/SearchResults/index.html"
        },

        LOGIN: {
            dev : appconfig.apppath + "apps/Login/index.html",
            staging : appconfig.apppath + "apps/Login/index.html",
            test : appconfig.apppath + "apps/Login/index.html",
            prod : appconfig.apppath + "apps/Login/index.html"
        }
    },
    
    DATA:{

        RECENTAPPS : {
            dev: appconfig.apppath + "resources/data/recent-apps.json",
            staging: appconfig.apppath + "resources/data/recent-apps.json",
            test:appconfig.apppath + "resources/data/recent-apps.json",
            prod:appconfig.apppath + "resources/data/recent-apps.json"
        },
        
        PROFILE : {
            dev: appconfig.apppath + "resources/data/user-profile.json",
            staging : appconfig.apppath + "resources/data/user-profile.json",
            test : appconfig.apppath + "resources/data/user-profile.json",
            prod : appconfig.apppath + "resources/data/user-profile.json"
        },
        
        LOGOUT:{
            dev : "http://www.google.com",
            staging : "http://www.google.com",
            test : "http://www.google.com",
            prod : "http://www.google.com"
        },
        
		START_MENU : {
            dev: appconfig.apppath + "resources/data/start-menu.json",
            staging: appconfig.apppath + "resources/data/start-menu.json",
            test : appconfig.apppath + "resources/data/start-menu.json",
            prod : appconfig.apppath + "resources/data/start-menu.json"
        },

        HEARTBEAT : {
            dev: appconfig.apppath + "resources/data/heartbeat.json",
            staging : appconfig.apppath + "resources/data/heartbeat.json",
            test : appconfig.apppath + "resources/data/heartbeat.json",
            prod : appconfig.apppath + "resources/data/heartbeat.json"
        },

        VIDEO_DETAILS : {
            dev : appconfig.apppath + "resources/data/youtube-video-details.json?part=statistics%2CcontentDetails%2Cplayer%2Csnippet&id={id}&key={key}",
            staging: "https://www.googleapis.com/youtube/v3/videos?part=statistics%2CcontentDetails%2Cplayer%2Csnippet&id={id}&key={key}",
            test: "https://www.googleapis.com/youtube/v3/videos?part=statistics%2CcontentDetails%2Cplayer%2Csnippet&id={id}&key={key}",
            prod : "https://www.googleapis.com/youtube/v3/videos?part=statistics%2CcontentDetails%2Cplayer%2Csnippet&id={id}&key={key}",
            options : {
                method: "GET",
                restful: true
            }
        },

        ABOUT_INFO : {
            dev : appconfig.apppath + "resources/data/about.json",
            staging : appconfig.apppath + "resources/data/about.json",
            test : appconfig.apppath + "resources/data/about.json",
            prod : appconfig.apppath + "resources/data/about.json"
        },

        YOUTUBE_SEARCH : {
            dev: appconfig.apppath + "resources/data/youtube-search-results.json?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
            staging: "https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
            test:"https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
            prod:"https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}"
        },

        YOUTUBE_COMMENTS_THREAD : {
            dev: appconfig.apppath + "resources/data/youtube-comment-threads.json?part=snippet%2Creplies&maxResults={maxResults}&videoId={videoId}&key={key}",
            staging: "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults={maxResults}&videoId={videoId}&key={key}",
            test:"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults={maxResults}&videoId={videoId}&key={key}",
            prod:"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults={maxResults}&videoId={videoId}&key={key}"
        }
    }
};
