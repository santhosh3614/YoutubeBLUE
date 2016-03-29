
# Youtube BLUE

This application is built on a framework that allows it to
run offline from disk (file:///), as a web application (http://) 
or on a native Android (.apk) and/or iOS (.ipa) device using 
Phonegap or Cordova.

DEMO:
<a href="http://js.netai.net/youtube">YoutubeBLUE Demo</a>


<img src="https://github.com/Nashorn/YoutubeBLUE/blob/master/web/resources/images/youtube/screenshots.png"/>


## Getting Started

These instructions will get you a copy of the project up and 
running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a 
live system.

### Prerequisities

Mac or Windows
LAMP/MAMP Server


### Installing

Download the .zip or pull the repository from git. 

#### Run from disk:
Open 'web/index.html' from disk (file:///) or... 

#### Run from built-in server
To boot a simple ruby server (Mac ships with Ruby), cd.. into
the root of this application and run:

```
cd YoutubeBLUE/
```

```
YoutubeBLUE > rake js:server
```

This will spawn a localhost server on port 3000 for 
the current folder.

To access the app from your PC:
```
http://localhost:3000/web
```


#### Run from LAMP/MAMP server
Alternatively, you can copy the contents of the 'web/' folder into a folder 
such as 'YoutubeBlue/' located in the /public root of your LAMP/MAMP or 
Apache server and access it by folder:

```
http://localhost:8888/YoutubeBLUE/web
```

#### Run from Device
*To access the app from your devices Android/iOS web browser:
```
http://192.168.0.6:3000
```

To access the app from your Android/iOS emulator:
```
http://192.168.0.6:3000/web
```

Where the ip is your IPv4 computer ip.

*This is the recommended way for testing the UI on a mobile device until
PhoneGap is integrated. 

Your device must be set to use 'WiFi' and be on the same wifi network to connect.
NOTE: Some VPN clients will prevent the device from connecting.



### Deployment Environment

#### Define your deployment environment
The 'YoutubeBlue' app supports 4 different deployment environments:
* 'dev'
* 'staging'
* 'test'
* 'prod'

Where:
* 'dev' - For testing/debugging locally on development machine
* 'staging' - Use if deploying to a staging server
* 'test' - Use if deploying to a QA server
* 'prod' - Use when moving to production server or official Cordova releases.

See the appconfig{} defined in index.html to set the appropriate
environment flag. Use 1 of the 4 above string values. Fro example,
index.html defines appconfig as:

```
appconfig = {
	version		: "1.0",
    namespace	: "YoutubeBLUE",
    charset		: "utf-8",
    environment	: "dev",			// <---- HERE
    theme		: "Default",
    AMD			: true,
    foucdelay	: 10,
    debug		: true,
    logging		: true,
    fullscreenmode	: false,
    ismobile	: false,
    apppath		: ""
};
```

#### Define webservice end-points
When the 'environment' property is configured (see above), the application will attempt 
to make all net/ajax connections to that server environment for read/write data access.

All connections are defined in 'resources/data/routes.js'. This config
defines service end-points for all possible environments. Only
the configured environment URI will be accessed when deployed.

Example: When connecting to get a list of items for a video search, 1 of 4
URI's would be accessed depending on what environment the application configured
for.

Here's what the URI end-point looks like for searching a list of items:

```
DATA:{
	...,
	...,
	YOUTUBE_SEARCH : {
      dev: appconfig.apppath + "resources/data/youtube-search-results.json?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
      staging: "https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
      test:"https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}",
      prod:"https://www.googleapis.com/youtube/v3/search?part={part}&order={order}&q={q}&key={key}&pageToken={pageToken}&maxResults={maxResults}"
  },
	...
	...
}
```

'YOUTUBE_SEARCH' defines 4 uri's for each environment. Only the uri for
the configured environment will be accessed in the deployed server.

#### Verifying end-points
There are 3 ways to verify the end-points you've defined for the various 
environments:

Console Logging:
```
//Outputs the whole configuration object with all URI's
console.log(ROUTES.DATA.YOUTUBE_SEARCH)
```

Resolving a URI dynamically in the console:
```
//Outputs a resolved URI for the current environment
var resolvedUrl = core.http.UrlRouter.resolve(ROUTES.DATA.YOUTUBE_SEARCH);
console.log(resolvedUrl)
```


Using a WebAction request:
```
var keywordStr = "Movie Trailers";

var action = new core.http.WebAction(
    ROUTES.DATA.YOUTUBE_SEARCH, {q:keywordStr}
);

action.invoke({
  onSuccess  : function(xhr, responseText){
    console.log("responseText", responseText)
  },
  onFailure  : function(xhr, responseText){},
  onRejected : function(xhr, responseText){}
});
```


## Running the tests
Tests are executed by Jasmine framework. More info to come...


### Coding Style

Explain what these tests test and why

```
Give an example
```

## Contributing

Please read for details on our code of conduct, and the process for submitting pull requests.

## Versioning

Use [SemVer](http://semver.org/) for versioning. For the versions available, 
see the(). 

## Authors

* **Jason E. Smith (jaysmith024@gmail.com) ** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
