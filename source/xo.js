// TODO: stop the Interval that is set in the MusicPlayer when application is not foreground, resume when it is.  Also stop it when that pane is switched to a different view.
// TODO: half implemented scrolling when dragging music to top or bottom of list ?
// TODO: half implemented downloading of files
// TODO: playlist stuff is ridiculously unreliable and locks up touchpads and phones alike.. wtf?

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
        { name: "fileDownload", kind: "PalmService", service: "palm://com.palm.downloadmanager/", method: "download", onSuccess: "downloadFinished", subscribe: true },
        { kind: "ApplicationEvents", onBack: "doBack" },
        { name: "LogView", kind: "LogView", },
        { name: "api", kind: "subsonic.api",
            onLicenseReceived: "receivedLicense",
            onLicenseError: "badLicense",
            onAlbumListReceived: "receivedAlbumList",
            onDirectoryReceived: "receivedDirectory",
            onReceivedPlaylists: "receivedPlaylists",
            onReceivedPlaylist: "receivedPlaylist",
        },
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
                        { name: "LeftPane", flex: 1, kind: "Pane", onSelectView: "leftPaneSelected", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", components:
                            [
                                { name: "HomeView", kind: "subsonic.HomeView", onServerDialog: "openServerDialog", onMusicView: "loadMusicView" },
                                { name: "MusicView", kind: "subsonic.MusicView", onAlbumClicked: "loadAlbum", onSongClicked: "loadSong", },
                                { name: "SearchView", kind: "subsonic.SearchView", },
                                { name: "PlaylistsView", kind: "subsonic.PlaylistsView", onRefreshPlaylists: "refreshPlaylists", onOpenPlaylist: "openPlaylist", onPlayPlaylist: "playPlaylist" },
                            ]
                        },
                    ]
                },
                { name: "RightView", kind: "SlidingView", /*dismissible: true,*/ edgeDragging: true, components:
                    [
                        { name: "RightTabs", kind: "TabGroup", onChange: "rightTabChange", showing: prefs.get("righttabsshowing"), components:
                            [
                                { caption: "Playlist" },
                                { caption: "Player" },
                                { caption: "Lyrics" },
                            ]
                        },
                        
                        { name: "RightPane", kind: "Pane", flex: 1, components:
                            [
                                /*{ name: "PlaylistView", flex: 1, kind: "VFlexBox", ondrop: "dropOnPlaylist", onmousehold: "hideShowRightTabs", onclick: "cycleRightTab", components:
                                    [
                                        { name: "Playlist", kind: "subsonic.PlaylistView" },
                                    ]
                                },*/
                                { name: "PlaylistView", flex: 1, kind: "subsonic.PlaylistView", onStartPlaylist: "startPlaylist", ondragout: "dragOutPlaylist", ondragover: "dragOverPlaylist", ondrop: "dropOnPlaylist", onmousehold: "hideShowRightTabs", onclick: "cycleRightTab",},
                                { name: "MusicPlayerView", flex: 1, kind: "VFlexBox", components:
                                    [
                                        { name: "MusicPlayer", flex: 1, onNextSong: "playNext", onPrevSong: "playPrev", onHideTabs: "hideShowRightTabs", onCycleTab: "cycleRightTab", style: "background: black; ", kind: "subsonic.MusicPlayerView" },
                                    ]
                                },
                                { name: "LyricsView", kind: "VFlexBox", components:
                                    [
                                        { content: "Lyrics View Here", onmousehold: "hideShowRightTabs", onclick: "cycleRightTab" },
                                        { kind: "Spacer", },
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        { kind: "VFlexBox", components:
            [
                { name: "serverDialog", kind: "subsonic.ServerDialog",
                    onServerChanged: "changedServer",
                },
            ]
        },
    ],
    openPlaylist: function(inSender, inEvent, inID)
    {
        this.playPlaylist = false;
        this.$.api.call("getPlaylist", { id: inID });
    },
    playPlaylist: function(inSender, inEvent, inID)
    {
        //this.log(inSender, inEvent, inID);
        this.playPlaylist = true;
        this.$.api.call("getPlaylist", { id: inID });
    },
    refreshPlaylists: function(inSender, inEvent)
    {
        this.$.api.call("getPlaylists");
    },
    dragOverPlaylist: function(inSender, inEvent)
    {
        if(inEvent.rowIndex != enyo.application.dropIndex)
        {
            this.log("Dragging something over Playlist row " + inEvent.rowIndex);
            enyo.application.dropIndex = inEvent.rowIndex;
            this.$.PlaylistView.render();
        }
    },
    dragOutPlaylist: function(inSender, inEvent)
    {
        enyo.application.dropIndex = -1;
        this.$.PlaylistView.render();
    },
    dropOnPlaylist: function(inSender, inEvent)
    {
        /* dispatchTarget: enyo object we're dropping onto
           dragInfo: undefined?
           dx: x distance of drop?
           dy: y distance of drop?
           horizontal: true? huh?
           lockable: true? huh?
           pageX: x pos of drop?
           pageY: y pos of drop?
           target: html element we're targetting
           type: drop
           vertical: false .. huh?
        */
        console.log(inEvent);
        console.log("rowIndex", inEvent.rowIndex);
        if(inEvent.dragInfo != undefined)
        {
            if(!enyo.application.playlist)
            {
                enyo.application.playlist = [ ];
            }
            if(inEvent.rowIndex == undefined)
                enyo.application.playlist.push(this.$.MusicView.queryListItem(inEvent.dragInfo)); // get the info from the row from the list
            else
                enyo.application.playlist.insert(inEvent.rowIndex, this.$.MusicView.queryListItem(inEvent.dragInfo));
        }
        enyo.application.dragging = false;
        this.$.PlaylistView.render();
        prefs.set("playlist", enyo.application.playlist);
    },
    hideShowRightTabs: function()
    {
        var on = !this.$.RightTabs.showing;
        this.$.RightTabs.setShowing(on);
        prefs.set("righttabsshowing", on);
        this.ignoreCycle = true;
    },
    cycleRightTab: function()
    {
        if(!this.ignoreCycle)
        {
            var curr = this.$.RightPane.getViewIndex();
            var newind = (curr >= 2) ? 0 : curr+1;
            this.$.RightTabs.setValue(newind);
            //this.log(curr, newind);
            this.$.RightPane.selectViewByIndex(newind);
        }
        this.ignoreCycle = false;
    },
    receivedLicense: function(inSender, inLicense)
    {
        this.log(inLicense);
        this.$.HomeView.setLicenseData(inLicense);
        this.$.HomeView.$.ServerSpinner.hide();
    },
    receivedPlaylists: function(inSender, inLists)
    {
        this.log(inLists);
        var list = inLists.playlist || inLists;
        
        for(var x in list)
        {
            if(list[x].id)
                this.$.PlaylistsView.addPlaylist(list[x]);
        }
        this.$.PlaylistsView.render();
    },
    create: function()
    {
        this.inherited(arguments);

        prefs.def("righttabsshowing", true);        
        prefs.def("serverip","www.ericbla.de:88");
        prefs.def("username","slow");
        prefs.def("password","slow");
        prefs.def("playlist", []);
        
        enyo.application.playlist = prefs.get("playlist");
    },
    pingServer: function()
    {
        this.$.api.call("ping");
    },
    getServerLicense: function()
    {
        this.$.api.call("getLicense");
    },
    changedServer: function()
    {
        this.$.api.serverChanged();
        this.$.HomeView.setLicenseData();
        this.$.HomeView.$.ServerSpinner.show();
        this.pingServer();
        this.getServerLicense();
        //this.$.api.call("getIndexes");        
    },
    delayedStartup: function()
    {
        this.changedServer();
    },
    rendered: function()
    {
        this.inherited(arguments);
        this.selectViewByName("slider");
        
        enyo.asyncMethod(this, "delayedStartup");
    },
    openServerDialog: function()
    {
        this.$.serverDialog.open();
    },
    doBack: function(inSender, inEvent)
    {
        if(this.$.LeftPane.getViewName() == "MusicView" && this.$.slider.getViewName() != "RightView")
        {
            this.$.MusicView.goBack();
            inEvent.stopPropagation();
            inEvent.preventDefault();
            return -1;
        }
        this.log(this.$.slider.history);
        if(this.$.slider.history.length)
        {
            this.$.slider.back();
            inEvent.stopPropagation();
            inEvent.preventDefault();
            return -1;
        }
    },
    loadMusicView: function(inSender, inType)
    {
        var apicall;
        var type;
        switch(inType)
        {
            case "recentlyadded":
                type = "newest";
                apicall = "getAlbumList";
                break;
            case "random": // TODO: getRandomSongs.view can give us criteria based randomness
                type = "random";
                apicall = "getAlbumList";
                break;
            case "toprated": 
                type = "highest";
                apicall = "getAlbumList";
                break;
            case "recentlyplayed":
                type = "recent";
                apicall = "getAlbumList";
            case "mostplayed":
                type = "frequent";
                apicall = "getAlbumList";
                break;
        }
        this.$.HomeView.$.ServerSpinner.show();
        this.$.api.call(apicall, { type: type, size: 10 }); // TODO: Must support loading pages, using the offset parameter!
    },
    receivedAlbumList: function(inSender, inAlbumList)
    {
        this.log();
        this.$.HomeView.$.ServerSpinner.hide();
        this.$.MusicView.setMusic(inAlbumList);
        this.selectMusicView();
    },
    receivedDirectory: function(inSender, inDirectory)
    {
        this.log();
        this.$.MusicView.setSongList(inDirectory);
    },
    receivedPlaylist: function(inSender, inPlaylist)
    {
        //this.log(inPlaylist);
        var stupid = { directory: { child: inPlaylist } }; // the subsonic api is dumb sometimes
        if(!this.playPlaylist)
        {
            this.$.MusicView.setSongList(stupid);
            this.selectMusicView();
        } else {
            enyo.application.playlist = inPlaylist;
            enyo.application.playlist.index = 0;
            this.$.PlaylistView.render();
            this.startPlaylist();
        }
        this.playPlaylist = false;
    },
    loadAlbum: function(inSender, inEvent, inId)
    {
        this.$.api.call("getMusicDirectory", { id: inId });
    },
    loadSong: function(inSender, inEvent, inSongData)
    {
        this.$.MusicPlayer.setSong(inSongData);
        this.selectPlayerView(); 
    },
    startPlaylist: function(inSender, inEvent)
    {
        enyo.application.playlist.index = 0;
        this.$.MusicPlayer.setSong(enyo.application.playlist[0]);
        this.selectPlayerView();
    },
    playNext: function(inSender, inEvent)
    {
        var currId = this.$.MusicPlayer.song.id;
        var index = enyo.application.playlist.index;
        var p = enyo.application.playlist[index];
        if(p && p.id != currId)
        {
            index = this.findItemInPlaylist(currId);
        }
        enyo.application.playlist.index = index + 1;
        this.$.MusicPlayer.setSong(enyo.application.playlist[index+1]);
    },
    playPrev: function(inSender, inEvent)
    {
        var currId = this.$.MusicPlayer.song.id;
        var index = enyo.application.playlist.index;
        var p = enyo.application.playlist[index];
        if(p && p.id != currId)
        {
            index = this.findItemInPlaylist(currId);
        }
        enyo.application.playlist.index = index - 1;
        this.$.MusicPlayer.setSong(enyo.application.playlist[index-1]);
    },
    findItemInPlaylist: function(itemID)
    {
        for(x in enyo.application.playlist)
        {
            if(x && enyo.application.playlist[x].id == itemID)
            {
                return x;
            }
        }
        return false;
    },
    selectMusicView: function()
    {
        this.log();
        this.$.LeftPane.selectViewByName("MusicView");
    },
    selectSearchView: function()
    {
        this.$.LeftPane.selectViewByName("SearchView");
    },
    selectPlaylistsView: function()
    {
        this.$.LeftPane.selectViewByName("PlaylistsView");
    },
    selectHomeView: function()
    {
        this.$.LeftPane.selectViewByName("HomeView");
    },
    selectPlayerView: function()
    {
        //this.$.RightView.show();
        this.$.slider.selectViewByName("RightView");
        this.$.RightPane.selectViewByName("MusicPlayerView");
        this.$.RightTabs.setValue(1);
        setTimeout(enyo.bind(this, this.$.MusicPlayer.hideTips), 5000);
    },
    leftTabChange: function(inSender)
    {
        this.log("Selected Tab " + inSender.getValue());
        this.$.LeftPane.selectViewByIndex(inSender.getValue());
    },
    rightTabChange: function(inSender)
    {
        this.log("right Selected Tab " + inSender.getValue());
        this.$.RightPane.selectViewByIndex(inSender.getValue());
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
    },
    badLicense: function(inSender, inError)
    {
        this.log();
        // TODO: get a real popup. alert doesn't work.. lol
        window.alert("Error: " + inError.code +" " + inError.message);
    },
    downloadSubsonicFile: function(id, filename)
    {
        // "http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)"
        this.$.fileDownload.call( {
            target: "http://" + prefs.get("serverip") + "/rest/download.view?id=" + id + "&u=" + prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)",
            mime: "audio/mpeg3",
            targetDir: "/media/internal/xo/",
            //cookieHeader: "GALX=" + this.GALX + ";SID="+this.SID+";LSID=grandcentral:"+this.LSID+"gv="+this.LSID,
            targetFilename: filename,
            keepFilenameOnRedirect: true,
            canHandlePause: true,
            subscribe: true
        });
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
                                            { name: "LeftPane", kind: "Pane", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", flex: 1, components:
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
                this.$.CoverArt.setSrc("http://www.ericbla.de:88/rest/stream.view?size=48&id="+song.coverArt+"&u=slow&p=slow&v=1.6.0&c=XO(webOS)(development)");
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
