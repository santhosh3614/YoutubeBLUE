//= require Observer

namespace("core.traits.OAuthProfile", {
    '@traits':[ new Observer ],


    /**
     * Initialization triggered after the parent host is initialized.
     * @param {ui.Application} component - The host application that is
     * including this trait into it's @traits list.
     */
    initialize : function(component){
        debugger;
        //this.clientId = "767465948567-1sn41l7o67n68dt3igr0tspv0c2p4om7.apps.googleusercontent.com";
        //this.clientSecret = "Pb-9UK1XOByYlcPrUy9Zs3Xv";
        this.profileUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
        this.oauth = component.oauth;        
        component.profile = this;
    },


    /**
     * Helper triggered to exchange a code for a token 
     * or to refresh a token.
     * @param {String} url - Url of the oAuth service
     * @param {Function} callback - The callback to fire when a 
     * result is returned from the oAuth service call.
     */
    getProfile : function(callback){
        var xmlreq = new XMLHttpRequest();
        
        xmlreq.onreadystatechange=function(){
            if (xmlreq.readyState == 4){ 
                debugger;       
                callback(xmlreq.responseText);
            }
        };
        var t = this.oauth.hasToken();
        //alert("this.oauth.hasToken(): " + t)
        
        //xmlreq.setRequestHeader('Access-Control-Allow-Headers', '*');
        //xmlreq.setRequestHeader('Access-Control-Allow-Origin', '*');
        xmlreq.open("GET",this.profileUrl,true);
        xmlreq.setRequestHeader('Authorization', 'Bearer ' + t);
        //xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlreq.send();

    }
});
