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
        this.templates["recent-coupons"] = {
            template:this.querySelector("#recent-coupons-template"),
            div:".results-listing.recent-coupons"
        };

        this.selectionsModel = new core.data.Accessor({count : 0});
        this.selectionsModel.addEventListener("changed", this.onSelectionCountChanged.bind(this),false);

        //this.peopleLists = this.querySelector(".results-listing.people");
        this.addEventListener("click", this.onCouponItemClicked.bind(this), false);
        this.clearButton.addEventListener("click", this.onClearSelectedCoupons.bind(this), false);
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

    /*onClearCoupons : function(e){
        var doit = confirm("Clear all recent and favorites?");
        if(doit){
            StorageManager.reset("coupon.clippings");
            StorageManager.reset("coupon.recent");
            StorageManager.persist();
            this.onSearch(e);
        }
    },*/

    onClearSelectedCoupons : function(e){
        var doit = confirm("Clear selected items ?");
        if(doit){
            var items = this.querySelectorAll(".deletion-checkbox input:checked");
            for(var i=0; i<=items.length-1; i++){
                var item = items[i];
                var id = item.getAttribute("data-video-id");
                var type = item.getAttribute("data-coupon-type");
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

    
    onCouponItemClicked : function(e){
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
        //alert("searching")
        /*var keywordStr = e.data.keyword;
        var action = new core.http.WebAction(ROUTES.DATA.HOTEL_SEARCH, {keyword:keywordStr});

            action.invoke({
                onSuccess  : this.onSearchLoaded.bind(this),
                onFailure  : this.onSearchLoadedFailure.bind(this),
                onRejected : this.onSearchLoadedFailure.bind(this)
            });*/
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
        /*try{
            var data = JSON.parse(responseText);
            if(data && typeof data=="object"){
                this.renderSearchResults(data);
            }
        }
        catch(e){
            alert("error getting search results");
            console.error(e.message,responseText);
        }*/
    },
    
    renderSearchResults : function(data){
        this.renderTitle(data);
        this.renderTemplate(data, "favorites-results");

        //this.selectionsModel.set("clippings", data.result.items.length);
    },

    renderRecentResults : function(data){
        //this.renderTitle(data);
        this.renderTemplate(data, "recent-coupons");

        //this.selectionsModel.set("viewed", data.result.items.length);
    },

    renderTitle : function(data){
        //this.titleText.innerHTML = "MY COUPONS"
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



