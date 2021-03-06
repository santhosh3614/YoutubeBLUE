/**
 * The HandlePanelCloseButton constructor runs during parent app initialize().
 * Hanles the closing of panels globally.
 * @example
 * var app = new apps.SearchResults;  // <-- all traits are initialized here as well
 * @return {core.ui.WebApplication}
 */
HandlePanelCloseButton = {
    initialize : function(){
        this.parent()
        this.addEventListener("close", this.onClosePanel.bind(this), false);
    },

    /**
     * Triggered when user clicks the 'X' of the current app/window
     * @param {Event} e - The click event
     */
    onClosePanel : function(){
        history.back(-1)    
    }
};

/**
 * The AutomaticallyOpenHelpWizardOnce constructor runs during parent app initialize()
 * This trait will check if the auto help wizard have already been seen by
 * the user and will set a flag to not show it again.
 * @example
 * var app = new apps.SearchResults;  // <-- all traits are initialized here as well
 * @return {core.ui.WebApplication}
 */
AutomaticallyOpenHelpWizardOnce = {
    initialize : function(){
        this.parent()
        if(!this.isAutoHelpWizardDisabled()){
            this.setAutoHelpWizardEnabled(false);
            this.showHelpWizard();
        }
    },

    /**
     * Helper used to determine if the 'disableHelpWizard' was set already
     * @param {Event} e - The click event
     */
    isAutoHelpWizardDisabled : function(){
        var res = StorageManager.find(this.namespace + ".disableHelpWizard");
        if(res.length<=0){ return false }
        else {
            return res[0] == true
        }
    },

    /**
     * Helper used for setting the 'disableHelpWizard' flag
     */
    setAutoHelpWizardEnabled : function(){
        StorageManager.store(this.namespace + ".disableHelpWizard",true);
        StorageManager.persist();
    }
};


namespace("core.ui.StartMenu", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets' :["src/core/ui/components/StartMenu/index.css"],
    "@cascade"      : true,
    "@href"         : "src/core/ui/components/StartMenu/index.html",

   
    initialize : function(){
        this.parent();
        this._template = this.querySelector("#start-menu-template");
        this.draggable = new Draggable(this);

        this.templates = {};
        this.templates["start-menu"] = {
            template:this._template,
            div:"#start-menu-container"
        };
        
        this.start_menu_panel = this.querySelector("#start-menu-panel");
        this.logo = this.querySelector("#start-menu-logo");
        this.ul = this.querySelector("ul");
        this.logo.addEventListener("click", this.onHideStartMenuPanel.bind(this), false);

        this.ul.addEventListener("click", this.onOpenApplication.bind(this), false);
        application.addEventListener("openapp", this.onApplicationOpened.bind(this), false);

        this.downloadStartMenu();
        this.setMenuPosition();
        this.fixMenuLogo();
        application.addEventListener("screensized", this.onScreenSizeChanged.bind(this), false);
    },

    fixMenuLogo : function(){
        var img = this.logo.querySelector("img");
            img.src = img.getAttribute("data-src");
    },

    toggle : function(){
        var cl = this.element.classList;
        if(cl.contains("active")){
            this.hide()
        } else{
            this.show()
        }
    },

    show : function(){
        this.element.classList.add("active");
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")});
    },


    hide : function(){
        this.element.classList.remove("active");
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")})
    },

    onScreenSizeChanged : function(e){
        this.setMenuPosition();
    },

    setMenuPosition : function(){
        var transform = "transform".toVendorPrefix();
        var wInnerWidth = window.innerWidth;
        this.element.style[transform] = "translate3d(-" + wInnerWidth + "px, 0px, 0px)";
    },

    /*renderDOMTree : function(){
        var el = this.element;
        var self=this;
        
        var firstChild = this.firstChild(null,true);
        var path = this.constructor.prototype["@href"];

        if(!firstChild){
            if(path) {
                var oXMLHttpRequest;
                try{
                    oXMLHttpRequest = new core.http.XMLHttpRequest;
                } catch(e){
                    oXMLHttpRequest = new XMLHttpRequest;
                };
                    path = (typeof path=="string")?this.relativeToAbsoluteFilePath(path):path;
                    oXMLHttpRequest.open("GET", path, true);
                    oXMLHttpRequest.setRequestHeader("Content-type", "text/plain");
                    oXMLHttpRequest.onreadystatechange  = function() {
                        if (this.readyState == XMLHttpRequest.DONE) {
                            var htmltext = this.responseText;
                            self.constructor.prototype.innerHTML = htmltext;
                            self.constructor.prototype["@href"]=null;
                            var view = self.parseElement();
                            self.element.appendChild(view);
                            self.innerHTML=self.element.outerHTML;
                            self.onDomReady(el);          
                        }
                    }
                    oXMLHttpRequest.send(null);
            } else {
               var view = this.parseElement();
               self.element.appendChild(view);
               self.onDomReady(el);
            }
        }
        else {
            self.onDomReady(el);
        }
        
        var canvas = this.firstChild(null,true)
        this.addClass("canvas", canvas);
        this.canvas = canvas;
        return el;
    },*/

    onPress: function(){
        this.startCoords = this.dnd.getBoundingClientRect(this.element);
        console.log(this.startCoords)
    },

    onMove : function(e){
        var target = e.data.target;
        var x = e.data.offsetX;
        var y = e.data.offsetY;
    },

    onMovePosition : function(e){},

    onDragEnd       : function(e) {
        this.element.classList.remove("dragging");
       // this.element.classList.add("destination");
        this.coords = this.dnd.getBoundingClientRect(this.element);
        var canvasHeight = this.dnd.getBoundingClientRect(document.body).height;
        var boxPos = (this.coords.top);
        
        if(e.data.swipedir == "up" ){
            
        } else if(e.data.swipedir == "down" ){
            
        }
        else if(e.data.swipedir == "right" ){
            this.dispatchEvent("showmenu",true,true,{});
        } 
        else if(e.data.swipedir == "left" ){
            this.dispatchEvent("hidemenu",true,true,{});
        } else {
            if(boxPos > canvasHeight/2){
                
            } else if (boxPos < canvasHeight/2){
                
            }
            else {
                
            }
        }
    },
    
    onDragStart : function(e){
        this.element.classList.add("dragging");
    },
    
    onRevertPosition : function(){},


    
    downloadStartMenu : function(){
        var self=this;
        var uri = this.element.getAttribute("data-uri");
        var a = new core.http.WebAction(uri,{});
        a.invoke({
            onSuccess  : this.onStartMenuDownloaded.bind(this),
            onFailure  : this.onStartMenuDownloadFailure.bind(this),
            onRejected : this.onStartMenuDownloadFailure.bind(this)
        })
    },
    
    onStartMenuDownloaded : function(r, responseText){
        
        try{
            var data = JSON.parse(responseText);
            if(data.result){
                //self.renderList(data)
                this.data=data;
                this.renderMenu(data)
            }
        }
        catch(e){
            alert("error downloading start menu");
            console.error(e.message,responseText)
        }
    },
    
    renderMenu : function(data){
        this.renderTemplate(data, "start-menu");
    },
    
    onStartMenuDownloadFailure : function(r, responseText){
        alert("error downloading start menu");
        console.error("onStartMenuDownloadFailure(): ", responseText)
    },
    
    onApplicationOpened : function(){
        this.onHideStartMenuPanel();
    },
    
    onShowStartMenuPanel : function(e){
        var startMenuPanel = this.querySelector("#start-menu-panel");
        var start_button_icon = this.startbutton.querySelector("img");
        
        if(!this.startMenuOpen){
            this.element.classList.add("active");
            this.startMenuOpen=true;
        } else {
            this.element.classList.remove("active");
            this.startMenuOpen=false;
        }
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")})
    },
    
    onHideStartMenuPanel : function(){
        this.hide();
    },
    
    onOpenApplication : function(e){
        var appRef = e.target.getAttribute("data-app-ref");
        var href = e.target.getAttribute("href");
        
        if(appRef && appRef.length>0){
            this.dispatchEvent("openapp", true, true, {appref:appRef});
            this.onHideStartMenuPanel();
        } else if(href && href.length>0){
            if(href.indexOf("$.DATA.")>=0){
                var url = core.http.UrlRouter.resolve(href);
                if(url){
                    setTimeout(function(){
                        window.open(url,"_system", 'location=yes');
                    },200);
                } else {
                    console.error("No Route defined for href: " + href);
                }
            } else{
                window.open(href,"_system", 'location=yes');
            }
        }
    }
}); 

/**
 * core.ui.SearchBox is the search component that appears at the top of the screen
 * @example
 * var app = new core.ui.SearchBox;
 * @class
 */
namespace("core.ui.SearchBox", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    
    /**
     * The constructor which runs when a new instance of core.ui.SearchBox is created
     * @example
     * var app = new core.ui.SearchBox;
     * @return {core.ui.SearchBox}
     */
    initialize : function(){
        this.parent();
        this.searchBoxInput     = this.querySelector("input");
        this.searchButton       = this.querySelector("#app-search-button");
        this.searchBoxInput.addEventListener("keyup", this.onEnterKeySearch.bind(this), false);
        this.searchButton.addEventListener("click", this.onStartSearch.bind(this), true);
        application.addEventListener("search", this.onSearchEventDetected.bind(this), false);
        application.addEventListener("searchcomplete", this.onSearchCompleteEventDetected.bind(this), false);

        this.restoreSearchKeywordDisplay();
    },


    restoreSearchKeywordDisplay : function(){ 
      try{
        var hash = location.hash.replace("#","");
        var appinfo = rison.decode(decodeURIComponent(hash));
        if(appinfo){
          this.searchBoxInput.value = appinfo.keyword||"";
        }
      }
      catch(e){}
    },

    onSearchEventDetected : function(e){
        this.onStartSearch(e)
    },

    onSearchCompleteEventDetected : function(){
        this.searchButton.prototype.reset();
    },

    onEnterKeySearch : function(e){
        if(e.keyCode == 13) {
            this.onStartSearch(e)
        } 
    },

    spinIcon : function(){
      this.searchButton.prototype.spin("fa-search");
    },
    
    onStartSearch : function(e){
       var self=this;
       this.spinIcon();

       self.searchBoxInput.blur();
         Session.State.resetSearchResults = true;
         application.dispatchEvent("openapp", true, true, {
            appref : "apps/SearchResults", 
            keyword : self.searchBoxInput.value
         });
    }
});

namespace("core.ui.SearchFilterDialog", 
{
    '@inherits'     : core.ui.WindowPanel,
    '@stylesheets'  : [],
    "@cascade"      : true,


    initialize : function() {
    	this.countSelect 	= this.querySelector("select#count-filter");
    	this.sortSelect 	= this.querySelector("select#sort-filter");
    	this.okButton		= this.querySelector(".ok.button");
    	this.cancelButton	= this.querySelector(".cancel.button");
        this.helpButton     = this.querySelector(".panel-options .help.button");

        this.helpButton.addEventListener("click", this.onShowHelpWizard.bind(this), false);
    	this.okButton.addEventListener("click", this.onSetFilterSelections.bind(this), false);
    	this.cancelButton.addEventListener("click", this.onUpdateViewFilters.bind(this), false);
    },

    onSetFilterSelections : function(e){
    	this.accessor.set("order", 	this.sortSelect.value, this);
        this.accessor.set("count",  this.countSelect.value, this);
    },

    onUpdateViewFilters : function(e){
    	if(e && e.owner == this){return}

    	this.sortSelect.value 	= this.accessor.data.order;
        this.countSelect.value   = this.accessor.data.count;
    },

    bind : function(accessor) {
    	this.accessor = accessor;
    	this.onUpdateViewFilters(null);
    	this.accessor.addEventListener("changed", this.onUpdateViewFilters.bind(this),false);
    },

    getStepsForHelpWizard : function(){
       var steps = this.querySelectorAll("*[data-filter-helpindex]");
       return steps;
    },

    /**
     * Triggered when this.helpButton (see cctor) is clicked on.
     * Calls showHelpWizard(<delay>) with a delay
     * @param {Event} e - The click event
     */
    onShowHelpWizard : function(e){
        this.showHelpWizard(200);
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
    }
});
    
    

namespace("core.ui.SelectBox", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function(){
        this.ul     = this.querySelector("ul");
        this.label  = this.querySelector(".label");
        this.count  = this.querySelector(".count");
        this.readonly = this.element.getAttribute("readonly");
        this.refreshable = this.element.getAttribute("data-refresh");
        this.refresh_interval = this.element.getAttribute("data-refresh-interval");
        
        application.addEventListener("connection", this.onNetworkConnectionChanged.bind(this), false);
        this.addEventListener("click", this.onItemSelected.bind(this), false);
        this.renderOptions();
        this.setRefreshTimer();
    },
    
    onNetworkConnectionChanged : function(e){
        if(e.data.status == "offline"){
            if(this.count) { this.count.innerHTML = "Offline"}
        } else{
            this.renderOptions();
        }
    },
    
    setRefreshTimer : function(){
        var self=this;
        if(this.refreshable == "true"){
            var interval = parseInt(this.refresh_interval,10);
            setInterval(function(){
                self.renderOptions();
            }, interval)
        }
    },
    
    onItemSelected : function(e){
        this.selectChild(e.target)
    },
    
    selectChild : function(li){
        if(this.readonly != "true"){
            if(this.lastSelected) {
                this.lastSelected.classList.remove("selected");
            }
            //this.lastSelected.classList.remove("selected");
            if(li.classList.contains("item")){
            li.classList.add("selected");
            this.lastSelected = li;
            this.label.innerHTML = li.innerHTML.toUpperCase(); 
            }
        }
    },
    
    renderOptions:function(){
        if(!application.onLine){
            return;
        }

        var enabled = this.element.getAttribute("enabled");
        if(enabled){
            if(enabled.toLowerCase() == "false"||enabled.toLowerCase() == "0"){
                return;
            }
        }
        var self=this;
        var uri = this.element.getAttribute("data-uri");
        
        var a = new core.http.WebAction(uri,{});
        a.invoke({
            onSuccess  : function(r, responseText){
                try{
                    var data = JSON.parse(responseText);
                    if(data.result){
                        self.renderList(data)
                    }
                }
                catch(e){
                    alert("error");
                    console.error(e.message,responseText)
                }
            },
            onFailure  : function(r, text){
                alert("failed: " + text)
            },
            onRejected : function(){}
        })
    },
    
    renderList : function(items){
        this.ul.innerHTML ="";
        if(items){
            for(var i=0; i<=items.length-1; i++){
                var item = items[i];
                var li = document.createElement("li");
                var label = document.createElement("div");//document.createTextNode(item.name);
                    label.classList.add("select-label");
                    label.innerHTML = item.name;
                var info = document.createElement("div");
                    info.classList.add("menu-item-info");
                    info.innerHTML = item.time;
                li.appendChild(label);
                li.appendChild(info);
                if(item["default"]){
                    li.classList.add("selected");
                    this.selectChild(li)
                }
                this.ul.appendChild(li)
            }
        }
        if(this.count){
            this.count.innerHTML = items.length;
        }
    }
});

namespace("core.ui.RecentAppsSelectBox", 
{
    '@inherits'     : core.ui.SelectBox,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function(){
        this.parent();
        this.recent_apps_template = this.querySelector("#recent-apps-template");
         
        this.templates = {};
        this.templates["recent-apps"] = {
            template:this.recent_apps_template,
            div:"#recent-apps-container"
        };
    },

    renderOptions:function(){
        var enabled = this.element.getAttribute("enabled");
        if(enabled){
            if(enabled.toLowerCase() == "false"||enabled.toLowerCase() == "0"){
                return;
            }
        }
        
        var self=this;
        var uri = this.element.getAttribute("data-uri");
        
        var a = new core.http.WebAction(uri,{});
        a.invoke({
            onSuccess  : function(r, responseText){
                try{
                    var data = JSON.parse(responseText);
                    if(data.result){
                        //self.renderList(data)
                        self.data=data;
                        self.renderList(self.data)
                    }
                }
                catch(e){
                    alert("error");
                    console.error(e.message,responseText)
                }
            },
            onFailure  : function(r, text){
                alert("failed: " + text)
            },
            onRejected : function(){}
        })
    },

    selectChild : function(li){
        
    },
    
    add : function(appInstance){
        var uri = this.element.getAttribute("data-uri");
        var newEntry = {
            name:appInstance["@title"]||appInstance.classname,
            appref:appInstance.namespace.replace(".","/"),
            time:new Date().toLocaleString()
        };
        
        var action = new core.http.WebAction(uri, {action:"insert", item:newEntry});
            action.invoke({
                onSuccess  : this.onRecentAppLogged.bind(this, newEntry),
                onFailure  : this.onRecentAppLogFailure.bind(this),
                onRejected : this.onRecentAppLogFailure.bind(this)
            });
    },
    
    onRecentAppLogged : function(newEntry, r, responseText){
        try{
            var data = JSON.parse(responseText);
            if(data && typeof data =="object"){
                this.data.result.currently_running.push(newEntry);
                this.renderList(this.data);
            }
        }
        catch(e){
            alert("error loading report");
            console.error(e.message,responseText);
        }
    },
    
    onRecentAppLogFailure : function(){
        
    },
    
    remove : function(appref){
        for(var i=0; i<=this.data.result.currently_running.length-1; i++){
            var item = this.data.result.currently_running[i];
            if (item && item.appref == appref){
                this.data.result.currently_running.splice(i,1);
                break;
            } 
        }
        this.renderList(this.data);
    },
    
    onItemSelected : function(e){
        var target = e.target;
        if(target.classList.contains("close-app-button")){
            var _ns = target.parentNode.getAttribute("data-app-ref");
                //_ns = _ns.replace("/",".");
            this.dispatchEvent("releaseapp", true,true, {ns:_ns.replace("/",".")});
            //target.parentNode.parentNode.removeChild(target.parentNode);
            this.remove(_ns);
        }
        else {
            while(!target.classList.contains("item")){
                target = target.parentNode;
                if(target.tagName.toLowerCase() == "ul"){
                    target=null;
                    break;
                }
            }
            if(target){
                var appRef = target.getAttribute("data-app-ref");
                if(appRef && appRef.length >0){
                    this.dispatchEvent("openapp", true, true, {appref:appRef});
                }
            }
        }
    },

    renderList : function(data){
        this.renderTemplate(data, "recent-apps");
        if(this.count){
            this.count.innerHTML = data.result.currently_running.length;
        }
    },
    
    renderTemplate : function(data, templateName, cssSelector){
        var templateDefinition = this.templates[templateName];
        if(!templateDefinition){
            alert("error, no '" +templateName+ "' template found to render data");
            return;
        } 
        var text = Kruntch.Apply(templateDefinition.template.innerHTML, data);
        var d = document.createElement("div");
        d.innerHTML = text;
        var container = this.querySelector(templateDefinition.div);
            container.innerHTML="";
            container.appendChild(d);
    }
});

namespace("core.ui.Navigator", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,

    initialize : function(){
        this.desktopButton = this.querySelector(".buttons .dashboard");
        this.fullscreenButton = this.querySelector(".buttons .fullscreen");
        this.desktopButton.addEventListener('click', this.onReturnToDashboard.bind(this), false);
        this.fullscreenButton.addEventListener('click', this.onToggleFullscreen.bind(this), false);
    },
    
    onReturnToDashboard : function(){
        this.dispatchEvent("showdashboard",true,true,{component:this});
    },
    
    onToggleFullscreen : function(){
        this.dispatchEvent("fullscreenmode",true,true,{component:this, button:this.fullscreenButton});
    }
});

namespace("core.ui.SlidingMenu", 
{
    '@inherits'     : core.ui.Navigator,
    '@stylesheets'  : [],
    "@cascade"      : true,

    initialize : function(){
        this.optionsButton = this.querySelector(".buttons .options");
        this.desktopButton = this.querySelector(".buttons .dashboard");
        this.fullscreenButton = this.querySelector(".buttons .fullscreen");
        this.supportButton = this.querySelector("#support");
        this.optionsButton.addEventListener('click', this.onOptionsClicked.bind(this), false);

        if(this.fullscreenButton){
            this.fullscreenButton.addEventListener('click', this.onToggleFullscreen.bind(this), false);
        }
        this.supportButton.addEventListener('click', this.onOpenSupportScreen.bind(this), false);

        this.state="open";
        setTimeout(this.togglePosition.bind(this), 1300);
    },

    onOpenSupportScreen : function(e){
        window.location.href="tel://" + app.constants.company.CUSTOMER_SUPPORT_PHONE;
        this.togglePosition()
    },

    setPosition : function(posX){
        //console.warn("bounding rec", this.getBoundingClientRect())
        var width = this.getBoundingClientRect().width;
        posX = (typeof posX == "number")?posX:width-70;
        //this.element.style.right = -posX + "px"
        //this.state="closed";
        //this.element.style.transform = "translateX(" posX + 'px' ")"
        this.element.style["transform".toVendorPrefix()]="translate3d("+posX +"px,0px,0)";
    },

    togglePosition : function(){
        if(this.state == "closed"){
            this.setPosition(0);
            this.state="open"
        } else{
            this.setPosition();
            this.state="closed"
        }
        this.dispatchEvent("menuchanged",true,true,{state:this.state})
    },

    
    onOptionsClicked : function(){
        this.togglePosition()
        //alert("clicked")
        //this.dispatchEvent("showdashboard",true,true,{component:this});
    },
    
    onToggleFullscreen : function(){
        this.dispatchEvent("fullscreenmode",true,true,{component:this, button:this.fullscreenButton, force:false});
        this.togglePosition()
    }
});





namespace("YoutubeBlue",
{
    '@inherits' : framework.Application,
    '@cascade'  : false,
    '@stylesheets' : [],
    '@traits':[
        UrlHashState, 
        core.traits.OAuthProfile,
        core.traits.OAuth
    ],

    
    initialize : function () {
        if(UserAgent.isMobile()){
            this.parent(arguments);
        }
        else{
            this.element.innerHTML="";
            alert("Mobile devices only. Open on your Phone. Go to:\njs.netai.net/YoutubeBlue");
        }
        this.oauth.addEventListener("endsignin", this.onEndSignin.bind(this), false);
    },

    onStartSignin : function(){
        this.oauth.startSignin();
    },

    onEndSignin : function(){
        alert("Sign In Done")
        console.info("End Signin", arguments);
    },

    innerHTML:
	'<div>test</div>'
});