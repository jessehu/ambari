
var multipleClustersSupported = false;

/* Super-handy augmentation to Function that allows 'this' to be bound 
 * statically.
 *
 * Primarily used when creating objects whose methods will be used as
 * callbacks in unknown contexts.
 *
 * Look at txnUtils.js for sample usage. 
 */
Function.prototype.bind = function(scope) {
  var _function = this;

  return function() {
    return _function.apply(scope, arguments);
  }
}

/* Belongs with createInformationalPanel() */
var customizedYuiPanelCss = false;

/* XXX Ugly, ugly hack to emulate a singleton - users are NEVER supposed 
 * to use this, and should only access the createInformationalPanel() and 
 * destroyInformationalPanel() methods below.
 */
var globalSingletonInformationalPanel;

function createInformationalPanel( containerNodeId, headerContentString ) {

  /* XXX This should check that globalSingletonInformationalPanel is within 
   * containerNodeId, and only then perform this cleanup, but this whole
   * panel-related section needs to be rewritten anyway - for now, we only
   * support the one globalSingletonInformationalPanel, and passing in
   * anything other than #informationalPanelContainerDivId as containerNodeId 
   * is not guaranteed to work.
   */
  if( globalSingletonInformationalPanel ) {
    destroyInformationalPanel( globalSingletonInformationalPanel );
  }

  globalYui.one( containerNodeId ).append('<div id="informationalPanelInnerContainerDivId"></div>');

  globalYui.one( '#informationalPanelInnerContainerDivId' ).append( '<div class="yui3-widget-hd"></div>' );
  globalYui.one( '#informationalPanelInnerContainerDivId' ).append( '<div class="yui3-widget-bd"></div>' );
  globalYui.one( '#informationalPanelInnerContainerDivId' ).append( '<div class="yui3-widget-ft"></div>' );
              
  var newPanel = new globalYui.Panel({
    srcNode: '#informationalPanelInnerContainerDivId', 
    headerContent: headerContentString,
    width: 800,
    height: 400,
    centered: true,
    render: true,
    modal: true,
    zIndex: 100,
    visible: false
  });

  if( !customizedYuiPanelCss ) {
    /* Needs to be called one time only. 
     *
     * We do this here instead of creating a static entry in a CSS file  
     * because the first invocation of globalYui.Panel (above) pulls in all 
     * the necessary additional styling information that is applied to the 
     * panel - since this new styling information comes in at runtime, it
     * overrides any static CSS we might have had, so adding our overrides
     * at runtime (*after* globalYui.Panel) is the only way out.
     */
    globalYui.StyleSheet('KewlApp').set( '.yui3-skin-sam .yui3-panel-content .yui3-widget-hd', {
      background: 'rgb(50,185,50)',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '150%'
    });

    globalYui.StyleSheet('KewlApp').set( '.yui3-skin-sam .yui3-panel-content .yui3-button-icon', {
      backgroundColor: 'white',
      border: 'medium solid gray'
    });

    globalYui.StyleSheet('KewlApp').set( '.yui3-skin-sam .yui3-panel-content .yui3-widget-ft', {
      background: 'rgb(50,185,50)',
    });

    globalYui.StyleSheet('KewlApp').set( '.yui3-skin-sam .yui3-panel-content .yui3-widget-ft .yui3-button', {
      fontWeight: 'bold',
      fontSize: '135%',
      color: 'white',
      margin: '0pt 6px',
      padding: '4px 8px',
      textDecoration: 'underline',
      background: 'none',
      border: '0px'
    });

    customizedYuiPanelCss = true;
  }

  globalSingletonInformationalPanel = newPanel;

  return newPanel;
}

function destroyInformationalPanel( theInformationalPanelInstance ) {

  if( theInformationalPanelInstance ) {

    theInformationalPanelInstance.hide();
    theInformationalPanelInstance.destroy();

    if( theInformationalPanelInstance === globalSingletonInformationalPanel ) {
      globalSingletonInformationalPanel = null;
    }
  }
}

function showLoadingImg() {

  globalYui.one("#loadingDivId").setStyle('display','block');
  //globalYui.one("#blackScreenDivId").setStyle('display','block');
  //globalYui.one("#loadingImgId").setStyle('display','block');
}

function hideLoadingImg() {
  globalYui.one("#loadingDivId").setStyle('display','none');
  //globalYui.one("#loadingImgId").setStyle('display','none');
  //globalYui.one("#blackScreenDivId").setStyle('display','none');
}

function swapStageVisibilities( currentStageDivSelector, newStageDivSelector ) {

  globalYui.log("In swapStageVisibilities: " + currentStageDivSelector + "->" + newStageDivSelector);
  /* Hide the current stage. */
  globalYui.one(currentStageDivSelector).setStyle('display','none');

  /* Show the new stage. */
  globalYui.one(newStageDivSelector).setStyle('display','block');
}

/* TODO XXX Consider bundling the last 3 parameters into their own NewStage object.
 * TODO XXX Do the same for the first 2 parameters and a CurrentStage object.  
 */
function transitionToNextStage( currentStageDivSelector, currentStageData, newStageDivSelector, newStageData, newStageRenderFunction ) {

  clearFormStatus();

  /* Render the next stage. */
  newStageRenderFunction(newStageData);

  globalYui.log("In transitionToNextStage: " + currentStageDivSelector + "->" + newStageDivSelector);

  //// tshooter: No longer doing this given dynamic rendering on stages. Only hide current stage.  
  /* And make it visibly replace the currently showing one. */
  ///// tshooter: commented: swapStageVisibilities(currentStageDivSelector, newStageDivSelector);
  globalYui.one(currentStageDivSelector).setStyle('display','none');

  /* And now, handle the updates to addNodesWizardStages... */

  /* There can be only one 'current' stage at a time. */
  var currentStage = globalYui.one('.installationWizardCurrentStage');

  var nextStage = null;

  /* Check to make sure we haven't reached the last stage. */
  if( nextStage = currentStage.next('.installationWizardUnvisitedStage') ) {

    /* Mark this up-until-now 'current' stage as 'visited'. */
    currentStage.replaceClass( 'installationWizardCurrentStage', 'installationWizardVisitedStage' );

    /* Mark the stage after that as the new 'current' stage. */
    nextStage.replaceClass( 'installationWizardUnvisitedStage', 'installationWizardCurrentStage' );
  }
}

function clearFormStatus() {
  var formStatusDiv = globalYui.one("#formStatusDivId");
  // formStatusDiv.setContent("");
  formStatusDiv.setStyle("visibility", "hidden");
  formStatusDiv.set('className','');
  formStatusDiv.addClass("formStatusBar");
}

function setFormStatus(statusString, isError, noFade) {
  var formStatusDivCssClass;
  if (isError) {
    formStatusDivCssClass = 'statusError';
  } else {
    formStatusDivCssClass = 'statusOk';
  }
  var formStatusDiv = globalYui.one("#formStatusDivId");
  formStatusDiv.setStyle("visibility", "visible");
  formStatusDiv.set('className','');
  formStatusDiv.addClass("formStatusBar");
  formStatusDiv.addClass(formStatusDivCssClass);
  formStatusDiv.setContent(statusString);
  if (!isError && !noFade) {
    setTimeout(fadeFormStatus, 1000);
  }
}

function fadeFormStatus() {
  var formStatusDiv = globalYui.one("#formStatusDivId");
  formStatusDiv.addClass("formStatusBarZeroOpacity");
}

function convertDisplayType (displayType) {
  switch (displayType) {
    case "NODISPLAY":
      return "NODISPLAY";

    case "TEXT":
      return "text";

    case "SECRET":
      return "password";
    
    default:
      return "text";
  }
}

function executeStage(inputUrl, renderStageFunction) {
  globalYui.io(inputUrl, {
      method: 'GET',
      timeout : 10000,
      on: {
        success: function (x,o) {
          globalYui.log("RAW JSON DATA: " + o.responseText);
          // Process the JSON data returned from the server
          try {
            responseJson = globalYui.JSON.parse(o.responseText);
          }
          catch (e) {
            hideLoadingImg();
            alert("JSON Parse failed!");
            return;
          }

          globalYui.log("PARSED DATA: " + globalYui.Lang.dump(responseJson));

          if (responseJson.result != 0) {
             hideLoadingImg();
             // Error!
             alert("Got error during getting data: " + responseJson.error); 
             return;
           }
          responseJson = responseJson.response;
          renderStageFunction(responseJson);
          hideLoadingImg();
          return;
        },
        failure: function (x,o) {
          alert("Async call failed!");
          return;
        }
      }
  });
}

function submitDataAndProgressToNextScreen(url, requestData, submitButton, thisScreenId, nextScreenId, nextScreenRenderFunction, errorHandlerFunction) {
  showLoadingImg();
  globalYui.io(url, {

      method: 'POST',
      data: globalYui.JSON.stringify(requestData),
      timeout : 10000,
      on: {
        start: function(x, o) {
          submitButton.set('disabled', true);
          globalYui.log("In start function");
          // showLoadingImg();
        },
        complete: function(x, o) {
          submitButton.set('disabled', false);
          globalYui.log("In stop function");
          // hideLoadingImg();
        },
        success: function (x,o) {
          submitButton.set('disabled', false);
          globalYui.log("RAW JSON DATA: " + o.responseText);

          // Process the JSON data returned from the server
          try {
            responseJson = globalYui.JSON.parse(o.responseText);
          }
          catch (e) {
            submitButton.set('disabled', false);
            hideLoadingImg();
            alert("JSON Parse failed!");
            return;
          }

          globalYui.log("PARSED DATA: " + globalYui.Lang.dump(responseJson));

          if (responseJson.result != 0) {
             submitButton.set('disabled', false);
             hideLoadingImg();
             // Error!
             globalYui.log("Got error during submit data!" + responseJson.error);
             if ( errorHandlerFunction ) {
               globalYui.log("Invoking error handler function");
               errorHandlerFunction(responseJson);
             } else {
               alert("Got error during submit data!" + responseJson.error);
             }
             return;
           }
          responseJson = responseJson.response;

          /* Done with this stage, transition to the next. */
          transitionToNextStage( thisScreenId, requestData, nextScreenId, responseJson, nextScreenRenderFunction );
        },
        failure: function (x,o) {
          submitButton.set('disabled', false);
          alert("Async call failed!");
        }
      }
  });
}

function PeriodicDataPoller( dataSourceContext, responseHandler ) {

  this.dataSourceContext = dataSourceContext;

  /* Smoothe out the optional bits of this.dataSourceContext. */
  if( !this.dataSourceContext.pollInterval ) {
    /* How often we poll. */
    this.dataSourceContext.pollInterval = 5000;
  }
  if( !this.dataSourceContext.maxFailedAttempts ) {
    /* How many failed attempts before we stop polling. */
    this.dataSourceContext.maxFailedAttempts = 5;
  }

  this.responseHandler = responseHandler;

  this.dataSource = new globalYui.DataSource.IO ({
    source: this.dataSourceContext.source
  });

  this.dataSource.plug(globalYui.Plugin.DataSourceJSONSchema, {
    schema: this.dataSourceContext.schema
  });

  this.dataSourcePollFailureCount = 0;

  /* Set when start() is invoked. */
  this.dataSourcePollHandle = null;

  this.dataSourcePollRequestContext = {
    request: this.dataSourceContext.request,
    callback: {
      success: function (e) {
        /* Reset our failure count every time we succeed. */
        this.dataSourcePollFailureCount = 0;

        /* Invoke user-pluggable code. */
        if( this.responseHandler.success ) {
          this.responseHandler.success( e, this );
        }

      }.bind(this),

      failure: function (e) {
        ++this.dataSourcePollFailureCount;

        if( this.dataSourcePollFailureCount > this.dataSourceContext.maxFailedAttempts ) {

          /* Invoke user-pluggable code. */
          if( this.responseHandler.failure ) {
            this.responseHandler.failure( e, this );
          }

          /* No point making any more attempts. */
          this.stop();
        }
      }.bind(this)
    }
  };
}

/* Start polling. */
PeriodicDataPoller.prototype.start = function() {

  this.dataSourcePollHandle = this.dataSource.setInterval( this.dataSourceContext.pollInterval, this.dataSourcePollRequestContext );
}

/* Stop polling. */
PeriodicDataPoller.prototype.stop = function() {

  this.dataSource.clearInterval( this.dataSourcePollHandle );
}

function titleCase(word){
  return word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
}