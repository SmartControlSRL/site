jQuery(document).ready(function ($) {
  "use strict";

  window.onload = userAgentDetect;
  function userAgentDetect() {
    if (
      window.navigator.userAgent.match(/Mobile/i) ||
      window.navigator.userAgent.match(/iPhone/i) ||
      window.navigator.userAgent.match(/iPod/i) ||
      window.navigator.userAgent.match(/IEMobile/i) ||
      window.navigator.userAgent.match(/Windows Phone/i) ||
      window.navigator.userAgent.match(/Android/i) ||
      window.navigator.userAgent.match(/BlackBerry/i) ||
      window.navigator.userAgent.match(/webOS/i)
    ) {
      document.body.className += " mobile";

      // 1
      const appear1 = document.querySelector(".appear1");
      const cb1 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io1 = new IntersectionObserver(cb1);
      io1.observe(appear1);

      // 2
      const appear2 = document.querySelector(".appear2");
      const cb2 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io2 = new IntersectionObserver(cb2);
      io2.observe(appear2);

      // 3
      const appear3 = document.querySelector(".appear3");
      const cb3 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io3 = new IntersectionObserver(cb3);
      io3.observe(appear3);

      // 4
      const appear4 = document.querySelector(".appear4");
      const cb4 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io4 = new IntersectionObserver(cb4);
      io4.observe(appear4);

      // 5
      const appear5 = document.querySelector(".appear5");
      const cb5 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io5 = new IntersectionObserver(cb5);
      io5.observe(appear5);

      // 6
      const appear6 = document.querySelector(".appear6");
      const cb6 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io6 = new IntersectionObserver(cb6);
      io6.observe(appear6);

      // 7
      const appear7 = document.querySelector(".appear7");
      const cb7 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io7 = new IntersectionObserver(cb7);
      io7.observe(appear7);

      // 8
      const appear8 = document.querySelector(".appear8");
      const cb8 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io8 = new IntersectionObserver(cb8);
      io8.observe(appear8);

      // 9
      const appear9 = document.querySelector(".appear9");
      const cb9 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io9 = new IntersectionObserver(cb9);
      io9.observe(appear9);
      // 10
      const appear10 = document.querySelector(".appear10");
      const cb10 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io10 = new IntersectionObserver(cb10);
      io10.observe(appear10);

      // 11
      const appear11 = document.querySelector(".appear11");
      const cb11 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io11 = new IntersectionObserver(cb11);
      io11.observe(appear11);

      // 12
      const appear12 = document.querySelector(".appear12");
      const cb12 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io12 = new IntersectionObserver(cb12);
      io12.observe(appear12);

      // 13
      const appear13 = document.querySelector(".appear13");
      const cb13 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io13 = new IntersectionObserver(cb13);
      io13.observe(appear13);

      // 14
      const appear14 = document.querySelector(".appear14");
      const cb14 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io14 = new IntersectionObserver(cb14);
      io14.observe(appear14);

      // 15
      const appear15 = document.querySelector(".appear15");
      const cb15 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io15 = new IntersectionObserver(cb15);
      io15.observe(appear15);

      // 16
      const appear16 = document.querySelector(".appear16");
      const cb16 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io16 = new IntersectionObserver(cb16);
      io16.observe(appear16);

      // 17
      const appear17 = document.querySelector(".appear17");
      const cb17 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io17 = new IntersectionObserver(cb17);
      io17.observe(appear17);

      // 18
      const appear18 = document.querySelector(".appear18");
      const cb18 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io18 = new IntersectionObserver(cb18);
      io18.observe(appear18);

      // 19
      const appear19 = document.querySelector(".appear19");
      const cb19 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io19 = new IntersectionObserver(cb19);
      io19.observe(appear19);

      // 20
      const appear20 = document.querySelector(".appear20");
      const cb20 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io20 = new IntersectionObserver(cb20);
      io20.observe(appear20);

      // 21
      const appear21 = document.querySelector(".appear21");
      const cb21 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io21 = new IntersectionObserver(cb21);
      io21.observe(appear21);

      // 22
      const appear22 = document.querySelector(".appear22");
      const cb22 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io22 = new IntersectionObserver(cb22);
      io22.observe(appear22);

      // 23
      const appear23 = document.querySelector(".appear23");
      const cb23 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io23 = new IntersectionObserver(cb23);
      io23.observe(appear23);

      // 24
      const appear24 = document.querySelector(".appear24");
      const cb24 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io24 = new IntersectionObserver(cb24);
      io24.observe(appear24);

      // 25
      // const appear25 = document.querySelector(".appear25");
      // const cb25 = function (entries) {
      //   entries.forEach((entry) => {
      //     if (entry.isIntersecting) {
      //       entry.target.classList.add("inview");
      //     }
      //   });
      // };
      // const io25 = new IntersectionObserver(cb25);
      // io25.observe(appear25);

      // 26
      const appear26 = document.querySelector(".appear26");
      const cb26 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io26 = new IntersectionObserver(cb26);
      io26.observe(appear26);

      // 27
      const appear27 = document.querySelector(".appear27");
      const cb27 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io27 = new IntersectionObserver(cb27);
      io27.observe(appear27);

      // 28
      const appear28 = document.querySelector(".appear28");
      const cb28 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io28 = new IntersectionObserver(cb28);
      io28.observe(appear28);

      // 29
      const appear29 = document.querySelector(".appear29");
      const cb29 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io29 = new IntersectionObserver(cb29);
      io29.observe(appear29);

      // 30
      const appear30 = document.querySelector(".appear30");
      const cb30 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io30 = new IntersectionObserver(cb30);
      io30.observe(appear30);

      // 31
      const appear31 = document.querySelector(".appear31");
      const cb31 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io31 = new IntersectionObserver(cb31);
      io31.observe(appear31);

      // 32
      const appear32 = document.querySelector(".appear32");
      const cb32 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io32 = new IntersectionObserver(cb32);
      io32.observe(appear32);

      // 33
      const appear33 = document.querySelector(".appear33");
      const cb33 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io33 = new IntersectionObserver(cb33);
      io33.observe(appear33);

      // 34
      const appear34 = document.querySelector(".appear34");
      const cb34 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io34 = new IntersectionObserver(cb34);
      io34.observe(appear34);

      // 35
      const appear35 = document.querySelector(".appear35");
      const cb35 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io35 = new IntersectionObserver(cb35);
      io35.observe(appear35);

      // 36
      const appear36 = document.querySelector(".appear36");
      const cb36 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io36 = new IntersectionObserver(cb36);
      io36.observe(appear36);

      // 37
      const appear37 = document.querySelector(".appear37");
      const cb37 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io37 = new IntersectionObserver(cb37);
      io37.observe(appear37);

      // 38
      const appear38 = document.querySelector(".appear38");
      const cb38 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io38 = new IntersectionObserver(cb38);
      io38.observe(appear38);

      // 39
      const appear39 = document.querySelector(".appear39");
      const cb39 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io39 = new IntersectionObserver(cb39);
      io39.observe(appear39);

      // 40
      const appear40 = document.querySelector(".appear40");
      const cb40 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io40 = new IntersectionObserver(cb40);
      io40.observe(appear40);

      // 41
      const appear41 = document.querySelector(".appear41");
      const cb41 = function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
          }
        });
      };
      const io41 = new IntersectionObserver(cb41);
      io41.observe(appear41);
    }
  }

  $(function () {
    function isScrolledIntoView1($elem) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + $elem.height();
      return elemBottom <= docViewBottom && elemTop >= docViewTop;
    }

    function count1($this) {
      var current = parseInt($this.html(), 10);
      if (
        isScrolledIntoView1($this) &&
        !$this.data("isCounting") &&
        current < $this.data("count1")
      ) {
        $this.html(current + 10);
        $this.data("isCounting", true);
        setTimeout(function () {
          $this.data("isCounting", false);
          count1($this);
        }, 19.23);
      }
    }

    $(".num1").each(function () {
      $(this).data("count1", parseInt($(this).html(), 10));
      $(this).html("0");
      $(this).data("isCounting", false);
    });

    function startCount1() {
      $(".num1").each(function () {
        count1($(this));
      });
    }

    $(window).scroll(function () {
      startCount1();
    });

    startCount1();
  });
  $(function () {
    function isScrolledIntoView2($elem) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + $elem.height();
      return elemBottom <= docViewBottom && elemTop >= docViewTop;
    }

    function count2($this) {
      var current = parseInt($this.html(), 10);
      if (
        isScrolledIntoView2($this) &&
        !$this.data("isCounting") &&
        current < $this.data("count2")
      ) {
        $this.html(++current);
        $this.data("isCounting", true);
        setTimeout(function () {
          $this.data("isCounting", false);
          count2($this);
        }, 12.5);
      }
    }

    $(".num2").each(function () {
      $(this).data("count2", parseInt($(this).html(), 10));
      $(this).html("0");
      $(this).data("isCounting", false);
    });

    function startCount2() {
      $(".num2").each(function () {
        count2($(this));
      });
    }

    $(window).scroll(function () {
      startCount2();
    });

    startCount2();
  });

  $(function () {
    function isScrolledIntoView3($elem) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + $elem.height();
      return elemBottom <= docViewBottom && elemTop >= docViewTop;
    }

    function count3($this) {
      var current = parseInt($this.html(), 10);
      if (
        isScrolledIntoView3($this) &&
        !$this.data("isCounting") &&
        current < $this.data("count3")
      ) {
        $this.html(++current);
        $this.data("isCounting", true);
        setTimeout(function () {
          $this.data("isCounting", false);
          count3($this);
        }, 50);
      }
    }

    $(".num3").each(function () {
      $(this).data("count3", parseInt($(this).html(), 10));
      $(this).html("0");
      $(this).data("isCounting", false);
    });

    function startCount3() {
      $(".num3").each(function () {
        count3($(this));
      });
    }

    $(window).scroll(function () {
      startCount3();
    });

    startCount3();
  });

  $("#who").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#who-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#who1").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#who-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#how").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#how-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#how1").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#how-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#partners").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#partners-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#partners1").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#partners-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#team").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#team-scroll").offset().top - 0,
      },
      1500
    );
  });
  $("#team1").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#team-scroll").offset().top - 0,
      },
      1500
    );
  });

  /*-----------------------------------------------------------------------------------*/
  /* 	LOADER
/*-----------------------------------------------------------------------------------*/
  $("#loader").delay(500).fadeOut("slow");
  /*-----------------------------------------------------------------------------------*/
  /* 	COUNTER JS
/*-----------------------------------------------------------------------------------*/
  if ($(window).scrollTop() > 500) {
    $(".counter .timer").countTo();
  }
  /*-----------------------------------------------------------------------------------*/
  /*		STICKY NAVIGATION
/*-----------------------------------------------------------------------------------*/
  $(".sticky").sticky({ topSpacing: 0 });
  /*-----------------------------------------------------------------------------------*/
  /*  FULL SCREEN
/*-----------------------------------------------------------------------------------*/
  $(".full-screen").superslides({});
  /*-----------------------------------------------------------------------------------*/
  /* 	TEAM SLIDER 
/*-----------------------------------------------------------------------------------*/
  $(".team-slider").owlCarousel({
    autoplay: false,
    autoplayHoverPause: true,
    singleItem: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    lazyLoad: true,
    nav: true,
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });
  /*-----------------------------------------------------------------------------------*/
  /* 	SINGLE SLIDE
/*-----------------------------------------------------------------------------------*/
  $(".single-slides").owlCarousel({
    items: 1,
    autoplay: false,
    autoplayHoverPause: true,
    singleItem: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    lazyLoad: true,
    nav: true,
    loop: true,
    animateOut: "fadeOut",
  });
  /*-----------------------------------------------------------------------------------*/
  /* 	TEAM SLIDER 
/*-----------------------------------------------------------------------------------*/
  $(".clients-slider").owlCarousel({
    autoplay: false,
    autoplayHoverPause: true,
    singleItem: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    lazyLoad: true,
    nav: true,
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });
  /*-----------------------------------------------------------------------------------*/
  /* 	Slider 3 SEC
/*-----------------------------------------------------------------------------------*/
  $(".slider-three-item").owlCarousel({
    autoplay: false,
    autoplayHoverPause: true,
    singleItem: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    lazyLoad: true,
    nav: true,
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });
  /*-----------------------------------------------------------------------------------
    TESTNMONIALS STYLE 1
    /*-----------------------------------------------------------------------------------*/
  $(".testi-slide").flexslider({
    animation: "fade",
    controlsContainer: ".flex-container",
    controlNav: "thumbnails",
  });
  /*-----------------------------------------------------------------------------------
    TESTNMONIALS STYLE 2
    /*-----------------------------------------------------------------------------------*/
  $(".testi-slide-2").bxSlider({
    mode: "fade",
    auto: true,
  });
  /*-----------------------------------------------------------------------------------
    Animated progress bars
    /*-----------------------------------------------------------------------------------*/
  $(".progress-bars").waypoint(
    function () {
      $(".progress").each(function () {
        $(this)
          .find(".progress-bar")
          .animate(
            {
              width: $(this).attr("data-percent"),
            },
            200
          );
      });
    },
    {
      offset: "100%",
      triggerOnce: true,
    }
  );
  /*-----------------------------------------------------------------------------------*/
  /* 	SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
  jQuery(".tp-banner")
    .show()
    .revolution({
      dottedOverlay: "none",
      delay: 10000,
      startwidth: 1170,
      startheight: 700,
      navigationType: "bullet",
      navigationArrows: "solo",
      navigationStyle: "preview4",
      parallax: "mouse",
      parallaxBgFreeze: "on",
      parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
      keyboardNavigation: "on",
      shadow: 0,
      fullWidth: "on",
      fullScreen: "on",
      shuffle: "off",
      autoHeight: "off",
      forceFullWidth: "off",
      fullScreenOffsetContainer: "",
    });
  /*-----------------------------------------------------------------------------------*/
  /* 	SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
  jQuery(".tp-banner-fix")
    .show()
    .revolution({
      dottedOverlay: "none",
      delay: 10000,
      startwidth: 1170,
      startheight: 700,
      navigationType: "bullet",
      navigationArrows: "solo",
      navigationStyle: "preview4",
      parallax: "mouse",
      parallaxBgFreeze: "on",
      parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
      keyboardNavigation: "on",
      fullWidth: "off",
      fullScreen: "off",
    });
  /*-----------------------------------------------------------------------------------*/
  /* 	ANIMATION
/*-----------------------------------------------------------------------------------*/
  var wow = new WOW({
    boxClass: "animate", // animated element css class (default is wow)
    animateClass: "animated", // animation css class (default is animated)
    offset: 100, // distance to the element when triggering the animation (default is 0)
    mobile: false, // trigger animations on mobile devices (true is default)
  });
  wow.init();
  /*-----------------------------------------------------------------------------------*/
  /*	ISOTOPE PORTFOLIO
/*-----------------------------------------------------------------------------------*/
  var $container = $(".port-wrap .items");
  $container.imagesLoaded(function () {
    $container.isotope({
      itemSelector: ".portfolio-item",
      layoutMode: "masonry",
    });
  });
  $(".portfolio-filter li a").on("click", function () {
    $(".portfolio-filter li a").removeClass("active");
    $(this).addClass("active");
    var selector = $(this).attr("data-filter");
    $container.isotope({
      filter: selector,
    });
    return false;
  });
  /*-----------------------------------------------------------------------------------*/
  /* 		NAVIGATION SMOOTH SCROLL
/*-----------------------------------------------------------------------------------*/
  $(".scroll a").bind("click", function (event) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top,
        },
        1000,
        "easeInOutExpo"
      );
    event.preventDefault();
  });
  /*-----------------------------------------------------------------------------------*/
  /* 		Active Menu Item on Page Scroll
/*-----------------------------------------------------------------------------------*/
  $(window).scroll(function (event) {
    Scroll();
  });
  $(".scroll a").click(function () {
    $("html, body").animate(
      { scrollTop: $(this.hash).offset().top - 50 },
      1000
    );
    return false;
  });
  // User define function
  function Scroll() {
    var contentTop = [];
    var contentBottom = [];
    var winTop = $(window).scrollTop();
    var rangeTop = 70;
    var rangeBottom = 1000;
    $("nav")
      .find(".scroll a")
      .each(function () {
        contentTop.push($($(this).attr("href")).offset().top);
        contentBottom.push(
          $($(this).attr("href")).offset().top +
            $($(this).attr("href")).height()
        );
      });
    $.each(contentTop, function (i) {
      if (winTop > contentTop[i] - rangeTop) {
        $("nav li.scroll").removeClass("active").eq(i).addClass("active");
      }
    });
  }
  /*-----------------------------------------------------------------------------------*/
  /*	LEFT MENU
/*-----------------------------------------------------------------------------------*/
  jQuery(document).ready(function ($) {
    var $lateral_menu_trigger = $("#cd-menu-trigger"),
      $content_wrapper = $(".cd-main-content"),
      $navigation = $("header");

    //open-close lateral menu clicking on the menu icon
    $lateral_menu_trigger.on("click", function (event) {
      event.preventDefault();

      $lateral_menu_trigger.toggleClass("is-clicked");
      $navigation.toggleClass("lateral-menu-is-open");
      $content_wrapper
        .toggleClass("lateral-menu-is-open")
        .one(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function () {
            // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
            $("body").toggleClass("overflow-hidden");
          }
        );
      $("#cd-lateral-nav").toggleClass("lateral-menu-is-open");

      //check if transitions are not supported - i.e. in IE9
      if ($("html").hasClass("no-csstransitions")) {
        $("body").toggleClass("overflow-hidden");
      }
    });

    //close lateral menu clicking outside the menu itself
    $content_wrapper.on("click", function (event) {
      if (!$(event.target).is("#cd-menu-trigger, #cd-menu-trigger span")) {
        $lateral_menu_trigger.removeClass("is-clicked");
        $navigation.removeClass("lateral-menu-is-open");
        $content_wrapper
          .removeClass("lateral-menu-is-open")
          .one(
            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function () {
              $("body").removeClass("overflow-hidden");
            }
          );
        $("#cd-lateral-nav").removeClass("lateral-menu-is-open");
        //check if transitions are not supported
        if ($("html").hasClass("no-csstransitions")) {
          $("body").removeClass("overflow-hidden");
        }
      }
    });
    //open (or close) submenu items in the lateral menu. Close all the other open submenu items.
    $(".item-has-children")
      .children("a")
      .on("click", function (event) {
        event.preventDefault();
        $(this)
          .toggleClass("submenu-open")
          .next(".sub-menu")
          .slideToggle(200)
          .end()
          .parent(".item-has-children")
          .siblings(".item-has-children")
          .children("a")
          .removeClass("submenu-open")
          .next(".sub-menu")
          .slideUp(200);
      });
  });
  /*-----------------------------------------------------------------------------------*/
  /*	Go TO TOP
/*-----------------------------------------------------------------------------------*/
  var offset = 300,
    //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
    offset_opacity = 1200,
    //duration of the top scrolling animation (in ms)
    scroll_top_duration = 700,
    //grab the "back to top" link
    $back_to_top = $(".cd-top");

  //hide or show the "back to top" link
  $(window).scroll(function () {
    $(this).scrollTop() > offset
      ? $back_to_top.addClass("cd-is-visible")
      : $back_to_top.removeClass("cd-is-visible cd-fade-out");
    if ($(this).scrollTop() > offset_opacity) {
      $back_to_top.addClass("cd-fade-out");
    }
  });
  //smooth scroll to top
  $back_to_top.on("click", function (event) {
    event.preventDefault();
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      scroll_top_duration
    );
  });
});
