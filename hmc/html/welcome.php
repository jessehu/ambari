<?php require_once "./head.inc"; ?>
<html>
  <head>
    <?php require "./head.htmli" ?>
  </head>

  <body class="yui3-skin-sam">
    <?php require "./topnav.htmli"; ?>

    <div id="ContentDivId">
      <div class="alert alert-info" style="margin-top:40px;padding:20px">
        <h2 style="margin-bottom:10px"><?php echo $RES['welcome.header'] ?></h2>
        <p><?php echo $RES['welcome.body'] ?></p>
        <p><span class='label label-info'>Note</span><span style='margin-left:10px;'><?php echo $RES['welcome.note'] ?></span></p> 
        <a id="submitLinkId" class='btn btn-large' style='margin-top:20px' href='initializeCluster.php'><?php echo $RES['welcome.submit.label'] ?></a>
      </div>
    </div>
  </body>
</html>