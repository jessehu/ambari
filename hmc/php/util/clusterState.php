<?php

define ("HMC_CLUSTER_STATE_LOCK_FILE_SUFFIX", "clusterstate");
// initial setup
function updateClusterState ($clusterName, $state, $displayName, $context) {
  $logger = new HMCLogger("ClusterState");
  $dbAccessor = new HMCDBAccessor($GLOBALS["DB_PATH"]);

  $stateObj = array (
                  'state' => $state,
                  'displayName' => $displayName,
                  'timeStamp' => time(),
                  'context' => $context
                );

  $stateStr = json_encode($stateObj);
  $retval = $dbAccessor->setClusterState($clusterName, $stateStr);

  $logger->log_info("Update Cluster State with ".$stateStr);

  return $retval;
}

function needWipeOut ($clusterName) {
  $logger = new HMCLogger("ClusterState");
  $dbAccessor = new HMCDBAccessor($GLOBALS["DB_PATH"]);
  $clusterStatus = $dbAccessor->getClusterStatus($clusterName);
  return $clusterStatus;
}

?>
