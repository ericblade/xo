enyo.kind({
    name: "subsonic.api",
    kind: "Component",
    components: [
        { name: "ssAPI", kind: "WebService", onFailure: "apiFailure", components:
            [
                { contentType: "charset=utf-8" },
                { name: "ping", file: "ping.view", onSuccess: "pingSuccess", },
                { name: "getLicense", file: "getLicense.view", onSuccess: "licenseSuccess", },
                { name: "getMusicFolders", file: "getMusicFolders.view", onSuccess: "gotMusicFolders", },
                { name: "getNowPlaying", file: "getNowPlaying.view", onSuccess: "gotNowPlaying" },
                { name: "getIndexes", file: "getIndexes.view", onSuccess: "indexReceived" },
                { name: "getMusicDirectory", file: "getMusicDirectory.view", onSuccess: "directoryReceived" },
                { name: "search", file: "search2.view", onSuccess: "gotSearch", },
                { name: "getPlaylists", file: "getPlaylists.view", onSuccess: "gotPlaylists", },
                { name: "getPlaylist", file: "getPlaylist.view", onSuccess: "gotPlaylist", },
                { name: "createPlaylist", file: "createPlaylist.view", onSuccess: "createdPlaylist", },
                { name: "deletePlaylist", file: "deletePlaylist.view", onSuccess: "deletedPlaylist", },
                { name: "download", file: "download.view", onSuccess: "downloaded" },
                { name: "stream", file: "stream.view", onSucess: "streamed", },
                { name: "getCoverArt", file: "getCoverArt.view", onSuccess: "gotCoverArt", },
                { name: "scrobble", file: "scrobble.view", onSuccess: "scrobbled", },
                { name: "changePassword", file: "changePassword.view", onSuccess: "changedPassword", },
                { name: "getUser", file: "getUser.view", onSuccess: "gotUser", },
                { name: "createUser", file: "createUser.view", onSuccess: "createdUser", },
                { name: "deleteUser", file: "deleteUser.view", onSuccess: "deletedUser", },
                { name: "getChatMessages", file: "getChatMessages.view", onSuccess: "gotChatMessages", },
                { name: "addChatMessage", file: "addChatMessage.view", onSuccess: "addedChatMessage", },
                { name: "getAlbumList", file: "getAlbumList.view", onSuccess: "albumListReceived" },
                { name: "getRandomSongs", file: "getRandomSongs.view", onSuccess: "gotRandomSongs" },
                { name: "getLyrics", file: "getLyrics.view", onSuccess: "gotLyrics",  },
                { name: "jukeboxControl", file: "jukeboxControl.view", onSuccess: "controlledJukebox", },
                { name: "getPodcasts", file: "getPodcasts.view", onSuccess: "gotPodcasts", },
                { name: "getShares", file: "getShares.view", onSuccess: "gotShares" },
                { name: "createShare", file: "createShare.view", onSuccess: "createdShare", },
                { name: "updateShare", file: "updateShare.view", onSuccess: "updatedShare", },
                { name: "deleteShare", file: "deleteShare.view", onSuccess: "deletedShare", },
                { name: "setRating", file: "setRating.view", onSuccess: "setRating", },
            ]
        },
    ],
    events: {
        "onLicenseError": "",
        "onLicenseReceived": "",
        "onAlbumListReceived": "",
        "onDirectoryReceived": "",
    },
    serverChanged: function()
    {
        for(x in this.$)
        {
            if(this.$[x].setUrl)
                this.$[x].setUrl("");
        }
    },
    call: function(name, params)
    {
        this.log(name, params);

        var userid = prefs.get("username");
        var password = prefs.get("password");
        var req = this.$[name];
        
        if(!params)
            params = { };
        params.u = userid;
        params.p = password;
        params.v = "1.6.0";
        params.c = "XO(webOS)(development)";
        if(!params.f)
            params.f = "json";
        if(!req.getUrl() || req.getUrl() == "")
        {
            req.setUrl("http://" + prefs.get("serverip") + "/rest/" + req.file);
            req.setHandleAs(params.f == "json" ? "json" : "xml");
        }
        
        req.call(params);
    },
    createdShare: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    updatedShare: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    deletedShare: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    setRating: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    changedPassword: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotUser: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    createdUser: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    deletedUser: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotChatMessages: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    addedChatMessage: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    albumListReceived: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        this.log();
        this.doAlbumListReceived(inResponse["subsonic-response"]);
    },
    gotRandomSongs: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotLyrics: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    controlledJukebox: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotPodcasts: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotShares: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotPlaylists: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    createdPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    deletedPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    downloaded: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    streamed: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotCoverArt: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    scrobbled: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    pingSuccess: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    licenseSuccess: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
        if(!inResponse["subsonic-response"]) return;
        if(inResponse["subsonic-response"].error)
        {
            this.doLicenseError(inResponse["subsonic-response"].error);
        } else {
            this.doLicenseReceived(inResponse["subsonic-response"]);
        }
    },
    gotMusicFolders: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotNowPlaying:  function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    indexReceived:  function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    directoryReceived:  function(inSender, inResponse, inRequest) {
        this.log();
        this.doDirectoryReceived(inResponse["subsonic-response"]);
    },
    gotSearch: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
})