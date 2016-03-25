//= require core.ui.Panel
//= require core.ui.WindowPanel


/**
 * Creates a new apps.SearchResults application instance.
 * @example
 * var app = new apps.SearchResults;
 * @class
 */
namespace("apps.SearchResults",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.SEARCH_RESULTS,
    '@title'    : "Search Results",
    '@stylesheets' : [
        "./resources/[$theme]/SearchResults.css",
        "~/resources/[$theme]/Video.css"
    ],
    '@traits' : [ 
        InfiniteScroll,                         //for pagination
        HandlePanelCloseButton,                 //handles close button
        AutomaticallyOpenHelpWizardOnce         //opens wizard just once
    ],

    /**
     * The constructor which runs when a new instance of apps.SearchResults is created
     * @example
     * var app = new apps.SearchResults;
     * @return {core.ui.WebApplication}
     */
    initialize : function() {
        this.parent();
        Session.State.resetSearchResults = true;
        this.filterOptionsModal = this.modalize(this.querySelector("#search-filter-dialog"));

        this.filterButton   = this.querySelector(".filters.button");
        this.titleText      = this.querySelector(".titlebar .title");
        this.contentPanel   = this.querySelector(".panel-content");
        this.spinner        = this.querySelector("#scroll-spinner");
        this.resultLists    = this.querySelector(".results-listing");
        this.filterDialog   = this.querySelector("#search-filter-dialog");
        this.count          = app.constants.youtube.MAX_RESULTS;
        this.page           = 0;

        
        this.resultLists.addEventListener("click", this.onVideoItemClicked.bind(this), false);
        this.filterButton.addEventListener("click", this.onShowFilterDialog.bind(this), false);
        this.addEventListener("resetsearch", this.onResetSearchListings.bind(this), false);

        this.initializeTemplates();
        this.initializeSearchFilter();
    },


    /**
     * Triggered during initialization. initializeTemplates() will store
     * a template to be used for populating with JSON results.
     */
    initializeTemplates : function(){
        this.templates = {};
        this.templates["results"] = {
            template : this.querySelector("#videos-search-results-template"),
            div : ".results-listing"
        };
    },


    /**
     * Triggered during initialization. It creates a binding to filters
     * to be used in search filtering.
     */
    initializeSearchFilter : function(){
        var filters = {
            order  : app.constants.youtube.ORDER_BY
        };

        this.mFilter = new core.data.Accessor(filters);
        this.mFilter.addEventListener("changed", this.onSearchFiltersChanged.bind(this).debounce(200),false);
        this.filterDialog.prototype.bind(this.mFilter);
    },



    /**
     * Triggered when this.filterButton is clicked. Opens the search filter dialog.
     * @param {Event} e - The click event
     */
    onShowFilterDialog : function(e) {
        this.filterOptionsModal.open();
    },


    /**
     * getInfiniteScrollableItem() returns the scrollable div that holds all results.
     */
    getInfiniteScrollableItem : function() {
        return this.contentPanel;
    },


    /**
     * The 'refresh()' hook is triggered by the application framework 
     * on the currently active and focused application
     */
    refresh : function() {},



    /**
     * Triggered when user scrolls to the top of the container
     * @param {Event} e - The scroll event
     */
    onContentScrolledTop : function(e) { },



    /**
     * Triggered when user scrolls to the bottom of the container
     * @param {Event} e - The scroll event
     */
    onContentScrolledBottom : function(e) {
        var action = this.getResultsIterator();
            this.executeSearch(action);
    },

    

    /**
     * Triggered when user clicks on any item in the search results list
     * @param {Event} e - The click event
     */
    onVideoItemClicked : function(e) {
        var target = this.getSearchTargetItem(e);
        if(!target){return}
            
        if(target.classList.contains("fa-phone-square")){return}

        if(target){
            var hash = location.hash.replace("#","");
            var appinfo = rison.decode(decodeURIComponent(hash));
            var position = Session.State.currentGeocodePosition||appinfo||{};
            
            this.scrollTop = this.contentPanel.scrollTop;
            var appref = target.getAttribute("data-appref");
            var videoId = target.getAttribute("data-video-id");
            Session.State.selectedVideoId = videoId;
            Session.State.resetSearchResults = false;
            application.dispatchEvent("openapp",true,true,{
                appref:appref, 
                force:false, 
                data:{id:videoId}
            });
        }
    },
    
    
    /**
     * Helper for filtering out targets if the user clicked within a Video item.
     * @param {Event} e - The click event
     */
    getSearchTargetItem : function(e) {
        var target = e.target;
        if(target.classList.contains("fa-phone-square")){return target}
        while(!target.classList.contains("Video")){
            target=target.parentNode;
            if(target.classList.contains("results-listing")){
                target=null;
                break
            }
        }
        return target;
    },


    /**
     * Triggered when screen first loads. Only triggered once.
     * @param {Event} e - The activation event
     */
    onActivated : function(e){
        console.info(this.namespace + " view tracked/logged");
    },
    

    /**
     * Triggered whenever the user reopens the application from cache/memory.
     * @param {Event} e - The focus event
     */
    onFocus : function(e) {
        this.parent(e);
        setTimeout(function(){
            if(this.scrollTop){
                this.contentPanel.scrollTop = this.scrollTop;
            }
        }.bind(this),10);
        if(Session.State.resetSearchResults){
            this.onSearch(e);
        }
    },


    /**
     * Triggered when user switches context to another application
     * onBlur() fired just before app goes to 'sleep'
     * @param {Event} e - The blur event
     */
    onBlur : function(e){
        this.parent(e)
        this.filterOptionsModal.close()
    },
    

    /**
     * Triggered when user preforms a search from top search bar in application
     * @param {Event} e - The search event
     */
    onSearch : function(e) {
        if(e && e.data && e.data.keyword){
            this.keyword = e.data.keyword;
        }
        else {
            var currentHash = window.location.hash;
                currentHash = currentHash.replace("#","");
            var appinfo     = rison.decode(decodeURIComponent(currentHash));

            this.keyword = appinfo.keyword;
        }

       this.deleteResultsIterator();
       var action = this.getResultsIterator();
       this.executeSearch(action);
    },


    /**
     * Helper for firing off a paginated search
     * @param {core.http.WebIterator} action - An iterator action used to paginate results
     */
    executeSearch : function(action) {
        var msg = this.querySelector("#paging-message");
        if(action && !action.isLastPage()){
            if(this.data){
                action.setParameter("pageToken",this.data.nextPageToken);
            }
            this.spinner.style.display="block";
            msg.innerHTML = app.labels.PLEASE_WAIT;
            action.invoke({
                onNext  : this.onSearchLoaded.bind(this),
                onFailure  : this.onSearchLoadedFailure.bind(this),
                onRejected : this.onSearchLoadedFailure.bind(this)
            });
        } else if(action && action.isLastPage()){
            msg.innerHTML = app.labels.SHOWING_ALL;
            this.spinner.style.display="none"
        }
    },

    /**
     * Helper for returning an iterator
     * @return {core.http.WebIterator}
     */
    getResultsIterator : function() {
        var uri = ROUTES.DATA.YOUTUBE_SEARCH;
        if(!this.__iterator)
        {
            this.__iterator = new core.http.WebIterator(uri, {
                //keyword : this.getKeyword(),
                part:"snippet",
                count : this.count,
                maxResults : this.count,
                page : this.page,
                q : this.keyword,
                key:app.constants.youtube.KEYS.COMMON.YOUTUBE_API,
                order : this.mFilter.data.order
            });
            window.it=this.__iterator;
            this.__iterator.configureDataMappings({total:"pageInfo.totalResults", count:"pageInfo.resultsPerPage"});
            this.setResultsIterator(this.__iterator);
            this.dispatchEvent("resetsearch", true, true, {});
        } 
        return this.__iterator
    },

    onResetSearchListings : function() {
        this.querySelector(".results-listing").innerHTML = "";
    },



    /**
     * Resets the search Iterator action
     * @param {core.http.WebIterator} action - The iterator instance to store
     */
    setResultsIterator : function(action) {
        this.__iterator = action;
    },
    

    /**
     * nullifies the search Iterator action
     * @param {core.http.WebIterator} action - The iterator instance to store
     */
    deleteResultsIterator : function() {
        this.__iterator = null;
    },

    /**
     * Triggered when the iterator returns data from a URI service
     * @param {XmlHttpResponse} response - The low-level xhr response instance
     * @param {JSON} data - The json result set
     */
    onSearchLoaded : function(response, data) {
        var msg = this.querySelector("#paging-message");
        var action = this.getResultsIterator();
        this.spinner.style.display="none";
        msg.innerHTML = app.labels.SHOWING + " " + (action.currentPage()*this.count) + (" of " + action.totalPages()*this.count)
        try{
            //var data = JSON.parse(responseText);
            if(data && typeof data=="object"){
                this.data=data;
                this.renderSearchResults(data);
            }
        }
        catch(e){
            alert("error getting search results");
            console.error(e.message,responseText);
        }
        application.dispatchEvent("searchcomplete", true, true, {});
    },
    
    /**
     * Triggered when data is received, used for populating the html template with json values
     * @param {JSON} data - The json result set
     */
    renderSearchResults : function(data) {
        this.renderTitle(data);
        //this.renderTemplate(data, "results");
        var res = this.renderNode(data, "results", true);
        this.querySelector(".results-listing").appendChild(res);
        //alert(this.filterButton.prototype.setLabel)
    },


    /**
     * Fired when the search results are modified. Will delete the 
     * current search iterator and create a new instance and invoke
     * the search again.
     * @param {JSON} data - The json result set
     */
    onSearchFiltersChanged : function(e) {
        this.deleteResultsIterator();
        this.onSearch()
    },


    /**
     * Helper for rendering title bar context
     * @param {JSON} data - The json result set
     */
    renderTitle : function(data) {
        this.titleText.innerHTML = data.pageInfo.totalResults + " " + app.labels.RESULTS_TITLE;
    },
    
    
    /**
     * Triggered if there was a net failure
     * @param {XmlHttpRequest} response - The low-level xhr response of the failure
     * @param {string} text - The responseText of the failure
     */
    onSearchLoadedFailure : function(response, text) {
        console.error("failure to retrieve search results",r,text);  
        application.dispatchEvent("searchcomplete", true, true, {});
    },
    

    getStepsForHelpWizard : function(){
       var steps = this.querySelectorAll("*[data-helpindex]");
       return steps;
    },



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
     * The UI representation of this UI Component when initialized without a DOM element-container.
     * @example
     * var app = new apps.SearchResults;
     * console.log(app.element)  //element is a DOM representation of the innerHTML video
     */
    innerHTML:
    '<div></div>'
});



