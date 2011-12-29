enyo.kind({
    name: "xolauncher",
    kind: "VFlexBox",
    components: [
        { kind: "ApplicationEvents", onLoad: "onload", onApplicationRelaunch: "onrelaunch" },
    ],
    onload: function(inSender, x)
    {
        this.log("windowType=", enyo.windowParams.windowType);
        enyo.application.windowType = enyo.windowParams.windowType;
        if(enyo.windowParams.windowType == "dockModeWindow")
            enyo.windows.openWindow("index-normal.html", "eXhibitOn", {}, {window: "dockMode"});
        else
            enyo.windows.openWindow("index-normal.html", "XO", {}, { });
    },
    onrelaunch: function(inSender, x)
    {
        this.log("windowType=", enyo.windowParams.windowType);
        enyo.application.windowType = enyo.windowParams.windowType;
        if(enyo.windowParams.windowType == "dockModeWindow")
            enyo.windows.openWindow("index-normal.html", "eXibitiOn", {}, {window: "dockMode"});
        else
            enyo.windows.openWindow("index-normal.html", "XO", {}, { });
    }
})