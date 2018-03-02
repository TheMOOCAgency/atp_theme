define(['domReady', 'jquery', 'underscore','jquery.ui'],function(domReady, $, _) {
  var onReady = function() {
    // method preview csv file
    var ok_csv = true;

    function csv_preview(input,output,next) {
      var reader = new FileReader();
      var fileinput = document.getElementById(input);
      reader.onload = function(){
        var lines = this.result.split('\n');
        var out = $('#'+output);
        var limit = 0;
        out.html();
        for(var line = 0; line < lines.length; line++){
          if(limit < 6) {
            columns = lines[line].split(',');
            var row_id = 'csv_row_'+line;
            var paragraphe = "<p id='"+row_id+"'></p>";
            out.append(paragraphe);
            var cur_row = $('#'+row_id);
            var email_column;
            if(line > 0) {
              email_column = "<span class='email_row'>"+columns[0]+"</span>";
              cur_row.append(email_column);
            }else{
              email_column = "<span>"+columns[0]+"</span>";
              cur_row.append(email_column);
            }
            for(var i = 1;i<columns.length;i++) {
              var span = "<span>"+columns[i]+"</span>";
              cur_row.append(span);
            }
            //out.append('<p><span>'+lines[line].split(',').join('</span><span>')+'</span><p>');
          }else{
            line = lines.length - 1;
          }
        };
        out.find('p').each(function(){
          var This = $(this);
          var text = This.text();
          if(text == '') {
            This.remove();
          }
        })
        $('.email_row').each(function(){
          var This = $(this);
          var text = This.text();
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(!re.test(text)) {
            ok_csv = false;
            This.addClass("is_error");
          }
        })
        out.find('span').attr('style','');
        $('#output_section').show();
        if(ok_csv) {
            $('#'+next).show();
        }else{
          console.log("csv file contains invalids email addresses");
        }
      }
      reader.readAsText(fileinput.files[0]);
      return "canard";
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
          csv_preview('invite_participant','output',next)
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
      $('#pop_up_invite').removeClass('is_show');
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
          $('#pop_up_invite').addClass('is_show');
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
