define(['domReady', 'jquery', 'underscore','dynatable','papaparse','jquery.ui'],function(domReady, $, _, dynatable, Papa) {
  var onReady = function() {

    //////////////////////////////////////////////////// CHECK CSV FILE //////////////////////////////////////////////////
function ParseCsvFile(evt) {
  $("#csv_import_error").css('display','none');
  $('#csv_import').html('');
  $('#csv_import_preview').css('display','none');
  $('#csv_import_feedback').css('display','none');
  final_valid_records={};
  final_error_records={};
  $('#register_user_btn').css('display','none');
  var file = evt.target.files[0];
  var fileread = new FileReader();
  fileread.onload = function(e) {
    if(e.target.result.indexOf('�')>-1){
      encoding_type="ascii"
    }
    else{
      encoding_type="utf-8"
    }
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      encoding: encoding_type,
      complete: function(results) {
        data = results;
        csv_users=results['data'];
        csv_users_cleaned = clean_maj(csv_users);
        valid_header=check_valid_header(csv_users_cleaned);
        if(valid_header==true){
          check_results = check_csv_errors(csv_users_cleaned);
          final_valid_records = check_results['valid_records'];
          final_error_records = check_results['errors'];
          if(final_error_records.length>0){
            manage_error_display(final_error_records);
          }
          else{
            display_csv_rows(final_valid_records);
            $('#register_user_btn').css('display','block');
          }
        }
        else{
          manage_error_display(valid_header);
        }
      }
    });
  };
  fileread.readAsText(file);
}

function clean_maj(csv_users){
  i=0;
  csv_users_cleaned={};
  for (user in csv_users){
    user_obj =csv_users[user];
    var key, keys = Object.keys(user_obj);
    var n = keys.length;
    var new_user_obj={}
    while (n--) {
      key = keys[n];
      new_user_obj[key.toLowerCase()] = user_obj[key];
    }
    csv_users_cleaned[i]=new_user_obj;
    i+=1;
  }
  return csv_users_cleaned;
}

function check_valid_header(csv_users_cleaned){
  valid_header=true;
  errors={};
  errors['missing_header']=[];
  for(i=0;i<required_fields.length;i++){
    if (!(required_fields[i] in csv_users_cleaned[0])){
      errors['missing_header'].push(required_fields[i]);
    }
  }
  if(errors['missing_header'].length>0){
    valid_header=errors;
  }
  return valid_header;
}

function check_csv_errors(csv_users_cleaned){
  errors=[];
  valid_records=[];
  check_results={};
  for (user in csv_users_cleaned){
    user_data=csv_users_cleaned[user];
    valid=true
    user_data['missing_fields']=[];
    user_data['line']=parseInt(user)+2;
    console.log(user_data);
    for (var i = 0; i < required_fields.length; i++){
      if(user_data[required_fields[i]]==undefined && user_data[required_fields[i]]==null){
        valid=false;
        user_data['missing_fields'].push(required_fields[i]);
      }
      else if(required_fields[i]=='email' && !validateEmail(user_data['email'])){
        valid=false;
        user_data['invalid_email']=true;
      }
    }
    if(valid==true){
      valid_records.push(user_data);
    }
    else if(!isempty(user_data)){
      errors.push(user_data);
    }
  }
  check_results['valid_records']=valid_records;
  check_results['errors']=errors;
  return check_results;
}

function display_csv_rows(csv_users_cleaned){
  $('#csv_import').css('display','block');
  set_header();
  if(times_displayed<1){
    dynatable = $('#csv_import').dynatable({
    dataset: {
        records: csv_users_cleaned
    }
    }).data('dynatable');
  }
  else{
    dynatable.settings.dataset.originalRecords = csv_users_cleaned;
    dynatable.process();
  }
  times_displayed+=1;
  $('.dynatable-active-page a').addClass('primary-color-bg');
  $('#csv_import_preview').css('display','block');
}

function manage_error_display(errors){
  $('#csv_import_error').css('display','block');
  $('#csv_import').css('display','none');
  $('.error-message').each(function(){
    $(this).css('display','none');
  })



  if('missing_header' in errors){
    header_error='';
    $("#incorrect_header").css('display','block');
    header_errors+='<ul>';
    for(missing_header in errors['missing_header']){
      header_error+='<li>'+errors['missing_header'][missing_header]+'</li>';
    }
    header_error+='</ul>';
    $('#header-error-details').html(header_error);
  }
  else{
    missing_error='<ul>';
    incorrect_error='<ul>';
    for(user in errors){
      if('invalid_email' in errors[user]){
        $("#incorrect-data").css('display','block');
        incorrect_error+='<li>l'+ errors[user]['line']+' '+(errors[user]['email']||'')+' : email</li>';
      }
      else if ('missing_fields' in errors[user]){
        $("#required-data").css('display','block');
        missing_error+='<li>l'+ errors[user]['line']+' '+(errors[user]['email']||'')+' : ';
        for(i=0;i<errors[user]['missing_fields'].length;i++){
          missing_error+=errors[user]['missing_fields'][i];
        }
        missing_error+='</li>';
      }
    }
    missing_error+='</ul>';
    $('#incorrect-error-detail').html(incorrect_error);
    incorrect_error='</ul>';
    $('#missing-error-detail').html(missing_error);
  }

}




function set_header(){
  header_fields = ['email','first_name','last_name','level_1','level_2','level_3','level_4'];
  $('#csv_import').append('<thead><tr></tr></thead>');
  for (i=0;i<header_fields.length;i++){
      $('#csv_import thead tr').append('<th class="primary-color-bg white-border white-text">'+header_fields[i]+'</th>');
  }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isempty(obj) {
    for (var key in obj) {
        if (obj[key] !== null && obj[key] != "" && obj[key] != undefined){
            return false;
    }
    return true;
  }
}

//////////////////////////////////////////// ACTIONS //////////////////////////////////////

//Check csv on submit
$(document).ready(function () {
  times_displayed=0;
  required_fields = ['email','first_name','last_name'];
  $("#invite_participant").change(ParseCsvFile);

  // register users from csv
  $('#register_from_csv').on('click',function(){

    $('#header-error-details').html('');
    $('#incorrect-error-detail').html('');
    $('#missing-error-detail').html('');
    $('#csv_import_feedback').css('display','none');
    var csrftoken = $("#csrf").html();
    var path = window.location.path;
    var data = new FormData();
    data.append('file',$('#invite_participant')[0].files[0])
    data.append('request_type','register_only');
    $.ajax({
      url:path,
      type: 'POST',
      processData: false,
      contentType: false,
      headers:{
        "X-CSRFToken": csrftoken
      },
      data:data,
      success:function(data){
        $('#csv_import_feedback').css('display','block');
        $('#csv_import_preview').css('display','none');
        $('#register_user_btn').css('display','none');
      }
    })
  })
});


  };
  domReady(onReady);
  return {
      onReady: onReady
  };
})
