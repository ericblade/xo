enyo.kind({
    name: "IntroPopup",
    kind: "Popup",
    components: [
        { name: "WebLauncher", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", },
        //{ kind: "Item", content: "XOlabel", name: "Label" },
        { kind: "Item", content: "What is XO?", onclick: "clickwhat" },
        { kind: "Item", content: "Help", onclick: "clickhelp" },
        { kind: "Item", content: "If you like XO, please leave a review", onclick: "clickreview" },
        { kind: "Item", content: "If you don't, please let me know why.", onclick: "clickemail" },
        { kind: "Item", content: "Continue :-)", onclick: "close" },
    ],
    rendered: function() {
        this.inherited(arguments);
        //this.$.Label.setContent("XO - platform: " + Platform.getPlatformName());
    },
    clickreview: function(inSender, inEvent) {
        var url = Platform.getReviewURL();
        enyo.log("Review URL:" + url);
        if(url != "")
            Platform.browser(Platform.getReviewURL(), this)();
        inEvent.preventDefault();
        inEvent.stopPropagation();
        return true;
    },
    clickemail: function() {
        var url = "mailto:blade.eric@gmail.com?subject=XO-email";
        Platform.browser(url, this)();
    },
    clickwhat: function()
    {
        var url = "http://www.ericbla.de/gvoice-webos/xo/";
        Platform.browser(url, this)();
    },
    clickhelp: function() {
        var url = "http://ericbla.de/gvoice-webos/xo/help/";
        Platform.browser(url, this)();
    },
});

enyo.kind({
    name: "subsonic.DemoServerDialog",
    kind: "Dialog",
    flyInFrom: "bottom",
    events: {
        "onServerChanged" : "",
    },
    components: [
        { name: "WebLauncher", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", },                    
        { kind: "Group", caption: "Server Settings", components:
            [
                { content: "You are using the DEMO version of XO, and cannot change servers.  You can get the FULL version of XO by pressing the button below!" },
                { kind: "Button", caption: "Get XO!", onclick: "purchaseClick" },
            ]
        }
    ],
    purchaseClick: function(inSender, inEvent)
    {
        var url = "http://developer.palm.com/appredirect/?packageid=com.ericblade.xo";
        this.$.WebLauncher.call( { target: url });
    },
    changedServer: function(inSender, inEvent)
    {
        prefs.set("serverip", this.$.ServerInput.getValue());
        this.doServerChanged();
    },
    changedUsername: function(inSender, inEvent)
    {
        prefs.set("username", this.$.UserInput.getValue());
    },
    changedPassword: function(inSender, inEvent)
    {
        prefs.set("password", this.$.PassInput.getValue());
    }
});

enyo.kind({
    name: "subsonic.ServerDialog",
    kind: "Dialog",
    flyInFrom: "bottom",
    events: {
        "onServerChanged" : "",
    },
    components: [
        { kind: "Group", caption: "Server Settings", components:
            [
                { kind: "VFlexBox", components:
                    [
                        { content: "Server Address", },
                        { kind: "Spacer", },
                        { name: "ServerInput", kind: "Input", autoCapitalize: "lowercase", autocorrect: false, spellcheck: false, autoWordComplete: false, onchange: "changedServer", value: prefs.get("serverip"), },
                    ]
                },
                { kind: "VFlexBox", components:
                    [
                        { content: "Username", },
                        { kind: "Spacer", },
                        { name: "UserInput", kind: "Input", autoCapitalize: "lowercase", autocorrect: false, spellcheck: false, autoWordComplete: false, onchange: "changedUsername", value: prefs.get("username"), },
                    ]
                },
                { kind: "VFlexBox", components:
                    [
                        { content: "Password", },
                        { kind: "Spacer", },
                        { name: "PassInput", kind: "PasswordInput", value: "uipassword", onchange: "changedPassword", value: prefs.get("password"), },
                    ]
                },
            ]
        }
    ],
    changedServer: function(inSender, inEvent)
    {
        prefs.set("serverip", this.$.ServerInput.getValue());
        this.doServerChanged();
    },
    changedUsername: function(inSender, inEvent)
    {
        prefs.set("username", this.$.UserInput.getValue());
    },
    changedPassword: function(inSender, inEvent)
    {
        prefs.set("password", this.$.PassInput.getValue());
    }
});

// TODO: "Go To Album" for use when we find a song via random selection?
enyo.kind({
    name: "SongMenu",
    kind: enyo.Menu,
    published: {
        song: undefined,
    },
    events: {
        "onPlaySong": "",
        "onInsertSong": "",
        "onAddSong": "",
        "onDownloadSong": "",
    },
    components: [
        { name: "PlayNowButton", caption: "Play Now", onclick: "playSong" },
        { caption: "Play Next", onclick: "insertSong" },
        { caption: "Add to Now Playing", onclick: "addSong" },
        { name: "DownloadButton", caption: "Download", onclick: "downloadSong", disabled: true },
    ],
    afterOpen: function() {
        this.inherited(arguments);
        if(enyo.application.subsonicUser.downloadRole)
            this.$.DownloadButton.setDisabled(false);
        if(enyo.application.jukeboxMode)
            this.$.PlayNowButton.hide();
        else
            this.$.PlayNowButton.show();
    },
    playSong: function() { this.doPlaySong(this.song); },
    insertSong: function() { this.doInsertSong(this.song); },
    addSong: function() { this.doAddSong(this.song); },
    downloadSong: function() { this.doDownloadSong(this.song); }
});

enyo.kind({
    name: "NowPlayingMenu",
    kind: enyo.Menu,
    published: {
        song: undefined,
    },
    events: {
        "onRemoveSong": "",
    },
    components: [
        { caption: "Remove from Now Playing", onclick: "removeSong" },
    ],
    removeSong: function() { this.doRemoveSong(this.song); },
});

enyo.kind({
    name: "ErrorDialog",
    kind: "Dialog",
    flyInFrom: "bottom",    
    published: {
        message: "",
    },
    components: [
        { name: "MessageBox", content: "Error" },
    ],
    messageChanged: function() {
        this.$.MessageBox.setContent(this.message);
    }
});
