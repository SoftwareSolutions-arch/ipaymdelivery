angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngStorage', 'ui.bootstrap', 'ionic-material', 'ionMdInput', 'starter.services', 'ion-profile-picture'])
  // <!--angular.module('starter', ['ionic', 'starter.controllers','ngStorage','ui.bootstrap','ionic-material','ionMdInput'])-->
  .run(function ($ionicPlatform, $rootScope, $state, $http, $ionicHistory, $ionicScrollDelegate, $ionicPopup, $location) {
    /*$rootScope.lat= ""; 
    $rootScope.lng= ""; */
    $rootScope.latitude = "";
    $rootScope.langitude = "";
    $rootScope.statusstart = "";
    $rootScope.statusstop = "";
    $rootScope.searchlist = {};
    $rootScope.startloop = "";
    $rootScope.searchlistfare = {};
    $rootScope.deviceinfo = {};
    $rootScope.forget_password = function () {
      $ionicPopup.show({
        template: 'Enter your email address below.<label class="item item-input" style="  height: 34px; margin-top: 10px;"><input  type="email"  /></label>',
        title: 'Forget Password',
        subTitle: ' ',
        scope: $rootScope,
        buttons: [{
            text: 'Send',
            type: 'button-clear dark-blue'
          },
          {
            text: 'Cancel',
            type: 'button-clear main-bg-color'
          },
        ]
      });
    };

    $ionicPlatform.ready(function () {

      if (window.applicationPreferences) {
        // org.apache.cordova.statusbar required
        window.applicationPreferences.get("referrer", function (value) {
          // alert("Value is " + value);
          $rootScope.referalvalue = value;
        }, function (error) {
          // alert("Error! " + JSON.stringify(error));
        });
      }

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(
          function (result) {
            console.log("Device info = " + result);
            $rootScope.deviceinfo = result;

            /*$scope.result=Response.data;
	  alert($scope.result);*/

          },
          function () {
            console.log("error");
          });
      } else {
        $rootScope.deviceinfo = '{"account0Name":"Phone contacts","account0Type":"com.sonyericsson.localcontacts","account1Name":"vprasath5@gmail.com","account1Type":"com.google","account2Name":"riya_poulose","account2Type":"com.skype.contacts.sync","deviceID":"356872067678229","phoneNo":"TM.ERROR","netCountry":"TM.ERROR","netName":"TM.ERROR","simNo":"TM.ERROR","simCountry":"TM.ERROR","simName":"TM.ERROR"}';
      }


      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }

      $ionicPlatform.registerBackButtonAction(function (event) {

        event.preventDefault();
        if (($state.current.name == "app.home") || ($state.current.name == "hotelbills") || ($state.current.name == "forgotpassword") || ($state.current.name == "login")) {
          var confirmPopup = $ionicPopup.confirm({

            template: 'Are you sure want to Exit ?',
            cancelText: 'No',
            okText: 'Yes'
          });

          confirmPopup.then(function (res) {
            if (res) {
              navigator.app.exitApp();
            }

          });
        } else if (($state.current.name == "app.success") || ($state.current.name == "app.moneytransferrsuccess") || ($state.current.name == "app.shoppinginvoicePG") || ($state.current.name == "app.cabticket") || ($state.current.name == "app.fticket") || ($state.current.name == "app.hticket")) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.home');
        } else {
          // $ionicHistory.nextViewOptions({ disableBack: false });
          // $state.go('app.home');
          navigator.app.backHistory();
        }
      }, 101); //registerBackButton


      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      document.addEventListener('deviceready', function () {
        if (navigator.geolocation) {
          console.log('geolocation');

          navigator.geolocation.getCurrentPosition(function (position) {
            console.log('navigator ok' + position);
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            console.log('navigator ok :' + lat + ' ' + lng);
          }, function (error) {
            alert('navigator error' + JSON.stringify(error));
            console.log('navigator error ' + JSON.stringify(error));
          });
        } else {
          console.log('no geolocation');
        }
      }, false);
    });

    /*************** increment-decrement function ****************/
    $rootScope.valueKids = 1;
    $rootScope.valueAdults = 1;
    $rootScope.valueBabies = 1;
    $rootScope.increment_val = function (type) {
      if (type == 'Kids' && $rootScope.valueKids >= 0) $rootScope.valueKids++;
      if (type == 'Adults' && $rootScope.valueAdults >= 0) $rootScope.valueAdults++;
      if (type == 'Babies' && $rootScope.valueBabies >= 0) $rootScope.valueBabies++;
    };
    $rootScope.decrement_val = function (type) {
      //if ($rootScope.value > 0)  $rootScope.value--;
      if (type == 'Kids' && $rootScope.valueKids > 0) $rootScope.valueKids--;
      if (type == 'Adults' && $rootScope.valueAdults > 0) $rootScope.valueAdults--;
      if (type == 'Babies' && $rootScope.valueBabies > 0) $rootScope.valueBabies--;

    };

    $rootScope.confirmMsg = function (index) {
      $rootScope.show_msg = index
    }
    $rootScope.scrollTop = function () {
      $ionicScrollDelegate.scrollTop();
    };
    /*************** group function ****************/
    $rootScope.groups = [{
        id: 1,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 2,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 3,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 4,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 5,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 6,
        items: [{
          subName: 'SubBubbles1'
        }]
      },

      {
        id: 7,
        items: [{
          subName: 'SubBubbles1'
        }]
      }
    ];


    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $rootScope.toggleGroup = function (group) {
      if ($rootScope.isGroupShown(group)) {
        $rootScope.shownGroup = null;
      } else {
        $rootScope.shownGroup = group;
      }
    };
    $rootScope.isGroupShown = function (group) {
      return $rootScope.shownGroup === group;
    };

    /*************** location function ****************/
    $rootScope.goto = function (url) {
      $location.path(url)
    }

    /*************** active function ****************/
    $rootScope.activeIcon = 1
    $rootScope.activeTab = function (index) {
      $rootScope.activeIcon = index
    }
    /*************** repeat array ****************/


    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }


    });
  })
  .config(function ($cordovaInAppBrowserProvider) {

    var defaultOptions = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no'
    };

    //document.addEventListener("deviceready", onDeviceReady, false);



    document.addEventListener("deviceready", function () {
      $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
    }, false);
  })
  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.timeout = 25000;
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
        cache: false
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl',
        cache: false
      })
      .state('app', {
        cache: false,
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        onEnter: function ($state, Auth) {
          if (!Auth.isLoggedIn()) {
            $state.go('login');
          }
        }
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })
      .state('app.accepteddelivery', {
        url: '/accepteddelivery',
        views: {
          'menuContent': {
            templateUrl: 'templates/accepteddelivery.html',
            controller: 'accepteddeliveryCtrl'
          }
        }
      })

      .state('app.completeddelivery', {
        url: '/completeddelivery',
        views: {
          'menuContent': {
            templateUrl: 'templates/completeddelivery.html',
            controller: 'completeddeliveryCtrl'
          }
        }
      })
      .state('app.Mydeliverys', {
        url: '/Mydeliverys',
        views: {
          'menuContent': {
            templateUrl: 'templates/Mydeliverys.html',
            controller: 'MydeliverysCtrl'
          }
        }
      })
      .state('app.homecomplete', {
        url: '/homecomplete',
        views: {
          'menuContent': {
            templateUrl: 'templates/homecomplete.html',
            controller: 'homecompleteCtrl'
          }
        }
      })
      .state('app.rejectdetail', {
        url: '/rejectdetail/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/rejectdetail.html',
            controller: 'rejectdetailCtrl'
          }
        }
      })
      .state('app.completedetail', {
        url: '/completedetail/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/completedetail.html',
            controller: 'completedetailCtrl'
          }
        }
      })
      .state('app.shoppingcomletedetail', {
        url: '/shoppingcomletedetail/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/shoppingcomletedetail.html',
            controller: 'shoppingcomletedetailCtrl'
          }
        }
      })

      .state('app.shoppingorderdet', {
        url: '/shoppingorderdet/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/shoppingorderdet.html',
            controller: 'shoppingorderdetCtrl'
          }
        }
      })


      .state('app.walletdetails', {
        url: '/walletdetails/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/walletdetails.html',
            controller: 'walletdetailsCtrl'
          }
        }
      })
      .state('app.acceptdeliverydetais', {
        url: '/acceptdeliverydetais/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/acceptdeliverydetais.html',
            controller: 'acceptdeliverydetaisCtrl'
          }
        }
      })
      .state('app.personaldetais', {
        url: '/personaldetais/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/personaldetais.html',
            controller: 'personaldetaisCtrl'
          }
        }
      })
      .state('app.rejectdelivery', {
        url: '/rejectdelivery/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/rejectdelivery.html',
            controller: 'rejectdeliveryCtrl'
          }
        }
      })
      .state('app.rejlist', {
        url: '/rejlist',
        views: {
          'menuContent': {
            templateUrl: 'templates/rejlist.html',
            controller: 'rejlistCtrl'
          }
        }
      })
      .state('app.payqrwaiter', {
        url: '/payqrwaiter/:getdatas',
        views: {
          'menuContent': {
            templateUrl: 'templates/payqrwaiter.html',
            controller: 'payqrwaiterCtrl'
          }
        }
      })
      .state('app.personalviwe', {
        url: '/personalviwe/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/personalviwe.html',
            controller: 'personalviweCtrl'
          }
        }
      })
      .state('app.notification', {
        url: '/notification',
        views: {
          'menuContent': {
            templateUrl: 'templates/notification.html',
            controller: 'notificationCtrl'
          }
        }
      })
      .state('app.helpandfeedback', {
        url: '/helpandfeedback',
        views: {
          'menuContent': {
            templateUrl: 'templates/helpandfeedback.html',
            controller: 'helpandfeedbackCtrl'
          }
        }
      })
      .state('app.PrivacyPolicy', {
        url: '/PrivacyPolicy',
        views: {
          'menuContent': {
            templateUrl: 'templates/PrivacyPolicy.html',
            controller: 'PrivacyPolicyCtrl'
          }
        }
      })
      .state('app.Vehiclemanagement', {
        url: '/Vehiclemanagement',
        views: {
          'menuContent': {
            templateUrl: 'templates/Vehiclemanagement.html',
            controller: 'VehiclemanagementCtrl'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
          }
        }
      })
      .state('app.editprofile', {
        url: '/editprofile',
        views: {
          'menuContent': {
            templateUrl: 'templates/editprofile.html',
            controller: 'editprofileCtrl'
          }
        }
      })
      .state('app.wallet', {
        url: '/wallet',
        views: {
          'menuContent': {
            templateUrl: 'templates/wallet.html',
            controller: 'walletCtrl'
          }
        }
      })
      .state('app.scanpay', {
        url: '/scanpay',
        views: {
          'menuContent': {
            templateUrl: 'templates/scanpay.html',
            controller: 'scanpayCtrl'
          }
        }
      })
      .state('app.deliverystatus', {
        url: '/deliverystatus/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/deliverystatus.html',
            controller: 'deliverystatusCtrl'
          }
        }
      })
      .state('app.deliverystatusshop', {
        url: '/deliverystatusshop/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/deliverystatusshop.html',
            controller: 'deliverystatusshopCtrl'
          }
        }
      })
      .state('app.deliverystatusshopdue', {
        url: '/deliverystatusshopdue/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/deliverystatusshopdue.html',
            controller: 'deliverystatusshopdueCtrl'
          }
        }
      })
      .state('app.orderdecline', {
        url: '/orderdecline/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/orderdecline.html',
            controller: 'orderdeclineCtrl'
          }
        }
      })
      .state('app.shopppingorderdecline', {
        url: '/shopppingorderdecline/:order_id',
        views: {
          'menuContent': {
            templateUrl: 'templates/shopppingorderdecline.html',
            controller: 'shopppingorderdeclineCtrl'
          }
        }
      })
      .state('app.personalorderdecline', {
        url: '/personalorderdecline/:Order_ID',
        views: {
          'menuContent': {
            templateUrl: 'templates/personalorderdecline.html',
            controller: 'personalorderdeclineCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('app/home');
  })
  .factory('sharedCartService', ['$ionicPopup', function ($ionicPopup) {

    var cartObj = {};
    cartObj.cart = [];
    cartObj.whishlist = [];
    cartObj.total_amount = 0;
    cartObj.total_qty = 0;

    cartObj.cart.add = function (id, image, name, price, qty, tax, shippingcharge) {
      if (cartObj.cart.find(id) != -1) {
        var alertPopup = $ionicPopup.alert({
          title: 'Product Already Added',
          template: 'Increase the qty from the cart'
        });
      } else {
        cartObj.cart.push({
          "cart_item_id": id,
          "cart_item_image": image,
          "cart_item_name": name,
          "cart_item_price": price,
          "cart_item_qty": qty,
          "cart_item_tax": tax,
          "cart_item_shippingcharge": shippingcharge
        });
        cartObj.total_qty += 1;
        cartObj.total_amount += parseInt(price);
      }
    };



    cartObj.whishlist.addTowishlist = function (id, image, name, price, qty, tax, shippingcharge, agentid) {
      if (cartObj.whishlist.find(id) != -1) {
        var alertPopup = $ionicPopup.alert({
          title: 'Product Already Added',
          template: 'Product Already Added in Wishlist'
        });
      } else {
        cartObj.whishlist.push({
          "cart_item_id": id,
          "cart_item_image": image,
          "cart_item_name": name,
          "cart_item_price": price,
          "cart_item_qty": qty,
          "cart_item_tax": tax,
          "cart_item_shippingcharge": shippingcharge,
          "agentid": agentid
        });

      }
    };

    cartObj.cart.checkout = function (id, image, name, price, qty, tax, shippingcharge) {
      if (cartObj.cart.find(id) != -1) {} else {
        cartObj.cart.push({
          "cart_item_id": id,
          "cart_item_image": image,
          "cart_item_name": name,
          "cart_item_price": price,
          "cart_item_qty": qty,
          "cart_item_tax": tax,
          "cart_item_shippingcharge": shippingcharge
        });
        cartObj.total_qty += 1;
        cartObj.total_amount += parseInt(price);
      }
    };
    cartObj.cart.find = function (id) {
      var result = -1;
      for (var i = 0, len = cartObj.cart.length; i < len; i++) {
        if (cartObj.cart[i].cart_item_id === id) {
          result = i;
          break;
        }
      }
      return result;
    };

    cartObj.whishlist.find = function (id) {
      var result = -1;
      for (var i = 0, len = cartObj.whishlist.length; i < len; i++) {
        if (cartObj.whishlist[i].cart_item_id === id) {
          result = i;
          break;
        }
      }
      return result;
    };

    cartObj.cart.drop = function (id) {
      var temp = cartObj.cart[cartObj.cart.find(id)];
      cartObj.total_qty -= parseInt(temp.cart_item_qty);
      cartObj.total_amount -= (parseInt(temp.cart_item_qty) * parseInt(temp.cart_item_price));
      cartObj.cart.splice(cartObj.cart.find(id), 1);

    };

    cartObj.whishlist.drop = function (id) {
      var temp = cartObj.whishlist[cartObj.whishlist.find(id)];
      cartObj.whishlist.splice(cartObj.whishlist.find(id), 1);

    };
    cartObj.cart.increment = function (id) {
      cartObj.cart[cartObj.cart.find(id)].cart_item_qty += 1;
      cartObj.total_qty += 1;
      cartObj.total_amount += (parseInt(cartObj.cart[cartObj.cart.find(id)].cart_item_price));
    };

    cartObj.cart.decrement = function (id) {
      cartObj.cart[cartObj.cart.find(id)].cart_item_qty -= 1;

      if (cartObj.cart[cartObj.cart.find(id)].cart_item_qty == 0) {
        cartObj.cart.splice(cartObj.cart[cartObj.cart.find(id)], 1);

        //for dynamic updation
        cartObj.total_qty += 0;
        cartObj.total_amount += 0;
      } else {
        cartObj.total_qty -= 1;
        cartObj.total_amount -= parseInt(cartObj.cart[cartObj.cart.find(id)].cart_item_price);
      }
    };
    return cartObj;
  }])
  .directive('back', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.bind('click', function () {
          $window.history.back();
        });
      }
    };
  }])
  .directive("limitTo", [function () {
    return {
      restrict: "A",
      link: function (scope, elem, attrs) {
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on("keypress", function (e) {
          if (this.value.length == limit) e.preventDefault();
        });
      }
    }
  }])
  .directive('sbMin', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attributes, ngModel) {

        function minimum(value) {
          if (!isNaN(value)) {
            var validity = Number(value) >= attributes.sbMin;
            ngModel.$setValidity('min-value', validity)
          }
          return value;
        }

        ngModel.$parsers.push(minimum);
        ngModel.$formatters.push(minimum);
      }

    };
  })
  .filter("asDate", function () {
    return function (input) {
      return new Date(input);
    }
  })
  .factory('Auth', function ($localStorage) {
    return {
      isLoggedIn: function () {
        if ($localStorage.session == 1) {
          return true;
          console.log('returning true');
        } else {
          console.log('returning false');
          return false;
        }
      }
    }

  });

$scope.startloop = function ($scope, $cordovaGeolocation) {
  // .controller('MyCtrl', function($scope, $cordovaGeolocation) {
  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log('position', position)
      var lat = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat + '   ' + long)
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
  FCMPlugin.getToken(function (token) {
    console.log('token',token);
    alert(token);
  });
  watch.clearWatch();
}

