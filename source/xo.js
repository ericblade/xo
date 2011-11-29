function isLargeScreen()
{
    return window.screen.availWidth > 480;
}

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

function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

enyo.kind({
    name: "LogView",
    kind: "VFlexBox",
    published: {
        logEntries: { },
    },
    components: [
        { kind: "Header", content: "Captain's Log" },
        { name: "client" },
        { kind: "Scroller", height: "400px", allowHtml: false, components:
            [
                { name: "logControl", kind: "Control", allowHtml: false, content: "", },
            ]
        },
    ],
    add: function(str)
    {
        str = stripHtml(str);
        if(this.$.logControl.content.length > 4096)
            this.$.logControl.content = "";
        this.$.logControl.content += "*** " + str + "\r\n<br>";
        this.log(this.$.logControl.content);
        this.render();
    },
})

enyo.kind({
    name: "xo",
    kind: enyo.Pane,
    transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin",
    components: [
        { kind: "ApplicationEvents", onBack: "doBack" },
        { name: "slider", kind: "SlidingPane", components:
            [
                { name: "LeftView", width: "50%", kind: "SlidingView", edgeDragging: true, onSelectView: "leftViewSelected", components:
                    [
                        { name: "TabBar", kind: "TabGroup", onChange: "leftTabChange", components:
                            [
                                { caption: "Home", },
                                { caption: "Music", },
                                { caption: "Search", },
                                { caption: "Playlists", },
                            ]
                        },
                        { name: "LeftPane", flex: 1,kind: "Pane", onSelectView: "leftPaneSelected", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", components:
                            [
                                { name: "HomeView", kind: "VFlexBox", components:
                                    [
                                        { kind: "Scroller", flex: 1, components:
                                            [
                                                { kind: "Item", content: "Server: UI Demonstration", onclick: "openServerDialog" },
                                                { kind: "Divider", caption: "Albums" },
                                                { kind: "Item", content: "Recently added", onclick: "selectMusicView", },
                                                { kind: "Item", content: "Random", onclick: "selectMusicView",  },
                                                { kind: "Item", content: "Top rated", onclick: "selectMusicView",  },
                                                { kind: "Item", content: "Recently played", onclick: "selectMusicView",  },
                                                { kind: "Item", content: "Most played", onclick: "selectMusicView", },
                                            ]
                                        },
                                    ]
                                },
                                { name: "MusicView", kind: "VFlexBox", components:
                                    [
                                        { kind: "Item", onclick: "selectPlayerView", components:
                                            [
                                                { kind: "HFlexBox", components:
                                                    [
                                                        { name: "AlbumArt", /*style: "display: inline;",*/ height: "48px", width: "48px", kind: enyo.Image, src: "http://images2.fanpop.com/images/photos/4100000/-21st-Century-Breakdown-Album-Cover-Art-Large-Version-green-day-4121729-900-900.jpg" },
                                                        { name: "AlbumItem", style: "padding-left: 5px; ",pack: "center", kind: "HFlexBox", components:
                                                            [
                                                                { kind: "VFlexBox", pack: "center", flex: 1, components:
                                                                    [
                                                                        { content: "Album Name One", },
                                                                        { content: "Artist Name One", className: "enyo-item-ternary" },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                        { kind: "Item", onclick: "selectPlayerView", components:
                                            [
                                                { kind: "HFlexBox", components:
                                                    [
                                                        { name: "AlbumArtTwo", /*style: "display: inline;",*/ height: "48px", width: "48px", kind: enyo.Image, src: "http://images2.fanpop.com/images/photos/4100000/-21st-Century-Breakdown-Album-Cover-Art-Large-Version-green-day-4121729-900-900.jpg" },
                                                        { name: "AlbumItemTwo", style: "padding-left: 5px; ", pack: "center", kind: "HFlexBox", components:
                                                            [
                                                                { kind: "VFlexBox", pack: "center", flex: 1, components:
                                                                    [
                                                                        { content: "Album Name Two", },
                                                                        { content: "Artist Name Two", className: "enyo-item-ternary" },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                                { name: "SearchView", kind: "VFlexBox", components:
                                    [
                                        { kind: "SearchInput", },
                                        { kind: "Divider", caption: "Artists" },
                                        { kind: "Item", content: "Artist 1", onclick: "selectMusicView", },
                                        { kind: "Item", content: "Artist 2", onclick: "selectMusicView", },
                                        { kind: "Divider", caption: "Albums" },
                                        { kind: "Item", onclick: "selectPlayerView", components:
                                            [
                                                { kind: "HFlexBox", components:
                                                    [
                                                        { height: "48px", width: "48px", kind: enyo.Image, src: "http://images2.fanpop.com/images/photos/4100000/-21st-Century-Breakdown-Album-Cover-Art-Large-Version-green-day-4121729-900-900.jpg" },
                                                        { style: "padding-left: 5px; ", pack: "center", kind: "HFlexBox", components:
                                                            [
                                                                { kind: "VFlexBox", pack: "center", flex: 1, components:
                                                                    [
                                                                        { content: "Album Name One", },
                                                                        { content: "Artist Name One", className: "enyo-item-ternary" },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                        { kind: "Divider", caption: "Songs" },
                                        { kind: "Item", onclick: "selectPlayerView", components:
                                            [
                                                { content: "Song Name 1" },
                                                { kind: "HFlexBox", components:
                                                    [
                                                        { content: "Song Artist", className: "enyo-item-ternary" },
                                                        { kind: "Spacer" },
                                                        { content: "Song Album", className: "enyo-item-ternary"  },
                                                        { kind: "Spacer", },
                                                        { content: "128kbps mp3", className: "enyo-item-ternary"  },
                                                        { kind: "Spacer", },
                                                        { content: "5:42", className: "enyo-item-ternary" },
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { name: "PlaylistView", kind: "VFlexBox", components:
                                    [
                                        { kind: "Item", content: "Playlist 1", onclick: "selectPlayerView", },
                                        { kind: "Item", content: "Playlist 2", onclick: "selectPlayerView", },
                                        { kind: "Item", content: "Playlist 3", onclick: "selectPlayerView", },
                                    ]
                                },
                            ]
                        },
                        /*{ kind: "Toolbar", components:
                            [
                                {kind: "GrabButton"},
                                { kind: "ToolButton", caption: "Stop", onclick: "stopAudio", }
                            ]
                        }*/
                    ]
                },
                { name: "RightView", kind: "SlidingView", /*dismissible: true,*/ edgeDragging: true, components:
                    [
                        { name: "MusicPlayer", kind: "Sound", preload: true, audioClass: "media", controls: "True", },
                        { kind: "VFlexBox", style: "background: black;", flex: 1, components:
                            [
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Spacer", },
                                        { kind: enyo.Image, height: isLargeScreen() ? "320px" : "240px", src: "http://images2.fanpop.com/images/photos/4100000/-21st-Century-Breakdown-Album-Cover-Art-Large-Version-green-day-4121729-900-900.jpg" },
                                        { kind: "Spacer", },
                                    ]
                                },
                                { kind: "Spacer", },
                                { kind: "HFlexBox", components:
                                    [
                                        { name: "ArtistNameLabel", content: "Artist Name", style: "color: white", },
                                        { kind: "Spacer", },
                                        { name: "AlbumNameLabel", content: "Album Name", style: "color: white", },
                                    ]
                                },
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Spacer", },
                                        { name: "SongNameLabel", content: "Song Name", style: "color: white", },
                                        { kind: "Spacer", },
                                    ]
                                },
                                { kind: "VFlexBox", components:
                                    [
                                        { kind: "ProgressSlider", barPosition: 10, altBarPosition: 10, position: 10, style: "padding-left: 2px; padding-right: 2px;" },
                                        { kind: "HFlexBox", components:
                                            [
                                                { content: "0:00", className: "enyo-item-ternary", pack: "center" },
                                                { kind: "Spacer", },
                                                { name: "MediaLengthLabel", content: "5:43", pack: "center", className: "enyo-item-ternary" },                                                
                                            ]
                                        }
                                    ]
                                },
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Spacer", },
                                        { kind: "Button", caption: "Prev", },
                                        { kind: "Button", caption: "Play/Pause", },
                                        { kind: "Button", caption: "Next", },
                                        { kind: "Spacer", },
                                    ]
                                },
                                /*{ kind: "Toolbar", components:
                                    [
                                        {kind: "GrabButton"},
                                        { kind: "ToolButton", caption: "Stop", onclick: "stopAudio", }
                                    ]
                                }                                */
                            ]                            
                        },                        
                    ]
                }
            ]
        },
        { kind: "VFlexBox", components:
            [
                { name: "serverDialog", style: "max-width: 50%; width: 320px", kind: "Dialog", flyInFrom: "bottom", components:
                    [
                        { kind: "VFlexBox", components:
                            [
                                { content: "Server Address", },
                                { kind: "Spacer", },
                                { kind: "Input", value: "uidemo.com:88", },
                            ]
                        },
                        { kind: "VFlexBox", components:
                            [
                                { content: "Username", },
                                { kind: "Spacer", },
                                { kind: "Input", value: "uiuser", },
                            ]
                        },
                        { kind: "VFlexBox", components:
                            [
                                { content: "Password", },
                                { kind: "Spacer", },
                                { kind: "Input", value: "uipassword" },
                            ]
                        },
                    ]
                },
            ]
        },

    ],
    openServerDialog: function()
    {
        this.$.serverDialog.openAtCenter();
    },
    doBack: function(inSender, inEvent)
    {
        this.$.slider.back();
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    },
    selectMusicView: function()
    {
        this.$.LeftPane.selectViewByName("MusicView");
    },
    selectSearchView: function()
    {
        this.$.LeftPane.selectViewByName("SearchView");
    },
    selectPlaylistView: function()
    {
        this.$.LeftPane.selectViewByName("PlaylistView");
    },
    selectHomeView: function()
    {
        this.$.LeftPane.selectViewByName("HomeView");
    },
    selectPlayerView: function()
    {
        this.$.RightView.show();
        this.$.slider.selectViewByName("RightView");
    },
    leftTabChange: function(inSender)
    {
        this.log("Selected Tab " + inSender.getValue());
        this.$.LeftPane.selectViewByIndex(inSender.getValue());
    },
    leftViewSelected: function(inSender, inNewView, inPrevView)
    {
        this.log("selected view ", inNewView.index);
    },
    leftPaneSelected: function(inSender, inNewView, inPrevView)
    {
        this.log("selected pane view", inNewView, inPrevView);
        switch(inNewView.name)
        {
            case "MusicView":
                inNewView.index = 1;
                this.ForceTabSet = true;
                break;
        }
        if(inNewView.index)
            this.$.TabBar.setValue(inNewView.index);
    }
})

enyo.kind({
	name: "xo.old",
	kind: enyo.VFlexBox,
	components:
        [
            { name: "MusicPlayer", kind: "Sound", preload: true, audioClass: "media", },
            { name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
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
                    { name: "getAlbumList", file: "getAlbumList.view", onSuccess: "albumListReceived" },
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
            { name: "MainPane", flex: 1, kind: "Pane", transitionKind: enyo.transitions.Fade, components:
                [
                    { name: "Log", kind: "LogView", components:
                        [
                            { name: "LogSpinner", kind: "SpinnerLarge" },
                        ]
                    },
                    { name: "PrimaryView", flex: 1, kind: "VFlexBox", components:
                        [
                            {name: "slidingPane", flex: 1, kind: "SlidingPane", components:
                                [
                                    { name: "left", width: "320px", kind:"SlidingView", components:
                                        [
                                            { kind: "TabGroup", onChange: "leftTabChange", components:
                                                [
                                                    { caption: "Artists" },
                                                    { caption: "Albums", },
                                                    { caption: "Random" },
                                                ]
                                            },
                                            { name: "LeftPane", kind: "Pane", transitionKind:"TestTransition", flex: 1, components:
                                                [
                                                    { name: "ArtistView", kind: "VFlexBox", components:
                                                        [
                                                            {kind: "Scroller", flex: 1, components:
                                                                [
                                                                    { name: "IndexRepeater", flex: 1, kind: "VirtualRepeater", onSetupRow: "loadIndex", components:
                                                                        [
                                                                            { name: "IndexDrawer", kind: "DividerDrawer", onOpenChanged: "drawerOpenedOrClosed", components:
                                                                                [
                                                                                    { name: "ArtistRepeater", kind: "ArtistRepeater", onArtistClicked: "artistOrAlbumClicked" },
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                        ]
                                                    },
                                                    { name: "AlbumView", kind: "VFlexBox", components:
                                                        [
                                                            { kind: "Scroller", flex: 1, components:
                                                                [
                                                                    { name: "AlbumRepeater", kind: "VirtualRepeater", onSetupRow: "loadAlbum", onclick: "albumClicked", components:
                                                                        [
                                                                            { kind: "HFlexBox", components:
                                                                                [
                                                                                    { name: "AlbumArt", height: "48px", width: "48px", kind: enyo.Image },
                                                                                    { name: "AlbumItem", kind: "Item" },
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },                                    
                                                    { name: "RandomView", kind: "VFlexBox", components:
                                                        [
                                                            { kind: "Scroller", flex: 1, components:
                                                                [
                                                                    { name: "RandomRepeater", kind: "VirtualRepeater", onSetupRow: "loadRandom", components:
                                                                        [
                                                                            { name: "RandomItem", kind: "Item" },
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            { kind: "Toolbar", components:
                                                [
                                                    {kind: "GrabButton"}
                                                ]
                                            }
                                        ]
                                    },
                                    {name: "middle", width: "320px", kind:"SlidingView", peekWidth: 50, components: [
                                                    {kind: "Header", content:"Songs/Albums"},
                                                    {kind: "Scroller", flex: 1, components:
                                                        [
                                                            { name: "songListRepeater", kind: "VirtualRepeater", onSetupRow: "loadSongList", onclick: "songClicked", components:
                                                                [
                                                                    { kind: "HFlexBox", components:
                                                                        [
                                                                            { name: "CoverArt", kind: enyo.Image, height: "48px", width: "48px", },
                                                                            { name: "SongItem", kind: "Item", components:
                                                                                [
                                                                                    { name: "Title", kind: "Control", },
                                                                                    { name: "Album", kind: "Control", },
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
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
                                                            {kind: "GrabButton"},
                                                            { kind: "ToolButton", caption: "Stop", onclick: "stopAudio", }
                                                    ]}
                                    ]}
                            ]},
                        ]
                    },
                ]
            }
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
            var userid = "slow";
            var password = "slow";
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
                req.setUrl("http://www.ericbla.de:88/rest/" + req.file);
                req.setHandleAs( params.f == "json" ? "json" : "xml");
            }
            this.log("** calling: ", req.getUrl, params);
            req.call(params);
        },
        leftTabChange: function(inSender)
        {
            this.log("Selected Tab " + inSender.getValue());
            this.$.LeftPane.selectViewByIndex(inSender.getValue());
        },
        delayedStartup: function()
        {
            this.$.Log.add("Setting up sonar . . .");
            this.seturls("http://www.ericbla.de:88/rest/");
            this.callApi(this.$.ping);
            //this.log("musicplayer=", this.$.MusicPlayer);            
        },
        rendered: function()
        {
            this.inherited(arguments);
            this.$.LogSpinner.show();
            this.$.Log.add("Main screen turn on.");
            enyo.asyncMethod(this, "delayedStartup");
        },
        apiFailure: function(inSender, x, y, z)
        {
            this.log(inSender, "x", x, "y", y, "z", z);
        },
        pingSuccess: function(inSender, inResponse)
        {
            this.$.Log.add("Contact received."); // TODO: Play PING
            this.callApi(this.$.getLicense);            
        },
        licenseSuccess: function(inSender, inResponse)
        {
            this.log(inResponse);
            this.callApi(this.$.getIndexes, { f: "xml", });
            this.$.Log.add("Comm channels open.");
            this.$.Log.add("Receiving file index."); // TODO: Play PING
        },
        indexReceived: function(inSender, inResponse, inRequest)
        {
            this.$.Log.add("Processing file index . . .");
            enyo.asyncMethod(this, "processIndex", inSender, inResponse, inRequest);
        },
        processIndex: function(inSender, inResponse, inRequest)
        {
            enyo.log(inSender, inResponse, inRequest, inRequest.xhr.readyState, inRequest.xhr.status);
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
            this.$.Log.add("Receiving Album list.");
            this.callApi(this.$.getAlbumList, { type: "newest", size: "50" }); // TODO: make this load over time ?            
            this.$.ArtistRepeater.render();
            this.$.LogSpinner.hide();
            this.$.Log.add("XO, you have the Conn.");
            this.$.MainPane.selectViewByName("PrimaryView");
            
        },
        directoryReceived: function(inSender, inResponse)
        {
/*
    {
        "subsonic-response":
        {
            "directory":
            {
                "child":
                {
                    "artist":"Alice In Chains",
                    "coverArt":"633a5c6d757369635c416c6963655f496e5f436861696e735c426c61636b2047697665732057617920546f20426c75655c436f7665722e6a7067",
                    "id":"633a5c6d757369635c416c6963655f496e5f436861696e735c426c61636b2047697665732057617920546f20426c7565",
                    "isDir":true,
                    "parent":"633a5c6d757369635c416c6963655f496e5f436861696e73",
                    "title":"Black Gives Way To Blue"
                },
                "id":"633a5c6d757369635c416c6963655f496e5f436861696e73",
                "name":"Alice_In_Chains"
            },
            "status":"ok",
            "version":"1.6.0",
            "xmlns":"http://subsonic.org/restapi"
        }
    }
    
    {
        "subsonic-response":
        {
            "directory":
            {
                "child":
                {
                    "album":"Emotive",
                    "artist":"Perfect Circle",
                    "bitRate":214,
                    "contentType":"audio/mpeg",
                    "coverArt":"633a5c6d757369635c415f506572666563745f436972636c655c466f6c6465722e6a7067",
                    "duration":288,
                    "genre":"Hard Rock",
                    "id":"633a5c6d757369635c415f506572666563745f436972636c655c41205065726665637420436972636c65202d20496d6167696e652e6d7033",
                    "isDir":false,
                    "isVideo":false,
                    "parent":"633a5c6d757369635c415f506572666563745f436972636c65",
                    "path":"A_Perfect_Circle/A Perfect Circle - Imagine.mp3",
                    "size":7821312,
                    "suffix":"mp3",
                    "title":"Imagine",
                    "track":2,
                    "year":2005
                },
                "id":"633a5c6d757369635c415f506572666563745f436972636c65",
                "name":"A_Perfect_Circle"
            },
            "status":"ok",
            "version":"1.6.0",
            "xmlns":"http://subsonic.org/restapi"
        }
    }
*/
            this.log(inResponse);
            this.$.songListRepeater.directory = inResponse["subsonic-response"].directory;
            this.$.songListRepeater.render();
        },
        loadSongList: function(inSender, inRow)
        {
            var dir = this.$.songListRepeater.directory;
            // we get a single child object if there's only one, otherwise we get an array.
            // if single object, and we're not on row 0, we want undefined, so it passes through. otherwise, set song to the single object, or the requested array element
            var song;
            if(dir && dir.child)
            {
                if(dir.child[inRow])
                    song = dir.child[inRow];
                else if(inRow == 0)
                    song = dir.child;
            } // TODO: and then in some cases, we just don't get anything useful back, just an id and a Name .. wtf?
            //var song = dir && dir.child ? (dir.child[inRow] ? dir.child[inRow] : (inRow == 0 ? dir.child : undefined)) : undefined;
            this.log(dir, song);
            if(song)
            {
                this.$.Title.setContent(song.title + (song.isDir ? "\\" : ""));
                this.$.Album.setContent(song.album);
                this.$.CoverArt.setSrc("http://www.ericbla.de:88/rest/stream.view?id="+song.coverArt+"&u=slow&p=slow&v=1.6.0&c=XO(webOS)(development)");
                this.$.SongItem.song = song;
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
        drawerOpenedOrClosed: function(inSender, inEvent)
        {
            this.log(inSender, inEvent);
            //inSender.$.ArtistRepeater.render();        
        },
        artistOrAlbumClicked: function(inSender, artist)
        {            
            if(artist.name) // name might be null if we're getting an album .. grr.
                this.debug("clicked " + artist.name);
            this.callApi(this.$.getMusicDirectory, { id: artist.id });
            this.$.slidingPane.selectViewByName("middle");
        },
        albumClicked: function(inSender, inEvent)
        {
            this.debug("clicked " + this.$.AlbumRepeater.albumList[inEvent.rowIndex].id);
            this.artistOrAlbumClicked(inSender, this.$.AlbumRepeater.albumList[inEvent.rowIndex]);
        },
        songClicked: function(inSender, inEvent)
        {
            var inRow = inEvent.rowIndex;
            var dir = this.$.songListRepeater.directory;
            var song = dir ? (dir.child[inRow] ? dir.child[inRow] : (inRow == 0 ? dir.child : undefined)) : undefined;
            
            if(song)
            {
                this.debug("clicked " + song.title);
                if(song.isDir)
                {
                    this.artistOrAlbumClicked(inSender, song);
                } else {
                    /*            params.u = userid;
            params.p = password;
            params.v = "1.6.0";
            params.c = "XO(webOS)(development)";
                    */
                    //this.log("calling streaming player");
                    //this.$.AppManService.call( { target: "http://192.168.1.124:88/rest/stream.view?id="+song.id+"&u=admin&p=subgame&v=1.6.0&c=XO(webOS)(development)"});
                    this.log("this=", this);
                    this.$.MusicPlayer.setSrc("http://www.ericbla.de:88/rest/stream.view?id="+song.id+"&u=slow&p=slow&v=1.6.0&c=XO(webOS)(development)");
                    this.$.MusicPlayer.play();
                }
            }
        },
        stopAudio: function(inSender, inEvent)
        {
            if(!this.$.MusicPlayer.audio.paused)
                this.$.MusicPlayer.audio.pause();
            else
                this.$.MusicPlayer.audio.play();
        },
        albumListReceived: function(inSender, inResponse)
        {
            this.$.Log.add("Processing album list. . .");
            enyo.asyncMethod(this, "processAlbumList", inSender, inResponse);
        },
        processAlbumList: function(inSender, inResponse)
        {
/*
    {
        "subsonic-response":
        {
            "albumList":
            {
                "album":
                    [
                        {
                            "artist":"Guns N' Roses",
                            "coverArt":"633a5c6d757369635c47756e735f6e5f526f7365735c416c62756d735c31393938202d2055736520796f757220496c6c7573696f6e5c466f6c6465722e6a7067","id":"633a5c6d757369635c47756e735f6e5f526f7365735c416c62756d735c31393938202d2055736520796f757220496c6c7573696f6e",
                            "isDir":true,
                            "parent":"633a5c6d757369635c47756e735f6e5f526f7365735c416c62756d73",
                            "title":"1998 - Use your Illusion"
                        },
*/
            this.log(inResponse);
            this.$.AlbumRepeater.albumList = inResponse["subsonic-response"].albumList.album;
            this.$.AlbumRepeater.albumList.sort( function(i1, i2) { return (i1.title && i1.title.localeCompare) ? i1.title.localeCompare(i2.title) : 0 ; });
            this.$.AlbumRepeater.render();
            this.$.LogSpinner.hide();
            this.$.Log.add("XO, you have the Conn.");
            this.$.MainPane.selectViewByName("slidingPane");
        },
        loadAlbum: function(inSender, inRow)
        {
            var album;
            if(this.$.AlbumRepeater.albumList && this.$.AlbumRepeater.albumList[inRow])
            {
                album = this.$.AlbumRepeater.albumList[inRow];
                this.$.AlbumItem.setContent(album.title);
                this.$.AlbumArt.setSrc("http://www.ericbla.de:88/rest/stream.view?id="+album.coverArt+"&u=admin&p=subgame&v=1.6.0&c=XO(webOS)(development)")
                return true;
            }
            return false;
        }
});
