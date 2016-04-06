namespace("core.traits.OAuth", {
    '@traits':[ new Observer ],


    initialize : function(component){
        debugger;
        this.clientId = "767465948567-1sn41l7o67n68dt3igr0tspv0c2p4om7.apps.googleusercontent.com";
        this.clientSecret = "Pb-9UK1XOByYlcPrUy9Zs3Xv";
        this.accessToken =  {};
        this.authWindow = null;
        this.redirect_uri = "http://localhost:3000/web";
        component.oauth = this;
        this.setLoginInProcess(false);
        this.parseRedirectUrl();
    },


    parseRedirectUrl : function(e){
        //debugger;
        var url = location.href;
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
            StorageManager.store("oauth.accessToken", null, true);
            this.endSignin(-1);
        }
        else{
            this.setLoginInProcess(false);
        }    
    },

    endSignin : function(res){
        this.dispatchEvent("endsignin", {value:res});
        var url = location.href;
        var parameter = "code";
        url = url.replace(new RegExp('^([^#]*\?)(([^#]*)&)?' + parameter + '(\=[^&#]*)?(&|#|$)' ), '$1$3$5').replace(/^([^#]*)((\?)&|\?(#|$))/,'$1$3$4');
        location.replace(url);
    },

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

    callBackTokens : function(resp){
        var tokensResp = JSON.parse(resp);//eval('('+resp+')');

        if(tokensResp.access_token){
            //localStorage["accessToken"] = tokensResp.access_token;
            StorageManager.store("oauth.accessToken", tokensResp.access_token, true);

            //localStorage["refreshToken"] = tokensResp.refresh_token;
            StorageManager.store("oauth.refreshToken", tokensResp.refresh_token, true);

            var refreshTime = (new Date()).getTime() + 1000*tokensResp.expires_in;
            //localStorage["refreshTime"] = refreshTime;
            StorageManager.store("oauth.refreshTime", refreshTime, true);

            accessToken = tokensResp.access_token;
            this.endSignin(accessToken);
        }else{
            accessToken = null;
            //localStorage["accessToken"] = null;
            StorageManager.store("oauth.accessToken", null, true);
            this.endSignin(-1);
        }
    },


    refreshedAccessToken : function(refreshToken){
        debugger;
        var dataQuery = "client_id=" + this.clientId + "&"
                + "client_secret=" + this.clientSecret + "&"
                + "refresh_token=" + refreshToken + "&"
                + "grant_type=refresh_token";
    
        var url = "https://www.googleapis.com/oauth2/v3/token?" + dataQuery;
        this.requestTokens(url,this.callBackRefreshToken.bind(this));
    },


    callBackRefreshToken : function(resp){
        debugger;
        var tokensResp = JSON.parse(resp);//eval('('+resp+')');

        if(tokensResp.access_token){
            //localStorage["accessToken"] = tokensResp.access_token;
            StorageManager.store("oauth.accessToken", tokensResp.access_token, true);

            var refreshTime = (new Date()).getTime() + 1000*tokensResp.expires_in;
            //localStorage["refreshTime"] = refreshTime;
            StorageManager.store("oauth.refreshTime", refreshTime, true);

            accessToken = tokensResp.access_token;  
            //this.endSignin(accessToken);
            this.initializeLogin();
        }else{
            accessToken = null;
            //localStorage["accessToken"] = null;
            //this.endSignin(-1);
            StorageManager.store("oauth.accessToken", null, true);
            this.initializeLogin();
        }
    },

    initializeLogin : function(){
        debugger;
        //accessToken = localStorage["accessToken"];
        accessToken = StorageManager.find("oauth.accessToken")[0];
        
        if(accessToken == "null"){
            accessToken = null;
        }
        
        if(accessToken!==null && typeof(accessToken)!=='undefined'){
            var refreshTime = StorageManager.find("oauth.refreshTime")[0];//localStorage["refreshTime"];
            var refreshToken = StorageManager.find("oauth.refreshToken")[0] //localStorage["refreshToken"];
            var currentTime = (new Date()).getTime();
            
            if(currentTime < refreshTime){
                this._isLoggedIn = true;
                this.endSignin(accessToken);
            }else{
                this._isLoggedIn = false;
                this.refreshedAccessToken(refreshToken);
            }
        } else {
            this._isLoggedIn = false;
            //this.endSignin(-1);
            if(!this.isLoginInProcess()){
                //this.endSignin = callbackEnd;
                this.openAuthWindow();
            }
        }
    },

    isLoggedIn : function(){
        return this._isLoggedIn;
    },

    startSignin : function(){
        debugger;
        if(!this.isLoginInProcess()){
            this.initializeLogin();
        }
    },

    isLoginInProcess : function(){
        return StorageManager.find("oauth.login_in_process")[0];
        //return localStorage["oauth.login_in_process"] == "true"
    },

    setLoginInProcess : function(bool){
        debugger;
        StorageManager.store("oauth.login_in_process", bool, true);
        //localStorage["oauth.login_in_process"]=bool;
    },

    logOut : function(){
        debugger;
        accessToken = null;
        //localStorage["accessToken"] = null;
        StorageManager.store("oauth.accessToken", null, true);

        //localStorage["refreshToken"] = null;
        StorageManager.store("oauth.refreshToken", null, true);
    },

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
