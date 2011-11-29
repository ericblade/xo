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
                    { kind: "Item", content: "Recently added", onclick: "clickRecentlyAdded" },
                    { kind: "Item", content: "Random", onclick: "clickRandom" },
                    { kind: "Item", content: "Top Rated", onclick: "clickTopRated" },
                    { kind: "Item", content: "Recently Played", onclick: "clickRecentlyPlayed" },
                    { kind: "Item", content: "Most Played", onclick: "clickMostPlayed" },
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
    kind: "Item",
    layoutKind: "VFlexLayout",
    flex: 1,
    style: "padding-left: 5px; padding-right: 5px;",
    components: [
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
});

enyo.kind({
    name: "subsonic.MusicView",
    kind: "VFlexBox",
    published: {
        "music" : "",
    },
    events: {
        "onAlbumClicked": "",
        "onSongClicked": "",
    },
    components: [
        { kind: "Scroller", flex: 1, accelerated: true, components:
            [
                { name: "AlbumList", kind: "VirtualRepeater", flex: 1, accelerated: true, onSetupRow: "getListItem", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "AlbumItem", kind: "subsonic.AlbumItem", onclick: "itemClicked", },
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    getListItem: function(inSender, inRow)
    {
        var a = this.albumList && this.albumList[inRow];
        var mi = this.$.AlbumItem;
        
        this.log(inRow);
        if(a)
        {
            if(a.isDir) {
                mi.$.AlbumNameLabel.setContent(a.title);
                mi.$.ArtistNameLabel.setContent(a.artist);
                // TODO: Come up with a caching mechanism
                mi.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
                mi.setItemID(a.id);
            } else {
                var si = mi.$.SongItem;
                mi.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
                mi.$.AlbumItem.hide();
                si.show();
                si.$.SongNameLabel.setContent(a.title);
                si.$.SongLengthLabel.setContent(a.duration); // TODO: make hh:mm
                si.$.ArtistNameLabel.setContent(a.artist);
                si.$.SongFileTypeLabel.setContent(a.bitRate + "bit " + a.suffix);
                si.$.AlbumNameLabel.setContent(a.album);
                mi.setItemID(a.id);
            }
            return true;
        }
        return false;
    },
    musicChanged: function()
    {
        //this.log(this.music);
        this.albumList = this.music.albumList ? this.music.albumList.album : this.music.directory.child;
        //this.albumList.sort( function(i1, i2) { return (i1.title && i1.title.localeCompare) ? i1.title.localeCompare(i2.title) : 0; });
        this.log(this.albumList[0]);
        this.$.AlbumList.render();
    },
    itemClicked: function(inSender, inEvent)
    {
        this.log(inSender, inSender.itemID);
        inSender.$.AlbumSpinner.show();
        enyo.asyncMethod(this, enyo.bind(function(itemid, inEvent) { this.processItemClick(itemid, inEvent); }), inSender.itemID, inEvent);
    },
    processItemClick: function(itemid, inEvent)
    {
        this.log(itemid);
        for(x in this.albumList)
        {
            if(this.albumList[x].id == itemid)
            {
                if(this.albumList[x].isDir)
                {
                    this.doAlbumClicked(inEvent, this.albumList[x].id);
                } else {
                    this.doSongClicked(inEvent, this.albumList[x]);
                }
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
    name: "subsonic.PlaylistView",
    kind: "VFlexBox",
    components: [
        { kind: "Scroller", flex: 1, components:
            [
                { kind: "VirtualList", onSetupRow: "getPlaylistItem", components:
                    [
                        { name: "PlaylistName", kind: "Item" },
                    ]
                }
            ]
        }
    ],
    getPlaylistItem: function(inSender, inRow)
    {
        if(inRow >= 0 && inRow < 15)
        {
            this.$.PlaylistName.setContent("Playlist " + inRow);
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
                        { kind: "Button", caption: "Prev", },
                        { kind: "Button", caption: "Play/Pause", onclick: "playPauseClicked", },
                        { kind: "Button", caption: "Next", },
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
        setInterval(enyo.bind(this, this.checkStatus), 100);
    },
    songChanged: function()
    {
        this.$.SongInfoBox.show();
        this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+this.song.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
        this.$.ArtistNameLabel.setContent(this.song.artist);
        this.$.AlbumNameLabel.setContent(this.song.album);
        this.$.SongNameLabel.setContent(this.song.title);
        this.$.MediaLengthLabel.setContent(this.song.duration);
        this.$.MusicPlayer.setSrc("http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.6.0" + "&c=XO(webOS)(development)");
        this.$.ProgressSlider.setBarPosition(0);
        this.$.ProgressSlider.setAltBarPosition(0);        
        this.$.MusicPlayer.play();
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
        //this.$.PlayerStatus.setContent(this.$.MusicPlayer.audio.seeking + " " + this.$.MusicPlayer.audio.readyState + " " + this.$.MusicPlayer.audio.currentTime + " " + this.$.MusicPlayer.audio.paused + " " + (this.$.MusicPlayer.audio.currentTime / this.song.duration) * 100);
        if(this.$.MusicPlayer.audio.readyState == 0)
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
    }
});