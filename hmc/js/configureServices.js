var globalOptionsInfo = null;
           
globalYui.one('#configureClusterAdvancedSubmitButtonId').on('click',function (e) {

  var retval = configureServicesUtil.checkPasswordCorrectness();
  if (retval.passwdMatched !== true) {
    setFormStatus(retval.errorString, true, true);
    document.getElementById(retval.focusOn).scrollIntoView();
    return;
  }
  configureServicesUtil.cleanupClassesForPasswordErrors();
 
  clearFormStatus();
  configureServicesUtil.clearErrorReasons(opts); 
  var opts = configureServicesUtil.generateUserOpts();

  e.target.set('disabled', true);
  var url = "../php/frontend/configureServices.php?clusterName="+globalOptionsInfo.clusterName;
  var requestData = opts;
  var submitButton = e.target;
  var thisScreenId = "#configureClusterAdvancedCoreDivId";
  var nextScreenId = "#deployCoreDivId";
  var nextScreenRenderFunction = renderDeploy;
  submitDataAndProgressToNextScreen(url, requestData, submitButton, thisScreenId, nextScreenId, nextScreenRenderFunction, configureServicesUtil.handleConfigureServiceErrors);
});

// register an event handler for the password fields
globalYui.one("#configureClusterAdvancedDynamicRenderDivId").delegate(
  {
    'keyup' : function (passwordEvent) {
      configureServicesUtil.checkPasswordCorrectness();
    }
  },
  "input[type=password]"
);

function renderConfigureServicesInternal (optionsInfo) {
  globalYui.one("#configureClusterAdvancedDynamicRenderDivId").setContent(configureServicesUtil.getOptionsSummaryMarkup(optionsInfo, false));
  hideLoadingImg();
  globalYui.one("#configureClusterAdvancedCoreDivId").setStyle("display", "block");
}

function renderOptionsPage (optionsInfo) {
  globalOptionsInfo = optionsInfo;
  var inputUrl = "../php/frontend/fetchClusterServices.php?clusterName=" + optionsInfo.clusterName + "&getConfigs=true";
  executeStage(inputUrl, renderConfigureServicesInternal);
}
