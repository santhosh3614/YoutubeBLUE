//= require core.ui.Panel
//= require core.ui.WindowPanel



namespace("apps.Privacy",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.PRIVACY,
    '@stylesheets' :["apps/Privacy/resources/[$theme]/Privacy.css"],
    '@title'	: "Privacy",

    '@traits' : [ 
        HandlePanelCloseButton
    ],

    initialize : function(){
        this.parent();
    },
    
    innerHTML:
    '<div></div>'
});



