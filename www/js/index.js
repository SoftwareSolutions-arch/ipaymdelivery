
var app = {
  initialize: function() {
    this.bindEvents();
  },
 
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },

  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

    app.initPaymentUI();
  },
  initPaymentUI: function() {
    var clientIDs = {
      "PayPalEnvironmentProduction": "Ae6_Hvsq48SR8M-qf9TvQGPyE5HMMO7ZfpyEfdPPSw_d_HhkFWYeglOO6P9qLTc_Hxlc9DNWUehgYHhp",
      "PayPalEnvironmentSandbox": "ARtewuGHtLPvcUsi6Qej0pjF0fmzSe49R27G9ja2Hl4LfytEJE2FJeO41YgfBzsrO20h5DKbylsJ6Pyw"
    };
    PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

  },
  onSuccesfulPayment: function(payment) {
      alert("payment been successfull");
  },
  onAuthorizationCallback: function(authorization) {
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },
  createPayment: function() {
    var paymentDetails = new PayPalPaymentDetails("1.00", "0.00", "0.00");
    var payment = new PayPalPayment(window.localStorage['fair'], "USD", "booking", "Sale",
      paymentDetails);
    return payment;
  },
  configuration: function() {
 
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onPrepareRender: function() {

    var buyNowBtn = document.getElementById("buyNowBtn");
    var buyInFutureBtn = document.getElementById("buyInFutureBtn");
    var profileSharingBtn = document.getElementById("profileSharingBtn");

    buyNowBtn.onclick = function(e) {
      // single payment
      PayPalMobile.renderSinglePaymentUI(app.createPayment(), app.onSuccesfulPayment,
        app.onUserCanceled);
    };

    buyInFutureBtn.onclick = function(e) {
      // future payment
      PayPalMobile.renderFuturePaymentUI(app.onAuthorizationCallback, app
        .onUserCanceled);
    };

    profileSharingBtn.onclick = function(e) {
      // profile sharing
      PayPalMobile.renderProfileSharingUI(["profile", "email", "phone",
        "address", "futurepayments", "paypalattributes"
      ], app.onAuthorizationCallback, app.onUserCanceled);
    };
  },
  onPayPalMobileInit: function() {
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentProduction", app.configuration(),
      app.onPrepareRender);
  },
  onUserCanceled: function(result) {
    console.log(result);
  }
};

app.initialize();
