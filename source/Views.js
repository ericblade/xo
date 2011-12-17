// http://www.ericbla.de:88/rest/stream.view?id=633a5c6d757369635c54797065204f204e656761746976655c4f63746f62657220527573745c54797065204f204e65676174697665202d204261642047726f756e642e6d7033&u=admin&p=subgame&v=1.6.0&c=XO(webOS)(development)

enyo.kind({
    name: "subsonic.HomeView",
    kind: "VFlexBox",
    events: {
        onServerDialog: "",
        onMusicView: "",
        onFolderClick: "",
    },
    published: {
        licenseData: "",
        folders: "",
    },
    components:
        [
            { kind: "FadeScroller", flex: 1, accelerated: true, components:
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
                    { kind: "Divider", caption: "Folders" },
                    { name: "FolderRepeater", style: "padding-left: 20px; padding-right: 20px;", kind: "VirtualRepeater", onclick: "folderClicked", onSetupRow: "getFolderRow", components:
                        [
                            { name: "FolderItem", kind: "DividerDrawer", open: false, content: "Folder", components:
                                [
                                ]
                            },
                        ]
                    },
                ]
            }
        ],
        // {"musicFolder":{"id":4,"name":"Music"}
    getFolderRow: function(inSender, inRow)
    {
        var x = this.folderList && this.folderList[inRow];
        this.log(inRow, x, this.folderList);
        if(x)
        {
            this.$.FolderItem.setCaption(x.name);
            this.$.FolderItem.folderId = x.id;
            return true;
        }
        return false;
    },
    folderClicked: function(inSender, inEvent)
    {
        this.doFolderClick(inEvent, this.folderList[inEvent.rowIndex].id);
    },
    foldersChanged: function()
    {
        if(this.folders.musicFolder.name) { // only one.. sigh
            this.folderList = new Array();
            this.folderList[0] = this.folders.musicFolder;
        } else {
            this.folderList = this.folders.musicFolder;
        }
        this.$.FolderRepeater.render();
    },
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

/*enyo.kind({
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
                        //{ kind: "FadeScroller", flex: 1, accelerated: true, components:
                        //    [
                                { name: "AlbumList", kind: "VirtualList", lookAhead: 20, flex: 1, accelerated: true, onSetupRow: "getAlbumListItem", components:
                                    [
                                        { kind: "HFlexBox", components:
                                            [
                                                //{ name: "AlbumItem", kind: "subsonic.AlbumItem", onclick: "itemClicked", },
                                                { name: "AlbumItem", kind: "subsonic.AlbumOrSongItem", onclick: "itemClicked", },
                                            ]
                                        }
                                    ]
                                }
                        //    ]
                        //},
                    ]
                },
                { name: "SongListView", kind: "VFlexBox", components:
                    [
                        { kind: "FadeScroller", flex: 1, accelerated: true, components:
                            [
                                { name: "SongList", kind: "VirtualRepeater", flex: 1, accelerated: true, onSetupRow: "getSongListItem", components:
                                    [
                                        { kind: "HFlexBox", components:
                                            [
                                                //{ name: "SongItem", kind: "subsonic.AlbumItem", onclick: "itemClicked", },
                                                { name: "SongItem", kind: "subsonic.AlbumOrSongItem", flex: 1, onclick: "itemClicked", },
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
            //if(this.$.ViewPane.getViewName() == "AlbumListView") {
            if(a.isDir) {
                this.$.AlbumItem.setAlbumInfo(a);
            } else {
                this.$.SongItem.setSongInfo(a);
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
    querySongItem: function(row)
    {
        return this.queryListItem(row);
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
        //this.log(this.songList);
        this.songList = this.songList.directory.child;
        this.$.ViewPane.selectViewByName("SongListView");
        if(this.lastActivatedSpinner)
            this.lastActivatedSpinner.hide();
        this.$.SongList.render();
    },
    itemClicked: function(inSender, inEvent)
    {
        var what = (inSender.name == "AlbumItem" ? this.albumList[inEvent.rowIndex] : this.songList[inEvent.rowIndex]);
        if(inSender.songInfo)
        {
            enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doSongClicked(inEvent, id); }), inEvent, what);
        }
        else
        {
            enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doAlbumClicked(inEvent, id); }), inEvent, what.id);
        }
    },
});*/

enyo.kind({
    name: "subsonic.SearchView",
    kind: "VFlexBox", components: [
        { name: "SearchText", kind: "SearchInput", onchange: "performSearch" },
        { kind: "FadeScroller", flex: 1, accelerated: true, onchange: "performSearch", components:
            [
                { kind: "Divider", caption: "Artists" },
                { name: "ArtistList", kind: "VirtualRepeater", accelerated: true, onSetupRow: "getArtistSearchItem", components:
                    [
                        { name: "ArtistItem", kind: "subsonic.ArtistItem", onclick: "clickArtist", },
                    ]
                },
                { kind: "Divider", caption: "Albums" },
                { name: "AlbumList", kind: "VirtualRepeater", accelerated: true, onSetupRow: "getAlbumSearchItem", components:
                    [
                        { name: "AlbumItem", kind: "subsonic.AlbumOrSongItem", onclick: "clickAlbum", },
                    ]
                },
                { kind: "Divider", caption: "Songs", },
                { name: "SongList", kind: "VirtualRepeater", accelerated: true, onSetupRow: "getSongSearchItem", components:
                    [
                        { name: "SongItem", kind: "subsonic.AlbumOrSongItem", onclick: "clickSong", }, // TODO: AlbumItem has a SongItem inside it already .. sigh
                    ]
                }
            ]
        }
    ],
    events: {
        "onSearch": "",
        "onAlbumClicked": "",
        "onSongClicked": "",
        "onArtistClicked": "",
    },
    published: {
        "songList" : "",
        "music": "",
        "artistList": "",
    },
    clickArtist: function(inSender, inEvent) {
        var x = inEvent.rowIndex;
        this.doArtistClicked(inEvent, this.artistList[x].id);
    },
    clickAlbum: function(inSender, inEvent)
    {
        var x = inEvent.rowIndex;
        this.doAlbumClicked(inEvent, this.albumList[x].id);        
    },
    clickSong: function(inSender, inEvent)
    {
        var x = inEvent.rowIndex;
        this.doSongClicked(inEvent, this.songList[x]);
    },
    musicChanged: function()
    {
        // TODO: If no Internet connection, we get "Cannot read property 'albumList' of undefined, here
        if(!this.music) {
            this.music = { albumList: {} };
            this.albumList = {};
            this.$.AlbumList.render();
            return;
        }
        if(this.music.artist) // Only one response.. SIGH
            this.music[0] = this.music;

        this.albumList = (this.music.albumList && this.music.albumList.album) || (this.music.directory && this.music.directory.child) || this.music;
        //this.albumList = this.music.albumList ? this.music.albumList.album : this.music.directory.child;
        //this.albumList.sort( function(i1, i2) { return (i1.title && i1.title.localeCompare) ? i1.title.localeCompare(i2.title) : 0; });
        //this.log(this.albumList[0]);
        //this.$.ViewPane.selectViewByName("AlbumListView");
        this.$.AlbumList.render();
    },
    songListChanged: function()
    {
        
        if(!this.songList)
            this.songList = {};
        if(this.songList.album) // fucking sigh
            this.songList[0] = this.songList;
        this.songList = (this.songList.directory && this.songList.directory.child) || this.songList;
        //this.$.ViewPane.selectViewByName("SongListView");
        //if(this.lastActivatedSpinner)
        //    this.lastActivatedSpinner.hide();
        this.$.SongList.render();
    },
    artistListChanged: function()
    {
        //id: "633a5c6d757369635c54797065204f204e65676174697665"
        // name: "Type O Negative"
        if(!this.artistList)
        {
            this.artistList = new Array();
        }
        if(this.artistList.name) // if there's only one entry, then .. well.. this API fucking sucks sometimes.
            this.artistList[0] = this.artistList;
        else
            this.artistList.sort( function(i1, i2) { return (i1.name && i1.name.localeCompare) ? i1.name.localeCompare(i2.name) : 0; });
        this.$.ArtistList.render();
    },
    performSearch: function(inSender, inEvent)
    {
        this.log();
        this.doSearch(this.$.SearchText.getValue());
    },
    getArtistSearchItem: function(inSender, inRow)
    {
        if(this.artistList[inRow])
        {
            this.$.ArtistItem.setContent(this.artistList[inRow].name);
            this.$.ArtistItem.artistID = this.artistList[inRow].id;
            return true;
        }
        return false;
    },
    // TODO: getAlbum/SongListItem straight copied from the MusicView . . probably want to custom it, or figure out a way to share it.
    getAlbumSearchItem: function(inSender, inRow)
    {
        var a = this.albumList && this.albumList[inRow];
        
        if(a)
        {
            this.$.AlbumItem.setAlbumInfo(a);
            return true;
        }
        return false;
    },
    getSongSearchItem: function(inSender, inRow)
    {
        var a = this.songList && this.songList[inRow];
        if(a)
        {
            this.$.SongItem.setSongInfo(a);
            return true;
        }
        return false;
    },
    querySongItem: function(inRow)
    {
        return this.songList && this.songList[inRow];
    }
});
/*
  {"subsonic-response":
  {"searchResult2":
  {"song":
    [
        {"album":"Least Worst of",
            "artist":"Type O Negative",
            "bitRate":192,
            "contentType":"audio/mpeg",
            "coverArt":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f665c54797065204f204e65676174697665202d20313220426c61636b205261696e626f77732e6d7033",
            "duration":749,
            "genre":"Metal",
            "id":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f665c54797065204f204e65676174697665202d20556e7375636365737366756c6c7920436f70696e67205769746820746865204e61747572616c20426561757479206f6620496e666964656c6974792e6d7033",
            "isDir":false,"isVideo":false,"parent":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f66","path":"Type O Negative/Least Worst of/Type O Negative - Unsuccessfully Coping With the Natural Beauty of Infidelity.mp3","size":18042880,"suffix":"mp3","title":"Unsuccessfully Coping With the Natural Beauty of Infidelity","track":13,"year":2000},{"album":"Slow Deep & Hard","artist":"Type O Negative","bitRate":192,"contentType":"audio/mpeg","coverArt":"633a5c6d757369635c54797065204f204e656761746976655c536c6f772044656570202620486172645c466f6c6465722e6a7067","duration":759,"id":"633a5c6d757369635c54797065204f204e656761746976655c536c6f772044656570202620486172645c54797065204f204e65676174697665202d20556e7375636365737366756c6c7920436f70696e67205769746820746865204e61747572616c20426561757479206f6620496e666964656c6974792e6d7033","isDir":false,"isVideo":false,"parent":"633a5c6d757369635c54797065204f204e656761746976655c536c6f77204465657020262048617264","path":"Type O Negative/Slow Deep & Hard/Type O Negative - Unsuccessfully Coping With the Natural Beauty of Infidelity.mp3","size":18468864,"suffix":"mp3","title":"Unsuccessfully Coping With the Natural Beauty of Infidelity","track":1,"year":1991}]},"status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}
*/
enyo.kind({
    name: "subsonic.PlaylistsView",
    kind: "VFlexBox",
    events: {
        "onRefreshPlaylists":"",
        "onOpenPlaylist":"",
        "onPlayPlaylist":"",
    },
    components: [
        { kind: "FadeScroller", flex: 1, components:
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
        "onSongChanged": "",
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
                                //{ name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: enyo.Image, height: isLargeScreen() ? "320px" : "240px", src: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
                                { name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: "ImageFallback", height: isLargeScreen() ? "320px" : "240px", fallbackSrc: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
                                // TODO: adjust albumart height when rotating to landscape on telephones
                                { name: "PlayerTips", content: "Tap to change display, hold to toggle tabs.", className: "enyo-item-ternary", style: "color: white;" },
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
                                { name: "ArtistNameLabel", content: "Artist Name", style: "color: white; max-width: 50%; ", },
                                { kind: "Spacer", },
                                { name: "AlbumNameLabel", content: "Album Name", style: "color: white; max-width: 50%; ", },
                            ]
                        },
                        { kind: "HFlexBox", components:
                            [
                                { kind: "Spacer", },
                                { name: "SongNameLabel", content: "Song Name", style: "color: white; max-width: 95%; ", },
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
                        { kind: "GrabButton", style: "background-color: #121212" },
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
        this.checkTimer();
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
    checkTimer: function() {
        if(!this.timer)
            this.timer = setInterval(enyo.bind(this, this.checkStatus), 500);
    },
    clearTimer: function() {
        if(this.timer)
        {
            clearInterval(this.timer);
            delete this.timer;
        }
    },
    play: function() {
        this.$.MusicPlayer.play();
        this.checkTimer();
    },
    songChanged: function()
    {
        console.log("songChanged");
        console.log(this.song);
        this.$.MusicPlayer.audio.pause();
        enyo.application.nowplaying = this.song;
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
            this.checkTimer();
        } else {
            this.$.SongInfoBox.hide();
            this.$.AlbumArt.setSrc("http://img91.imageshack.us/img91/3550/nocoverni0.png");
            this.$.MusicPlayer.setSrc("");
            this.clearTimer();
            delete this.timer;
            this.checkStatus();
        }
        this.doSongChanged(this.song);
    },
    playPauseClicked: function(inSender, inEvent)
    {
        if(!this.$.MusicPlayer.audio.paused)
            this.$.MusicPlayer.audio.pause();
        else
            this.$.MusicPlayer.audio.play();
        this.checkTimer();
        inEvent.stopPropagation();
        return true;
    },
    checkStatus: function()
    {
        //this.log(this.showing);
        //this.log();
        this.$.PlayerStatus.setContent(this.$.MusicPlayer.audio.seeking + " " + this.$.MusicPlayer.audio.readyState + " " +  this.$.MusicPlayer.audio.paused);
        if(!this.song)
            return;
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
        //this.log("song progress = ", this.$.MusicPlayer.audio.currentTime, this.song.duration, prog);
        this.$.ProgressSlider.setBarPosition( prog );
        if(!this.$.MusicPlayer.audio.seeking)
            this.$.ProgressSlider.setPosition(prog);
        // TODO: we need to check to see what our last time was, and if we're looping within 1sec of the end, then cut
        if(this.$.MusicPlayer.audio.currentTime > (this.song.duration - 0.6))
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
        "onSongClicked" : "",
        "onItemMenu": "",
        "onSongRemove": "",
    },
    components: [
        isLargeScreen() ? { content: "Drag songs from the Music list and drop them in the list. Tap here to change view, Hold to toggle Tabs. Hold on an individual item for options. Swipe an item to delete.", className: "enyo-item-ternary", ondragover: "scrollUp" } : { },
        { name: "Scroller", kind: "FadeScroller", flex: 1, accelerated: true, components:
            [
                { name: "PlaylistRepeater", flex: 1, kind: "VirtualRepeater", onmousehold: "songHeld", accelerated: true, onSetupRow: "getListItem", components:
                    [
                        //{ name: "Song", kind: "subsonic.SongItem", draggable: false, },
                        { name: "Song", kind: "subsonic.AlbumOrSongItem", onclick: "songClicked", onConfirm: "removeSong", swipeable: true, draggable: false, },
                    ]
                },
            ]
        },
        //{ kind: "Spacer" },
        { kind: "Toolbar", ondragover: "scrollDown", components:
            [
                { kind: "GrabButton" },
                { caption: "Play", onclick: "doStartPlaylist" },
                { caption: "Clear", onclick: "clearPlaylist" },
            ]
        },
    ],
    removeSong: function(inSender, inIndex) // TODO: This is all fucked in Chrome .. will it be all fucked on devices?
    {
        this.log();
        this.doSongRemove(enyo.application.playlist[inIndex]);
    },
    songHeld: function(inSender, inEvent)
    {
        this.log();
        this.doItemMenu(inEvent, enyo.application.playlist[inEvent.rowIndex]);
        inEvent.stopPropagation();
    },
    scrollUp: function(inSender, inEvent)
    {
        this.$.Scroller.scrollTo(this.$.Scroller.scrollTop - 10, this.$.Scroller.scrollLeft);
        this.log("should be scrolling upwards");
    },
    scrollDown: function(inSender, inEvent)
    {
        this.$.Scroller.scrollTo(this.$.Scroller.scrollTop + 10, this.$.Scroller.scrollLeft);
        this.log("should be scrolling downwards");
    },
    scrollToBottom: function()
    {
        this.$.Scroller.scrollToBottom();
    },
    songClicked: function(inSender, inEvent)
    {
        enyo.application.playlist.index = inEvent.rowIndex;
        this.render();
        this.doSongClicked(inEvent, enyo.application.playlist[inEvent.rowIndex]);
        inEvent.stopPropagation();
    },
    getListItem: function(inSender, inRow)
    {
        if(enyo.application.playlist && enyo.application.playlist[inRow])
        {
            this.log(inRow);
            this.$.Song.addRemoveClass("playhighlight", inRow == enyo.application.playlist.index);
            var p = enyo.application.playlist[inRow];
            var si = this.$.Song;
            
            //this.log(inRow, "pre", si.songInfo);
            si.setSongInfo(p);
            //this.log(inRow, "post", si.songInfo);
            this.$.Song.setDraggable(false); // TODO: make songs draggable -off- the now playing list, since we can't easily swipe to delete, i guess
            
            /*this.log(enyo.application.dragging, enyo.application.dropIndex, inRow, enyo.application.playlist.length);
            if(enyo.application.dragging && enyo.application.dropIndex != undefined && enyo.application.dropIndex > -1)
            {
                if(enyo.application.dropIndex == inRow)
                {
                    //this.log("highlighting " + inRow);
                    this.$.Song.applyStyle("border-top", "thick double blue");
                    this.$.Song.applyStyle("border-bottom", undefined);
                    if(this.lastHighlightedIndex != inRow)
                    {
                        //this.renderRow(this.lastHighlightedIndex)
                        this.lastHighlightedIndex = inRow;
                    }
                } else {
                    this.$.Song.applyStyle("border-top", undefined);
                    this.$.Song.applyStyle("border-bottom", undefined);
                } 
            } else if(enyo.application.dragging && inRow == enyo.application.playlist.length-1) {
                {
                    if(enyo.application.dropIndex == undefined ) {
                        this.$.Song.applyStyle("border-bottom", "thick double blue");
                        this.lastHighlightedIndex = inRow;
                    } else {
                        this.$.Song.applyStyle("border-bottom", undefined);
                    }
                }
            } else {
                this.$.Song.applyStyle("border-bottom", undefined);
                this.$.Song.applyStyle("border-top", undefined);
            }*/
            return true;
        }
        return false;
    },
    renderRow: function(inRow)
    {
        this.$.PlaylistRepeater.renderRow(inRow);
    },
    clearPlaylist: function(inSender, inEvent)
    {
        enyo.application.playlist = [ ];
        this.$.PlaylistRepeater.render();
        inEvent.stopPropagation();
    },
    scrollUp: function(inSender, inEvent)
    {
        
    },
    scrollDown: function(inSender, inEvent)
    {
        
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

enyo.kind({
    name: "LyricsView",
    kind: "VFlexBox",
    published: {
        "songArtist" : "",
        "songTitle" : "",
        "songLyrics": "",
    },
    components: [
        { kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [ { kind: "SpinnerLarge" } ], },
        { kind: "FadeScroller", accelerated: true, flex:1, components:
            [
                { kind: "RowGroup", layoutKind: "HFlexLayout", components:
                    [
                        { name: "TitleLabel", flex: 1, content: "Title" },
                        { name: "ArtistLabel", content: "Artist" },
                    ]
                },
                { kind: "Group", components:
                    [
                        { name: "Lyrics", content: "Lyrics here" },
                    ]
                },
            ]
        },
        { kind: "Toolbar", components:
            [
                { kind: "GrabButton" },
            ]
        },
    ],
    songArtistChanged: function()
    {
        this.$.ArtistLabel.setContent(this.songArtist);
    },
    songTitleChanged: function()
    {
        this.$.TitleLabel.setContent(this.songTitle);
    },
    songLyricsChanged: function()
    {
        this.$.Lyrics.setContent(this.songLyrics);
    }
})

enyo.kind({
    name: "subsonic.NewMusicView",
    kind: "VFlexBox",
    flex: 1,
    published: {
        "music": undefined, /* The complete list of Music we received for this folder */
        "albums": undefined, /* We're going to parse this into albums and songs */
        "songs": undefined, /* ok */
    },
    events: {
        "onAlbumClicked": "",
        "onSongClicked": "",
    },
    musicListView: {
        name: "AlbumListView", 
        flex: 1,
        kind: "VFlexBox", components: [
            { content: "Pre SongList" },
            { name: "SongList", kind: "VirtualList", lookAhead: 20, flex: 1, accelerated: true, onSetupRow: "getSongListItem", components:
                [
                    { kind: "HFlexBox", components:
                        [
                            { name: "SongItem", kind: "subsonic.AlbumOrSongItem", flex: 1, onclick: "songClicked", },
                        ]
                    }
                ]
            },
            { content: "Pre AlbumList" },
            { name: "AlbumList", kind: "VirtualList", lookAhead: 20, flex: 1, accelerated: true, onSetupRow: "getAlbumListItem", components:
                [
                    { kind: "HFlexBox", components: // TODO: is this box necessary? can we just HLayoutKind the list?
                        [
                            { name: "AlbumItem", kind: "subsonic.AlbumOrSongItem", onclick: "albumClicked" },
                        ]
                    }
                ]
            },
        ]
    },
    components: [
        //{ content: "Begin NewMusicView ViewPane" },
        { name: "ViewPane", flex: 1, kind: "Pane", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", components:
            [
                {
                    name: "AlbumListView", 
                    flex: 1,
                    kind: "VFlexBox", components:
                        [
                            //{ content: "Pre SongList" },
                            { kind: "FadeScroller", flex: 1, components:
                                [
                                    { name: "SongList", kind: "VirtualRepeater", lookAhead: 20, flex: 1, accelerated: true, onSetupRow: "getSongListItem", components:
                                        [
                                            { kind: "HFlexBox", components:
                                                [
                                                    { name: "SongItem", kind: "subsonic.AlbumOrSongItem", flex: 1, draggable: true, onclick: "songClicked", },
                                                ]
                                            }
                                        ]
                                    },
                                    //{ content: "Pre AlbumList" },
                                    { name: "AlbumList", kind: "VirtualRepeater", lookAhead: 20, flex: 1, accelerated: true, onSetupRow: "getAlbumListItem", components:
                                        [
                                            { kind: "HFlexBox", components: // TODO: is this box necessary? can we just HLayoutKind the list?
                                                [
                                                    { name: "AlbumItem", kind: "subsonic.AlbumOrSongItem", draggable: false, onclick: "albumClicked" },
                                                ]
                                            }
                                        ]
                                    },
                                ]
                            },
                        ]
                }
            ]
        },
        //{ content: "End NewMusicView ViewPane" },
    ],
    
    ready: function()
    {
        this.inherited(arguments);
        //this.myViews = new Array();
        //this.myViews.push(this.$.ViewPane.createComponent(this.musicListView));
        //this.$.ViewPane.render();
        //this.$.ViewPane.selectView(this.myViews[0]);
    },
    goBack: function()
    {
        this.$.ViewPane.selectView(this.myViews.pop);
    },
    getSongListItem: function(inSender, inRow)
    {
        /*var s = this.$.ViewPane.getView().songs;
        s = s[inRow];*/
        var s = this.songs && this.songs[inRow];
        if(s)
        {
            this.$.SongItem.setSongInfo(s);
            return true;
        }
        return false;
    },
    getAlbumListItem: function(inSender, inRow)
    {
        var a = this.albums && this.albums[inRow];
        if(a)
        {
            this.$.AlbumItem.setAlbumInfo(a);
            return true;
        }
        return false;
    },
    querySongItem: function(inRow)
    {
        return this.songs[inRow];
    },
    musicChanged: function()
    {
        this.log(this.music);
        if(this.music.albumList)
            this.music = this.music.albumList.album;
        this.albums = new Array();
        this.songs = new Array();
        for(var x = 0; x < this.music.length; x++)
        {
            if(this.music[x].isDir)
                this.albums.push(this.music[x]);
            else
                this.songs.push(this.music[x]);
        }
        this.$.SongList.render();
        this.$.AlbumList.render();
    },
    songClicked: function(inSender, inEvent)
    {
        this.log();
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doSongClicked(inEvent, id); }), inEvent, this.songs[inEvent.rowIndex]);
    },
    albumClicked: function(inSender, inEvent)
    {
        this.log();
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doAlbumClicked(inEvent, id); }), inEvent, this.albums[inEvent.rowIndex].id);
    }
})