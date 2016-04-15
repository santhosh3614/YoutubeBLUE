//= require Observer

namespace("core.traits.OAuth", {
    '@traits':[ new Observer ],


    /**
     * Initialization triggered after the parent host is initialized.
     * @param {ui.Application} component - The host application that is
     * including this trait into it's @traits list.
     */
    initialize : function(component){
        debugger;
        this.clientId = "767465948567-1sn41l7o67n68dt3igr0tspv0c2p4om7.apps.googleusercontent.com";
        this.clientSecret = "Pb-9UK1XOByYlcPrUy9Zs3Xv";
        this.accessToken =  {};
        this.authWindow = null;
        this.redirect_uri = "http://localhost:3000/web";
        component.oauth = this;
        component.addEventListener("appready", this.onBeginInitialize.bind(this), false);
    },


    /**
     * Returns bool <true|false> if user has previously established a session.
     * Does not gurantee/validate that the token is valid.
     */
    hasToken : function(){
        debugger;
        var accessToken = StorageManager.get("oauth.accessToken");
        if( accessToken ){
            return accessToken;
        };
        return false;
    },

    /**
     * Returns bool <true|false> if user is logged in.
     */
    isLoggedIn : function(){
        debugger;
        var accessToken = this.hasToken();
        if( accessToken ){
            var expired = this.isTokenExpired(accessToken);
            return expired == false;
        };
        return false;
    },


    /**
     * Returns <bool|false> if a token exists and has not expired.
     * Returns <bool|true> if a token exists and is expired.
     * Returns null if no token exists.
     * @param {String} accessToken - A string representing a token.
     */
    isTokenExpired : function(accessToken){
        accessToken = accessToken||this.hasToken();

        if(accessToken){
            var refreshTime     = StorageManager.get("oauth.refreshTime");//localStorage["refreshTime"];
            var refreshToken    = StorageManager.get("oauth.refreshToken"); //localStorage["refreshToken"];
            var currentTime     = (new Date()).getTime();
            
            if(currentTime < refreshTime){
                return false;
            }
            else {
                return true;
            }
        };
        return null;
    },


    /**
     * Will kick off the signing process. It first checks to ensure
     * that a current signin is in progress.
     */
    startSignin : function(){
        debugger;
        if(!this.isLoginInProcess()){
            this.initializeLogin();
        }
    },


    /**
     * Returns a bool <true|false> if a current 
     * signin is already in progress.
     */
    isLoginInProcess : function(){
        return StorageManager.get("oauth.login_in_process");
        //return localStorage["oauth.login_in_process"] == "true"
    },


    /**
     * Sets a flag <true|false> to indicate if a login is in progress.
     */
    setLoginInProcess : function(bool){
        debugger;
        StorageManager.set("oauth.login_in_process", bool, true);
        //localStorage["oauth.login_in_process"]=bool;
    },


    /**
     * Will remove tokens that was previously established from
     * a prior login. Calling isLoggedIn() will subsequently 
     * report back as false.
     */
    logOut : function(){
        debugger;
        accessToken = null;
        //localStorage["accessToken"] = null;
        StorageManager.set("oauth.accessToken", null, true);

        //localStorage["refreshToken"] = null;
        StorageManager.set("oauth.refreshToken", null, true);
    },


    /**
     * Triggered when the application has fully loaded and ready.
     * It begins the login process by checking the url for a "?code="
     * param. If found, the code is exchanged for real tokens to
     * establish a signin.
     */
    onBeginInitialize : function(e){
        this.setLoginInProcess(false);
        this.parseRedirectUrl(e);
    },


    /**
     * Helper function to check url for a "?code" param and
     * kicks off the process to exchange it for a token.
     * @param {Event} e - (optional) An event is passed in when
     * the application runs in cordova using InAppBrowser. 'e'
     * will be the window.open's 'loadstart' event (only in Cordova).
     */    
    parseRedirectUrl : function(e){
        //debugger;
        var url = e.url||location.href;
        var thereIsCode = url.indexOf("code=");
        var thereIsError = url.indexOf("error=");
        
        if(thereIsCode != -1){
            this.setLoginInProcess(true);
            var toMatch = "code=([^&#]*)";
            var regex = new RegExp(toMatch);
            var result = regex.exec(url);
            if(result != null){
                var code = result[1];
                this.exchangeCodeForTokens(code);
            }
        } else if(thereIsError != -1){
            this.setLoginInProcess(false);
            StorageManager.set("oauth.accessToken", null, true);
            this.endSignin(-1);
        }
        else{
            this.setLoginInProcess(false);
        }    
    },


    /**
     * Triggered by a few different circumstances. 1. After a ?code
     * is exchanged for a token. 2. After a token is refreshed. 3. If
     * there was an error getting a temp code. 4. If a check is preformed
     * to determin if user is logged in.
     * @param {String|Number} res - A token in string format or a -1 indicating
     * an issue getting a token back.
     */
    endSignin : function(res){
        this.dispatchEvent("endsignin", {value:res});
        var url = location.href;
        var parameter = "code";
        url = url.replace(new RegExp('^([^#]*\?)(([^#]*)&)?' + parameter + '(\=[^&#]*)?(&|#|$)' ), '$1$3$5').replace(/^([^#]*)((\?)&|\?(#|$))/,'$1$3$4');
        location.replace(url);
    },


    /**
     * Triggered when a ?code is being submitted in exchange for a token.
     * @param {String} code - A temporary auth code to be exchanged for a real token.
     */
    exchangeCodeForTokens : function(code){
        var dataQuery = "code=" + code + "&"
                + "client_id=" + this.clientId + "&"
                + "client_secret=" + this.clientSecret + "&"
                + "redirect_uri=" + this.redirect_uri + "&"
                + "grant_type=authorization_code";
        debugger;
        var url = "https://www.googleapis.com/oauth2/v3/token?" + dataQuery;
        this.requestTokens(url,this.callBackTokens.bind(this));
    },


    /**
     * Helper triggered to exchange a code for a token 
     * or to refresh a token.
     * @param {String} url - Url of the oAuth service
     * @param {Function} callback - The callback to fire when a 
     * result is returned from the oAuth service call.
     */
    requestTokens : function(url,callback){
        var xmlreq = new XMLHttpRequest();
        
        xmlreq.onreadystatechange=function(){
            if (xmlreq.readyState == 4){ 
                debugger;       
                callback(xmlreq.responseText);
            }
        };
        //xmlreq.setRequestHeader('Access-Control-Allow-Headers', '*');
        //xmlreq.setRequestHeader('Access-Control-Allow-Origin', '*');
        xmlreq.open("POST",url,true);
        //xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlreq.send();

    },


    /**
     * Helper triggered after a ?code is exchanged for a token.
     * Will store the token and refresh time into localStorage.
     * @param {String} resp - An oAuth token.
     */
    callBackTokens : function(resp){
        var tokensResp = JSON.parse(resp);//eval('('+resp+')');

        if(tokensResp.access_token){
            //localStorage["accessToken"] = tokensResp.access_token;
            StorageManager.set("oauth.accessToken", tokensResp.access_token, true);

            //localStorage["refreshToken"] = tokensResp.refresh_token;
            StorageManager.set("oauth.refreshToken", tokensResp.refresh_token, true);

            var refreshTime = (new Date()).getTime() + 1000*tokensResp.expires_in;
            //localStorage["refreshTime"] = refreshTime;
            StorageManager.set("oauth.refreshTime", refreshTime, true);

            accessToken = tokensResp.access_token;
            this.endSignin(accessToken);
        }else{
            accessToken = null;
            //localStorage["accessToken"] = null;
            StorageManager.set("oauth.accessToken", null, true);
            this.endSignin(-1);
        }
    },


    /**
     * Helper triggered when a token expires and needs to refresh.
     * @param {String} refreshToken - An oAuth refresh token.
     */
    refreshedAccessToken : function(refreshToken){
        debugger;
        var dataQuery = "client_id=" + this.clientId + "&"
                + "client_secret=" + this.clientSecret + "&"
                + "refresh_token=" + refreshToken + "&"
                + "grant_type=refresh_token";
    
        var url = "https://www.googleapis.com/oauth2/v3/token?" + dataQuery;
        this.requestTokens(url,this.callBackRefreshToken.bind(this));
    },


    /**
     * Helper triggered when a token has been refreshed.
     * @param {String} resp - An oAuth token that has been refreshed.
     */
    callBackRefreshToken : function(resp){
        debugger;
        var tokensResp = JSON.parse(resp);//eval('('+resp+')');

        if(tokensResp.access_token){
            //localStorage["accessToken"] = tokensResp.access_token;
            StorageManager.set("oauth.accessToken", tokensResp.access_token, true);

            var refreshTime = (new Date()).getTime() + 1000*tokensResp.expires_in;
            //localStorage["refreshTime"] = refreshTime;
            StorageManager.set("oauth.refreshTime", refreshTime, true);

            accessToken = tokensResp.access_token;  
            //this.endSignin(accessToken);
            this.initializeLogin();
        }else{
            accessToken = null;
            //localStorage["accessToken"] = null;
            //this.endSignin(-1);
            StorageManager.set("oauth.accessToken", null, true);
            this.initializeLogin();
        }
    },


    /**
     * Helper triggered when the signin process starts. Will check for
     * a token, if expired, it makes the call to renew. If no valid token 
     * is discovered, it will begin the process to get a temp auth code
     * when will then be exchanged for a token.
     */
    initializeLogin : function(){
        if(this.hasToken() && this.isLoggedIn()){
            this.endSignin(this.hasToken());
        }
        else if(this.hasToken() && this.isTokenExpired()){
            var doit = confirm("Session Expired. Login to Coninue?");
            if(doit){
                this.refreshedAccessToken(this.hasToken());
            }
        }
        else {
            if(!this.isLoginInProcess()){
                this.openAuthWindow();
            }
        }
        /*debugger;
        var accessToken = StorageManager.get("oauth.accessToken");
        
        if(accessToken == "null"){
            accessToken = null;
        }
        
        if(accessToken!==null && typeof(accessToken)!=='undefined'){
            var refreshTime = StorageManager.get("oauth.refreshTime");//localStorage["refreshTime"];
            var refreshToken = StorageManager.get("oauth.refreshToken"); //localStorage["refreshToken"];
            var currentTime = (new Date()).getTime();
            
            if(!this.isTokenExpired()){
                this.endSignin(accessToken);
            }else{
                this.refreshedAccessToken(refreshToken);
            }
        } else {
            //this.endSignin(-1);
            if(!this.isLoginInProcess()){
                //this.endSignin = callbackEnd;
                this.openAuthWindow();
            }
        }*/
    },


    /**
     * Helper triggered when the signin process starts. Will utilize 'InAppBrowser'
     * for a popup window on Cordova otherwise redirects to the oAuth authentication
     * page inline.
     */
    openAuthWindow : function(){
        debugger;
        var urlAuth = "https://accounts.google.com/o/oauth2/auth?"
            + "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&"
            + "redirect_uri=http://localhost:3000/web&"
            + "response_type=code&"
            + "client_id=" + this.clientId;
    
        
        // Open InAppBrowser to get authorization code
        if(UserAgent.isAndroid()){
            this.authWindow = window.open(urlAuth, '_blank', 'location=yes,toolbar=no');
            this.authWindow.addEventListener('loadstart', this.parseRedirectUrl.bind(this));
        }
        else{
            location.href=urlAuth;
        }
    }
});
