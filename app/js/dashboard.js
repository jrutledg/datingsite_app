'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var Dashboard = (function(){
  var authToken, apiHost;
  var bucketUrl = "https://s3.amazonaws.com/datingapp-wdi/";
  var apiHost = 'http://localhost:3000/';

  var run = function(){
    authToken = localStorage.getItem('authToken');
    Registration.setupAjaxRequests();
    var apiHost = 'http://localhost:3000/';
    getAmazonJson();
    getMatchesImages();
  };

  var getAmazonJson = function(){
    $.ajax({
      url: apiHost + '/amazon/sign_key',
      type: 'GET'
    }).done(function(data){
     //  console.log(data);
       var template = Handlebars.compile($('#imageHeaderTemplate').html());
       $('#container').html(template({
         imageHeader: data
       }));
       submitForm(data.key)
    }).fail(function(jqXHR, textStatus, errorThrow){
          trace(jqXHR, textStatus, errorThrow);
    });
  };

  var submitForm = function(fileName){
    var $form = $('form#imageForm');
  $('body').on('submit',$form, function(e,$form){
      //e.preventDefault();
      postImageRails(fileName);
      $($form).submit();
    });
  };

  var postImageRails = function(imageUrl){
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
  }
  // currently showing all images
  var getMatchesImages = function(){
    var location_id = 1;
    console.log(authToken);
   // debugger;
    $.ajax({
      url: apiHost + 'images',
    // url: apiHost + 'locations/' + location_id,
      type: 'GET',
    }).done(function(response){
      console.log(response);
      renderMatchImages(response);
    }).fail(function(jqXHR, textStatus, errorThrow){
          trace(jqXHR, textStatus, errorThrow);
    }).always(function(response){
          trace(response);
    });
  };

  var renderMatchImages = function(matches){
    //template for rendering images, issues getting it going will fix later.
   // var template = Handlebars.compile($('#matchesTemplate').html());
   //    $('#container').html(template({
   //      matches: etags
   //    }));
  //temp fix to get it going
  //etags.map(function(matches){
    matches.map(function(match){
     // debugger;
     // $('#matches').append('<img src="' + match.images.url + '">')
     $('#matches').append('<img src="' + match.url + '">')
      //});
      });
    };
  return{
    run:run
  };
})();

// $(document).ready(function()
// {

// });
