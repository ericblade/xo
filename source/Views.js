// http://www.ericbla.de:88/rest/stream.view?id=633a5c6d757369635c54797065204f204e656761746976655c4f63746f62657220527573745c54797065204f204e65676174697665202d204261642047726f756e642e6d7033&u=admin&p=subgame&v=1.6.0&c=XO(webOS)(development)
enyo.kind({
    name: "subsonic.HomeView",
    kind: "VFlexBox",
    events: {
        onServerDialog: "",
        onMusicView: "",
    },
    published: {
        licenseData: "",
    },
    components:
        [
            { kind: "Scroller", flex: 1, accelerated: true, components:
                [
                    !isLargeScreen() ? { content: "Slide from right edge to access Player views", className: "enyo-item-ternary" } : { },
                    { name: "serverItem", kind: "Item", onclick: "doServerDialog", layoutKind: "VFlexLayout", components:
                        [
                            { kind: "HFlexBox", components:
                                [
                                    { content: "Server" },
                                    { name: "ServerNameLabel", style: "padding-left: 10px;" },
                                    { kind: "Spacer" },
                                    { name: "ServerSpinner", kind: "Spinner", }
                                ]
                            },
                            { kind: "HFlexBox", components:
                                [
                                    { name: "ServerVersionLabel", content: "", className: "enyo-item-ternary" },
                                    { kind: "Spacer" },
                                    { name: "ServerLicenseLabel", content: "", style: "color: red;", className: "enyo-item-ternary" },
                                ]
                            },
                        ]
                    },
                    { kind: "Divider", caption: "Albums" },
                    { kind: "Item", content: "Recently added", onclick: "clickRecentlyAdded", },
                    { kind: "Item", content: "Random", onclick: "clickRandom" },
                    { kind: "Item", content: "Top Rated", onclick: "clickTopRated" },
                    { kind: "Item", content: "Recently Played", onclick: "clickRecentlyPlayed" },
                    { kind: "Item", content: "Most Played", onclick: "clickMostPlayed", },
                ]
            }
        ],
    licenseDataChanged: function()
    {
        var ld = this.licenseData;
        this.log(ld);
        this.$.ServerNameLabel.setContent(prefs.get("serverip"));
        if(ld && ld.license && ld.license.valid != undefined)
        {
            this.$.ServerVersionLabel.setContent("Version: " + ld.version);
            this.$.ServerLicenseLabel.setContent(ld.license.valid ? "" : "NOT LICENSED");
        }
        else
        {
            this.$.ServerVersionLabel.setContent("");
            this.$.ServerLicenseLabel.setContent("");
        }
    },
    opened: function()
    {
        this.inherited(arguments);
        this.$.ServerNameLabel.setContent("Server: " + prefs.get("serverip"));
    },
    clickRecentlyAdded: function()
    {
        this.doMusicView("recentlyadded");
    },
    clickRandom: function()
    {
        this.doMusicView("random");
    },
    clickTopRated: function()
    {
        this.doMusicView("toprated");
    },
    clickRecentlyPlayed: function()
    {
        this.doMusicView("recentlyplayed");
    },
    clickMostPlayed: function()
    {
        this.doMusicView("mostplayed");
    },
});

enyo.kind({
    name: "subsonic.ArtistItem",
    kind: "Item",
    content: "Artist"
});

enyo.kind({
    name: "subsonic.AlbumItem",
    kind: "Item",
    layoutKind: "HFlexLayout",
    flex: 1,
    published: {
        itemID: "",
    },
    components: [
        { name: "AlbumArt",  height: "48px", width: "48px", kind: enyo.Image },
        { name: "AlbumItem", style: "padding-left: 5px;", pack: "center", kind: "HFlexBox", components:
            [
                { kind: "VFlexBox", pack: "center", components:
                    [
                        { name: "AlbumNameLabel", content: "Album Name" },
                        { name: "ArtistNameLabel", content: "Artist Name", className: "enyo-item-ternary" },
                    ]
                },
                { kind: "Spacer" },
                { name: "AlbumSpinner", kind: "Spinner" },                
            ]
        },
        { name: "SongItem", kind: "subsonic.SongItem", pack: "center", showing: false, },
    ]
});

/*
     {"subsonic-response":
         {"directory":
             {"child":
                 [{"album":"...For The Whole World To See",
                   "artist":"Death",
                   "bitRate":289,
                   "contentType":"audio/mpeg",
                   "coverArt":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f205365655c6261636b2e6a7067",
                   "duration":170,
                   "genre":"Punk",
                   "id":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f205365655c3031202d204b656570204f6e204b6e6f636b696e672e6d7033",
                   "isDir":false,
                   "isVideo":false,
                   "parent":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f20536565",
                   "path":"Death-Punk-Detroit/For The Whole World To See/Death - For the Whole World to See/01 - Keep On Knocking.mp3",
                   "size":6181477,
                   "suffix":"mp3",
                   "title":"Keep On Knocking",
                   "track":1,
                   "year":1975
                },
                {"album":"...For The Whole World To See",
                 "artist":"Death",
                 "bitRate":278,
                 "contentType":"audio/mpeg",
                 "coverArt":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f205365655c6261636b2e6a7067",
                 "duration":161,
                 "genre":"Punk",
                 "id":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f205365655c3032202d20526f636b2d4e2d526f6c6c2056696374696d2e6d7033",
                 "isDir":false,
                 "isVideo":false,
                 "parent":"633a5c6d757369635c44656174682d50756e6b2d446574726f69745c466f72205468652057686f6c6520576f726c6420546f205365655c4465617468202d20466f72207468652057686f6c6520576f726c6420746f20536565",
                 "path":"Death-Punk-Detroit/For The Whole World To See/Death - For the Whole World to See/02 - Rock-N-Roll Victim.mp3",
                 "size":5635970,
                 "suffix":"mp3",
                 "title":"Rock-N-Roll Victim",
                 "track":2,
                 "year":1975
                 },*/
enyo.kind({
    name: "subsonic.SongItem",
    kind: "SwipeableItem",
    swipeable: false,
    layoutKind: "VFlexLayout",
    flex: 1,
    style: "padding-left: 5px; padding-right: 5px;",
    published: {
        draggable: isLargeScreen(),
    },
    components: [
        { kind: "VFlexBox", onmousehold: "mousehold", ondragstart: "dragStart", ondragfinish: "dragFinish", components:
            [
                { kind: "HFlexBox", components:
                    [ // TODO: put album image in here?
                        { name: "SongNameLabel", kind: "Control", content: "Song Name" },
                        { kind: "Spacer" },
                        { name: "SongLengthLabel", kind: "Control", className: "enyo-item-ternary", content: "5:42" },
                    ]
                },
                { kind: "HFlexBox", components:
                    [
                        { name: "ArtistNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Artist Name" },
                        { kind: "Spacer" },
                        { name: "AlbumNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Album Name" },
                        { kind: "Spacer" },
                        { name: "SongFileTypeLabel", kind: "Control", className: "enyo-item-ternary", content: "128kbps mp3" },
                    ]
                },
            ]
        },
    ],
    mousehold: function(inSender, inEvent)
    {
        console.log(inEvent);        
    },
    dragStart: function(inSender, inEvent)
    {
        //console.log(inEvent); // set inEvent.dragInfo here
        if(!this.draggable)
            return;
        console.log("dragStart");
        console.log(inSender.parent);
        if(inEvent.horizontal)
        {
            /*inEvent.dragInfo = inSender.parent.songInfo;
            inEvent.dragInfo.itemID = inSender.parent.parent.itemID;
            inEvent.dragInfo.coverArt = inSender.parent.parent.$.AlbumArt.coverArt;*/
            inEvent.dragInfo = inEvent.rowIndex;
            enyo.application.dragging = true;
            enyo.application.dropIndex = -1;
        }
    },
    dragFinish: function(inSender, inEvent)
    {
        enyo.application.dragging = false;
        enyo.application.dropIndex = -1;
        console.log(inEvent);
    }
});

enyo.kind({
    name: "subsonic.MusicView",
    kind: "VFlexBox",
    flex: 1,
    published: {
        "music" : "",
        "songList": "",
    },
    events: {
        "onAlbumClicked": "",
        "onSongClicked": "",
    },
    components: [
        { name: "ViewPane", flex: 1, kind: "Pane", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", components:
            [
                { name: "AlbumListView", flex: 1, kind: "VFlexBox", components:
                    [
                        { kind: "Scroller", flex: 1, accelerated: true, components:
                            [
                                { name: "AlbumList", kind: "VirtualRepeater", accelerated: true, onSetupRow: "getAlbumListItem", components:
                                    [
                                        { kind: "HFlexBox", components:
                                            [
                                                { name: "AlbumItem", kind: "subsonic.AlbumItem", onclick: "itemClicked", },
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                },
                { name: "SongListView", kind: "VFlexBox", components:
                    [
                        { kind: "Scroller", flex: 1, accelerated: true, components:
                            [
                                { name: "SongList", kind: "VirtualRepeater", flex: 1, accelerated: true, onSetupRow: "getSongListItem", components:
                                    [
                                        { kind: "HFlexBox", components:
                                            [
                                                { name: "SongItem", kind: "subsonic.AlbumItem", onclick: "itemClicked", },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                        isLargeScreen() ? 
                        { kind: "Toolbar", components:
                            [
                                { caption: "Back", onclick: "goBack" },
                            ]
                        } : {},
                    ]
                }
            ]
        }
    ],
    goBack: function()
    {
        this.$.ViewPane.back();
    },
    getAlbumListItem: function(inSender, inRow)
    {
        var a = this.songload ? this.songList[inRow] : (this.albumList && this.albumList[inRow]);
        var mi = this.songload ? this.$.SongItem : this.$.AlbumItem;
        
        if(a)
        {
            if(a.isDir) {
                mi.$.AlbumNameLabel.setContent(a.title);
                mi.$.ArtistNameLabel.setContent(a.artist);
                // TODO: Come up with a caching mechanism
                mi.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
                mi.$.AlbumArt.coverArt = a.coverArt;
                mi.setItemID(a.id);
            } else {
                var si = mi.$.SongItem;
                this.log("!isDir", mi, si, a);
                mi.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
                mi.$.AlbumArt.coverArt = a.coverArt;
                mi.$.AlbumItem.hide();
                si.show();
                si.$.SongNameLabel.setContent(a.title);
                si.$.SongLengthLabel.setContent(secondsToTime(a.duration)); // TODO: make hh:mm
                si.$.ArtistNameLabel.setContent(a.artist);
                si.$.SongFileTypeLabel.setContent(a.bitRate + "bit " + a.suffix);
                si.$.AlbumNameLabel.setContent(a.album);
                mi.setItemID(a.id);
                //this.log(a);
                si.songInfo = a;
            }
            return true;
        }
        return false;
    },
    getSongListItem: function(inSender, inRow)
    {
        this.log(inRow);
        this.songload = true;
        var ret = this.getAlbumListItem(inSender, inRow);
        this.songload = false;
        return this.songList[inRow];
    },
    queryListItem: function(row)
    {
        var view = this.$.ViewPane.getViewName();
        var a = (view == "AlbumListView") ? (this.albumList && this.albumList[row]) : (this.songList && this.songList[row]);
        return a || false;
    },
    // TODO: rename "music" to "albumList", fix getSongListItem and getAlbumListItem to be more independent?
    musicChanged: function()
    {
        //this.log(this.music);
        // TODO: If no Internet connection, we get "Cannot read property 'albumList' of undefined, here
        this.albumList = this.music.albumList ? this.music.albumList.album : this.music.directory.child;
        //this.albumList.sort( function(i1, i2) { return (i1.title && i1.title.localeCompare) ? i1.title.localeCompare(i2.title) : 0; });
        this.log(this.albumList[0]);
        this.$.ViewPane.selectViewByName("AlbumListView");
        this.$.AlbumList.render();
    },
    songListChanged: function()
    {
        this.songList = this.songList.directory.child;
        this.$.ViewPane.selectViewByName("SongListView");
        if(this.lastActivatedSpinner)
            this.lastActivatedSpinner.hide();
        this.$.SongList.render();
    },
    itemClicked: function(inSender, inEvent)
    {
        this.log(inSender, inSender.itemID);
        this.lastActivatedSpinner = inSender.$.AlbumSpinner;
        inSender.$.AlbumSpinner.show();
        if(inSender.name == "AlbumItem")
            enyo.asyncMethod(this, enyo.bind(function(itemid, inEvent) { this.processAlbumClick(itemid, inEvent); }), inSender.itemID, inEvent);
        else
            enyo.asyncMethod(this, enyo.bind(function(itemid, inEvent) { this.processSongClick(itemid, inEvent); }), inSender.itemID, inEvent);
    },
    processAlbumClick: function(itemid, inEvent)
    {
        this.log();
        for(x in this.albumList)
        {
            if(this.albumList[x].id == itemid)
            {
                this.doAlbumClicked(inEvent, this.albumList[x].id);
                break;
            }
        }
    },
    processSongClick: function(itemid, inEvent)
    {
        this.log();
        for(x in this.songList)
        {
            if(this.songList[x].id == itemid)
            {
                this.doSongClicked(inEvent, this.songList[x]);
                break;
            }
        }
    }
});

enyo.kind({
    name: "subsonic.SearchView",
    kind: "VFlexBox", components: [
        { kind: "SearchInput", },
        { kind: "Scroller", flex: 1, accelerated: true, components:
            [
                { kind: "Divider", caption: "Artists" },
                { kind: "VirtualRepeater", accelerated: true, onSetupRow: "getArtistSearchItem", components:
                    [
                        { name: "ArtistItem", kind: "subsonic.ArtistItem" },
                    ]
                },
                { kind: "Divider", caption: "Albums" },
                { kind: "VirtualRepeater", accelerated: true, onSetupRow: "getAlbumSearchItem", components:
                    [
                        { name: "AlbumItem", kind: "subsonic.AlbumItem" },
                    ]
                },
                { kind: "Divider", caption: "Songs", },
                { kind: "VirtualRepeater", accelerated: true, onSetupRow: "getSongSearchItem", components:
                    [
                        { name: "SongItem", kind: "subsonic.SongItem" },
                    ]
                }
            ]
        }
    ],
    getArtistSearchItem: function(inSender, inRow)
    {
        if(inRow >= 0 && inRow < 10)
        {
            this.$.ArtistItem.setContent("Artist " + inRow);
            return true;
        }
        return false;
    },
    getAlbumSearchItem: function(inSender, inRow)
    {
        if(inRow >= 0 && inRow < 10)
        {
            this.$.AlbumItem.$.AlbumArt.setSrc("http://images2.fanpop.com/images/photos/4100000/-21st-Century-Breakdown-Album-Cover-Art-Large-Version-green-day-4121729-900-900.jpg");
            this.$.AlbumItem.$.ArtistNameLabel.setContent("Artist " + inRow);
            this.$.AlbumItem.$.AlbumNameLabel.setContent("Album " + inRow);
            return true;
        }
        return false;
    },
    getSongSearchItem: function(inSender, inRow)
    {
        if(inRow >= 0 && inRow < 10)
        {
            this.$.SongItem.$.ArtistNameLabel.setContent("Artist " + inRow);
            this.$.SongItem.$.AlbumNameLabel.setContent("Album " + inRow);
            this.$.SongItem.$.SongFileTypeLabel.setContent(inRow + "kbps mp3");
            return true;
        }
        return false;
    },
});

enyo.kind({
    name: "subsonic.PlaylistsView",
    kind: "VFlexBox",
    events: {
        "onRefreshPlaylists":"",
        "onOpenPlaylist":"",
        "onPlayPlaylist":"",
    },
    components: [
        { kind: "Scroller", flex: 1, components:
            [
                { kind: "VirtualList", onSetupRow: "getPlaylistItem", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "PlaylistName", flex: 1, kind: "Item", onclick: "clickItem" },
                                { caption: "Play", kind: "Button", onclick: "clickPlay" },
                            ]
                        }
                    ]
                }
            ]
        },
        { kind: "Toolbar", components:
            [
                { caption: "Refresh", onclick: "doRefreshPlaylists" },
            ]
        },
    ],
    clickItem: function(inSender, inEvent)
    {
        var row = inEvent.rowIndex;
        this.doOpenPlaylist(inEvent, this.playlists[row].id);
    },
    clickPlay: function(inSender, inEvent)
    {
        this.log();
        var row = inEvent.rowIndex;
        this.doPlayPlaylist(inEvent, this.playlists[row].id);
    },
    addPlaylist: function(list)
    {
        this.log(list);
        if(!this.playlists)
            this.playlists = [ ];
        this.playlists.push(list);
    },
    getPlaylistItem: function(inSender, inRow)
    {
        if(this.playlists == undefined)
        {
            this.doRefreshPlaylists();
            return false;
        }
        if(this.playlists[inRow])
        {
            this.$.PlaylistName.setContent("Playlist: " + this.playlists[inRow].name);
            this.$.PlaylistName.playlistID = this.playlists[inRow].id;
            return true;
        }
        return false;
    }
});

enyo.kind({
    name: "subsonic.MusicPlayerView",
    kind: "VFlexBox",
    flex: 1,
    events: {
        "onHideTabs": "",
        "onCycleTab": "",
        "onNextSong": "",
        "onPrevSong": "",
    },
    components: [
        { name: "MusicPlayer", kind: "Sound", preload: true, audioClass: "media", },
        { kind: "VFlexBox", flex: 1, components:
            [
                { kind: "HFlexBox", components:
                    [
                        { kind: "Spacer", },
                        { kind: "VFlexBox", components:
                            [
                                { name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: enyo.Image, height: isLargeScreen() ? "320px" : "240px", src: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
                                // TODO: adjust albumart height when rotating to landscape on telephones
                                { name: "PlayerTips", content: "Tap to change display, hold to toggle tabs", className: "enyo-item-ternary", style: "color: white;" },
                                { name: "PlayerStatus", content: "", className: "enyo-item-ternary", style: "color: white;" },
                                { name: "PlayerSpinner", kind: isLargeScreen() ? "SpinnerLarge" : "Spinner" },
                            ]
                        },
                        { kind: "Spacer", },
                    ]
                },
                { kind: "Spacer", },
                { name: "SongInfoBox", kind: "VFlexBox", showing: false, components:
                    [
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
                    ]
                },
                { kind: "Spacer", },
                { name: "SliderBox", kind: "VFlexBox", components:
                    [
                        { kind: "VFlexBox", components:
                            [
                                { name: "ProgressSlider", kind: "ProgressSlider", barMinimum: 0, barMaximum: 100, barPosition: 0, altBarPosition: 0, position: 0, onChange: "progressSliderChange", style: "padding-left: 2px; padding-right: 2px;" },
                                { kind: "HFlexBox", components:
                                    [
                                        { content: "0:00", className: "enyo-item-ternary", pack: "center" },
                                        { kind: "Spacer", },
                                        { name: "MediaLengthLabel", content: "5:43", pack: "center", className: "enyo-item-ternary" },                                                
                                    ]
                                }
                            ]
                        },
                    ]
                },
                { kind: "HFlexBox", components:
                    [
                        { kind: "Spacer", },
                        { kind: "Button", caption: "Prev", onclick: "doPrevSong", },
                        { kind: "Button", caption: "Play/Pause", onclick: "playPauseClicked", },
                        { kind: "Button", caption: "Next", onclick: "doNextSong", },
                        { kind: "Spacer", },
                    ]
                },
            ]                            
        },
    ],
    hideTips: function() { this.log(this); this.$.MusicPlayer.$.PlayerTips.hide(); },
    progressSliderChange: function(inSender, x)
    {
        this.log(x);
        //this.log(this.$.MusicPlayer.audio.currentTime, this.$.ProgressSlider.getPosition(), (this.$.ProgressSlider.getPosition() / 100) * this.song.duration);
        this.$.MusicPlayer.audio.currentTime = (this.$.ProgressSlider.getPosition() / 100) * this.song.duration;
        //this.log(this.$.MusicPlayer.audio.currentTime);
        return true;
    },
    published: {
        song: "",
    },
    rendered: function()
    {
        this.inherited(arguments);
        this.checkStatus();
        var e = enyo.bind(this, this.playerEvent);
        this.$.MusicPlayer.audio.addEventListener('loadstart', e);
        //this.$.MusicPlayer.audio.addEventListener('onloadstart', enyo.bind(this, this.playerEvent));
        this.$.MusicPlayer.audio.addEventListener('canplay', e);
        this.$.MusicPlayer.audio.addEventListener('canplaythrough', e);
        this.$.MusicPlayer.audio.addEventListener('durationchange', e);
        this.$.MusicPlayer.audio.addEventListener('emptied', e);
        this.$.MusicPlayer.audio.addEventListener('ended', e);
        this.$.MusicPlayer.audio.addEventListener('error', e);
        this.$.MusicPlayer.audio.addEventListener('loadeddata', e);
        this.$.MusicPlayer.audio.addEventListener('loadedmetadata', e);
        this.$.MusicPlayer.audio.addEventListener('pause', e);
        this.$.MusicPlayer.audio.addEventListener('onpause', e);
        this.$.MusicPlayer.audio.addEventListener('play', e);
        this.$.MusicPlayer.audio.addEventListener('playing', e);
        this.$.MusicPlayer.audio.addEventListener('progress', e);
        this.$.MusicPlayer.audio.addEventListener('ratechange', e);
        this.$.MusicPlayer.audio.addEventListener('readystatechange', e);
        this.$.MusicPlayer.audio.addEventListener('seeked', e);
        this.$.MusicPlayer.audio.addEventListener('seeking', e);
        this.$.MusicPlayer.audio.addEventListener('stalled', e);
        this.$.MusicPlayer.audio.addEventListener('suspend', e);
        this.$.MusicPlayer.audio.addEventListener('timeupdate', e);
        this.$.MusicPlayer.audio.addEventListener('volumechange', e);
        this.$.MusicPlayer.audio.addEventListener('waiting', e);
        
        //this.$.MusicPlayer.audio.addEventListener('onloadstart', this.log);
        //this.$.MusicPlayer.audio.onloadstart = "checkStatus";
        this.timer = setInterval(enyo.bind(this, this.checkStatus), 500);
    },
    playerEvent: function(inEvent, x, y)
    {
        this.log(inEvent.type);
        this.checkStatus();
        switch(inEvent.type)
        {
            case "error":
                this.$.PlayerStatus.setContent("ERROR LOADING MEDIA");
                this.$.PlayerSpinner.hide();
                this.log(inEvent, x, y);
                break;
        }
    },
    songChanged: function()
    {
        console.log("songChanged");
        console.log(this.song);
        this.$.MusicPlayer.audio.pause();
        if(this.song)
        {
            this.$.SongInfoBox.show();
            this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+this.song.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
            this.$.ArtistNameLabel.setContent(this.song.artist);
            this.$.AlbumNameLabel.setContent(this.song.album);
            this.$.SongNameLabel.setContent(this.song.title);
            this.$.MediaLengthLabel.setContent(secondsToTime(this.song.duration));
            this.$.MusicPlayer.setSrc("http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.6.0" + "&c=XO(webOS)(development)");
            this.log(this.$.MusicPlayer.src);
            this.$.ProgressSlider.setBarPosition(0);
            this.$.ProgressSlider.setAltBarPosition(0);        
            this.$.MusicPlayer.play();
        } else {
            this.$.SongInfoBox.hide();
            this.$.AlbumArt.setSrc("http://img91.imageshack.us/img91/3550/nocoverni0.png");
            clearInterval(this.timer);
            this.checkStatus();
        }
    },
    playPauseClicked: function(inSender, inEvent)
    {
        if(!this.$.MusicPlayer.audio.paused)
            this.$.MusicPlayer.audio.pause();
        else
            this.$.MusicPlayer.audio.play();
        inEvent.stopPropagation();
        return true;
    },
    checkStatus: function()
    {
        //this.log(this.showing);
        //this.log();
        this.$.PlayerStatus.setContent(this.$.MusicPlayer.audio.seeking + " " + this.$.MusicPlayer.audio.readyState + " " +  this.$.MusicPlayer.audio.paused);
        if(this.$.MusicPlayer.audio.readyState != 4)
        {
            this.$.SliderBox.hide();
            if(!this.$.MusicPlayer.audio.paused && !this.$.PlayerSpinner.showing)
            {
                this.$.PlayerSpinner.show();
            }
        }
        else
        {
            this.$.SliderBox.show();
            if(this.$.PlayerSpinner.showing)
                this.$.PlayerSpinner.hide();
        }
        var prog = (this.$.MusicPlayer.audio.currentTime / this.song.duration) * 100;
        this.$.ProgressSlider.setBarPosition( prog );
        if(!this.$.MusicPlayer.audio.seeking)
            this.$.ProgressSlider.setPosition(prog);
        if(prog >= 100)
        {
            this.doNextSong();
        }
    }
});

// TODO: make a Swipable version of SongItem for use here, so you can delete things.
// TODO: make Player playing a song search the Playlist, and highlight it if present, making that the current location in the playlist
enyo.kind({
    name: "subsonic.PlaylistView",
    kind: "VFlexBox",
    events: {
        "onStartPlaylist" : "",
    },
    components: [
        isLargeScreen() ? { content: "Drag songs from the Music list and drop them here.", className: "enyo-item-ternary", ondragover: "scrollUp" } : { },
        { kind: "Scroller", flex: 1, components:
            [
                { name: "PlaylistRepeater", flex: 1, kind: "VirtualRepeater", onSetupRow: "getListItem", components:
                    [
                        { name: "Song", kind: "subsonic.SongItem", draggable: false, },
                    ]
                },
            ]
        },
        //{ kind: "Spacer" },
        { kind: "Toolbar", ondragover: "scrollDown", components:
            [
                { caption: "Play", onclick: "doStartPlaylist" },
                { caption: "Clear", onclick: "clearPlaylist" },
            ]
        },
    ],
    getListItem: function(inSender, inRow)
    {
        if(enyo.application.playlist && enyo.application.playlist[inRow])
        {
            var p = enyo.application.playlist[inRow];
            this.$.Song.itemID = p.itemID;
            this.$.Song.$.SongNameLabel.setContent(p.title);
            this.$.Song.$.SongLengthLabel.setContent(secondsToTime(p.duration));
            this.$.Song.$.ArtistNameLabel.setContent(p.artist);
            this.$.Song.$.AlbumNameLabel.setContent(p.album); // si.$.SongFileTypeLabel.setContent(a.bitRate + "bit " + a.suffix);
            this.$.Song.$.SongFileTypeLabel.setContent(p.bitRate + "bit " +p.suffix);
            if(enyo.application.dragging && enyo.application.dropIndex != undefined && enyo.application.dropIndex > -1)
            {
                if(enyo.application.dropIndex == inRow)
                {
                    this.log("highlighting " + inRow);
                    this.$.Song.applyStyle("border-top", "thick double blue");
                } else {
                    this.$.Song.applyStyle("border-top", undefined);
                    this.$.Song.applyStyle("border-bottom", undefined);
                } 
            } else if(enyo.application.dragging && enyo.application.dropIndex == undefined && inRow == enyo.application.playlist.length-1) {
                {
                    this.$.Song.applyStyle("border-bottom", "thick double blue");
                }
            } else {
                this.$.Song.applyStyle("border-bottom", undefined);
                this.$.Song.applyStyle("border-top", undefined);
            }
            return true;
        }
        return false;
    },
    clearPlaylist: function(inSender, inEvent)
    {
        enyo.application.playlist = [ ];
        this.$.PlaylistRepeater.render();
        inEvent.stopPropagation();
    }
});
/*
                { kind: "HFlexBox", components:
                    [ // TODO: put album image in here?
                        { name: "SongNameLabel", kind: "Control", content: "Song Name" },
                        { kind: "Spacer" },
                        { name: "SongLengthLabel", kind: "Control", className: "enyo-item-ternary", content: "5:42" },
                    ]
                },
                { kind: "HFlexBox", components:
                    [
                        { name: "ArtistNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Artist Name" },
                        { kind: "Spacer" },
                        { name: "AlbumNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Album Name" },
                        { kind: "Spacer" },
                        { name: "SongFileTypeLabel", kind: "Control", className: "enyo-item-ternary", content: "128kbps mp3" },
                    ]
                },
                itemID: this.owner.itemID,
                title: this.$.SongNameLabel.getContent(),
                duration: this.$.SongLengthLabel.getContent(),
                artist: this.ArtistNameLabel.getContent(),
                album: this.AlbumNameLabel.getContent(),
                filetype: this.SongFileTypeLabel.getContent(),
*/



