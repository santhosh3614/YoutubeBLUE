//= require core.ui.Panel
//= require core.ui.WindowPanel


namespace("apps.Desktop",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.DESKTOP,
    '@stylesheets' :["./resources/[$theme]/Desktop.css"],
    '@title'    : "Home",
    '@traits' : [
        AutomaticallyOpenHelpWizardOnce
    ],
    
    initialize : function(){
        this.parent();
        this.prefButton  = this.querySelector(".button-bar .preferences.button");
        this.helpButton  = this.querySelector("#home-help-button");

        this.helpButton.addEventListener("click", this.onShowHelpWizard.bind(this),  false);
        this.prefButton.addEventListener("click", this.onOpenPreferences.bind(this), false);
    },
    

    onShowHelpWizard : function(){
        this.showHelpWizard(200);
    },

    onOpenPreferences : function(e){
        alert("In Development...")
    },


    /**
     * Triggered when user switches context back to this application
     * onFocus() is fired when the app is reloaded from memory.
     * @param {Event} e - The focus event
     */
    onFocus : function(e){

    },

    /**
     * Triggered when screen first loads. Only triggered once.
     * @param {Event} e - The activation event
     */
    onActivated : function(){

    },


    getStepsForHelpWizard : function(){
       var steps = this.querySelectorAll("*[data-helpindex]");
       return steps;
    },

    showHelpWizard : function(delay){
        delay = typeof delay=="number"?delay:2000;
        var i = -1;
        var help = application.getHelpWizard();
        var steps = this.getStepsForHelpWizard()
        help.setHardwareAcceleration(true);
        application.element.appendChild(help.element);
        setTimeout(function(){
          help.activate();
          help.setSteps(steps);
          help.setIndex(i);
          help.next();
        },delay);
    },
    
    innerHTML:
    '<div></div>'
});



