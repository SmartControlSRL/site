<?php include("config.php");?>

<!doctype html>
  <html class="no-js" lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <!-- Document Title -->
    <title>Smart Control</title>

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
  <link rel="manifest" href="images/favicon/site.webmanifest">

  <!-- StyleSheets -->
  <link rel="stylesheet" href="css/animate.css">
  <link rel="stylesheet" href="css/ionicons.min.css">
  <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/custom.css">
  <link rel="stylesheet" href="css/responsive.css">

  <!-- SLIDER REVOLUTION 4.x CSS SETTINGS -->
  <link rel="stylesheet" type="text/css" href="rs-plugin/css/settings.css" media="screen">


</head>
<body>

  <!-- LOADER ===========================================-->
  <div id="loader">
    <div class="loader">
      <div class="position-center-center"> <img src="images/logo-website.png" alt="">
        <p class="font-crimson text-center">Please Wait...</p>
        <div class="loading">
          <div class="ball"></div>
          <div class="ball"></div>
          <div class="ball"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page Wrapper -->
  <div id="wrap"> 
                  <!-- Header -->
    <header class="header">
      <div class="container-50">
        <div class="mobile-visible">
          <div class="logo"> <a href="<?=$site_url;?>"><img src="images/logo-website.png" alt="Logo Smart Control"> </div>
        </div>

        <div class="desktop-visible">
          <div class="logo"> <a href="<?=$site_url;?>"><img src="images/logo-alb.png" alt="Logo Smart Control"> </div>
        </div>

          <!-- Nav -->
          <nav>
            <ul id="ownmenu" class="ownmenu">
              <li class="active"><a href="<?=$site_url;?>">HOME</a></li>
              <li id="who"><a href="javascript:void(0)" >WHO WE ARE</a></li>
              <li id="how"><a href="javascript:void(0)">HOW CAN WE HELP YOU</a></li>
              <li id="partners"><a href="javascript:void(0)">OUR PARTNERS</a></li>
              <li id="team"><a href="javascript:void(0)">THE TEAM & EXPERTISSE</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <!-- End Header --> 

  <?php include("slide.php"); ?>

        <!-- Content -->
        <div id="content"> 
          <?php include("who-we-are.php"); ?>
          <?php include("how-can-we-help.php"); ?>
          <?php include("our-parteners.php"); ?>
          <?php include("team.php"); ?>
          <?php include("footer.php"); ?>  
        </div>
        <!-- End Content --> 

          <!-- End Footer --> 

          <!-- GO TO TOP --> 
          <!-- <a href="#" class="cd-top"><i class="fa fa-angle-up"></i></a>  -->
          <!-- GO TO TOP End --> 
        </div>
        <!-- End Page Wrapper --> 

        <!-- JavaScripts --> 
        <script src="js/vendors/jquery/jquery.min.js"></script> 
        <script src="js/vendors/wow.min.js"></script> 
        <script src="js/vendors/bootstrap.min.js"></script> 
        <script src="js/vendors/own-menu.js"></script> 
        <script src="js/vendors/flexslider/jquery.flexslider-min.js"></script> 
        <script src="js/vendors/jquery.countTo.js"></script> 
        <script src="js/vendors/jquery.isotope.min.js"></script> 
        <script src="js/vendors/jquery.bxslider.min.js"></script> 
        <script src="js/vendors/owl.carousel.min.js"></script> 
        <script src="js/vendors/jquery.sticky.js"></script> 

        <!-- SLIDER REVOLUTION 4.x SCRIPTS  --> 
        <script type="text/javascript" src="rs-plugin/js/jquery.themepunch.tools.min.js"></script> 
        <script type="text/javascript" src="rs-plugin/js/jquery.themepunch.revolution.min.js"></script> 
        <script src="js/zap.js" defer></script>
      </body>
      </html>