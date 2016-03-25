
# HOTEL COUPONS MOBILE APP

This application is built on a framework that allows it to
run as a web application hosted within a php container. It can 
also be compiled and installed as an app on Android and/or 
iOS devices using Phonegap/Cordova.


<img src="https://github.dominionenterprises.com/TravelMediaGroup/matrix-mobileapp/blob/master/resources/screenshots/home.png?raw=true" width="320"/>

<img src="https://github.dominionenterprises.com/TravelMediaGroup/matrix-mobileapp/blob/master/resources/screenshots/menu.png?raw=true" width="320"/>

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
Open 'index.html' from disk (file:///) or... 

#### Run from built-in server
To boot a simple ruby server (Mac ships with Ruby), cd.. into
the root of this application and run:

```
cd HotelCouponsMobile/
```

```
HotelCouponsMobile > rake js:server
```

This will spawn a localhost server on port 3000 for 
the current folder.

To access the app from your PC:
```
http://localhost:3000
```


#### Run from LAMP/MAMP server
Alternatively, you can drop the application folder into the /public
folder of your LAMP/MAMP or Apache server and access it by folder:

```
http://localhost:8888/HotelCoupons
```

#### Run from Device
*To access the app from your devices Android/iOS web browser:
```
http://192.168.0.6:3000
```

To access the app from your Android/iOS emulator:
```
http://192.168.0.6:3000
```

Where the ip is your IPv4 computer ip.

*This is the recommended way for testing the UI on a mobile device until
PhoneGap is integrated. 

Your device must be set to use 'WiFi' and be on the same wifi network to connect.
NOTE: Some VPN clients will prevent the device from connecting.



### Deployment Environment

#### Define your deployment environment
The 'HotelCoupons' app supports 4 different deployment environments:
* 'dev'
* 'staging'
* 'test'
* 'prod'

Where:
* 'dev' - For testing/debugging locally on development machine
* 'staging' - Use if deploying to a staging server
* 'test' - Use if deploying to a QA server
* 'prod' - Use when moving to production server or official PhoneGap releases.

See the appconfig{} defined in index.html to set the appropriate
environment flag. Use 1 of the 4 above string values. Fro example,
index.html defines appconfig as:

```
appconfig = {
	version		: "1.0",
    namespace	: "HotelCoupons",
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

Example: When connecting to get a list of properties for a hotel search, 1 of 4
URI's would be accessed depending on what environment the application configured
for.

Here's what the URI end-point looks like for searching a list of properties:

```
DATA:{
	...,
	...,
	HOTEL_SEARCH : {
	    dev: appconfig.apppath + "resources/data/hotel-search.json",
	    staging: "http://127.0.0.1:8080/api/properties",
	    test:"",
	    prod:""
	},
	...
	...
}
```

'HOTEL_SEARCH' defines 4 uri's for each environment. Only the uri for
the onfigured environment will be accessed in the deployed server.

#### Verifying end-points
There are 3 ways to verify the end-points you've defined for the various 
environments:

Console Logging:
```
//Outputs the whole configuration object with all URI's
console.log(ROUTES.DATA.HOTEL_SEARCH)
```

Resolving a URI dynamically in the console:
```
//Outputs a resolved URI for the current environment
var resolvedUrl = core.http.UrlRouter.resolve(ROUTES.DATA.HOTEL_SEARCH);
console.log(resolvedUrl)
```


Using a WebAction request:
```
var keywordStr = "Orlando, FL";

var action = new core.http.WebAction(
    ROUTES.DATA.HOTEL_SEARCH, {keyword:keywordStr}
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
see the [tags on this repository](https://github.dominionenterprises.com/TravelMediaGroup/matrix-mobileapp/tags). 

## Authors

* **Jason E. Smith** - *Initial work*

See also the list of [contributors](https://github.dominionenterprises.com/TravelMediaGroup/matrix-mobileapp/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
