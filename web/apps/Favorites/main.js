//= require core.ui.Panel
//= require core.ui.WindowPanel


namespace("apps.Favorites",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.FAVORITES,
    '@title'    : "Favorites",
    '@stylesheets' :[
        "./resources/[$theme]/Favorites.css",
        "~/resources/[$theme]/Video.css"
    ],
    '@traits' : [ 
        HandlePanelCloseButton 
    ],
    
    initialize : function(){
        this.parent();

        this.titleText = this.querySelector(".titlebar .title");
        this.contentPanel = this.querySelector(".panel-content");
        this.clearButton  = this.querySelector(".button-bar .clear.button");

        this.templates = {};
        this.templates["favorites-results"] = {
            template:this.querySelector("#favorites-results-template"),
            div:".results-listing.favorites"
        };
        this.templates["recent-videos"] = {
            template:this.querySelector("#recent-videos-template"),
            div:".results-listing.recent-videos"
        };

        this.selectionsModel = new core.data.Accessor({count : 0});
        this.selectionsModel.addEventListener("changed", this.onSelectionCountChanged.bind(this),false);

        this.addEventListener("click", this.onItemClicked.bind(this), false);
        this.clearButton.addEventListener("click", this.onClearSelections.bind(this), false);
    },

    onSelectionCountChanged : function(e){
        var data = this.selectionsModel.data;
        if(data.count > 0){
            this.clearButton.classList.remove("disabled")
        } 
        else{
            this.clearButton.classList.add("disabled")
        }
    },


    onClearSelections : function(e){
        var doit = confirm("Clear selected items ?");
        if(doit){
            var items = this.querySelectorAll(".deletion-checkbox input:checked");
            for(var i=0; i<=items.length-1; i++){
                var item = items[i];
                var id = item.getAttribute("data-video-id");
                var type = item.getAttribute("data-video-type");
                if(id){
                    if(type == "viewed"){
                        StorageManager.remove("videos.recent",true).where("$.id=='" + id + "'");
                    }
                    else if(type=="clipping"){
                        StorageManager.remove("videos.favorites",true).where("$.id=='" + id + "'");
                    }
                }
            }
            this.onSearch(e);
        }
    },

    
    onItemClicked : function(e){
        var target = this.getSearchTargetItem(e);

        //if(target && target.classList.contains("fa-phone-square")){return}
        if(e.target.tagName.toLowerCase() == "input"){
            if(target && e.target.checked){
                target.classList.add("selected");
            }
            else {
                target.classList.remove("selected");
            }
            this.onSelectionsChanged();
        }
        else if(e.target.classList.contains("trash-clipping")){
            var doit = confirm("Remove just this item ?");
            if(doit){
                StorageManager.remove("videos.favorites",true).where("$.id=='" + target.getAttribute("data-video-id") + "'");
                //target.parentNode.removeChild(target)
                this.onSearch(e);
            }
        }
        else if(e.target.classList.contains("trash-recent")){
            StorageManager.remove("videos.recent",true).where("$.id=='" + target.getAttribute("data-video-id") + "'");
            //target.parentNode.removeChild(target)
            this.onSearch(e);
        }
        else if(target){
            this.scrollTop = this.contentPanel.scrollTop;
            var appref = target.getAttribute("data-appref");
            var videoId = target.getAttribute("data-video-id");
            Session.State.selectedVideoId = videoId;
            application.dispatchEvent("openapp",true,true,{appref:appref, force:false, data:{
                id:videoId
            }});
        }
        else{}
    },

    onSelectionsChanged : function(e){
        var checkboxes = this.querySelectorAll(".deletion-checkbox input:checked");
        this.selectionsModel.set("count", checkboxes.length);
    },
    
    
    getSearchTargetItem : function(e){
        var target = e.target;
        while(!target.classList.contains("Video")){
            target=target.parentNode;
            if(target && target.classList.contains("Favorites")){
                target=null;
                break
            }
        }
        return target;
    },


    onActivated : function(e){},

    
    onFocus : function(e){
        this.parent(e);
        this.onSearch(e);
    },

    
    onSearch : function(e){
        this.onSearchLoaded();
    },
    
    onSearchLoaded : function(response, responseText){
        this.renderSearchResults({
            result:{
                items:StorageManager.find("videos.favorites")
            }
        });

        this.renderRecentResults({
            result:{
                items:StorageManager.find("videos.recent")
            }
        });
        this.onSelectionsChanged();
    },
    
    renderSearchResults : function(data){
        this.renderTemplate(data, "favorites-results");
    },

    renderRecentResults : function(data){
        this.renderTemplate(data, "recent-videos");
    },
    
    onSearchLoadedFailure : function(r, text){
        console.error("failure to retrieve search results",r,text);  
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



