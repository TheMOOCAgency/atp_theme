function tma_show_more() {
 $('.tuto_action').click(function(){
  if($('#atp_tuto_arrow_up').hasClass('arrow-right')) {
   $('#atp_tuto_arrow_up').removeClass('arrow-right');
   $('#atp_tuto_arrow_up').addClass('arrow-bottom');
  }else if($('#atp_tuto_arrow_up').hasClass('arrow-bottom')) {
   $('#atp_tuto_arrow_up').removeClass('arrow-bottom');
   $('#atp_tuto_arrow_up').addClass('arrow-right');
  }
  if(!$('#dashboard_header_atp').hasClass('border_atp_head')) {
   $('#dashboard_header_atp').addClass('border_atp_head');
  }else{
   $('#dashboard_header_atp').removeClass('border_atp_head');
  }
  $('#dashboard_tuto_atp').slideToggle(1800);
 })
 $('.atp_dashboard_active_course').click(function(){
  $(this).parent().find('.atp_course_item').each(function(){
    var That = $(this);
    var style = That.attr('style');
    if(style) {
      That.attr('style','');
    }else{
      That.show();
    }
  })
  intervalDetectHeight();
 })
}
function intervalDetectHeight() {
  var height = 0;
  $('.atp_course_title').attr('style','');
  $('.atp_course_title').find('span').each(function(){
   var h = $(this).height();
   h = parseInt(h);
   if(h > height) {
    height = h;
   }
  })
  $('.atp_course_title').css('height',height+'px');
}
$(document).ready(function(){
 tma_show_more();
 intervalDetectHeight();
})
$('.atp_course_listing').on('change',function(){
 intervalDetectHeight();
})
$(window).resize(function(){
 intervalDetectHeight();
})
