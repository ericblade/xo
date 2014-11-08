enyo.kind({
    name: "VideoRequest",
    kind: enyo.Request,
    components: [
        { name: "TouchPlayer", kind: "PalmService", service: "palm://com.wordpress.mobilecoder.touchplayer.service/", method: "play", onSuccess: "touchPlayerLaunched", onFailure: "touchPlayerFailed" },
    ],
    call: function()
    {        
        var url = sanitizeServer(prefs.get("serverip")) + "/rest/stream.view?id=" + this.itemId + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS";        
        this.log("*** Playing Video URL ", url);
		/* At this time, we only know how to launch an external player on webOS */
		if(!window.PalmSystem)
        {
            this.log("Playing video on Blackberry");
            this.touchPlayerFailed();
        }
        else 
        {
			if(Platform.platformVersion >= 3) { // TODO: we need to be able to check the Subsonic version here to make sure IT can support HTTPLS before going to it!
				this.touchPlayerFailed(); // let's try HTTPLS if we're on TouchPad!
			} else {
				this.log("Playing video on Palm");
				this.$.TouchPlayer.call( { source: url } );
			}
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
		var page = "/rest/videoPlayer.view";
		if(window.PalmSystem && Platform.platformVersion >= 3) // TODO: and if Subsonic version supports it
			page = "/rest/hls.view";
        var url = sanitizeServer(prefs.get("serverip")) + page +"?id=" + this.itemId + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.8.0" + "&c=XO-webOS";
        this.log("*** Playing Video URL ", url);
		Platform.browser(url, this)();
        this.receive({ result: "ok" }); // null response == failure
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
});