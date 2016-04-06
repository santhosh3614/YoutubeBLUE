//= require core.ui.Panel
//= require core.ui.WindowPanel


/**
 * Creates a new apps.VideoDetails application instance.
 * @example
 * var app = new apps.VideoDetails;
 * @class
 */
namespace("apps.VideoDetails",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.VIDEO_DETAILS,
    '@title'    : "Video Info",
    '@stylesheets' : [
        "./resources/[$theme]/VideoDetails.css",
        "~/resources/[$theme]/Video.css"
    ],
    '@traits' : [ 
        HandlePanelCloseButton,
        AutomaticallyOpenHelpWizardOnce
    ],

    /**
     * The constructor which runs when a new instance of apps.VideoDetails is created
     * @example
     * var app = new apps.VideoDetails;
     * @return {core.ui.WebApplication}
     */
    initialize : function(){
        this.parent();
        this.titlebar       = this.querySelector(".titlebar .title");
        this.likeButton     = this.querySelector(".button-bar .like.button");
        this.unlikeButton   = this.querySelector(".button-bar .dislike.button");
        this.favoriteButton = this.querySelector(".button-bar .favorite.button");
        this.commentsButton = this.querySelector(".button-bar .comments.button");

        this.closeButton    = this.querySelector(".panel-options .close.button");
        this.helpButton     = this.querySelector(".panel-options .help.button");
        this.addEventListener("click", this.onDOMClickDetected.bind(this), false);
        this.helpButton.addEventListener("click", this.onShowHelpWizard.bind(this), false);
        this.commentsButton.addEventListener("click", this.onViewComments.bind(this), false);
        this.favoriteButton.addEventListener("click", this.onAddToFavorites.bind(this), false);


        this.templates = {};
        this.templates["video-details"] = {
            template:this.querySelector("#video-details-template"),
            div:"#video-details"
        };

        this.templates["comments-template"] = {
            template:this.querySelector("#video-comments-template"),
            div:"#video-comments-list"
        }
    },

    

    /**
     * Triggered when this.commentsButton (see cctor) is clicked on.
     * @param {Event} e - The click event
     */
    onViewComments : function(e){
        application.showAppSpinner();
        var _videoId = this.data.items[0].id;
        var action = new core.http.WebAction(
            ROUTES.DATA.YOUTUBE_COMMENTS_THREAD, {
                videoId:_videoId,
                maxResults : 50,
                key : app.constants.youtube.KEYS.COMMON.YOUTUBE_API
            }
        );

        action.invoke({
            onSuccess  : this.onVideoCommentsLoaded.bind(this),
            onFailure  : this.onVideoCommentsLoadFailure.bind(this),
            onRejected : this.onVideoCommentsLoadFailure.bind(this)
        });
    },



    /**
     * Triggered when the video comments are downloaded successfully
     * @param {XmlHttpRequest} response - The xhr response
     * @param {string} responseText - The xhr responseText
     */
    onVideoCommentsLoaded : function(response, responseText){
        try{
            var data = JSON.parse(responseText);
            if(data && typeof data=="object"){
                this.comments_data = data;
                this.onRenderComments(data);
            }
        }
        catch(e){
            alert("error getting video comments, see console.");
            console.error(e.message,responseText);
        }
    },


    /**
     * Triggered when the video comments fails to download
     * @param {XmlHttpRequest} response - The xhr response
     * @param {string} responseText - The xhr responseText
     */
    onVideoCommentsLoadFailure : function(response, responseText){
        console.error("failure to retrieve video comments", response, responseText);  
    },



    /**
     * Triggered when the video comments are downloaded and ready to render
     * @param {Object} data - The data to render
     */
    onRenderComments : function(data){
        this.commentsButton.prototype.setLabel(data.pageInfo.totalResults);
        this.renderTemplate(data, "comments-template");
        var commentsList = this.querySelector("#video-comments-list");
            commentsList.scrollIntoView({behavior: "smooth"});
        application.hideAppSpinner();
    },


    /**
     * Triggered when this.helpButton (see cctor) is clicked on.
     * Calls showHelpWizard(<delay>) with a delay
     * @param {Event} e - The click event
     */
    onShowHelpWizard : function(e){
        this.showHelpWizard(200);
    },


    /**
     * getStepsForHelpWizard() scans through the HTML for any data-helpindex elements
     * and returns the steps as an array to be used.
     */
    getStepsForHelpWizard : function(){
       var steps = this.querySelectorAll("*[data-helpindex]");
       return steps;
    },


    /**
     * Triggered by onShowHelpWizard(). Gathers a list of steps
     * sorts the steps by index order and then opens the wizard.
     * @param {Number} delay - The number of milliseconds to delay, default is 2 seconds.
     */
    showHelpWizard : function(delay){
        delay = (typeof delay=="number")?delay:2000;
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


     /**
     * Triggered when screen first loads. Only triggered once.
     * @param {Event} e - The activation event
     */
    onActivated : function(e){
        
    },


    /**
     * Triggered when user switches context to another application
     * onBlur() fired just before app goes to 'sleep'
     * @param {Event} e - The blur event
     */
    onBlur : function(e){
        this.parent(e);
        this.commentsButton.prototype.setLabel("...");
        var comments = this.querySelector("#comments");

        var p = this.querySelector(".Video");
        if(p){
            p.parentNode.removeChild(p);
        }
        if(comments){
            comments.innerHTML="";
        }
    },



    /**
     * Triggered when user clicks on a photo in the photo slider
     * @param {Event} e - The click event
     */
    onDOMClickDetected : function(e){
        if(e.target.classList.contains("photo")){
            var src = e.target.getAttribute("src");
            this.avatar = this.querySelector(".avatar");
            if(this.avatar){
              this.avatar.style.backgroundImage = "url(" + src + ")"
            }
        }
    },


    /**
     * Triggered when user clips the current coupon/video
     * @param {Event} e - The click event
     */
    onAddToFavorites : function(e){
        var e = e.data;
        var r = StorageManager.find("videos.favorites").where("$.id=='" + this.data.items[0].id + "'")[0];
        if(r){return}

        StorageManager.store("videos.favorites",this.data.items[0]);
        StorageManager.persist();
        application.dispatchEvent("notification",true,true,{appref:"apps/Favorites", message:"Video saved to Favorites", type:"info", title:"Favorites Updated"})
    },
    

    /**
     * Triggered when user switches context back to this application
     * onFocus() fired when the app is reloaded from memory.
     * @param {Event} e - The focus event
     */
    onFocus : function(e){
        this.parent(e);
        var hash = location.hash.replace("#","");
        var appinfo = rison.decode(decodeURIComponent(hash));

        if(appinfo && appinfo.appref == this.namespace){
            var data = appinfo.data;
            this.onDownloadVideo(data);
        } else{
            var selectedVideoId = Session.State.selectedVideoId;
            if(selectedVideoId){
                this.onDownloadVideo({id:selectedVideoId});
            }
        }
    },
    

    /**
     * Triggered when user loads the Video Details
     * @param {Event} data - The load event
     */
    onDownloadVideo : function(data){
        var videoId = data.id;
        var action = new core.http.WebAction(
            ROUTES.DATA.VIDEO_DETAILS, {
                id:videoId,
                key : app.constants.youtube.KEYS.COMMON.YOUTUBE_API
            }
        );

        action.invoke({
            onSuccess  : this.onDownloadVideoLoaded.bind(this),
            onFailure  : this.onDownloadVideoLoadedFailure.bind(this),
            onRejected : this.onDownloadVideoLoadedFailure.bind(this)
        });
    },
    

    /**
     * Triggered when the video details are downloaded successfully
     * @param {XmlHttpRequest} response - The xhr response
     * @param {string} responseText - The xhr responseText
     */
    onDownloadVideoLoaded : function(response, responseText){
        try{
            var data = JSON.parse(responseText);
            if(data && typeof data=="object"){
                this.data = data;
                var r = StorageManager.find("videos.recent").where("$.id=='" + this.data.items[0].id + "'")[0];
                if(!r){
                    StorageManager.store("videos.recent",this.data.items[0]);
                    StorageManager.persist();
                };
                this.renderSearchResults(data);
            }
        }
        catch(e){
            alert("error getting search results");
            console.error(e.message,responseText);
        }
    },


    /**
     * Triggered when the video details are downloaded to render JSON in html
     * @param {Object} data - The xhr json response
     */
    renderSearchResults : function(data){
        var likeCount = parseInt(data.items[0].statistics.likeCount);
        var dislikeCount = parseInt(data.items[0].statistics.dislikeCount);

        likeCount = Math.abbrNum(likeCount,1);
        dislikeCount = Math.abbrNum(dislikeCount,1);
        this.likeButton.prototype.setLabel(likeCount);
        this.unlikeButton.prototype.setLabel(dislikeCount);
        this.renderTemplate(data, "video-details");
    },

    

    /**
     * Triggered when there is a net failure
     * @param {XmlHttpRequest} response - the xhr object
     * @param {string} responseText - the xhr responseText
     */
    onDownloadVideoLoadedFailure : function(response, responseText){
        console.error("failure to retrieve video details", response, responseText);  
    },
    

    /**
     * The UI representation of this UI Component when initialized without a DOM element-container.
     * @example
     * var app = new apps.VideoDetails;
     * console.log(app.element)  //element is a DOM representation of the innerHTML video
     */
    innerHTML: '<div></div>'
});



