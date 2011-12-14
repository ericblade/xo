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
                        { name: "ServerInput", kind: "Input", autoCapitalize: "lowercase", autocorrect: false, spellcheck: false, autoWordComplete: false, value: "uidemo.com:88", onchange: "changedServer", value: prefs.get("serverip"), },
                    ]
                },
                { kind: "VFlexBox", components:
                    [
                        { content: "Username", },
                        { kind: "Spacer", },
                        { name: "UserInput", kind: "Input", autoCapitalize: "lowercase", autocorrect: false, spellcheck: false, autoWordComplete: false, value: "uiuser", onchange: "changedUsername", value: prefs.get("username"), },
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
    },
    components: [
        { caption: "Play Now", onclick: "playSong" },
        { caption: "Play Next", onclick: "insertSong" },
        { caption: "Add to Now Playing", onclick: "addSong" },
    ],
    playSong: function() { this.doPlaySong(this.song); },
    insertSong: function() { this.doInsertSong(this.song); },
    addSong: function() { this.doAddSong(this.song); },
});

enyo.kind({
    name: "NowPlayingMenu",
    kind: enyo.Menu,
    components: [
        { caption: "Remove from Now Playing" },
    ]
})
