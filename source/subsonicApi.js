/* [20111207-04:32:39.929290] info: subsonic.api.pingSuccess():
  {
    "subsonic-response": {
        "error": {
            "code":60,
            "message":"The trial period for the Subsonic server is over. Please donate to get a license key. Visit subsonic.org for details."
        },
        "status":"failed",
        "version":"1.7.0",
        "xmlns":"http://subsonic.org/restapi"
    }
} */

// TODO: if we can't reach the service, for some reason, we get back a pingSuccess() and licenseSuccess() with no result .. must check error codes.

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
        "onReceivedPlaylists": "",
        "onReceivedPlaylist": "",
        "onSearchResults": "",
        "onReceivedFolders": "",
        "onReceivedIndexes": "",
        "onRandomSongsReceived": "",
        "onDeletedPlaylist":"",
        "onReceivedUser":"",
        "onJukeboxPlaylist":"",
        "onJukeboxStatus":"",
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
        if(name != "jukeboxControl" || params.action != "status")
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
        this.doReceivedUser(inResponse["subsonic-response"].user);
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
        //this.log(inResponse, inRequest);
        this.log();
        this.doRandomSongsReceived(inResponse["subsonic-response"]);
    },
    gotLyrics: function(inSender, inResponse, inRequest) {
// no lyrics: {"subsonic-response":{"lyrics":"","status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}        
        this.log(inResponse, inRequest);
    },
    controlledJukebox: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        var x = inResponse["subsonic-response"];
        if(x.jukeboxPlaylist)
            this.doJukeboxPlaylist(x.jukeboxPlaylist);
        else
            this.doJukeboxStatus(x.jukeboxStatus);
    },
    gotPodcasts: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotShares: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    gotPlaylists: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        //{"subsonic-response":{"playlists":{"playlist":{"id":"72616e646f6d20706c61796c6973742e6d3375","name":"random playlist"}},"status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}
        this.doReceivedPlaylists(inResponse["subsonic-response"]);
    },
    gotPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
        this.doReceivedPlaylist(inResponse["subsonic-response"].playlist.entry || inResponse["subsonic-response"].playlist);
    },
    createdPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    deletedPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
        this.doDeletedPlaylist();
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
        this.doReceivedFolders(inResponse["subsonic-response"]);
    },
    gotNowPlaying:  function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
    },
    indexReceived:  function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        this.doReceivedIndexes(inResponse["subsonic-response"], inRequest);
    },
    directoryReceived:  function(inSender, inResponse, inRequest) {
        //this.log(inResponse["subsonic-response"]);
        this.doDirectoryReceived(inResponse["subsonic-response"], inRequest);
    },
    gotSearch: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);        
        this.doSearchResults(inResponse["subsonic-response"]["searchResult2"]);
    },
})