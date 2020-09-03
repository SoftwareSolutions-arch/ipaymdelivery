angular.module('starter.services', [])

.factory('sharedCartService', ['$ionicPopup',function($ionicPopup){
	
	var cartObj = {};
	cartObj.cart=[];
	cartObj.total_amount=0;
	cartObj.total_qty=0;
	
	
	cartObj.cart.add=function(id,image,name,price,qty,tax,shippingcharge){
		if( cartObj.cart.find(id)!=-1 ){
			var alertPopup = $ionicPopup.alert({
                title: 'Product Already Added',
                template: 'Increase the qty from the cart'
            });
			//cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
			//cartObj.total_qty+= 1;	
			//cartObj.total_amount+= parseInt(cartObj.cart[cartObj.cart.find(id)].cart_item_price);
		}
		else{
		    cartObj.cart.push( { "cart_item_id": id , "cart_item_image": image , "cart_item_name": name , "cart_item_price": price , "cart_item_qty": qty , "cart_item_tax": tax , "cart_item_shippingcharge": shippingcharge } );
			cartObj.total_qty+=1;	
			cartObj.total_amount+=parseInt(price);	
		}
	};
	
	cartObj.cart.find=function(id){	
		var result=-1;
		for( var i = 0, len = cartObj.cart.length; i < len; i++ ) {
			if( cartObj.cart[i].cart_item_id === id ) {
				result = i;
				break;
			}
		}
		return result;
	};
	
	cartObj.cart.drop=function(id){
	 var temp=cartObj.cart[cartObj.cart.find(id)];
	 cartObj.total_qty-= parseInt(temp.cart_item_qty);
	 cartObj.total_amount-=( parseInt(temp.cart_item_qty) * parseInt(temp.cart_item_price) );
	 cartObj.cart.splice(cartObj.cart.find(id), 1);

	};
	
	cartObj.cart.increment=function(id){
		 cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
		 cartObj.total_qty+= 1;
		 cartObj.total_amount+=( parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) );	
	};
	
	cartObj.cart.decrement=function(id){
		 cartObj.cart[cartObj.cart.find(id)].cart_item_qty-=1;
		 
		 if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty == 0){
			cartObj.cart.splice(cartObj.cart[cartObj.cart.find(id)], 1);
			
			//for dynamic updation
			cartObj.total_qty+= 0;
			cartObj.total_amount+=0;
		 }
		 else{
			cartObj.total_qty-= 1;
			cartObj.total_amount-= parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) ;	
		}
	};
	
	return cartObj;
}])


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: '10:45 pm - 6:15 am',
    rate: 'Rs 350',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: '12:45 pm - 8:15 am',
    rate: 'Rs 343',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: '2:45 pm - 10:15 am',
    rate: 'Rs 250',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: '10:45 pm - 6:15 am',
    rate: 'Rs 550',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  },  {
    id: 4,
    name: 'Steve Rols',
    lastText: '09:45 pm - 5:15 am',
    rate: 'Rs 350',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 5,
    name: 'Mike Harrington',
    lastText: '12:45 pm - 8:15 am',
    rate: 'Rs 250',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
var Services = angular.module('Services',['ionic', 'starter.controllers','ngCordova','ngStorage'])
.service('helper',function($ionicPlatform,$localStorage){
	
	this.apilink = "http://demosample.in/bitzlive/api/user/api.php";
	this.apiflight = "https://momomal.com/api/flight/flight-api.php";
	this.apihotel = "https://momomal.com/api/hotel/api.php";
	this.apicab = "https://momomal.com/api/cab/api.php";
	this.apifund = "https://momomal.com/recharge/api/api.php";
});	