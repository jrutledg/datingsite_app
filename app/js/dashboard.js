'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var Dashboard = (function(module){
  module.authToken =localStorage.getItem('authToken');
  module.bucketUrl = "https://s3.amazonaws.com/datingapp-wdi/uploads/";
  module.apiHost = 'http://localhost:3000/';

  module.run = function(){
    //authToken =
    Registration.setupAjaxRequests(authToken);
    module.getAmazonJson();
    module.getMatchesImages();
  };

  module.getAmazonJson = function(){
    $.ajax({
      url: apiHost + '/amazon/sign_key',
      type: 'GET'
    }).done(function(data){
     //  console.log(data);
     //Add back for showing upload form.
       // var template = Handlebars.compile($('#imageHeaderTemplate').html());
       // $('#container').html(template({
       //   imageHeader: data
       // }));
       submitForm(data.key);
       console.log(data);
       var template = Handlebars.compile($('#imageHeaderTemplate').html());
       $('#container').html(template({
         imageHeader: data
       }));
       module.submitForm(data.key);
    }).fail(function(jqXHR, textStatus, errorThrow){
        trace(jqXHR, textStatus, errorThrow);
    });
  };

  module.submitForm = function(fileName){
    var $form = $('form#imageForm');
    $('body').on('submit',$form, function(e,$form){
      //e.preventDefault();
      postImageRails(fileName);
      $($form).submit();
    });
  };

  module.postImageRails = function(imageUrl){
    //need to grab profile_id from somewhere.
    var profile_id = 1;
    $.ajax({
      url: apiHost + 'profiles/'+ profile_id +'/images',
      type: 'POST',
      data: {
        image:
        {
          url: bucketUrl + imageUrl,
          profile_id: profile_id
        }
      }
    }).done(function(response){
    //  console.log(response)
    }).fail(function(jqXHR, textStatus, errorThrow){
          trace(jqXHR, textStatus, errorThrow);
    }).always(function(response){
          trace(response);
    });
  };
  // currently showing all images

  module.getMatchesImages = function(){
    var location_id = 1;
    $.ajax({
    //  url: apiHost + 'images',
     url: apiHost + 'locations/' + location_id,
      type: 'GET',
    }).done(function(response){
    //console.log(response);
      module.renderMatchImages(response);
    }).fail(function(jqXHR, textStatus, errorThrow){
          trace(jqXHR, textStatus, errorThrow);
    }).always(function(response){
          trace(response);
    });
  };

  //ask about later.
  // var setupAjaxRequests = function(authToken) {
  //   $.ajaxPrefilter(function( options ) {
  //     options.headers = {};
  //     options.headers['AUTHORIZATION'] = "Token token=" + authToken;
  //   });
  // };

  module.renderMatchImages = function(matches){
    debugger;
    //template for rendering images, issues getting it going will fix later.
    var template = Handlebars.compile($('#matchesTemplate').html());
      $('#container').html(template({
        snapshots: matches
      }));
  };

  return module;

})(Dashboard || {});
