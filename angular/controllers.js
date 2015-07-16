'use strict';
/* Controllers */
var appCtrl = angular.module('app');
 appCtrl.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 });
/*******************************
**                            **
**      HOME CONTROLLER       **
**                            **
********************************/
appCtrl.controller('homeCtrl', ['$scope','$sce', '$rootScope',	function($scope,$sce,$rootScope) {
		$scope.news=null;
		$scope.events=Array();
		$scope.CurrentURL=null;
		$scope.openURL = function(theUrl){
			$scope.CurrentURL=$sce.trustAsResourceUrl(theUrl);
		}
}]);

/*******************************
**                            **
**     EVENTS CONTROLLER      **
**                            **
********************************/
appCtrl.controller('eventsController', ['$scope','$http','$sce',	function($scope,$http,$sce) {
	$scope.events = [];
		$http({
          method : "GET",
          url : "https://www.eventbriteapi.com/v3/events/search/?token=N7GZJ3GGWYMGJFPDHYXQ&organizer.id=1358238579"
      })
		.success(function(d){
    $scope.events = d.events;
  }).error(function(d,e){
    console.log(d,e);
  });
	$scope.openURL = function(theUrl){
    window.open(theUrl,'_blank');
	}
	$scope.goBack = function(){
		window.location='#/';
	}
}]);

appCtrl.filter('html', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

appCtrl.filter('datesplit', function() {
    return function(val) {
    	var date = val.split('T')[0].split('-');
        return date[1]+"/"+date[2]+"/"+date[0];
    };
});

appCtrl.filter('removeNumber', function() {
    return function(val) {
    	var splitValue = val.split('_');
    	if (isNaN(splitValue[0])){
    		return val;
    	}else{
    		splitValue=splitValue.slice(1,splitValue.length);
    		return splitValue.join(" ");
    	}
      
    };
});
appCtrl.filter('timesplit', function() {
    return function(val) {
    
    	var hours24 = parseInt(val.split('T')[1].split(':')[0]);
	var hours = ((hours24 + 11) % 12) + 1;
	var amPm = hours24 > 11 ? 'pm' : 'am';
	var minutes =  parseInt(val.split('T')[1].split(':')[1]);
	if (hours<10){
		hours="0"+hours;
	}
	if (minutes<10){
		minutes="0"+minutes;
	}
	return hours + ':' + minutes +" "+ amPm;
    };
});
/*******************************
**                            **
**    GALLERY CONTROLLER      **
**                            **
********************************/
appCtrl.controller('galleryController', ['$scope','Gallery','$sce','$routeParams','$interval',function($scope,Gallery,$sce,$routeParams,$interval) {
	var galleryFactory = Gallery();
	$scope.gallery = Array();
	$scope.scrollGallery = Array();
if (!$routeParams.name){
/*  FIRST LEVEL IS TO GET ONLY THE GALLERIES ( FOLDERS NAMES AND ONE RANDOM IMAGE FOR EACH FOLDER ) */
	galleryFactory.getGalleries(function(data){
		data.forEach(function(folder){
			var newGallery = {
				title : folder.name,
				url : $sce.trustAsResourceUrl("http://api.sdar.com/gallery/"+folder.name),
				thumbnail :  $sce.trustAsResourceUrl("http://api.sdar.com/gallery/"+folder.name+"/"+folder.thumbnail),
			}
			$scope.gallery.push(newGallery);
		});
		for (var i=0;(i<12)&&(i<$scope.gallery.length);i++){
			$scope.scrollGallery.push($scope.gallery[i]);
		}
	});
		$scope.goBack = function(){
			console.log("fsdafasdsdf back");
			window.location='#/';
		}
}else{
	var folder =$routeParams.name;
/*  SECOND LEVEL IS TO GET ALL PICTURES WITHIN A GALLERY( FOLDERS NAME ) */
	galleryFactory.getGallery(folder,function(data){
		data.forEach(function(image){
			var newImage = {
				url : $sce.trustAsResourceUrl("http://api.sdar.com/gallery/"+folder+"/"+image)
			}
			$scope.gallery.push(newImage);
		});
		for (var i=0;(i<12)&&(i<$scope.gallery.length);i++){
			$scope.scrollGallery.push($scope.gallery[i]);
		}
	});
	$scope.currentPhoto=null;
		$scope.showPhoto = function(index){
			if ( (index<0) || (index>=$scope.gallery.length)) $scope.currentPhoto=null;			
			$scope.currentPhoto=$scope.gallery[index];		
			$scope.currentPhoto.index=index;
		}
		$scope.goBackGallery = function(){
			window.location='#/gallery';
		}
}
$scope.showGallery = function(folder) {
	window.location='#/gallery/'+folder;
}
	$scope.paginateImages = function(){
    var last = $scope.scrollGallery.length;
    for(var i = 0; i < 4; i++) {
			if ($scope.gallery[last + i]){
	      $scope.scrollGallery.push($scope.gallery[last + i]);
			}
    }
	}

	
}]);

/**************************************************
**                                   					   **
**    DOCUMENTS/JUSTKNOCK/BENEFITS CONTROLLER    **
**                              					       **
***************************************************/
appCtrl.controller('documentsController', ['$scope','$sce','Documents','$document',function($scope,$sce,Documents,$document) {
	$scope.marginImageJustKnockWidth=(window.innerWidth-1100)/2+"px";
	$scope.currentPDF=null;
	$scope.CurrentURL=null;
	$scope.currentContent=null;

	var galleryFactory = Documents();
	$scope.documents = Array();
	$scope.scrollDocuments = Array();

	galleryFactory.getDocuments(function(data){
		data.forEach(function(document){
			var newDocument = {
				title : document.slice(0,document.length-4),
				url : $sce.trustAsResourceUrl("http://api.sdar.com/documents/"+document)
			}
			$scope.documents.push(newDocument);
		});
		for (var i=0;(i<16)&&(i<$scope.documents.length);i++){
			$scope.scrollDocuments.push($scope.documents[i]);
		}
	});
	$scope.goBack = function(){
		window.location='#/';
	}
	$scope.openURL = function(theUrl){
		$scope.currentContent=null;
		$scope.CurrentURL=$sce.trustAsResourceUrl(theUrl);
	}	
	$scope.openContent = function(content){
		console.log($scope.currentContent);
		$scope.currentContent=content;
		console.log($scope.currentContent);
	}
	$scope.showDocument = function(doc){
		$scope.currentPDF=doc;
	}

	$scope.paginateDocuments = function(){
    var last = $scope.scrollDocuments.length;
    console.log(last);
    for(var i = 0; i < 4; i++) {
			if ($scope.documents[last + i]){
	      $scope.scrollDocuments.push($scope.documents[last + i]);
			}
    }
	}
	$scope.printPDF = function(url){
    var w = window.open(url);
    w.print();
	}
}]);
/*******************************
**                            **
**      VIDEOS CONTROLLER     **
**                            **
********************************/
appCtrl.controller('videosController', ['$scope','$sce','Videos','$http',function($scope,$sce,Videos,$http) {
	var videosFactory = Videos();
  $scope.currentVideo = null;
	$scope.videos = Array();
	videosFactory.getVideos(function(data){
    console.log(data);
		data.items.forEach(function(d){
      $scope.videos.push({
        id: d.snippet.resourceId.videoId,
        title: d.snippet.title,
        description: d.snippet.description,
        thumbnail: $sce.trustAsResourceUrl(d.snippet.thumbnails.high.url)
      });
    });
	});

  $scope.playVideo = function(id) {
    var url = "https://www.youtube.com/embed/" + id + "?autoplay=1";
    $scope.currentVideo = $sce.trustAsHtml('<iframe id="ytplayer" type="text/html" width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen>');
  }
        
	$scope.goBack = function(){
		window.location='#/';
	}
}]);

/*******************************
**                            **
**       NEWS CONTROLLER      **
**                            **
********************************/
appCtrl.controller('newsController', ['$scope','$sce','RealtorNews',function($scope,$sce,RealtorNews) {
        var newsFactory = RealtorNews();
	$scope.realtornews = Array();
	newsFactory.getRNews(function(data){
		data.forEach(function(rnews){
			var newRNews = {
				title : rnews.slice(0,rnews.length-4),
				thumbnail : rnews.slice(0,rnews.length-4) + ".jpg"
			}
			$scope.realtornews.push(newRNews);
		});
	});

        $scope.showDocument = function(doc){
		$scope.currentPDF=$sce.trustAsResourceUrl('http://api.sdar.com/rnews/' + doc + '.pdf');
	}
        $scope.goBack = function(){
		window.location='#/';
	}
}]);

/*******************************
**                            **
**      ADMIN CONTROLLER      **
**                            **
********************************/
appCtrl.controller('adminController', ['$scope','$interval','Gallery','News','Documents','RealtorNews',function($scope,$interval,Gallery,News,Documents,RealtorNews) {
	$scope.loading = false;
	/***********/
	/* Gallery */
	/***********/
	var galleryFactory = Gallery();
	galleryFactory.getGallery(function(data){
		$scope.gallery = data;
	});
	$scope.removeFromGallery = function(index){
		if (confirm("Are you sure you want to remove?")){
			galleryFactory.removeFromGallery(index,function(data){
				if (data == "Removed"){
					galleryFactory.getGallery(function(data){
						$scope.gallery = data;
					});
				}else{
					console.log("Error");
				}
			});				
		}
	}

	$scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': 'http://api.sdar.com/touchGallery.php',
    },
    'eventHandlers': {
      'complete' : function (file){
				galleryFactory.getGallery(function(data){
					$scope.gallery = data;
					$scope.loading = false;
				});
      },
      'error' : function(error){
      	console.log("Error",error);
      }
    }
	};

	/********/
	/* News */
	/********/
	$scope.newNew = "";
	var newsFactory = News();
	newsFactory.getNews(function(data){
		$scope.news = data;
	});
	$scope.pushNew = function(){		
    newsFactory.pushNew($scope.newNew,function(newNew){					
    	console.log(newNew);		
			newsFactory.getNews(function(data){
				console.log(data);
				$scope.news = data;
			});
		});
	}
	$scope.removeFromNews = function(index){
		if (confirm("Are you sure you want to remove?")){
			newsFactory.removeFromNews(index,function(data){
				console.log(data);
				if (data == "Removed"){
					newsFactory.getNews(function(data){
						$scope.news = data;
					});
				}else{
					console.log("Error");
				}
			});				
		}
	}
	$scope.toggleActivation = function(index){
		newsFactory.toggleActivation(index,function(data){
		console.log(data);
			newsFactory.getNews(function(data){
				$scope.news = data;
			});
		});				
	}

	/****************/
	/* Realtor News */
	/****************/
	$scope.newRNews = "";
	var rnewsFactory = RealtorNews();
	rnewsFactory.getRNews(function(data){
		$scope.RNews = data;
	});
	$scope.removeFromRNews = function(filename){
		if (confirm("Are you sure you want to remove?")){
			rnewsFactory.removeFromRNews(filename,function(data){
				if (data == "Removed"){
					rnewsFactory.getRNews(function(data){
						$scope.RNews = data;
					});
				}else{
					console.log("Error");
				}
			});				
		}
	}
	$scope.rnewsDropzone = {
    'options': { // passed into the Dropzone constructor
      'url': 'http://api.sdar.com/touchRNews.php',
    },
    'eventHandlers': {
    	'addedfile' : function(){
					$scope.loading = true;
    	},
      'complete' : function (file){
      	console.log("file",file);
				rnewsFactory.getRNews(function(data){
					$scope.RNews = data;
					$scope.loading = false;
				});
				 //$scope.rnewsDropzone.removeFile(file);
      },
      'error' : function(error){
      	console.log("Error",error);
      }
    }
	};
	/*************/
	/* Documents */
	/*************/
	var documentsFactory = Documents();
	$scope.documents = "";
	documentsFactory.getDocuments(function(data){
		$scope.documents = data;
	});
	$scope.removeFromDocuments = function(index){
		if (confirm("Are you sure you want to remove?")){
			documentsFactory.removeFromDocuments(index,function(data){
				console.log(data);
				if (data == "Removed"){
					documentsFactory.getDocuments(function(data){
						$scope.documents = data;
					});
				}else{
					console.log("Error");
				}
			});				
		}
	}
	$scope.documentsDropzone = {
    'options': { // passed into the Dropzone constructor
      'url': 'http://api.sdar.com/touchDocuments.php'
    },
    'eventHandlers': {
    	'addedfile' : function(){
					$scope.loading = true;
    	},
      'complete' : function (file){
				documentsFactory.getDocuments(function(data){
					$scope.documents = data;
					$scope.loading = false;
				});
      },
      'error' : function(error){
      	console.log("Error",error);
      }
    }
	};
}]);


/*
appCtrl.filter('active', function() {
  return function(input) {
    return (input==true ?  : '\u2718';
  };*/