enyo.kind({
    name: "ArtistRepeater",
    kind: "VFlexBox",
    onSetupRow: "loadIndexArtist",
    published: {
        artists: { },
    },
    events: {
        onArtistClicked: "",
    },
    components: [
        { kind: "VirtualRepeater", onSetupRow: "loadArtist", onclick: "artistClicked", components:
            [
                { name: "IndexArtist", kind: "Item", },
            ]
        },
    ],
    loadArtist: function(inSender, inRow)
    {
        if(this.artists[inRow])
        {
            this.$.IndexArtist.setContent(this.artists[inRow].name);
            return true;
        }
        return false;
    },
    artistClicked: function(inSender, inEvent)
    {
        this.doArtistClicked(this.artists[inEvent.rowIndex]);
    },
});
enyo.kind({
	name: "xo",
	kind: enyo.VFlexBox,
	components:
        [
            { name: "ssAPI", kind: "WebService", onFailure: "apiFailure", components:
                [
                    { contentType: "charset=utf-8" },
                    { name: "ping", file: "ping.view", onSuccess: "pingSuccess", },
                    { name: "getLicense", file: "getLicense.view", onSuccess: "licenseSuccess", },
                    { name: "getMusicFolders", file: "getMusicFolders.view", },
                    { name: "getNowPlaying", file: "getNowPlaying.view" },
                    { name: "getIndexes", file: "getIndexes.view", onSuccess: "indexReceived" },
                    { name: "getMusicDirectory", file: "getMusicDirectory.view", onSuccess: "directoryReceived" },
                    { name: "search", file: "search2.view", },
                    { name: "getPlaylists", file: "getPlaylists.view" },
                    { name: "getPlaylist", file: "getPlaylist.view" },
                    { name: "createPlayList", file: "createPlaylist.view", },
                    { name: "deletePlaylist", file: "deletePlaylist.view", },
                    { name: "download", file: "download.view", },
                    { name: "stream", file: "stream.view", },
                    { name: "getCoverArt", file: "getCoverArt.view", },
                    { name: "scrobble", file: "scrobble.view", },
                    { name: "changePassword", file: "changePassword.view" },
                    { name: "getUser", file: "getUser.view", },
                    { name: "createUser", file: "createUser.view", },
                    { name: "deleteUser", file: "deleteUser.view", },
                    { name: "getChatMessages", file: "getChatMessages.view", },
                    { name: "addChatMessage", file: "addChatMessage.view", },
                    { name: "getAlbumList", file: "getAlbumList.view", },
                    { name: "getRandomSongs", file: "getRandomSongs.view", },
                    { name: "getLyrics", file: "getLyrics.view", },
                    { name: "jukeboxControl", file: "jukeboxControl.view", },
                    { name: "getPodcasts", file: "getPodcasts.view", },
                    { name: "getShares", file: "getShares.view", },
                    { name: "createShare", file: "createShare.view", },
                    { name: "updateShare", file: "updateShare.view", },
                    { name: "deleteShare", file: "deleteShare.view", },
                    { name: "setRating", file: "setRating.view", },
                ]
            },
            {name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
                    {name: "left", width: "320px", kind:"SlidingView", components: [
                                    {kind: "Header", content:"Artists"},
                                    {kind: "Scroller", flex: 1, components:
                                        [
                                            { name: "IndexRepeater", kind: "VirtualRepeater", onSetupRow: "loadIndex", components:
                                                [
                                                    { name: "IndexDrawer", kind: "DividerDrawer", onOpenChanged: "drawerOpened", components:
                                                        [
                                                            { name: "ArtistRepeater", kind: "ArtistRepeater", onArtistClicked: "artistClicked" },
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {kind: "Toolbar", components: [
                                            {kind: "GrabButton"}
                                    ]}
                    ]},
                    {name: "middle", width: "320px", kind:"SlidingView", peekWidth: 50, components: [
                                    {kind: "Header", content:"Songs/Albums"},
                                    {kind: "Scroller", flex: 1, components:
                                        [
                                            { name: "songListRepeater", kind: "VirtualRepeater", onSetupRow: "loadSongList", components:
                                                [
                                                    { kind: "Item", components:
                                                        [
                                                            { name: "Title", kind: "Control", },
                                                            { name: "Album", kind: "Control", },
                                                        ]
                                                    }
                                                ]
                                            }    
                                        ]
                                    },
                                    {kind: "Toolbar", components: [
                                            {kind: "GrabButton"}
                                    ]}
                    ]},
                    {name: "right", kind:"SlidingView", flex: 1, components: [
                                    {kind: "Header", content:"Everything Else"},
                                    {kind: "Scroller", flex: 1, components: [
                                        { name: "junk", kind: "HtmlContent", allowHtml: true, },
                                    ]},
                                    {kind: "Toolbar", components: [
                                            {kind: "GrabButton"}
                                    ]}
                    ]}
            ]}
	],
        debug: function(str)
        {
            this.$.junk.setContent(this.$.junk.getContent() + "<br>" + str);
        },
        seturls: function(server)
        {
            this.log(this.$.ssAPI.getComponents());
            for (x in this.$.ssAPI.getComponents())
            {
                this.log(x);
                if(this.$.ssAPI.components[x].hasOwnProperty("file"))
                {
                    this.$.ssAPI.components[x].setUrl(server + this.$.ssAPI.components.file);
                    this.log(this.$.ssAPI.components[x].getUrl());
                }
            }
        },
        callApi: function(req, params)
        {
            var userid = "admin";
            var password = "subgame";
            if(!params)
                params = { };
            params.u = userid;
            params.p = password;
            params.v = "1.6.0";
            params.c = "XO(webOS)(development)";
            params.f = "json";
            if(!req.getUrl() || req.getUrl == "")
            {
                req.setUrl("http://192.168.1.124:88/rest/" + req.file);
                req.setHandleAs("json");
            }
            this.log("** calling: ", req.getUrl, params);
            req.call(params);
        },
        ready: function()
        {
            this.inherited(arguments);
            this.seturls("http://subsonic.org/rest/");
            this.callApi(this.$.ping);
            this.callApi(this.$.getLicense);
            this.callApi(this.$.getIndexes);
        },
        apiFailure: function(inSender, x, y, z)
        {
            this.log(inSender, "x", x, "y", y, "z", z);
        },
        pingSuccess: function(inSender, inResponse)
        {
            
            this.log(inResponse);
        },
        licenseSuccess: function(inSender, inResponse)
        {
            this.log(inResponse);
        },
        indexReceived: function(inSender, inResponse)
        {
            var indexlist = inResponse.getElementsByTagName("index");
            var counto = 0;
            this.indexes = new Array();
            for(var index in indexlist)
            {
                if(indexlist.hasOwnProperty(index) && indexlist[index].getAttribute)
                {
                    this.indexes[counto] = { };
                    this.indexes[counto].name = indexlist[index].getAttribute("name");
                    
                    //this.log(indexlist[index]);
                    //this.debug(indexlist[index].getAttribute("name"));
                    var artistlist = indexlist[index].getElementsByTagName("artist");
                    this.indexes[counto].artists = { };
                    var counti = 0;
                    for(var artist in artistlist)
                    {
                        if(artistlist.hasOwnProperty(artist) && artistlist[artist].getAttribute)
                        {
                            this.indexes[counto].artists[counti] = { };
                            this.indexes[counto].artists[counti].name = artistlist[artist].getAttribute("name");
                            this.indexes[counto].artists[counti].id = artistlist[artist].getAttribute("id");
                            //this.log(artist, artistlist[artist])
                            //this.debug("&nbsp;&nbsp;" + artistlist[artist].getAttribute("name"));
                            counti++;
                        }
                    }
                    counto++;
                }
            }
            this.$.IndexRepeater.render();
            //this.$.ArtistRepeater.render();
        },
        directoryReceived: function(inSender, inResponse)
        {
            var dirlist = inResponse.getElementsByTagName("directory");
            var counto = 0;
            this.directories = new Array();
            for(var index in dirlist)
            {
                if(dirlist.hasOwnProperty(index) && dirlist[index].getAttribute)
                {
                    this.directories[counto] = { };
                    this.directories[counto].id = dirlist[index].getAttribute("id");
                    this.directories[counto].id = dirlist[index].getAttribute("parent");
                    this.directories[counto].id = dirlist[index].getAttribute("name");
                    
                    var children = dirlist[index].getElementsByTagName("child");
                    this.directories[counto].children = new Array();
                    var counti = 0;
                    this.debug("name=" + this.directories[counto].name + ", id=" + this.directories[counto].id + ", parent=" + this.directories[counto].parent);
                    for(var child in children)
                    {
                        if(children.hasOwnProperty(child) && children[child].getAttribute)
                        {
                            this.directories[counto].children[counti] = { };
                            this.directories[counto].children[counti].id = children[child].getAttribute("id");
                            this.directories[counto].children[counti].parent = children[child].getAttribute("parent");
                            this.directories[counto].children[counti].title = children[child].getAttribute("title");
                            this.directories[counto].children[counti].isDir = children[child].getAttribute("isDir");
                            this.directories[counto].children[counti].album = children[child].getAttribute("album");
                            this.directories[counto].children[counti].artist = children[child].getAttribute("artist");
                            this.directories[counto].children[counti].track = children[child].getAttribute("track");
                            this.directories[counto].children[counti].genre = children[child].getAttribute("genre");
                            this.directories[counto].children[counti].coverArt = children[child].getAttribute("coverArt");
                            this.directories[counto].children[counti].size = children[child].getAttribute("size");
                            this.directories[counto].children[counti].contentType = children[child].getAttribute("contentType");
                            this.directories[counto].children[counti].suffix = children[child].getAttribute("suffix");
                            this.directories[counto].children[counti].duration = children[child].getAttribute("duration");
                            this.directories[counto].children[counti].bitRate = children[child].getAttribute("bitRate");
                            this.directories[counto].children[counti].path = children[child].getAttribute("path");
                            this.directories[counto].children[counti].transcodedContentType = children[child].getAttribute("transcodedContentType");
                            this.directories[counto].children[counti].transcodedSuffix = children[child].getAttribute("transcodedSuffix");
                            
                            this.debug(this.directories[counto].children[counti].title);
                            counti++;
                        }
                    }
                    this.$.songListRepeater.directory = this.directories[counto];
                    this.$.songListRepeater.render();
                }
            }
        },
        loadSongList: function(inSender, inRow)
        {
            var dir = this.$.songListRepeater.directory;
            var song = dir ? dir.children[inRow] : undefined;
            if(song)
            {
                if(song.isDir)
                    this.$.Title.setContent(song.title + (song.isDir == "true" ? "\\" : ""));
                this.$.Album.setContent(song.album);
                return true;
            }
            return false;
        },
        loadIndex: function(inSender, inRow)
        {
            if(this.indexes && this.indexes[inRow])
            {
                this.renderIndex = inRow;
                this.$.IndexDrawer.setCaption(this.indexes[inRow].name);
                this.$.ArtistRepeater.setArtists(this.indexes[inRow].artists);
                this.$.ArtistRepeater.render();
                return true;
            }
            return false;
        },
        drawerOpened: function(inSender, inEvent)
        {
            this.log(inSender, inEvent);
            //inSender.$.ArtistRepeater.render();        
        },
        artistClicked: function(inSender, artist)
        {            
            this.debug("clicked " + artist.name);
            this.callApi(this.$.getMusicDirectory, { id: artist.id });
        }
});
