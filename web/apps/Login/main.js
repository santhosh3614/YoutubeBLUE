namespace("apps.Login", {
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.LOGIN,
    '@stylesheets' :[
        "./resources/[$theme]/Login.css"
    ],
    '@title'    : "Login",


    initialize : function() {
        this.loginButton = this.querySelector("#google-login-button");
        this.loginButton.addEventListener("click", this.onRedirectToGoogle.bind(this), false);
    },


    onRedirectToGoogle : function(){
        application.onStartSignin();
    }
});
