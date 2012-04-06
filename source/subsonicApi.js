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
    name: "httpsService",
    kind: "PalmService",
    service: "palm://com.ericblade.googlevoiceapp.service/",
    onFailure: "apiFailure",
    method: "httpsRequest",
    published: {
        url: "",
        handleAs: "",
    }
});
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
        //service: "palm://com.ericblade.googlevoiceapp.service/", method: "httpsRequest", onFailure: "sslFailure", onSuccess: "sslSuccess"
        { name: "ssSecureAPI", kind: "httpsService", service: "palm://com.ericblade.googlevoiceapp.service/", onFailure: "apiFailure", method: "httpsRequest", components:
            [
                { contentType: "charset=utf-8" },
                { name: "sping", file: "ping.view", onSuccess: "pingSuccess", },
                { name: "sgetLicense", file: "getLicense.view", onSuccess: "licenseSuccess", },
                { name: "sgetMusicFolders", file: "getMusicFolders.view", onSuccess: "gotMusicFolders", },
                { name: "sgetNowPlaying", file: "getNowPlaying.view", onSuccess: "gotNowPlaying" },
                { name: "sgetIndexes", file: "getIndexes.view", onSuccess: "indexReceived" },
                { name: "sgetMusicDirectory", file: "getMusicDirectory.view", onSuccess: "directoryReceived" },
                { name: "ssearch", file: "search2.view", onSuccess: "gotSearch", },
                { name: "sgetPlaylists", file: "getPlaylists.view", onSuccess: "gotPlaylists", },
                { name: "sgetPlaylist", file: "getPlaylist.view", onSuccess: "gotPlaylist", },
                { name: "screatePlaylist", file: "createPlaylist.view", onSuccess: "createdPlaylist", },
                { name: "sdeletePlaylist", file: "deletePlaylist.view", onSuccess: "deletedPlaylist", },
                { name: "sdownload", file: "download.view", onSuccess: "downloaded" },
                { name: "sstream", file: "stream.view", onSucess: "streamed", },
                { name: "sgetCoverArt", file: "getCoverArt.view", onSuccess: "gotCoverArt", },
                { name: "sscrobble", file: "scrobble.view", onSuccess: "scrobbled", },
                { name: "schangePassword", file: "changePassword.view", onSuccess: "changedPassword", },
                { name: "sgetUser", file: "getUser.view", onSuccess: "gotUser", },
                { name: "screateUser", file: "createUser.view", onSuccess: "createdUser", },
                { name: "sdeleteUser", file: "deleteUser.view", onSuccess: "deletedUser", },
                { name: "sgetChatMessages", file: "getChatMessages.view", onSuccess: "gotChatMessages", },
                { name: "saddChatMessage", file: "addChatMessage.view", onSuccess: "addedChatMessage", },
                { name: "sgetAlbumList", file: "getAlbumList.view", onSuccess: "albumListReceived" },
                { name: "sgetRandomSongs", file: "getRandomSongs.view", onSuccess: "gotRandomSongs" },
                { name: "sgetLyrics", file: "getLyrics.view", onSuccess: "gotLyrics",  },
                { name: "sjukeboxControl", file: "jukeboxControl.view", onSuccess: "controlledJukebox", },
                { name: "sgetPodcasts", file: "getPodcasts.view", onSuccess: "gotPodcasts", },
                { name: "sgetShares", file: "getShares.view", onSuccess: "gotShares" },
                { name: "screateShare", file: "createShare.view", onSuccess: "createdShare", },
                { name: "supdateShare", file: "updateShare.view", onSuccess: "updatedShare", },
                { name: "sdeleteShare", file: "deleteShare.view", onSuccess: "deletedShare", },
                { name: "ssetRating", file: "setRating.view", onSuccess: "setRating", },
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
        "onError": "",
        "onServerActivity": "",
    },
    apiFailure: function(inSender, inResponse, inRequest)
    {
        enyo.log("apiFailure: " + inSender + inResponse + inRequest);
        enyo.log("request Name: " + inRequest.name);
    },
    checkError: function(inResp)
    {
        this.doServerActivity(false);
        if(!inResp) {
            this.log("checkError called with no response?");
            return true;
        }
        if(!inResp["subsonic-response"]) {
            this.log("checkError called with no subsonic-response component?");
            return true;
        }
        if(inResp["subsonic-response"].error)
        {
            this.doError(inResp["subsonic-response"].error)
            return true;
        }
        return false;
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
            this.log(name + " " + params);

        var userid = prefs.get("username");
        var password = prefs.get("password");
        var req;
        var server = prefs.get("serverip");
        
        if(server.indexOf("https") == 0 && Platform.isWebOS())
        {
            req = this.$["s"+name];
        } else {
            req = this.$[name];
        }
               
        if(!params)
            params = { };
        params.u = userid;
        params.p = password;
        params.v = "1.7.0";
        params.c = "XO-" + Platform.platform;
        
        if(!params.f)
            params.f = "json";

        if(!req.getUrl() || req.getUrl() == "")
        {
            server = sanitizeServer(server);
            req.setUrl(server + "/rest/" + req.file);
            req.setHandleAs(params.f == "json" ? "json" : "xml");
        }
        if(Platform.isWebOS() && server.indexOf("https") == 0)
        {
            var pathString = "";
            var x;
            var counter = 0;
            for(x in params)
            {
                if(counter == 0)
                    pathString += "?";
                else
                    pathString += "&";
                pathString += x + "=" + params[x];
                counter++;
            }
            var port = server.substr(server.lastIndexOf(":")+1, server.length);
            this.log("server after port yanking=", server);
            var httpParams = {
                host: server.substr(8, server.lastIndexOf(":")-8),
                port: port || "443",
                path: "/rest/" + req.file + pathString,
                method: "GET"
            };
            this.log("***** MAKING HTTPS CALL WITH PARAMETERS", httpParams);
            req.call(httpParams);
        } else {
            this.log("**** Making normal call ");
            req.call(params);
        }
        if(params.action != "status")
            this.doServerActivity(true);
    },
    createdShare: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    updatedShare: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    deletedShare: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    setRating: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    changedPassword: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    gotUser: function(inSender, inResponse, inRequest) {
        this.log("resp", inResponse, "req", inRequest);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        this.log("data", inResponse);
        this.log("sr", inResponse["subsonic-response"]);
        if(!this.checkError(inResponse))
            if(inResponse && inResponse["subsonic-response"])
                this.doReceivedUser(inResponse["subsonic-response"].user);
    },
    createdUser: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    deletedUser: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    gotChatMessages: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    addedChatMessage: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    albumListReceived: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        this.log();
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doAlbumListReceived(inResponse["subsonic-response"]);
    },
    gotRandomSongs: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        this.log();
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doRandomSongsReceived(inResponse["subsonic-response"]);
    },
    gotLyrics: function(inSender, inResponse, inRequest) {
// no lyrics: {"subsonic-response":{"lyrics":"","status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}        
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    controlledJukebox: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
        {
            var x = inResponse["subsonic-response"];
            if(x.jukeboxPlaylist)
                this.doJukeboxPlaylist(x.jukeboxPlaylist);
            else
                this.doJukeboxStatus(x.jukeboxStatus);
        }
    },
    gotPodcasts: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    gotShares: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    gotPlaylists: function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        //{"subsonic-response":{"playlists":{"playlist":{"id":"72616e646f6d20706c61796c6973742e6d3375","name":"random playlist"}},"status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doReceivedPlaylists(inResponse["subsonic-response"]);
    },
    gotPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doReceivedPlaylist(inResponse["subsonic-response"].playlist.entry || inResponse["subsonic-response"].playlist);
    },
    createdPlaylist: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    deletedPlaylist: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doDeletedPlaylist();
    },
    downloaded: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    streamed: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    gotCoverArt: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    scrobbled: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    pingSuccess: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    licenseSuccess: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
        {            
            this.log(inResponse, inRequest);
            this.doLicenseReceived(inResponse["subsonic-response"]);
        }
    },
    gotMusicFolders: function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        this.log(inResponse, inRequest);
        if(!this.checkError(inResponse))
            this.doReceivedFolders(inResponse["subsonic-response"]);
    },
    gotNowPlaying:  function(inSender, inResponse, inRequest) {
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.log(inResponse, inRequest);
    },
    indexReceived:  function(inSender, inResponse, inRequest) {
        //this.log(inResponse, inRequest);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doReceivedIndexes(inResponse["subsonic-response"], inRequest);
    },
    directoryReceived:  function(inSender, inResponse, inRequest) {
        //this.log(inResponse["subsonic-response"]);
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doDirectoryReceived(inResponse["subsonic-response"], inRequest);
    },
    gotSearch: function(inSender, inResponse, inRequest) {
        this.log(inResponse, inRequest);        
        inResponse = (inResponse.data ? enyo.json.parse(inResponse.data) : inResponse);
        if(!this.checkError(inResponse))
            this.doSearchResults(inResponse["subsonic-response"]["searchResult2"]);
    },
})