define(["domReady", "jquery", "underscore"],
    function (domReady, $, _, CancelOnEscape, CreateMicrositeUtilsFactory) {
        "use strict";
        // microsite form
        var new_microsite_form = function(e) {
          e.preventDefault();
          $('.wrapper-create-element').removeClass('is-shown');
          $('.wrapper-create-microsite').addClass('is-shown');
        }
        var ajax_cancel_microsite = function(e) {
          $('.wrapper-create-microsite').removeClass('is-shown');
        }
        var ajax_call_create_microsite = function(e) {
          e.preventDefault();
          var url = '/create-microsite/';
          var formData = new FormData();
          formData.append('display_name',$('#new-microsite-name').val());
          formData.append('logo',$('#new-microsite-logo').prop("files")[0]);
          formData.append('primary_color',$('#new-microsite-primary_color').val());
          formData.append('secondary_color',$('#new-microsite-secondary_color').val());
          formData.append('language',$('#language-value').val());
          $.ajax({
            url:url,
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data) {
              $('.wrapper-create-microsite').removeClass('is-shown');
              location.reload();
            }
          })
        }
        // message aucune campagne
        var campaign_info = function(e) {
          $('#course-index-tabs').find('li').find('button').click(function(){
            var This = $(this);
            var data = This.data('sub');
            if(data == 'all') {
              $('#no_course').show();
              $('.content-supplementary').css('border','1px solid #c8c8c8');
              $('#info_my_campaign').show();
              $('#info_my_module').hide();
            }else{
              $('#no_course').hide();
            }
            if(data == 'microsites') {
              $('.content-supplementary').css('border','1px solid transparent');
              $('#info_my_campaign').hide();
              $('#info_my_module').hide();
            }
            if(data == 'template') {
              $('#generic_title').show();
              $('.content-supplementary').css('border','1px solid #c8c8c8');
              $('#info_my_campaign').hide();
              $('#info_my_module').show();
            }else{
              $('#generic_title').attr('style','');
            }
          })
        }
        var svg_load = function(){
          jQuery('img.svg').each(function(){
              var $img = jQuery(this);
              var imgID = $img.attr('id');
              var imgClass = $img.attr('class');
              var imgURL = $img.attr('src');
              jQuery.get(imgURL, function(data) {
                  // Get the SVG tag, ignore the rest
                  var $svg = jQuery(data).find('svg');
                  // Add replaced image's ID to the new SVG
                  if(typeof imgID !== 'undefined') {
                      $svg = $svg.attr('id', imgID);
                  }
                  // Add replaced image's classes to the new SVG
                  if(typeof imgClass !== 'undefined') {
                      $svg = $svg.attr('class', imgClass+' replaced-svg');
                  }
                  // Remove any invalid XML tags as per http://validator.w3.org
                  $svg = $svg.removeAttr('xmlns:a');
                  // Replace image with new SVG
                  $img.replaceWith($svg);

              }, 'xml');
          });
          $('img.svg').show();
        }
        var onReady = function () {
            $('.new-microsite-button').bind('click',new_microsite_form);
            $('.new-microsite-save').bind('click',ajax_call_create_microsite);
            $('.new-microsite-cancel').bind('click',ajax_cancel_microsite);
            campaign_info();
            svg_load();
            //$('#course-index-tabs .microsite-tab').bind('click', showTab('microsite'));
        };

        domReady(onReady);

        return {
            onReady: onReady
        };
    });
