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
        this.$.TouchPlayer.call( { source: url } );
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
        this.$.WebLauncher.call( { target: url });
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
    }
});