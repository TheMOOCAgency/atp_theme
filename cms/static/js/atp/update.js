define(['domReady', 'jquery', 'underscore','jquery.ui','tinymce','jquery.tinymce'],function(domReady, $, _) {
  class update_microsite {
    constructor(data) {
      this.data = data;
    }
    get_value(id,Class) {
      var This = $('#'+id);
      var data = new FormData($('#'+id).get(0));
      var That = $('.'+Class);
      $('.'+Class).each(function(){
        var val = $(this).attr('value');
        var name = $(this).attr('name');
        data.append(name,val);
      })
      this.data = data;
      return this.data;
    }
    save_action(update,cancel) {
      $('#new-microsite-logo,.'+update).on('change paste keyup',function(){
        $('#notification-warning').addClass('is-shown');
      })
      $('.'+cancel).click(function(){
        $('#notification-warning').removeClass('is-shown');
      })
    }
    success_ajax() {
      $('#notification-warning').removeClass('is-shown');
      var div = '<div class="wrapper wrapper-alert wrapper-alert-confirmation" id="alert-confirmation" aria-hidden="false" aria-labelledby="alert-confirmation-title" tabindex="-1"><div class="alert confirmation "><span class="feedback-symbol fa fa-check" aria-hidden="true"></span><div class="copy"><h2 class="title title-3" id="alert-confirmation-title">Your changes have been saved.</h2></div></div></div>';
      $('#page-alert').html(div);
      $.when($("html, body").animate({ scrollTop: 0 }, "slow")).done(function(){
        $('#page-alert').find('#alert-confirmation').slideDown(1000).delay(4000).slideUp(1000);
      })
    }
  }
  var onReady = function() {
    var updateMicrosite = new update_microsite();
    updateMicrosite.save_action('form_update','action-cancel');
    $('.action-save').click(function(){
      var values = updateMicrosite.get_value('upload_microsite_logo','input_update');
      var path = window.location.path;
      $.ajax({
        url:path,
        type:'POST',
        data: values,
        cache: false,
        contentType: false,
        processData: false,
        dataType:'json',
        success: function(retour) {
          updateMicrosite.success_ajax();
          $('#micro_primary_color').attr('value','');
          $('#micro_secondary_color').attr('value','');
          var logo_url = retour.logo_value_path;
          var primary_color = retour.primary_color;
          $('#pre_primary').find('label').text(primary_color);
          var secondary_color = retour.secondary_color;
          $('#pre_secondary').find('label').text(secondary_color);
          var src = $('#pre_picture').find('img').attr('src');
          src = src.split('/media/')[0];
          src = src+logo_url;
          $('#pre_picture').find('img').attr('src',src);
        }
      })
    })
  };
  domReady(onReady);
  return {
      onReady: onReady
  };
})
