  angular.module('starter.controllers', ['Services', 'ngCordova', 'ionic', 'ionic-material', 'ion-profile-picture'])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $http, $window, $rootScope, $cordovaGeolocation, $interval, $ionicPopup) {
      $scope.username = $localStorage.username;
      $scope.userId = $localStorage.userId;
      $scope.logout = function () {
        $localStorage.session = 0;
        $localStorage.accessToken = 0;
        $window.location.href = "#/login";
      }
      document.addEventListener('deviceready', function () {
        //cordova.plugins.backgroundMode.enable();

        cordova.plugins.backgroundMode.setDefaults({
          silent: true
        });
        cordova.plugins.backgroundMode.enable();
        // cordova.plugins.backgroundMode.disableWebViewOptimizations();

        //$ionicPopup.alert({ template:'backgroundMode enable'});
        var promise;
        $scope.items = []
        cordova.plugins.backgroundMode.on('activate', function () {
          // $interval($scope.startloop, 5000);
          // cordova.plugins.notification.badge.increase();
          // $scope.startloop();
          console.log('background mode activated !!!');
          cordova.plugins.backgroundMode.disableWebViewOptimizations();
          cordova.plugins.backgroundMode.disableBatteryOptimizations();
          // cordova.plugins.backgroundMode.moveToBackground();

          if ($rootScope.statusstart == "START") {
            //$ionicPopup.alert({ template:$rootScope.statusstart});
            //$ionicPopup.alert({ template:'backgroundMode start'});
            $scope.startloop();
          }
          if ($rootScope.statusstop == "STOP") {
            //$ionicPopup.alert({ template:$rootScope.statusstop});
            //$ionicPopup.alert({ template:'backgroundMode stop'});

            $scope.stoploop();
          }


        });
      }, false)
      var mainloop;
      $scope.startloop = function () {
        if (angular.isDefined(mainloop)) return;
        ///$ionicPopup.alert({ template: 'location started'});
        mainloop = $interval(function () {

          var options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
          };

          $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            console.log('position', position);
            latlong = {
              'lat': position.coords.latitude,
              'long': position.coords.longitude
            };
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            console.log('navigator ok :' + lat + ' ' + lng);
            $rootScope.currentLocation = latlong;
            $scope.latlanpush = {};
            $scope.latlanpush.action = "track_order";
            $scope.latlanpush.userId = $localStorage.id;
            $scope.latlanpush.accessToken = $localStorage.accessToken;
            $scope.latlanpush.invoice_id = $localStorage.Order_ID;
            $scope.latlanpush.lat = lat;
            $scope.latlanpush.lang = lng;
            $scope.latlanpush.mode = "user";
            $scope.latlanpush.deviceinfo = "test";
            $scope.latlanpush.imei = "356872067678229";
            console.log("latlanpush req--" + JSON.stringify($scope.latlanpush));
            $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.latlanpush).then(function (response) {
              //  console.log("latlanpush retunrdata" + JSON.stringify(response.data));
              if (response.data.status == "SUCCESS") {} else { //$scope.spin = false;
              }
            }, function (err) {
              console.log("error" + JSON.stringify(err));
            })


          }, function (err) {});
          cordova.plugins.notification.badge.increase();
        }, 3000);
      };

      $scope.stoploop = function () {
        console.log("stosplooplatandlang");
        //$ionicPopup.alert({ template: 'location stoped'});
        if (angular.isDefined(mainloop)) {
          $interval.cancel(mainloop);
          mainloop = undefined;
        }
      };

      $scope.$on('$destroy', function () {
        $scope.stoploop();
      });

    })

    .controller('completedetailCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner, $cordovaGeolocation, $rootScope) {



      $scope.Order_ID = $state.params.Order_ID;
      // $rootScope.Order_ID=$scope.Order_ID;
      //console.log("Order_ID" + JSON.stringify($rootScope.Order_ID));
      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "orderDetails";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.Order_ID;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.orderdetalistprod = response.data.Response[0].prod;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });
      $scope.openPopup = function (design_img) {
        $scope.design_img = design_img;
        var customTemplate =
          '<div class="statspopupbox"><div class="cls_rwe54s692f6"><i  class=" icon ion-plus sapn_pandf_tyhhdf485"  ng-click="fnzoom(+10)"></i><i ng-click="fnzoom(-10)" class="icon ion-minus sapn_pandf_tyhhdf485"  ></i> </div>' +
          '<img id="imgpopp" ng-src="{{design_img}}" class="statspopupbox_iamgs"/>' + ' </div>';

        $ionicPopup.show({
          template: customTemplate,
          title: '<p class="daspp"> Image </p>',
          scope: $scope,
          buttons: [{
            text: 'Close',
            type: 'bior_burt_cskkfg',
            onTap: function (e) {

            }

          }]
        });
      }

      $scope.fnzoom = function (val) {

        var width = parseInt(angular.element(document.getElementById("imgpopp").clientWidth)[0]) + val;
        var height = parseInt(angular.element(document.getElementById("imgpopp").clientHeight)[0]) + val;
        angular.element(document.getElementById("imgpopp")).css('width', width + 'px');
        angular.element(document.getElementById("imgpopp")).css('height', height + 'px');

      };

      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };


      $scope.deliverypri = {};
      $scope.deliverypri.action = "getOrderprice";
      $scope.deliverypri.reject_reasn = "";
      $scope.deliverypri.order_price = "";
      // $scope.deliverypri.order_price.push($scope.deliverypri.order_price);
      $scope.deliveryprice = function () {
        $scope.deliverypri.userId = $localStorage.id;
        $scope.deliverypri.order_id = $scope.Order_ID;
        $scope.deliverypri.accessToken = $localStorage.accessToken;

        $scope.deliverypri.lat = "";
        $scope.deliverypri.lang = "";
        $scope.deliverypri.mode = "user";
        $scope.deliverypri.deviceinfo = "test";
        $scope.deliverypri.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypri req--" + JSON.stringify($scope.deliverypri));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypri).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));

          if (response.data.status == "SUCCESS") {
            //$scope.Orderid = $scope.Order_ID;
            $localStorage.Order_ID = response.data.Response;
            console.log("orderid req" + JSON.stringify($scope.Order_ID));


            console.log("Order_ID" + JSON.stringify($scope.Orderid));
            //$scope.statusstart="START";
            $rootScope.statusstart = "START";
            var alertPopup = $ionicPopup.alert({
              template: '<center>Payment Request sent to user</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
            $scope.checktrack();
            if (response.data.status == "FAILED") {

              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }




      console.log("latlanpush" + JSON.stringify($rootScope.latitude));

      $scope.latlanpush = {};

      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)

        .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '   ' + long)


          $rootScope.latitude = lat;
          $rootScope.langitude = long;


          console.log("latitude" + JSON.stringify($rootScope.latitude));
        }, function (err) {
          console.log(err)
        });

      var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        null,

        function (err) {
          console.log(err)
        },

        function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '' + long)
        }
      );

      watch.clearWatch();


      $scope.checktrack = function () {
        $scope.latlanpush.action = "track_order";
        $scope.latlanpush.userId = $localStorage.id;
        $scope.latlanpush.accessToken = $localStorage.accessToken;
        $scope.latlanpush.invoice_id = $scope.Order_ID;
        $scope.latlanpush.lat = $scope.latitude;
        $scope.latlanpush.lang = $scope.langitude;
        $scope.latlanpush.mode = "user";
        $scope.latlanpush.deviceinfo = "test";
        $scope.latlanpush.imei = "356872067678229";
        $scope.spin = true;

        console.log("latlanpush req--" + JSON.stringify($scope.latlanpush));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.latlanpush).then(function (response) {
          console.log("latlanpush retunrdata" + JSON.stringify(response.data));
          //  $scope.spin = false; 
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $localStorage.Order_ID = $scope.latlanpush.invoice_id;
            console.log("orderid req" + JSON.stringify($localStorage.Order_ID));
            $rootScope.statusstart = "START";
            console.log("startloop" + JSON.stringify($rootScope.statusstart));
            $window.location.href = "#/app/home";
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          } else {
            $scope.spin = false;
            $scope.hider = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }

      $scope.hmload = function () {
        $scope.spin = true;
        $window.location.href = "#/app/home";
        $window.location.reload();

        $scope.spin = false;
      }
    })
    .controller('loginCtrl', function ($scope, $stateParams, $http, $localStorage, $window, $ionicLoading, $ionicPopup, $rootScope, helper, $cordovaGeolocation) {
      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Please fill details!</center>'
        });
      };
      $scope.loginData = {};



      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)

        .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '   ' + long)


          $rootScope.latitude = lat;
          $rootScope.langitude = long;


          console.log("latitude" + JSON.stringify($rootScope.latitude));
        }, function (err) {
          console.log(err)
        });

      var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        null,

        function (err) {
          console.log(err)
        },

        function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '' + long)
        }
      );

      watch.clearWatch();



      $scope.loginData.action = "login";
      $scope.loginData.username = "";
      $scope.loginData.password = "";
      //$scope.loginData.pin = "";
      $scope.loginData.mode = "user";
      $scope.login = function (v1, v2) {
        $scope.loginData.lang = $scope.langitude;
        $scope.loginData.lat = $scope.latitude;
        $scope.loginData.deviceinfo = "test";
        $scope.loginData.imei = "356872067678229";
        $scope.spin = true;
        if (v1 && v2) {
          console.log("login req--" + JSON.stringify($scope.loginData));
          $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.loginData).then(function (response) {
            console.log("retunrdata" + JSON.stringify(response.data));
            console.log("login req--" + JSON.stringify($scope.loginData));
            if (response.data.status == "SUCCESS") {
              $localStorage.session = 1;
              $window.location.href = "#/app/home";
              $localStorage.id = response.data.Response.id;
              $localStorage.accessToken = response.data.accessToken;
              $localStorage.delivery_agent_id = response.data.Response.delivery_agent_id;
              $localStorage.branch = response.data.Response.branch;
              console.log("login req--" + JSON.stringify($localStorage.accessToken));
              $scope.spin = false;

            } else {
              $scope.spin = false;
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }
          }, function (err) {
            console.log("err--" + JSON.stringify(err));
            $scope.spin = false;
            $scope.showprob();
          })
        } else {
          $scope.showAlert();
          $scope.spin = false;
        }
      }


      $scope.skip = function () {
        var data = JSON.stringify({
          "status": "SUCCESS",
          "Message": "Login Success",
          "Response": {
            "response": [{
              "sname": "sunriseuniversal",
              "id": "0",
              "first_name": "user",
              "email_id": "user@gmail.com",
              "mobile_number": "8989898989",
              "oid": "402",
              "accessToken": 181694843
            }]
          }
        });
        $scope.loginDataskip = JSON.parse(data);
        $localStorage.session = 1;
        $localStorage.userId = $scope.loginDataskip.Response.response[0].id;
        $localStorage.sname = $scope.loginDataskip.Response.response[0].sname;
        $localStorage.oid = $scope.loginDataskip.Response.response[0].oid;
        $localStorage.email = $scope.loginDataskip.Response.response[0].email_id;
        $localStorage.address1 = $scope.loginDataskip.Response.response[0].mobile_number;
        $localStorage.accessToken = $scope.loginDataskip.Response.response[0].accessToken;
        $scope.spin = false;
        console.log("userId req--" + JSON.stringify($localStorage.userId));
        $window.location.href = "#/app/home";

      }
    })
    .controller('signupCtrl', function ($scope, $state, $stateParams, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, helper, $window, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet, $filter, $cordovaGeolocation) {
      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };


      $scope.signup = {};


      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)

        .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '   ' + long)


          $rootScope.latitude = lat;
          $rootScope.langitude = long;


          console.log("latitude" + JSON.stringify($rootScope.latitude));
        }, function (err) {
          console.log(err)
        });

      var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        null,

        function (err) {
          console.log(err)
        },

        function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '' + long)
        }
      );

      watch.clearWatch();




      $scope.signup.action = "registerdelivery";
      $scope.signup.idddd = 1;
      $localStorage.session = 0;
      $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Some details are missing!</center>'
        });
      };
      $scope.showerr = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Something went wrong</center>'
        });
      };
      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      }
      $scope.create = function () {
        $scope.signup.deviceinfo = "test";
        $scope.signup.imei = "356872067678229";
        $scope.signup.mode = "user";
        $scope.signup.lang = $scope.langitude;
        $scope.signup.lat = $scope.latitude;
        var re = /\S+@\S+\.\S+/;
        if (!(re.test($scope.signup.email))) {
          var alertPopup = $ionicPopup.alert({
            template: '<center>Not valid Email id </center>'
          });
          return false;
        }
        /*	 var len = ( $scope.signup.mobileNumber+"").length;
        	 if(len != 10  ){var alertPopup = $ionicPopup.alert({template:'<center> Mobile number must be 10 character </center>'}); return false; }*/
        if ($scope.signup.user_name && $scope.signup.password && $scope.signup.email && $scope.signup.addreess && $scope.signup.mobile) {
          console.log("req" + JSON.stringify($scope.signup));
          $scope.spin = true;
          $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.signup).then(function (result) {
            console.log(" signup req--" + JSON.stringify($scope.signup));
            console.log(" signup res--" + JSON.stringify(result));

            console.log("res" + JSON.stringify(result.data));
            if (result.data.status == "SUCCESS") {
              $localStorage.rfname = $scope.signup.firstName;
              $localStorage.accessToken = result.data.Token;
              $window.location.href = "#/login";
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + result.data.Message + '</center>'
              });
              $scope.spin = false;
            } else {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + result.data.Message + '</center>'
              });;
              $scope.spin = false;
            }
          }, function (err) {
            console.log("error" + JSON.stringify(err));
            $scope.showprob();
            $scope.spin = false;
          });
        } else {
          $scope.showAlert();
          $scope.spin = false;
        }
      }



      var options = {
        componentRestrictions: {
          country: "in"
        }
        //componentRestrictions: {country: data.country}
      };
      var from_el = document.getElementById('autocompletefrom');

      var places = new google.maps.places.Autocomplete(from_el, options);
      google.maps.event.addListener(places, 'place_changed', function () {
        var place = places.getPlace();
        $scope.$apply(function () {
          $scope.signup.addreess = place.formatted_address;
          // $scope.catepr.lat = place.geometry.location.lat();
          //$scope.catepr.lng = place.geometry.location.lng();
        });

        $scope.start_box_copy = angular.copy($scope.pickupaddreess);

      });
    })
    .controller('homeCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $interval, $cordovaGeolocation) {

      $scope.stloop = function () {
        $scope.spin = true;
        $rootScope.statusstart = "START";
        console.log("lang" + JSON.stringify($rootScope.statusstart));
        $scope.spin = false;
      }
      $scope.stopesloop = function () {
        $scope.spin = true;
        $rootScope.statusstop = "STOP";
        console.log("lang" + JSON.stringify($rootScope.statusstop));
        $scope.spin = false;
      }

      var mainloop;

      // $scope.startloop = function () {
      //   if (angular.isDefined(mainloop)) return;
      //   mainloop = $interval(function () {

      //     var options = {
      //       enableHighAccuracy: true,
      //       maximumAge: 0,
      //       timeout: 3000
      //     };

      //     $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      //       latlong = {
      //         'lat': position.coords.latitude,
      //         'long': position.coords.longitude
      //       };
      //       $rootScope.currentLocation = latlong;

      //       var lat = position.coords.latitude;
      //       var lng = position.coords.longitude;

      //       $scope.lat = lat;
      //       $scope.lang = lng;
      //       console.log("lat" + JSON.stringify($scope.lat));
      //       console.log("lang" + JSON.stringify($scope.lang));
      //       $ionicPopup.alert({
      //         template: lat
      //       });
      //     }, function (err) {});

      //   }, 3000);
      // };

      $scope.startloop = function () {
        console.log("jello umagn")
        if (angular.isDefined(mainloop)) return;
        mainloop = $interval(function () {
          var watchOptions = {
            timeout: 300000,
            enableHighAccuracy: false
          };
          var watch = $cordovaGeolocation.watchPosition(watchOptions);
          // console.log('watch',watch);
          watch.then(
            null,

            function (err) {
              console.log(err)
            },

            function (position) {
              console.log('position', position);
              var lat = position.coords.latitude
              var long = position.coords.longitude
              console.log(lat + '' + long)

              $ionicPopup.alert({
                template: lat
              });
            }
          );

          // watch.clearWatch();


        })
      };

      $scope.stoploop = function () {
        if (angular.isDefined(mainloop)) {
          $interval.cancel(mainloop);
          mainloop = undefined;
        }
      };

      $scope.$on('$destroy', function () {
        $scope.stoploop();
      });

      $scope.wallet = function () {
        $scope.spin = true;
        $window.location.href = "#/app/wallet";
        $window.location.reload();

        $scope.spin = false;
      }

      $scope.homecomplete = function () {
        $scope.spin = true;
        $window.location.href = "#/app/homecomplete";
        $window.location.reload();

        $scope.spin = false;
      }
      $scope.accepteddelivery = function () {
        $scope.spin = true;
        $window.location.href = "#/app/accepteddelivery";
        $window.location.reload();

        $scope.spin = false;
      }
      $scope.completeddelivery = function () {
        $scope.spin = true;
        $window.location.href = "#/app/completeddelivery";
        $window.location.reload();

        $scope.spin = false;
      }
      $scope.Mydeliverys = function () {
        $scope.spin = true;
        $window.location.href = "#/app/Mydeliverys";
        $window.location.reload();

        $scope.spin = false;
      }
      /*$scope.searchData = {};
	$scope.spin = true;
$scope.delivery = {};
$scope.spin = true;
	  $scope.delivery.action = "delivery_packages";
	  $scope.delivery.branch = $localStorage.branch;
	  $scope.delivery.delivery_id = $localStorage.id;
      $scope.delivery.accessToken = $localStorage.accessToken;
	  $scope.delivery.lang = "";
  	$scope.delivery.lat = "";
	$scope.delivery.mode="user";
	$scope.delivery.deviceinfo="test";
	$scope.delivery.imei="356872067678229";
       $scope.spin = true;

	console.log("login req--" + JSON.stringify($scope.delivery));
           $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
			     console.log("retunrdata" + JSON.stringify(response.data));
                if (response.data.status == "SUCCESS") {
					 $scope.spin = false; 
					$scope.deliverylist = response.data.Response;
					
if(response.data.status == "FAILED" || response.data.Response.delivery_status == "Delivered" || response.data.Response.delivery_status == "Delivery Rejected"){
			 $scope.spin = false;
			 $scope.hider = true;
		}else
		{$scope.hiderr = true;
		 $scope.spin = false;
		 $scope.hider = false;}
		} else {$scope.spin = false;
				 $scope.hider = true;
				 } }, function (err) {console.log("error" + JSON.stringify(err));});
				 
				 
				 
				 $scope.dddr = {};
		$scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
           $scope.dddr.mobile=imageData.text;
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);

            $window.location.href = "#/app/paymoneytoboss/" + $scope.dddr.mobile;

        }, function (error) {
            console.log("An error happened -> " + error);
        });
    };
	$scope.scarcode = function () {
	$window.location.reload();
	}*/
    })
    .controller('payqrwaiterCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $state) {

      $scope.getdatas = $state.params.getdatas;
      console.log("getdatas req--" + JSON.stringify($scope.getdatas));
      var str = $scope.getdatas;
      /*8798hu78888888~9894168681~80.09*/
      var charsArray = str.split('~');
      var objects = [];
      for (var i = 0; i < str.length; i++) {
        var objProps = str[i].split('~');
        var myObj = {};
        myObj.name = objProps[0];
        myObj.mobile = objProps[1];
        myObj.id = objProps[2];
        objects.push(myObj);
      }


      $scope.qrpay = {};
      $scope.qrpay.action = "getAcceptorders";
      $scope.qrpay.userId = $localStorage.id;
      $scope.qrpay.accessToken = $localStorage.accessToken;
      $scope.qrpay.lang = "";
      $scope.qrpay.lat = "";
      $scope.qrpay.mode = "user";
      $scope.qrpay.deviceinfo = "test";
      $scope.qrpay.imei = "356872067678229";
      $scope.qrpay.name = charsArray[0];
      $scope.qrpay.mobile = charsArray[1];
      $scope.qrpay.id = charsArray[2];
      $scope.spin = true;

      $scope.qrpayfunc = function () {

        $scope.spin = true;
        console.log("qrpay req--" + JSON.stringify($scope.qrpay));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.qrpay).then(function (result) {
          console.log("qrpay req--" + JSON.stringify($scope.qrpay));
          console.log("qrpay res--" + JSON.stringify(result.data));
          $scope.spin = false;
          if (result.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.waletresul = result.data;
            $window.location.href = "#/app/quicksendconfirmpurchasepay/" + $scope.token + "/" + $scope.waltrans.amount + "/" + $scope.waltrans.mobile;
          }

          if (result.data.status == "FAILED") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + result.data.Message + '</center>'
            });
            $scope.spin = false;
          } else {}
        }, function (err) {
          $scope.showprob();
        });

      }
    })
    .controller('accepteddeliveryCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $interval) {
      $scope.ddr = {};
      $scope.scanBarcodepay = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $scope.ddr.getdatas = imageData.text;
          console.log("Barcode Format -> " + imageData.format);
          console.log("Cancelled -> " + imageData.cancelled);

          $window.location.href = "#/app/payqrwaiter/" + $scope.ddr.getdatas;

        }, function (error) {
          console.log("An error happened -> " + error);
        });
      };

      $scope.delivery = {};
      $scope.acceptwaiter = function () {
        $scope.delivery.action = "getAcceptorders";
        $scope.delivery.userId = $localStorage.id;
        $scope.delivery.accessToken = $localStorage.accessToken;
        $scope.delivery.lang = "";
        $scope.delivery.lat = "";

        $scope.delivery.mode = "user";
        $scope.delivery.deviceinfo = "test";
        $scope.delivery.ordermode = "waiter";
        $scope.delivery.imei = "356872067678229";
        $scope.spin = true;

        console.log("login req--" + JSON.stringify($scope.delivery));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliverylist = response.data.Response;
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hiders = true;
            } else {
              $scope.hiderrs = true;
              $scope.spin = false;
              $scope.hiders = false;
            }
          } else {
            $scope.spin = false;
            $scope.hiders = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }

      //$interval(function () {
      $scope.acceptwaiter();
      //}, 2000);			 




      $scope.deliveryshop = {};
      $scope.acceptshopping = function () {
        $scope.deliveryshop.action = "getAcceptorders";
        $scope.deliveryshop.userId = $localStorage.id;
        $scope.deliveryshop.accessToken = $localStorage.accessToken;
        $scope.deliveryshop.lang = "";
        $scope.deliveryshop.lat = "";
        $scope.deliveryshop.mode = "user";
        $scope.deliveryshop.deviceinfo = "test";
        $scope.deliveryshop.ordermode = "shopping";
        $scope.deliveryshop.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliveryshop req--" + JSON.stringify($scope.deliveryshop));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliveryshop).then(function (response) {
          console.log("deliveryshop" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliveryshoplist = response.data.Response;
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hidersp = true;
            } else {
              $scope.hiderrsp = true;
              $scope.spin = false;
              $scope.hidersp = false;
            }
          } else {
            $scope.spin = false;
            $scope.hidersp = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }

      $interval(function () {
        $scope.acceptshopping();
      }, 2000);



      $scope.deliverypers = {};
      $scope.acceptpersonal = function () {
        $scope.deliverypers.action = "getAcceptorders";
        $scope.deliverypers.userId = $localStorage.id;
        $scope.deliverypers.accessToken = $localStorage.accessToken;
        $scope.deliverypers.lang = "";
        $scope.deliverypers.lat = "";
        $scope.deliverypers.mode = "user";
        $scope.deliverypers.deviceinfo = "test";
        $scope.deliverypers.ordermode = "personal_assist";
        $scope.deliverypers.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypers req--" + JSON.stringify($scope.deliverypers));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypers).then(function (response) {
          console.log("deliverypers" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliveryperslist = response.data.Response;
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          } else {
            $scope.spin = false;
            $scope.hider = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }

      $interval(function () {
        $scope.acceptpersonal();
      }, 2000);

    })

    .controller('completeddeliveryCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $interval) {
      $scope.delivery = {};
      $scope.delivery.action = "CompletedOrderDelivery";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.delivery.ordermode = "waiter";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.spin = false;
          $scope.deliverylist = response.data.Response;
          if (response.data.Response == null) {
            $scope.spin = false;
            $scope.hiderw = true;
          } else {
            $scope.hiderrw = true;
            $scope.spin = false;
            $scope.hiderw = false;
          }
        } else {
          $scope.spin = false;
          $scope.hiderw = true;
        }
      }, function (err) {
        console.log("error" + JSON.stringify(err));
      });


      $scope.deliveryshop = {};
      $scope.deliveryshop.action = "CompletedOrderDelivery";
      $scope.deliveryshop.userId = $localStorage.id;
      $scope.deliveryshop.accessToken = $localStorage.accessToken;
      $scope.deliveryshop.lang = "";
      $scope.deliveryshop.lat = "";
      $scope.deliveryshop.mode = "user";
      $scope.deliveryshop.deviceinfo = "test";
      $scope.deliveryshop.imei = "356872067678229";
      $scope.deliveryshop.ordermode = "shopping";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.deliveryshop));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliveryshop).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.spin = false;
          $scope.deliveryshoplist = response.data.Response;
          if (response.data.Response == null) {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        } else {
          $scope.spin = false;
          $scope.hider = true;
        }
      }, function (err) {
        console.log("error" + JSON.stringify(err));
      });




      $scope.deliverypersonal = {};

      $scope.completedpersonal = function () {
        $scope.deliverypersonal.action = "CompletedOrderDelivery";
        $scope.deliverypersonal.userId = $localStorage.id;
        $scope.deliverypersonal.accessToken = $localStorage.accessToken;
        $scope.deliverypersonal.lang = "";
        $scope.deliverypersonal.lat = "";
        $scope.deliverypersonal.mode = "user";
        $scope.deliverypersonal.deviceinfo = "test";
        $scope.deliverypersonal.imei = "356872067678229";
        $scope.deliverypersonal.ordermode = "personal_assist";
        $scope.spin = true;

        console.log("login req--" + JSON.stringify($scope.deliverypersonal));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypersonal).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliverypersonallist = response.data.Response;
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hiderp = true;
            } else {
              $scope.hiderrp = true;
              $scope.spin = false;
              $scope.hiderp = false;
            }
          } else {
            $scope.spin = false;
            $scope.hiderp = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }


      $interval(function () {
        $scope.completedpersonal();
      }, 2000);
    })
    .controller('MydeliverysCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner) {

      $scope.delivery = {};
      $scope.delivery.action = "CancelledOrderDelivery";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.ordermode = "waiter";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.spin = false;
          $scope.deliverylist = response.data.Response;
          if (response.data.Response == null) {
            $scope.spin = false;
            $scope.hidero = true;
          } else {
            $scope.hiderro = true;
            $scope.spin = false;
            $scope.hidero = false;
          }
        } else {
          $scope.spin = false;
          $scope.hidero = true;
        }
      }, function (err) {
        console.log("error" + JSON.stringify(err));
      });




      $scope.deliveryshop = {};
      $scope.deliveryshop.action = "CancelledOrderDelivery";
      $scope.deliveryshop.userId = $localStorage.id;
      $scope.deliveryshop.accessToken = $localStorage.accessToken;
      $scope.deliveryshop.lang = "";
      $scope.deliveryshop.lat = "";
      $scope.deliveryshop.mode = "user";
      $scope.deliveryshop.deviceinfo = "test";
      $scope.deliveryshop.ordermode = "shopping";
      $scope.deliveryshop.imei = "356872067678229";
      $scope.spin = true;

      console.log("deliveryshop req--" + JSON.stringify($scope.deliveryshop));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliveryshop).then(function (response) {
        console.log("deliveryshopretunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.spin = false;
          $scope.deliveryshoplist = response.data.Response;
          if (response.data.Response == null) {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        } else {
          $scope.spin = false;
          $scope.hider = true;
        }
      }, function (err) {
        console.log("error" + JSON.stringify(err));
      });


    })
    .controller('personalviweCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $state) {

      $scope.order_id = $state.params.Order_ID;

      $scope.start = {};
      $scope.start.action = "assistWorkDetails";
      $scope.start.accessToken = $localStorage.accessToken;
      $scope.start.lang = "";
      $scope.start.lat = "";
      $scope.start.deviceinfo = "test";
      $scope.start.imei = "356872067678229";
      $scope.start.workmode = "assist_start";
      $scope.start.mode = "user";
      $scope.start.userId = $localStorage.id;
      $scope.start.order_id = $scope.order_id;
      $scope.start.start_time = $filter('date')(new Date(), "h:mm a");
      $scope.started = function () {
        $scope.spin = true;
        console.log("start req--" + JSON.stringify($scope.start));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.start).then(function (response) {
          console.log("start" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.startmsg = response.data.Message;
            $scope.starttimes = response.data.startTime;
            var alertPopup = $ionicPopup.alert({
              template: '<center>  Started </center>'
            });
            //   $window.location.href = "#/app/homereject";	
            $scope.spin = false;
          }
          if (response.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (response.data.status == "FAILED") {
            $scope.spin = false; {
              //var alertPopup = $ionicPopup.alert({ template: '<center>' + response.data.Message + '</center>'});
            }
            $scope.spin = false;

          }
          $scope.spin = false;
        }, function (err) {
          $scope.spin = false;
          $scope.showprob();
        });
      }

      $scope.stops = {};
      $scope.stops.action = "assistWorkDetails";
      $scope.stops.accessToken = $localStorage.accessToken;
      $scope.stops.lang = "";
      $scope.stops.lat = "";
      $scope.stops.deviceinfo = "test";
      $scope.stops.imei = "356872067678229";
      $scope.stops.workmode = "assist_stop";
      $scope.stops.mode = "user";
      $scope.stops.userId = $localStorage.id;
      $scope.stops.order_id = $scope.order_id;
      $scope.stops.end_time = $filter('date')(new Date(), "h:mm a");
      $scope.stoped = function () {
        $scope.spin = true;
        console.log("stops req--" + JSON.stringify($scope.stops));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.stops).then(function (response) {
          console.log("stops" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.stopmsg = response.data.Message;
            $scope.endedtimes = response.data.endtime;
            var alertPopup = $ionicPopup.alert({
              template: '<center> Stoped </center>'
            });
            $window.location.href = "#/app/completeddelivery";
            $scope.spin = false;
          }

          if (response.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (response.data.status == "FAILED") {
            $scope.spin = false; {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }


          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }
    })
    .controller('notificationCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner) {})
    .controller('helpandfeedbackCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner) {})
    .controller('PrivacyPolicyCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner) {})
    .controller('homecompleteCtrl', function ($scope, $stateParams, $sce, $window, $http, $localStorage, $ionicLoading, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $filter, $cordovaBarcodeScanner, $interval) {

      $scope.delivery = {};
      $scope.searchData = {};
      $scope.waiter = function () {
        $scope.delivery.action = "getDeliveryorders";
        $scope.delivery.userId = $localStorage.id;
        $scope.delivery.accessToken = $localStorage.accessToken;
        $scope.delivery.lang = "";
        $scope.delivery.lat = "";
        $scope.delivery.mode = "user";
        $scope.delivery.deviceinfo = "test";
        $scope.delivery.imei = "356872067678229";
        $scope.delivery.order_type = "waiter";
        $scope.spin = true;

        console.log("login req--" + JSON.stringify($scope.delivery));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));
          $scope.spin = false;
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliverylist = response.data.Response;
            $scope.hiderrw = true;
            $scope.hiderw = false;
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hiderw = true;
              $scope.hiderrw = false;
            } else {
              $scope.hiderrw = true;
              $scope.spin = false;
              $scope.hiderw = false;
            }
          } else {
            $scope.spin = false;
            $scope.hiderw = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }




      $interval(function () {
        $scope.waiter();
      }, 2000);


      /*shopping*/


      $scope.deliverysh = {};
      $scope.shopping = function () {
        $scope.deliverysh.action = "shopOrders";
        $scope.deliverysh.userId = $localStorage.id;
        $scope.deliverysh.accessToken = $localStorage.accessToken;
        $scope.deliverysh.lang = "";
        $scope.deliverysh.lat = "";
        $scope.deliverysh.mode = "user";
        $scope.deliverysh.deviceinfo = "test";
        $scope.deliverysh.imei = "356872067678229";
        // $scope.spin = true;

        console.log("deliverysh req--" + JSON.stringify($scope.deliverysh));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverysh).then(function (response) {
          console.log("deliverysh" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.shopOrdersdeliverylist = response.data.Response;
            $scope.hiderr = true;
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hider = true;
              $scope.hiderr = false;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          } else {
            $scope.spin = false;
            $scope.hider = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }

      $scope.clickedacc = function (Order_ID) {
        $scope.Order_ID = Order_ID;
        $window.location = "#/app/completedetail/" + $scope.Order_ID;
        console.log("Order_ID" + JSON.stringify($scope.Order_ID));
      }


      $interval(function () {
        $scope.shopping();
      }, 2000);

      /*shopping*/


      /*personal*/
      $scope.deliverypers = {};
      $scope.personal = function () {
        $scope.deliverypers.action = "getDeliveryorders";
        $scope.deliverypers.userId = $localStorage.id;
        $scope.deliverypers.accessToken = $localStorage.accessToken;
        $scope.deliverypers.lang = "";
        $scope.deliverypers.lat = "";
        $scope.deliverypers.mode = "user";
        $scope.deliverypers.deviceinfo = "test";
        $scope.deliverypers.imei = "356872067678229";
        $scope.deliverypers.order_type = "personal_assist";
        //  $scope.spin = true;

        console.log("deliverypers req--" + JSON.stringify($scope.deliverypers));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypers).then(function (response) {
          console.log("deliverypers retunrdata" + JSON.stringify(response.data));
          //  $scope.spin = false; 
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $scope.deliveryperslist = response.data.Response;
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hiderp = true;
              $scope.hiderrp = false;
            } else {
              $scope.hiderrp = true;
              $scope.spin = false;
              $scope.hiderp = false;
            }
          } else {
            $scope.spin = false;
            $scope.hiderp = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }



      $interval(function () {
        $scope.personal();
      }, 2000);

      /*personal*/


      $scope.deliverypri = {};
      $scope.deliverypri.action = "getOrderprice";
      $scope.deliverypri.reject_reasn = "";
      $scope.deliverypri.order_price = "0";
      $scope.deliverypri.order_type = "personal_assist";
      $scope.deliveryprice = function (orderid) {
        $scope.deliverypri.userId = $localStorage.id;
        $scope.deliverypri.order_id = orderid;
        $scope.deliverypri.accessToken = $localStorage.accessToken;

        $scope.deliverypri.lat = "";
        $scope.deliverypri.lang = "";
        $scope.deliverypri.mode = "user";
        $scope.deliverypri.deviceinfo = "test";
        $scope.deliverypri.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypri req--" + JSON.stringify($scope.deliverypri));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypri).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));

          if (response.data.status == "SUCCESS") {
            //$scope.Orderid = $scope.Order_ID;
            $localStorage.Order_ID = response.data.Response;
            console.log("orderid req" + JSON.stringify($scope.Order_ID));
            console.log("Order_ID" + JSON.stringify($scope.Orderid));
            $scope.statusstart = "START";

            var alertPopup = $ionicPopup.alert({
              template: '<center>Order Accepted</center>'
            });
            $window.location = "#/app/home";
            // $window.location = "#/app/personalviwe/"+$scope.deliverypri.order_id;
            $scope.spin = false;
            $scope.checktrack();
            if (response.data.status == "FAILED") {

              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }



      /*personal*/
    })
    .controller('rejectdeliveryCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $cordovaBarcodeScanner) {


      $scope.dddr = {};
      $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $scope.dddr.mobile = imageData.text;
          console.log("Barcode Format -> " + imageData.format);
          console.log("Cancelled -> " + imageData.cancelled);

          $window.location.href = "#/app/paymoneytoboss/" + $scope.dddr.mobile;

        }, function (error) {
          console.log("An error happened -> " + error);
        });
      };


      /*rejectdelivery*/



      $scope.deliveryreason = {};
      $scope.deliveryreason.action = "rejectReason";
      $scope.deliveryreason.accessToken = $localStorage.accessToken;
      $scope.deliveryreason.lang = "";
      $scope.deliveryreason.lat = "";
      $scope.deliveryreason.mode = "user";
      $scope.deliveryreason.deviceinfo = "test";
      $scope.deliveryreason.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliveryreason).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        $scope.deliveryreasonlist = response.data;
        console.log("deliveryreasonlist" + JSON.stringify($scope.deliveryreasonlist));
        if (response.data.status == "FAILED") {
          $scope.spin = false;
          $scope.hider = true;
        } else {
          $scope.hiderr = true;
          $scope.spin = false;
          $scope.hider = false;
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });


      $scope.order_id = $state.params.order_id;
      console.log("order_id" + JSON.stringify($scope.order_id));


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.rejet = {};

      $scope.rejet.action = "delivery_status";
      $scope.rejet.accessToken = $localStorage.accessToken;
      $scope.rejet.status = "0";
      $scope.rejet.lang = "";
      $scope.rejet.lat = "";
      $scope.rejet.mode = "user";
      $scope.rejet.type = "image";
      $scope.rejet.deviceinfo = "test";
      $scope.rejet.imei = "356872067678229";
      $scope.rejet.comments = "";
      $scope.rejet.reject_reason = "";
      $scope.rejet.orderid = $scope.order_id;
      $scope.rejected = function () {
        $scope.spin = true;
        console.log("rejet req--" + JSON.stringify($scope.rejet));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.rejet).then(function (response) {
          console.log("rejet" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $scope.rejetlist = response.data.Response;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
            $window.location.href = "#/app/homereject";
          }

          if (result.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (result.data.status == "FAILED") {
            $scope.spin = false; {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }


          }
        }, function (err) {
          $scope.showprob();
        });
      }

    })
    .controller('shoppingorderdetCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner, $cordovaGeolocation) {
      $scope.order_id = $state.params.order_id;




      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "viewshopOrders";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.order_id;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("shop req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("shopdetail" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.Order_ID = response.data.Response[0].Order_ID;
          console.log("Order_ID" + JSON.stringify($scope.Order_ID));
          $scope.orderdetalistprod = response.data.Response[0].product_details;
          $scope.spin = false;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });


      $scope.openPopup = function (vendoradres) {
        $scope.vendorAddress = vendoradres;
        var customTemplate =
          '<div class="statspopupbox"><div class="">' +
          '<p class="text_cen">  {{vendorAddress}}  </p>' + ' </div>';

        $ionicPopup.show({
          template: customTemplate,
          title: '<p class="daspp">Shop Address </p>',
          scope: $scope,
          buttons: [{
            text: 'Close',
            type: 'bior_burt_cskkfg',
            onTap: function (e) {

            }

          }]
        });
      }
    })
    .controller('shoppingcomletedetailCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner, $cordovaGeolocation) {


      $scope.Order_ID = $state.params.order_id;


      /*shopping*/


      $scope.deliveryshacept = {};
      $scope.deliveryshacept.action = "shopOrderstatus";
      $scope.deliveryshacept.userId = $localStorage.id;
      $scope.deliveryshacept.reason = "";
      $scope.deliveryshacept.status = "accept";
      $scope.deliveryshacept.accessToken = $localStorage.accessToken;
      $scope.deliveryshacept.lang = "";
      $scope.deliveryshacept.lat = "";
      $scope.deliveryshacept.mode = "user";
      $scope.deliveryshacept.deviceinfo = "test";
      $scope.deliveryshacept.imei = "356872067678229";
      $scope.deliveryshacept.order_id = $scope.Order_ID;
      $scope.acceptorder = function () {
        $scope.spin = true;
        console.log("deliveryshacept req--" + JSON.stringify($scope.deliveryshacept));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliveryshacept).then(function (response) {
          console.log("deliveryshacept" + JSON.stringify(response.data));
          //  $scope.spin = false; 
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            // $localStorage.Order_ID=response.data.Response;
            //  console.log("orderid req" + JSON.stringify($scope.Order_ID));
            //$rootScope.statusstart="START";
            //var alertPopup = $ionicPopup.alert({template: '<center>Order Accepted</center>' });
            $scope.checktrack();
            //$window.location.href = "#/app/home";
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          } else {
            $scope.spin = false;
            $scope.hider = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }



      console.log("latlanpush" + JSON.stringify($rootScope.latitude));

      $scope.latlanpush = {};

      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)

        .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '   ' + long)
          $rootScope.latitude = lat;
          $rootScope.langitude = long;


          console.log("latitude" + JSON.stringify($rootScope.latitude));
        }, function (err) {
          console.log(err)
        });

      var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        null,

        function (err) {
          console.log(err)
        },

        function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat + '' + long)
        }
      );

      watch.clearWatch();


      $scope.checktrack = function () {
        $scope.latlanpush.action = "track_order";
        $scope.latlanpush.userId = $localStorage.id;
        $scope.latlanpush.accessToken = $localStorage.accessToken;
        $scope.latlanpush.invoice_id = $scope.Order_ID;
        $scope.latlanpush.lat = $scope.latitude;
        $scope.latlanpush.lang = $scope.langitude;
        $scope.latlanpush.mode = "user";
        $scope.latlanpush.deviceinfo = "test";
        $scope.latlanpush.imei = "356872067678229";
        $scope.spin = true;

        console.log("latlanpush req--" + JSON.stringify($scope.latlanpush));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.latlanpush).then(function (response) {
          console.log("latlanpush retunrdata" + JSON.stringify(response.data));
          //  $scope.spin = false; 
          if (response.data.status == "SUCCESS") {
            $scope.spin = false;
            $localStorage.Order_ID = $scope.latlanpush.invoice_id;
            console.log("orderid req" + JSON.stringify($localStorage.Order_ID));
            $rootScope.statusstart = "START";
            var alertPopup = $ionicPopup.alert({
              template: '<center>Order Accepted</center>'
            });
            $window.location.href = "#/app/home";
            if (response.data.Response == null) {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          } else {
            $scope.spin = false;
            $scope.hider = true;
          }
        }, function (err) {
          console.log("error" + JSON.stringify(err));
        });
      }
      /*shopping*/


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "viewshopOrders";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.Order_ID;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("shop req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("shopdetail" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.orderdetalistprod = response.data.Response[0].product_details;
          $scope.spin = false;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });


      $scope.openPopup = function (vendoradres) {
        $scope.vendorAddress = vendoradres;
        var customTemplate =
          '<div class="statspopupbox"><div class="">' +
          '<p class="text_cen">  {{vendorAddress}}  </p>' + ' </div>';

        $ionicPopup.show({
          template: customTemplate,
          title: '<p class="daspp">Shop Address </p>',
          scope: $scope,
          buttons: [{
            text: 'Close',
            type: 'bior_burt_cskkfg',
            onTap: function (e) {

            }

          }]
        });
      }

    })
    .controller('personaldetaisCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner) {


      $scope.Order_ID = $state.params.Order_ID;


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "orderDetails";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.Order_ID;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.orderdetalistprod = response.data.Response[0].prod;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });




    })
    .controller('acceptdeliverydetaisCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner) {


      $scope.Order_ID = $state.params.Order_ID;


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "orderDetails";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.Order_ID;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.orderdetalistprod = response.data.Response[0].prod;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });


      $scope.openPopup = function (design_img) {
        $scope.design_img = design_img;
        var customTemplate =
          '<div class="statspopupbox"><div class="cls_rwe54s692f6"><i  class=" icon ion-plus sapn_pandf_tyhhdf485"  ng-click="fnzoom(+10)"></i><i ng-click="fnzoom(-10)" class="icon ion-minus sapn_pandf_tyhhdf485"  ></i> </div>' +
          '<img id="imgpopp" ng-src="{{design_img}}" class="statspopupbox_iamgs"/>' + ' </div>';

        $ionicPopup.show({
          template: customTemplate,
          title: '<p class="daspp"> Image </p>',
          scope: $scope,
          buttons: [{
            text: 'Close',
            type: 'bior_burt_cskkfg',
            onTap: function (e) {

            }

          }]
        });
      }

      $scope.fnzoom = function (val) {

        var width = parseInt(angular.element(document.getElementById("imgpopp").clientWidth)[0]) + val;
        var height = parseInt(angular.element(document.getElementById("imgpopp").clientHeight)[0]) + val;
        angular.element(document.getElementById("imgpopp")).css('width', width + 'px');
        angular.element(document.getElementById("imgpopp")).css('height', height + 'px');

      };

    })
    .controller('walletdetailsCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner) {


      $scope.Order_ID = $state.params.Order_ID;


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "orderDetails";
      $scope.delivery.userId = $localStorage.id;
      $scope.delivery.order_id = $scope.Order_ID;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.orderdetalist = response.data.Response[0];
          $scope.orderdetalistprod = response.data.Response[0].prod;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });




    })
    .controller('rejectdetailCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state, $timeout, $cordovaBarcodeScanner) {




      $scope.order_id = $state.params.order_id;


      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.delivery = {};
      $scope.delivery.action = "package_details";
      $scope.delivery.branch = $localStorage.branch;
      $scope.delivery.delivery_id = $localStorage.id;
      $scope.delivery.accessToken = $localStorage.accessToken;
      $scope.delivery.lang = "";
      $scope.delivery.lat = "";
      $scope.delivery.mode = "user";
      $scope.delivery.deviceinfo = "test";
      $scope.delivery.imei = "356872067678229";
      $scope.delivery.order_id = $scope.order_id;
      $scope.spin = true;

      console.log("login req--" + JSON.stringify($scope.delivery));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.delivery).then(function (response) {
        console.log("retunrdata" + JSON.stringify(response.data));
        if (response.data.status == "SUCCESS") {
          $scope.order_id = response.data.Response;
          $scope.deliverylist = response.data.Response.shipping_address;
          $scope.vendorinf = response.data.Response.vendor_info;
          $scope.prodt = response.data.Response.product_details;
          //$scope.Responseg = response.data.Response['shipping_address'];
          //	$scope.orderid = response.data.Response.order_id;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });




      $scope.dddr = {};
      $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $scope.dddr.mobile = imageData.text;
          console.log("Barcode Format -> " + imageData.format);
          console.log("Cancelled -> " + imageData.cancelled);

          $window.location.href = "#/app/paymoneytoboss/" + $scope.dddr.mobile;

        }, function (error) {
          console.log("An error happened -> " + error);
        });
      };


    })
    .controller('accptlistCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope) {})
    .controller('rejlistCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope) {})

    .controller('VehiclemanagementCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope) {})

    .controller('profileCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, helper) {
      $scope.$on('$ionicView.enter', function (e) {
        $scope.showAlert = function () {
          var alertPopup = $ionicPopup.alert({
            title: 'Submission Failure',
            template: '<center>Some details are missing!</center>'
          });
        };
        $scope.showerr = function () {
          var alertPopup = $ionicPopup.alert({
            template: '<center>Something went wrong</center>'
          });
        };
        $scope.showprob = function () {
          var alertPopup = $ionicPopup.alert({
            template: '<center>Network problem</center>'
          });
        };
        $scope.p = {};
        $scope.trans = {};
        $scope.trans.action = "ShowProfile";
        $scope.trans.userId = $localStorage.id;
        $scope.trans.deviceinfo = "test";
        $scope.trans.imei = "356872067678229";
        $scope.trans.mode = "user";
        $scope.trans.lang = "";
        $scope.trans.lat = "";
        $scope.trans.accessToken = $localStorage.accessToken;
        $scope.spin = true;
        console.log(JSON.stringify($scope.trans));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.trans).then(function (tres) {
          console.log(JSON.stringify(tres.data));
          if (tres.data.status = "SUCCESS") {
            $scope.profile = tres.data.Response;
            $scope.spin = false;
            //  if ($scope.profile.data_of_birth != "0000-00-00") $scope.p.dat = $scope.profile.date_of_birth;
          } else {
            $scope.showerr();
          }
        }, function (terr) {
          $scope.showprob();
        });

        $scope.update = function () {
          $scope.trans.action = "UpdateProfile";
          $scope.trans.firstName = $scope.profile.first_name;
          $scope.trans.lastname = $scope.profile.last_name;
          $scope.trans.email = $scope.profile.email_id;
          $scope.trans.mobilenumber = $scope.profile.mobile_number;
          $scope.trans.address = $scope.profile.address;
          //$scope.trans.address2=null;
          $scope.trans.city = $scope.profile.city;
          $scope.trans.pincode = $scope.profile.pincode;

          $scope.trans.deviceinfo = "test";
          $scope.trans.imei = "356872067678229";
          $scope.trans.mode = "user";
          $scope.trans.lang = "";
          $scope.trans.lat = "";
          console.log(JSON.stringify($scope.trans));
          $http.post("https://krazyoffers.in/api/fund/api.php", $scope.trans).then(function (tres) {
            console.log(JSON.stringify(tres.data));
            if (tres.data.status = "SUCCESS") {
              var alertPopup = $ionicPopup.alert({
                template: '<center>Updated Sucessfully</center>'
              });
              $scope.profiles = tres.data.Response;
            } else {
              $scope.showerr();
            }
          }, function (terr) {
            $scope.hides();
          });
        };
      });

    })
    .controller('deliverystatusCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {

      $scope.Order_ID = $state.params.Order_ID;

      $scope.deliver_y = {};

      $scope.deliver_y.action = "waiterOrderDelivery";
      $scope.deliver_y.accessToken = $localStorage.accessToken;
      $scope.deliver_y.lang = "";
      $scope.deliver_y.lat = "";
      $scope.deliver_y.mode = "user";
      $scope.deliver_y.type = "image";
      $scope.deliver_y.deviceinfo = "test";
      $scope.deliver_y.imei = "356872067678229";
      $scope.deliver_y.ordermode = "waiter";
      $scope.deliver_y.order_id = $scope.Order_ID;
      $scope.deliver_y.del_status = "";
      $scope.deliver_ystatus = function () {

        $scope.deliver_y.userId = $localStorage.id;
        $scope.spin = true;
        console.log("rejet req--" + JSON.stringify($scope.deliver_y));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliver_y).then(function (response) {
          console.log("deliver_y" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $rootScope.statusstop = "STOP";
            $scope.rejetlist = response.data.Response;
            var alertPopup = $ionicPopup.alert({
              template: '<center>Order Delivered Success</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
          }

          if (response.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (response.data.status == "FAILED") {
            $scope.spin = false; {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }
          }
        }, function (err) {
          $scope.showprob();
        });
      }
    })
    .controller('deliverystatusshopCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {

      $scope.Order_ID = $state.params.order_id;

      $scope.deliver_y = {};

      $scope.deliver_y.action = "waiterOrderDelivery";
      $scope.deliver_y.accessToken = $localStorage.accessToken;
      $scope.deliver_y.lang = "";
      $scope.deliver_y.lat = "";
      $scope.deliver_y.mode = "user";
      $scope.deliver_y.type = "image";
      $scope.deliver_y.deviceinfo = "test";
      $scope.deliver_y.imei = "356872067678229";
      $scope.deliver_y.ordermode = "shopping";
      $scope.deliver_y.order_id = $scope.Order_ID;
      $scope.deliver_y.paid_status = "paid";
      $scope.deliver_y.del_status = "";
      $scope.deliver_ystatus = function () {

        $scope.deliver_y.userId = $localStorage.id;
        $scope.spin = true;
        console.log("rejet req--" + JSON.stringify($scope.deliver_y));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliver_y).then(function (response) {
          console.log("deliver_y" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $rootScope.statusstop = "STOP";
            $scope.rejetlist = response.data.Response;
            var alertPopup = $ionicPopup.alert({
              template: '<center>Order Delivered Successfully</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
          }

          if (response.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (response.data.status == "FAILED") {
            $scope.spin = false; {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }
          }
        }, function (err) {
          $scope.showprob();
        });
      }
    })
    .controller('deliverystatusshopdueCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {

      $scope.Order_ID = $state.params.order_id;

      $scope.deliver_y = {};

      $scope.deliver_y.action = "waiterOrderDelivery";
      $scope.deliver_y.accessToken = $localStorage.accessToken;
      $scope.deliver_y.lang = "";
      $scope.deliver_y.lat = "";
      $scope.deliver_y.mode = "user";
      $scope.deliver_y.type = "image";
      $scope.deliver_y.deviceinfo = "test";
      $scope.deliver_y.imei = "356872067678229";
      $scope.deliver_y.ordermode = "shopping";
      $scope.deliver_y.paid_status = "cashreceived";
      $scope.deliver_y.order_id = $scope.Order_ID;
      $scope.deliver_y.del_status = "";
      $scope.deliver_ystatus = function () {

        $scope.deliver_y.userId = $localStorage.id;
        $scope.spin = true;
        console.log("rejet req--" + JSON.stringify($scope.deliver_y));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliver_y).then(function (response) {
          console.log("deliver_y" + JSON.stringify(response.data));
          if (response.data.status == "SUCCESS") {
            $rootScope.statusstart == "STOP";
            $localStorage.Order_ID = "";
            $scope.Order_ID = "";
            if ($rootScope.statusstart == "STOP") {
              $scope.stop();
              $rootScope.statusstart = "";
              $scope.Order_ID = "";
              $localStorage.Order_ID = "";
            }
            $scope.rejetlist = response.data.Response;
            var alertPopup = $ionicPopup.alert({
              template: '<center>Order Delivered Success</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
          }

          if (response.data.Status == "Failed") {
            $scope.spin = false;
            var alertPopup = $ionicPopup.alert({
              template: '<center>' + response.data.Message + '</center>'
            });
          } else if (response.data.status == "FAILED") {
            $scope.spin = false; {
              var alertPopup = $ionicPopup.alert({
                template: '<center>' + response.data.Message + '</center>'
              });
            }
          }
        }, function (err) {
          $scope.showprob();
        });
      }
    })
    .controller('orderdeclineCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {


      $scope.Order_ID = $state.params.Order_ID;

      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.deliverypri = {};
      $scope.deliverypri.action = "getOrderprice";
      $scope.deliverypri.order_price = "0";
      $scope.deliverypri.reject_reasn = "";
      // $scope.deliverypri.order_price.push($scope.deliverypri.order_price);
      $scope.orderdecline = function () {
        $scope.deliverypri.userId = $localStorage.id;
        $scope.deliverypri.order_id = $scope.Order_ID;
        $scope.deliverypri.accessToken = $localStorage.accessToken;
        $scope.deliverypri.lang = "";
        $scope.deliverypri.lat = "";
        $scope.deliverypri.mode = "user";
        $scope.deliverypri.deviceinfo = "test";
        $scope.deliverypri.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypri req--" + JSON.stringify($scope.deliverypri));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypri).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));

          if (response.data.status == "SUCCESS") {
            var alertPopup = $ionicPopup.alert({
              template: '<center>Status Updated</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }


    })
    .controller('shopppingorderdeclineCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {


      $scope.order_id = $state.params.order_id;

      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.deliverypri = {};
      $scope.deliverypri.action = "shopOrderstatus";
      $scope.deliverypri.status = "cancel";
      $scope.deliverypri.reason = "";
      $scope.orderdecline = function () {
        $scope.deliverypri.userId = $localStorage.id;
        $scope.deliverypri.order_id = $scope.order_id;
        $scope.deliverypri.accessToken = $localStorage.accessToken;
        $scope.deliverypri.lang = "";
        $scope.deliverypri.lat = "";
        $scope.deliverypri.mode = "user";
        $scope.deliverypri.deviceinfo = "test";
        $scope.deliverypri.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypri req--" + JSON.stringify($scope.deliverypri));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypri).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));

          if (response.data.status == "SUCCESS") {
            var alertPopup = $ionicPopup.alert({
              template: '<center>Status Updated</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }


    })
    .controller('personalorderdeclineCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {


      $scope.order_id = $state.params.order_id;

      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.deliverypri = {};
      $scope.deliverypri.action = "shopOrderstatus";
      $scope.deliverypri.status = "cancel";
      $scope.deliverypri.reason = "";
      $scope.orderdecline = function () {
        $scope.deliverypri.userId = $localStorage.id;
        $scope.deliverypri.order_id = $scope.order_id;
        $scope.deliverypri.accessToken = $localStorage.accessToken;
        $scope.deliverypri.lang = "";
        $scope.deliverypri.lat = "";
        $scope.deliverypri.mode = "user";
        $scope.deliverypri.deviceinfo = "test";
        $scope.deliverypri.imei = "356872067678229";
        $scope.spin = true;
        console.log("deliverypri req--" + JSON.stringify($scope.deliverypri));
        $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.deliverypri).then(function (response) {
          console.log("retunrdata" + JSON.stringify(response.data));

          if (response.data.status == "SUCCESS") {
            var alertPopup = $ionicPopup.alert({
              template: '<center>Status Updated</center>'
            });
            $window.location.href = "#/app/home";
            $scope.spin = false;
            if (response.data.status == "FAILED") {
              $scope.spin = false;
              $scope.hider = true;
            } else {
              $scope.hiderr = true;
              $scope.spin = false;
              $scope.hider = false;
            }
          }
        }, function (err) {
          $scope.showprob();
          $scope.spin = false;
        });
      }


    })
    .controller('walletCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope, $state) {
      $scope.showprob = function () {
        var alertPopup = $ionicPopup.alert({
          template: '<center>Network problem</center>'
        });
      };
      $scope.wallet = {};
      $scope.wallet.action = "getBalance";
      $scope.wallet.userId = $localStorage.id;
      $scope.wallet.accessToken = $localStorage.accessToken;
      $scope.wallet.lang = "";
      $scope.wallet.lat = "";
      $scope.wallet.mode = "user";
      $scope.wallet.deviceinfo = "test";
      $scope.wallet.imei = "356872067678229";
      $scope.spin = true;
      console.log("wallet req--" + JSON.stringify($scope.wallet));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.wallet).then(function (response) {
        console.log("wallet retunrdata" + JSON.stringify(response.data));

        if (response.data.status == "SUCCESS") {
          $scope.balance = response.data.Balance;
          $scope.spin = false;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });

      $scope.walletrepo = {};
      $scope.walletrepo.action = "walletTransReport";
      $scope.walletrepo.userId = $localStorage.id;
      $scope.walletrepo.accessToken = $localStorage.accessToken;
      $scope.walletrepo.lang = "";
      $scope.walletrepo.lat = "";
      $scope.walletrepo.mode = "user";
      $scope.walletrepo.deviceinfo = "test";
      $scope.walletrepo.imei = "356872067678229";
      $scope.spin = true;
      console.log("walletrepo req--" + JSON.stringify($scope.walletrepo));
      $http.post("https://krazyoffers.in/shopping/delivery/api/api.php", $scope.walletrepo).then(function (response) {
        console.log("walletrepo retunrdata" + JSON.stringify(response.data));

        if (response.data.status == "SUCCESS") {
          $scope.walletreport = response.data.Response;
          $scope.spin = false;
          if (response.data.status == "FAILED") {
            $scope.spin = false;
            $scope.hider = true;
          } else {
            $scope.hiderr = true;
            $scope.spin = false;
            $scope.hider = false;
          }
        }
      }, function (err) {
        $scope.showprob();
        $scope.spin = false;
      });


    })
    .controller('editprofileCtrl', function ($scope, $stateParams, $http, $ionicLoading, $ionicPopup, $localStorage, $window, $rootScope) {})
    .controller('AccountCtrl', ['$rootScope', 'mys', '$scope', '$http', function ($rootScope, mys, $scope, $http) {

    }]);

  function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }
