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


  $(function() {
    $.MTALeadGenGated = function (element) { //renamed arg for readability
      //store the passed element as a property of the created instance.
      this.element = (element instanceof $) ? element : $(element);

      this.local_storage_key  = 'mta_leadgen_uuid';
      this.access_period      = 120; //20 seconds
      this.time               = new Date().getTime();
      this.email              = '';
      this.phone              = '';
      this.last_name          = '';
      this.first_name         = '';
      this.company_name       = '';

      this.phone_field        = element.find('.gated-phone input');
      this.email_field        = element.find('.gated-email input');
      this.last_name_field    = element.find('.gated-name .name_last input');
      this.first_name_field   = element.find('.gated-name .name_first input');
      this.company_name_field = element.find('.gated-company input');

      this.ty_display = (element.data('ty-display') !== null) ? (typeof element.data('ty-display') !== 'undefined') ? element.data('ty-display') : 'replace' : 'replace';
      this.gated_id = (element.data('gated-id') !== null) ? (typeof element.data('gated-id') !== 'undefined') ? element.data('gated-id') : 0 : 0;
      this.access_id = (element.data('access-id') !== null) ? (typeof element.data('access-id') !== 'undefined') ? element.data('access-id') : 0 : 0;

      this.uuid = (localStorage.getItem(this.local_storage_key) !== null) ? localStorage.getItem(this.local_storage_key) !== undefined ? localStorage.getItem(this.local_storage_key) : this.generate_uuid() : this.generate_uuid(); //gated_post_uuid
    };

    $.MTALeadGenGated.prototype = {

      init: function () {
        //`this` references the instance object inside of an instace's method,
        //however `this` is set to reference a DOM element inside jQuery event
        //handler functions' scope. So we take advantage of JS's lexical scope
        //and assign the `this` reference to another variable that we can access
        //inside the jQuery handlers
        var that = this;

        //Save data when a user successfully submits a gravity form
        $(document).bind('gform_confirmation_loaded', function(event, form_id){
          /*
          ToDo:
          ***make this only do this form gated content forms
          ***while this is only initialized on a page with a gated form there may be multiple forms on that page.
          */

          localStorage.setItem('mta_leadgen_uuid', that.get_uuid());
          that.ajax_display_gated_content(1, that.gated_id, that.get_uuid(), that.access_id, that.get_access_period(), that.get_fname(), that.get_lname(), that.get_cname(), that.get_email(), that.get_phone(), that.created, that.accessed);
        });

        //on page load run our ajax command
        //dispaly the gated content if the user has already gained access
        that.ajax_display_gated_content(0, that.gated_id, that.get_uuid(), that.access_id);

        /* We cant just bind on blur b/c if a user types in a value and clicks enter without leaving the field and submits the form we won't capture that data */
        //store the first name on keyup and blur
        this.first_name_field.bind('keyup blur', function () {
          that.set_fname(this.value);
        });
        //store the last name on keyup and blur
        this.last_name_field.bind('keyup blur', function () {
          that.set_lname(this.value);
        });
        //store the company name on keyup and blur
        this.company_name_field.bind('keyup blur', function () {
          that.set_cname(this.value);
        });
        //store the company name on keyup and blur
        this.phone_field.bind('keyup blur', function () {
          that.set_phone(this.value);
        });
        //store the company name on keyup and blur
        this.email_field.bind('keyup blur', function () {
          that.set_email(this.value);
        });
      },

      triggerAnalyticsEvent: function (evCat, evAct, evLab, evVal) {
        try {
          ga('send', 'event', evCat, evAct, evLab, evVal);
        } catch (e) {
          console.log(e);
        }
      },

      // Get Values
      get_access_period: function() {
        return this.access_period;
      },
      get_fname: function() {
        return this.first_name;
      },
      get_uuid: function() {
        return this.uuid;
      },
      get_lname: function() {
        return this.last_name;
      },
      get_cname: function() {
        return this.company_name;
      },
      get_email: function() {
        return this.email;
      },
      get_phone: function() {
        return this.phone;
      },

      // Set Values
      set_fname: function(value) {
        this.first_name = value;
      },
      set_accessed: function(value) {
        this.accessed = new Date().getTime();
      },
      set_lname: function(value) {
        this.last_name = value;
      },
      set_cname: function(value) {
        this.company_name = value;
      },
      set_phone: function(value) {
        this.phone = value;
      },
      set_email: function(value) {
        this.email = value;
      },
      generate_uuid: function(length, chars){
        var result = '';
        var mask = '';
        length = (length === null) ? 64 : (length >= 64) ? length : 64;
        chars = chars || '#aA';

        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];

        return result;
      },


      //display gated content ajax function
      ajax_display_gated_content: function(create_access, gated_id, uuid, access_id, access_period, fname, lname, cname, email, phone, created_on, accessed, addType, delay, html_id ) {
        //`this` references the instance object inside of an instace's method,
        //however `this` is set to reference a DOM element inside jQuery event
        //handler functions' scope. So we take advantage of JS's lexical scope
        //and assign the `this` reference to another variable that we can access
        //inside the jQuery handlers
        var that = this;

        create_access = create_access || 0;
        gated_id      = gated_id      || 0;
        uuid          = uuid          || that.get_uuid();
        access_period = access_period || 864000; //default to 10 days (864000 seconds)
        access_id     = access_id     || 0;
        fname         = fname         || '';
        lname         = lname         || '';
        cname         = cname         || '';
        email         = email         || '';
        phone         = phone         || '';
        created_on    = created_on    || new Date().getTime();
        accessed      = accessed      || new Date().getTime();
        addType       = addType       || 'replace';
        delay         = delay         || 0;
        html_id       = html_id       || '#gated_form_wrapper';

        setTimeout(function() {
          $.ajax({
            type : "POST",
            dataType : "json",
            url : ajax_object.ajaxurl,
            data : {
              action: "display_gated_content",
              uuid:           uuid,
              fname:          fname,
              lname:          lname,
              cname:          cname,
              email:          email,
              phone:          phone,
              gated_id:       gated_id,
              accessed:       accessed,
              access_id:      access_id,
              created_on:     created_on,
              access_period:  access_period,
              create_access:  create_access
            },
            success: function(response) {
              if(response.type == "success") {

                //fire analytics events
                if(response.analytics.user_tracking){
                  that.triggerAnalyticsEvent('Gated Content', 'View - ' + response.analytics.post_title, response.analytics.name + ' ' + response.analytics.company + '(' + response.analytics.email + ')', 1);
                }
                if(response.analytics.view_tracking){
                  that.triggerAnalyticsEvent('Gated Content', 'View - ' + response.analytics.post_title, uuid, 1);
                }

                switch(addType) {
                  case 'hide_ty':
                  case 'replace':
                    $(html_id).html(response.data);
                    break;

                  case 'show_ty':
                    $(html_id).append(response.data);

                    break;
                  default:
                    $(html_id).html(response.data);
                    break;
                }
              }
              else {
                if(uuid && response.analytics.post_title) {
                  //only show view failure if there was an id that should have asccess, and there was an ajax failure
                  //we dont want to show a failure on initial page load when there is no id

                  //fire analytics events
                  if(response.analytics.user_tracking){
                    that.triggerAnalyticsEvent('Gated Content', 'View (Access Expired) - ' + response.analytics.post_title, response.analytics.name + ' ' + response.analytics.company + '(' + response.analytics.email + ')', 0);
                  }
                  if(response.analytics.view_tracking){
                    that.triggerAnalyticsEvent('Gated Content', 'View (Access Expired) - ' + response.analytics.post_title, uuid, 0);
                  }
                }
                else {
                  //fire analytics events
                  if(response.analytics.user_tracking){
                    that.triggerAnalyticsEvent('Gated Content', 'View (Gated Form) - ' + response.analytics.post_title, response.analytics.name + ' ' + response.analytics.company + '(' + response.analytics.email + ')', 0);
                  }
                  if(response.analytics.view_tracking){
                    that.triggerAnalyticsEvent('Gated Content', 'View (Gated Form) - ' + response.analytics.post_title, uuid, 0);
                  }
                }
                //log error to console
                console.log(response);
              }
            }
          });
        }, delay);
      }
    };

    //if the '#gated_form_wrapper' item exists on the page initialize the exitintent
    if ( $( "#gated_form_wrapper" ).length ) {
      var leadgengated = new $.MTALeadGenGated($("#gated_form_wrapper"));
      leadgengated.init();
    }
  });
})( jQuery );
