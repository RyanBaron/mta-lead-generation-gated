(function( $ ) {
  'use strict';

  /**
   * All of the code for your admin-facing JavaScript source
   * should reside in this file.
   *
   * Note: It has been assumed you will write jQuery code here, so the
   * $ function reference has been prepared for usage within the scope
   * of this function.
   *
   * This enables you to define handlers, for when the DOM is ready:
   *
   * $(function() {
   *
   * });
   *
   * When the window is loaded:
   *
   * $( window ).load(function() {
   *
   * });
   *
   * ...and/or other possibilities.
   *
   * Ideally, it is not considered best practise to attach more than a
   * single DOM-ready or window-load handler for a particular page.
   * Although scripts in the WordPress core, Plugins and Themes may be
   * practising this, we should strive to set a better example in our own work.
   */

  $.MTAleadgengatedAdminSection = function (element) { //renamed arg for readability
    //store the passed element as a property of the created instance.
    this.element = (element instanceof $) ? element : $(element);
    this.screenShotHelp = document.getElementsByClassName("help-screenshot");
    this.screenShotHide = document.getElementsByClassName("hide-screenshot");
  };

  $.MTAleadgengatedAdminSection.prototype = {

    init: function () {
      //`this` references the instance object inside of an instace's method,
      //however `this` is set to reference a DOM element inside jQuery event
      //handler functions' scope. So we take advantage of JS's lexical scope
      //and assign the `this` reference to another variable that we can access
      //inside the jQuery handlers
      var that = this;

      var showHelpScreenShot = function(e) {
        e.preventDefault();
        var imgUrl = this.getAttribute("data-screenshot-url");

        if(!$(this).parent().hasClass('show-screenshot')) {
          $(this).parent()
            .addClass('show-screenshot')
            .find('.screenshot-wrapper').append('<div class="screenshot-img-wrapper"><img class="screenshot-img" src="'+imgUrl+'"></div>');
        }
      };
      //add click listeners for each of the show screenshot buttons
      for (var i = 0; i < this.screenShotHelp.length; i++) {
        this.screenShotHelp[i].addEventListener('click', showHelpScreenShot, false);
      }

      var hideHelpScreenShot = function(e) {
        e.preventDefault();
        $(this).parent().parent()
          .removeClass('show-screenshot')
          .find('.screenshot-img-wrapper').remove();
      };
      //add click listeners for each of the hide screenshot buttons
      for (var j = 0; j < this.screenShotHide.length; j++) {
        this.screenShotHide[j].addEventListener('click', hideHelpScreenShot, false);
      }
    }
  };

  $(function() {
    //if the '#mta_leadgengated_wrapper' item exists on the page initialize the exitintent
    if ( $( "#mta_leadgengated_options_page" ).length ) {
      var leadgengated_options_page = new $.MTAleadgengatedAdminSection($("#mta_leadgengated_options_page"));
      leadgengated_options_page.init();
    }
  });

})( jQuery );
