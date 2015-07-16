'use strict';
var app = angular.module('app');

/*	****************

	Simple Square link Directive

	**************** */

app.directive('mySquare', function(){
	return {
		restrict: 'E',
		templateUrl:'partials/square.html'
,		link: function(scope, elm, attrs) {
			var color=attrs.color;
			var image=attrs.image;
			var type=attrs.type;
			var title=attrs.title;
			var link=attrs.link;
			var clock=attrs.clock;
			var blank=attrs.blank;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color,
				'background-image':'url('+image+')',
				'background-repeat':'no-repeat',
				'background-position':'50% 33%',
				'background-size':'70px'
			});
			$(elm).html("<p>"+title+"<p>");
			if (link){
				$(elm).click(function(){
					window.location='#/'+link;
				});
			}
			if (blank) {
				$(elm).click(function(){
					window.open(blank,'_blank');
				});
			}
		}
	}
});

/*	****************

	Weather Directive

	**************** */

app.directive('theWeather', function(){
	return {
		restrict: 'E',
		templateUrl:'partials/square.html'
,		link: function(scope, elm, attrs) {


			if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    } else { 
		        console.log("Geolocation is not supported by this browser.");
		    }

		    function showPosition(position) {		    	
				var weatherKEY='a4a9dafccc3f487b';
				var url = 'http://api.wunderground.com/api/'+weatherKEY+'/conditions/q/'+location+'.json';
			    var location = position.coords.latitude+','+position.coords.longitude;
			    $.ajax({ 
				url : 'http://api.wunderground.com/api/'+weatherKEY+'/geolookup/conditions/q/'+location+'.json', 
				dataType : "jsonp", 
				success : function(parsed_json) { 
					var location = parsed_json['location']['city']; 
					var temp_f = parsed_json['current_observation']['temp_f']; 
					var image = parsed_json['current_observation']['icon_url'];
					var feels_like = parsed_json['current_observation']['feelslike_f'];
					var city = parsed_json['current_observation']['display_location']['city'] + ',' + parsed_json['current_observation']['display_location']['state'];
					
					var title = city + ' Feels like:' + Math.round(parseInt(feels_like),0)  + '&#176;f'; 
					$(elm).find("span").html("<p>"+title+"<p>");
					$(elm).find("span").append("<div id='clock'></div>");			
					$(elm).find("span").append("<div class='weather'><div><img src='"+image+"'></div><div>"+Math.round(parseInt(temp_f),0) + "&#176;f"+"</div></div>");
					$(elm).find("#clock").FlipClock({
						clockFace: 'TwentyFourHourClock'
					});
				} 
				});
			}
			

			var color=attrs.color;
			var type=attrs.type;
			var title=attrs.title;
			var link=attrs.link;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color
			});
			$(elm).click(function(){
				window.location='#/'+link;
			});



		}
	}
});

/*	****************

	Time Directive

	**************** */

app.directive('theTime', function(){
	return {
		restrict: 'E',
		templateUrl:'partials/square.html'
,		link: function(scope, elm, attrs) {
			var color=attrs.color;
			var image=attrs.image;
			var type=attrs.type;
			var title=attrs.title;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color,
				'background-image':'url('+image+')',
				'background-repeat':'no-repeat',
				'background-position':'50% 50%',
				'background-size':'70px'
			});
			$(elm).find("span").html(title);
			$(elm).find("span").append("<div id='clock'></div>");			
			$(elm).find("#clock").FlipClock({
				clockFace: 'TwentyFourHourClock'
			});
			$(elm).click(function(){
				window.location='#/'+link;
			})
		}
	}
});

/*	****************

	News Ticker

	**************** */

app.directive('theNews', ['$interval','News',function($interval,News){
	return {
		restrict: 'E',
		templateUrl:'partials/marquee.html',
		link: function(scope, elm, attrs) {	
			scope.news = "";
			var newsFactory = News();
			newsFactory.getNews(function(data){
				scope.news = data;
			});
			$interval(function(){
				newsFactory.getNews(function(data){
					scope.news = data;
				});
			},600000);
		}	
	}
}]);

/*	****************

	Photo Gallery

	**************** */

app.directive('photoGallery', ['$interval','Gallery','$http','$sce',function($interval,Gallery,$http,$sce){
	return {
		restrict: 'E',
		templateUrl:'partials/square.html'
,		link: function(scope, elm, attrs) {		
			var color=attrs.color;
			var type=attrs.type;
			var title=attrs.title;
			var link=attrs.link;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color,
				'background-repeat':'no-repeat',
				'background-position':'50% 33%',
				'background-size':'cover'
			});

			$(elm).find("span").html("<p>"+title+"<p>");
			$(elm).click(function(){
				window.location='#/'+link;
			});

			var galleryFactory = Gallery();

			galleryFactory.getRandomImage(function(data){
				$(elm).css({
						'background-image':"url('"+$sce.trustAsResourceUrl('http://api.sdar.com/gallery/'+data)+"')"
				});
			});

			$interval(function(){
				galleryFactory.getRandomImage(function(data){
					$(elm).css({
						'background-image':"url('"+$sce.trustAsResourceUrl('http://api.sdar.com/gallery/'+data)+"')"
					});
				});
			},5000);
		}
	}
}]);

/*****************

	One Photo Directive

	**************** */

app.directive('myPhoto', function(){
	return {
		restrict: 'E',
		templateUrl:'partials/square.html',
		link: function(scope, elm, attrs) {
			var color=attrs.color;
			var image=attrs.image;
			var type=attrs.type;
			var title=attrs.title;
			var link=attrs.link;
			var id=attrs.index;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color,
				'background-image':'url('+image+')',
				'background-repeat':'no-repeat',
				'background-position':'50% 33%',
				'background-size':'cover'
			});
			$(elm).find("span").html(title);
		}
	}
});

/*****************

	Get Social Directive

	**************** */

app.directive('getSocial', function(){
	return {
		restrict: 'E',
		templateUrl:'partials/getSocial.html',
		link: function(scope, elm, attrs) {
			var color=attrs.color;
			var type=attrs.type;
			var title=attrs.title;
			var link=attrs.link;
			var id=attrs.index;

			$(elm).addClass('span-'+type);
			$(elm).css({
				'background-color':color,
				'background-repeat':'no-repeat',
				'background-position':'50% 33%',
				'background-size':'cover'
			});
      scope.title = title;
      scope.socialmedia = [{
        name: "Facebook",
        icon: "http://api.sdar.com/assets/facebook-icon.png",
        link: "https://www.facebook.com/RealtorsSD"
      },{
        name: "Twitter",
        icon: "http://api.sdar.com/assets/twitter-icon.png",
        link: "https://twitter.com/realtorssd"
      },{
        name: "Google+",
        icon: "http://api.sdar.com/assets/google-icon.png",
        link: "https://plus.google.com/112707606738948358944/posts"
      },{
        name: "Youtube",
        icon: "http://api.sdar.com/assets/youtube-icon.png",
        link: "https://www.youtube.com/user/RealtorsSD"
      },{
        name: "Linkedin",
        icon: "http://api.sdar.com/assets/linkedin-icon.png",
        link: "https://www.linkedin.com/company/greater-san-diego-association-of-realtors-"
      }];
		}
	}
});

/*	****************

	Drop Zone

	**************** */

app.directive('dropzone',[ function () {
  return function (scope, element, attrs) {
    var config, dropzone;
    
    config = scope[attrs.dropzone];
 
    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);
 
    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
	}
}]);