enyo.kind({
    name: "MillenialMedia.AdView",
    kind: "VFlexBox",
    published: {
        /* Documented metadata as I write this is:
         * age, gender, zip, marital, income, lat, long
         */
        metadata: "",
    },
    adserver: "ads.mp.mydas.mobi",  /* Millenial Media server address */
    apid: "Your Millenial Media Placement ID", /* Your MM Placement ID */
    auid: undefined, /* User's device ID */
    ua: undefined, /* UserAgent will be copied here */
    uip: undefined, /* User's IP Address will be stored here */
    components:
    [
        { name: "getIP", kind: "WebService", url: "http://jsonip.appspot.com/", handleAs: "json", onSuccess: "receivedIP" },
        { name: "getAd", kind: "WebService", url: this.adserver, handleAs: "text", onSuccess: "receivedAd" },
        { name: "webView", kind: "WebView", flex: 1 },
    ],
    create: function()
    {
        this.inherited(arguments);
        this.$.getIP.call();
        this.ua = navigator.userAgent;
    },
    receivedIP: function(inSender, inResponse, inRequest)
    {
        var deviceInfo = enyo.fetchDeviceInfo();
        this.uip = inResponse.ip;
        this.auid = deviceInfo.serialNumber;
        this.loadAd();
    },
    loadAd: function()
    {
        var params;
        if(!this.uip)
        {
            this.$.getIP.call();
            return;
        }
        params = {
            "apid": this.apid,
            "auid": this.auid,
            "ua": this.ua,
            "uip": this.uip,
        };
        enyo.mixin(params, this.metadata);
        this.$.getAd.setUrl(this.adserver);
        this.log("loading ad with parameters", params);
        this.$.getAd.call(params);
    },
    receivedAd: function(inSender, inResponse, inRequest)
    {
        this.$.webView.setHtml(inResponse);
    }
})