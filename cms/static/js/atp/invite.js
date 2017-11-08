define(['domReady', 'jquery', 'underscore','jquery.ui'],function(domReady, $, _) {
  var onReady = function() {
    // method preview csv file
    function csv_preview(input,output) {
      var reader = new FileReader();
      var fileinput = document.getElementById(input);
      reader.onload = function(){
        var lines = this.result.split('\n');
        var out = $('#'+output);
        var limit = 0;
        out.html();
        for(var line = 0; line < lines.length; line++){
          if(limit < 6) {
            out.append('<p><span>'+lines[line].split(',').join('</span><span>')+'</span><p>');
          }else{
            line = lines.length - 1;
          }
        };
        out.find('p').each(function(){
          var This = $(this);
          var text = This.text();
          if(text == '') {
            console.log('html : '+text);
            This.remove();
          }
        })
        out.find('span').attr('style','');
        $('#output_section').show();
      }
      reader.readAsText(fileinput.files[0]);
    };
    function invite() {
      this.constructor = function(body,action,data,checkbox) {
        this.body = body;
        this.action = action;
        this.data = data;
        this.checkbox = checkbox;
      },
      // set action
      this.setAction = function(val) {
        this.action = val;
      },
      this.getData = function() {
        return this.data;
      },
      // upload and pre-register only users
      this.register_only = function(id,file) {
        var This = $('#'+id);
        This.click(function(){
          var data = new FormData($(file).get(0));
          data.append('request_type','register_only');
          this.data = data;
        })
      },
      // load csv file to custom user input
      this.load_csv = function(file,action) {
        var data = new FormData($(file).get(0));
        data.append('request_type',action);
        data
        this.data = data;
      },
      // action on use file upload
      this.file_up_input = function(id,next) {
        var This = $('#'+id);
        This.change(function(){
          var val = This.attr('value');
          var split = val.split('.');
          var long = split.length - 1;
          var check = split[long];
          if(check.indexOf('csv') == -1) {
            alert('fichier au format incorect');
          }else{
            csv_preview('invite_participant','output');
            $('#'+next).show();
          }
        })
      }
    };


    /* action on submit form */
    var submit = '#upload_form_participant';
    var mail_invite = new invite();
    mail_invite.file_up_input('invite_participant','choise_from_file');
    // register users from csv
    $('#register_from_csv').click(function(){
      mail_invite.load_csv(submit,'register_only');
      var path = window.location.path;
      var data = mail_invite.getData();
      $.ajax({
        url: path,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
          var retour = data.message;
        }
      })
    })
    /* svg color */
    $('.svg_bis').contents().find('svg').attr("fill",'#06144D');
  };
  domReady(onReady);
  return {
      onReady: onReady
  };
})
