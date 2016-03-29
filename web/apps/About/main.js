//= require core.ui.Panel
//= require core.ui.WindowPanel


namespace("apps.About",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.ABOUT,
    '@stylesheets' :["apps/About/resources/[$theme]/About.css"],
    '@title'	: "About Us",
    '@traits' : [ 
        HandlePanelCloseButton 
    ],
    
    initialize : function(){
        this.parent();
        this.appversion = this.querySelector("#app-version");
        this.builddate = this.querySelector("#build-date");
        this.templates = {};
        this.templates["about-info-template"] = {
            template:this.querySelector("#about-info-template"),
            div:"#about-info-panel"
        };
        this.downloadAboutInfo();
    },


    /**
     * Triggered when 'apps.About' first initializes
     */
    downloadAboutInfo : function(){
        var action = new core.http.WebAction(ROUTES.DATA.ABOUT_INFO, {});

        action.invoke({
            onSuccess  : this.onAboutInfoLoaded.bind(this),
            onFailure  : this.onAboutInfoLoadedFailure.bind(this),
            onRejected : this.onAboutInfoLoadedFailure.bind(this)
        });
    },

    /**
     * Triggered when 'downloadAboutInfo() encounters an http response failure.
     * @param {Object} response - The low-level xhr response
     * @param {String} responseText - The responseText string
     */
    onAboutInfoLoadedFailure : function(response, responseText){
        console.error("failure to about info", response, responseText);  
    },


    /**
     * Triggered when 'downloadAboutInfo() successfully receives an http response.
     * @param {Object} response - The low-level xhr response
     * @param {String} responseText - The responseText string
     */
    onAboutInfoLoaded : function(response, responseText){
        try{
            var data = JSON.parse(responseText);
            if(data && typeof data=="object"){
                this.data = data;
                this.renderAboutInfo(data);
            }
        }
        catch(e){
            alert("error getting about info");
            console.error(e.message,responseText);
        }
    },

    /**
     * Triggered when 'onAboutInfoLoaded() successfully receives data'
     * @param {Object} data - The about data for the template
     */
    renderAboutInfo : function(data){
        this.renderTemplate(data, "about-info-template");
    },

    /**
     * Triggered when screen first loads. Only triggered once.
     * @param {Event} e - The activation event
     */
    onActivated : function(e){
        console.info(this.namespace + " view tracked/logged");
    },
    
    innerHTML:
    '<div></div>'
});



