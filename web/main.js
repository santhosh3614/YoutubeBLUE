//=require src/core/ui/SystemShell.js


namespace("YoutubeBlue",
{
    '@inherits' : core.ui.SystemShell,
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
