//=require src/core/traits/HandlePanelCloseButton.js
//=require src/core/traits/AutomaticallyOpenHelpWizardOnce.js

//=require src/core/ui/components/StartMenu/index.js
//=require src/core/ui/SearchBox.js
//=require src/core/ui/SearchFilterDialog.js
//=require src/core/ui/SelectBox.js
//=require src/core/ui/RecentAppsSelectBox.js
//=require src/core/ui/Navigator.js
//=require src/core/ui/SlidingMenu.js




namespace("YoutubeBlue",
{
    '@inherits' : framework.Application,
    '@cascade'  : false,
    '@stylesheets' : [],
    '@traits':[UrlHashState],

    
    initialize : function () {
        if(UserAgent.isMobile()){
            this.parent(arguments);
        }
        else{
            this.element.innerHTML="";
            alert("Mobile devices only. Open on your Phone. Go to:\njs.netai.net/YoutubeBlue");
        }
    },

    innerHTML:
	'<div>test</div>'
});
