var InstallationWizardStages = {

  /* The keys in 'stages' need to be kept in-sync with the <li> elements in 
   * the markup.
   */

  stages : {
    'createClusterStageId' : {
      divSelector : '#createClusterCoreDivId'
    },
    'addNodesStageId' : {
      divSelector : '#addNodesCoreDivId'
    },
    'selectServicesStageId' : {
      divSelector : '#selectServicesCoreDivId'
    },
    'assignHostsStageId' : {
      divSelector : '#assignHostsCoreDivId'
    },
    'configureClusterStageId' : {
      divSelector : '#configureClusterCoreDivId'
    },
    'configureClusterAdvancedStageId' : {
      divSelector : '#configureClusterAdvancedCoreDivId'
    },
    'deployClusterStageId' : {
      divSelector : '#deployCoreDivId'
    }
  },

  transitionToCachedStage : 
    function (currentStageId, cachedStageId) {

      clearFormStatus();

      globalYui.log("In transitionToCachedStage: " + currentStageId + "->" + cachedStageId);
      swapStageVisibilities( this.stages[currentStageId].divSelector, 
      this.stages[cachedStageId].divSelector );
    }
};

/* Setup the behavior for #installationWizardProgressBarListId */
globalYui.one('#installationWizardProgressBarListId').delegate('click', function (e) {

  /* Important: When we specify CSS filters to delegate, we need to access 
   * the filtered CSS element (which is what we really care to get at) via
   * 'this', not e.target. 
   *
   * Only do anything with clicks on stages that have previously been visited.
   */
  if( this.hasClass('installationWizardVisitedStage') ) {

    var newCurrentStage = this;
    var nextStage = null;

    /* Mark the clicked-on stage as 'current'. */
    newCurrentStage.replaceClass( 'installationWizardVisitedStage', 'installationWizardCurrentStage' );
    globalYui.log("Marked " + newCurrentStage.get('id') + "from visited to current");

    var currentStage = newCurrentStage;

    while( nextStage = currentStage.next('.installationWizardVisitedStage') ) {

      /* Mark all the following 'visited' stages as 'unvisited'. */
      nextStage.replaceClass( 'installationWizardVisitedStage', 'installationWizardUnvisitedStage' );
    globalYui.log("Marked " + nextStage.get('id') + "from visited to unvisited");

      currentStage = nextStage;
    }

    var previouslyCurrentStage = currentStage.next();

    /* And finally, also mark the up-until-now 'current' stage as unvisited. 
     * We know at this point that currentStage points to the last 
     * previously-visited stage, and the last previously-visited stage is always
     * followed immediately by the up-until-now 'current' stage, so no fancier
     * checks are required - just depend on the invariants.
     */
    previouslyCurrentStage.replaceClass( 'installationWizardCurrentStage', 'installationWizardUnvisitedStage' );
    globalYui.log("Marked " + previouslyCurrentStage.get('id') + "from current to unvisited");

    /* Finally, flip to this newly 'current' stage, from the previously current one. */
    InstallationWizardStages.transitionToCachedStage( previouslyCurrentStage.get('id'), newCurrentStage.get('id') );
  }
}, 'li' ); 

globalYui.one('#installationMainFormsDivId').delegate('key', function (e) {
    /* Prevent the refresh of the page. */
    e.preventDefault();

    /* We don't have identically structured markup around all our 
     * 'a.btn' elements, so we need this bubble-up search logic. 
     */
    var currentButtonSibling = e.target.ancestor();

    while( !currentButtonSibling.next('a.btn') ) {
      currentButtonSibling = currentButtonSibling.ancestor();
    }

    /* Generate the click. */
    currentButtonSibling.next('a.btn').simulate('click');

}, 'enter' );
