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
    
    
