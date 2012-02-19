enyo.kind({
    name: "VideoRequest",
    kind: enyo.Request,
    components: [
        { name: "TouchPlayer", kind: "PalmService", service: "palm://com.wordpress.mobilecoder.touchplayer.service/", method: "play", onSuccess: "touchPlayerLaunched", onFailure: "touchPlayerFailed" },
        { name: "WebLauncher", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onSuccess: "webBrowserLaunched", onFailure: "webBrowserFailed" },
    ],
    call: function()
    {        
        var url = "http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.itemId + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS";        
        this.log("*** Playing Video URL ", url);
        if(typeof blackberry != "undefined")
        {
            this.log("Playing video on Blackberry");
            this.touchPlayerFailed();
        }
        else if(window.PalmSystem)
        {
            this.log("Playing video on Palm");
            this.$.TouchPlayer.call( { source: url } );
        }
    },
    touchPlayerLaunched: function(inSender, inResponse)
    {
        this.log(inResponse);
        this.receive({ result: "ok" });
    },
    touchPlayerFailed: function(inSender, inResponse)
    {
        this.log(inResponse);
        var url = "http://" + prefs.get("serverip") + "/rest/videoPlayer.view?id=" + this.itemId + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS";
        this.log("*** Playing Video URL ", url);
        if(window.PalmSystem)
        {
            this.log("Launching browser on Palm", url);
            this.$.WebLauncher.call( { target: url });
        }
        else if(typeof blackberry != "undefined")
        {
            this.log("Launching browser on Blackberry", url);
            this.blackberrybrowser(url);
        }
        this.receive(); // null response == failure
    },
    webBrowserLaunched: function(inSender, inResponse)
    {
        this.log(inResponse);
        this.receive({ result: "ok" });
    },
    webBrowserFailed: function(inSender, inResponse)
    {
        this.log(inResponse);
        this.receive();
    },
    blackberrybrowser: function(address)
    {
	var encodedAddress = "";
	// URL Encode all instances of ':' in the address
	encodedAddress = address.replace(/:/g, "%3A");
	// Leave the first instance of ':' in its normal form
	encodedAddress = encodedAddress.replace(/%3A/, ":");
	// Escape all instances of '&' in the address
	encodedAddress = encodedAddress.replace(/&/g, "\&");
        this.log(encodedAddress);
	
	if (typeof blackberry !== 'undefined') {
			var args = new blackberry.invoke.BrowserArguments(encodedAddress);
			blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
	} else {
		// If I am not a BlackBerry device, open link in current browser
		window.location = encodedAddress; 
	}
    },
    
});