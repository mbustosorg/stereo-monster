/*
 * Fadecandy Server Web UI
 *
 * This code is released into the public domain. Feel free to use it as a starting
 * point for your own apps that communicate with the Fadecandy Server.
 */

jQuery(function ($) {
    'use strict';

	  var deviceID    = "55ff6f065075555318311887";
	  var accessToken = "c1dd5bb81ff468d63dcb31fc4574f2e50d95191b";
	  var setFunc = "setPos";
	  var getFunc = "pos";
	  var toggleFunc = "toggle";
	  
	var ConnectionManager = {

        init: function() {
            // Compatibility check
            if (!this.isBrowserSupported())
                return;
            $("#browser-not-supported").addClass("hide");
            $("#connection-complete").removeClass("hide");

            $("#toggle-button").on("click", function() {
                ConnectionManager.toggle();
            });
            $("#fine-adjust-down").on("click", function() {
                ConnectionManager.fineAdjust(-5);
            });
            $("#fine-adjust-up").on("click", function() {
                ConnectionManager.fineAdjust(5);
            });
            $("#degree-range").on("change", function (evt, ui) {
            	ConnectionManager.slideChange();
            });
        },

        isBrowserSupported: function() {
            // Currently we only care about WebSockets
            return window.WebSocket;
        },

		toggle: function() {
			var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + toggleFunc;
			$.post( requestURL, { params: "x", access_token: accessToken });
		  },
		  getValue: function() {
			var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + getFunc + "/?access_token=" + accessToken;
			$.getJSON(requestURL, function(json) {
					 $("#current-position").html(json.result + "&deg;");
					 $("#degree-range").val(parseInt(json.result));
					 });
		  },
		  slideChange: function(evt, ui) {
			ConnectionManager.sparkSetPos(parseInt($("#degree-range").val()));
		  },
		  fineAdjust: function(value) {
			var currentValue = parseInt($("#current-position").html());
			var newValue = value + currentValue;
			ConnectionManager.sparkSetPos(newValue);
		  },
		  sparkSetPos: function(newValue) {
			var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + setFunc + "/";
			$.post( requestURL, { params: newValue, access_token: accessToken });
			ConnectionManager.getValue();
		  }
		  
	  
    }

      sparkLogin(function(data) {
        console.log(data);
	  });
      
    ConnectionManager.init();
    setInterval(ConnectionManager.getValue, 1000);
});

		 