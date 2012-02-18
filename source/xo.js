// TODO: Save Playlist button doesn't light up after retrieving credentials, only after making a change to the playlist
// TODO: add all from search tab?
// TODO: player stops at song change if dashboard gets closed?
// TODO: Download statuses are completely fucked up
// TODO: send the command to change the dashboard play button from the main function, not from in the player
// TODO: test the dashboard in Jukebox mode
// IDEA: disable subsonic use if received error 60 (not registered), forward user to subsonic.org?, until we get a valid response?
// TODO: close dashboard at app exit (until the app is seperated)
// TODO: Multiple server configs
// TODO: Switching to/from Jukebox mode needs to sync the Play/Pause button for the current mode
// TODO: when tap selecting song, if not already playing, add and start playing
// TODO: preference for default action when tap selecting a song (Play Now, Add / Play, Add, "Just Select")

// TODO: need to do some checking on the Timer in MediaPlayerView and make sure that it's only running when we really need it to be.
// TODO: docs say "jukeboxControl" "set" doesn't stop the current play .. so if that's correct, then we're stopping it when we receive the new playlist?

// TODO: have Random button open up a popup that gives options for what to pull?
// TODO: need to relocate the player controls to the sides on phones when we go Landscape .. ugh.
// TODO: TouchPad in portrait mode has a shitton of extra space we can use
// TODO: need to have Clear playlist re-render the music view (as well as removing songs from the playlist)
// TODO: Album hold menu
// TODO: Probably should not allow any further taps to load more directories when we're waiting on a directory to load already ...

// IDEA: "Search" brings up a completely new main-view that is three-panes, and shows the search results from each type in each pane?!

// TODO: stop the Interval that is set in the MusicPlayer when application is not foreground, resume when it is.  Also stop it when that pane is switched to a different view.
// TODO: half implemented scrolling when dragging music to top or bottom of list ?
// TODO: volume buttons on device directly controlling the jukebox volume
// TODO: drag-drop to player (add to playlist, or play now?)
// TODO: add (optional?) banner notification of new song info when player switches songs, if app is in background, or player view is not visible
// TODO: if you start typing it should just pop over to the search tab, and focus the search input (see fahhem's blog)
// TODO: selecting a playlist opens it drawer-fashion like under it, instead of opening it in the Music tab?
// TODO: (option to?) disable sleep while player screen is up
// TODO: Exhibition mode
// TODO: had to add a timeout in the Transition code to deal with transitioning failure when auto-flipping from Search to Music tab.. investigate why the transition fails.
// TODO: "gapless" playback?

// TODO: popup a "No results received" toaster, for this and any other situation that gives no results?

// TODO: Have search also send a search query to Amazon, linking for purchasing? hmmm...
// TODO: Saving of current index in playlist does not appear to be working
// TODO: font sizing on artist/song title should be based on the lengths of both, not of each

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
    kind: "VFlexBox", //enyo.Pane,
    transitionKind: isLargeScreen() && window.PalmSystem ? "TestTransition" : "enyo.transitions.LeftRightFlyin",
    components: [        
        { name: "fileDownload", kind: "PalmService", service: "palm://com.palm.downloadmanager/",
          method: "download", onSuccess: "downloadStatus", subscribe: true },
        { kind: "ApplicationEvents", onUnload: "onUnload", onBack: "doBack", onLoad: "onLoad",
          onWindowRotated: "onWindowRotated", onApplicationRelaunched: "onRelaunch",
          onWindowActivated: "windowActivated", onWindowDeactivated: "windowDeactivated",
          onWindowParamsChange: "windowParamsChanged"
        },
        { name: "api", kind: "subsonic.api",
          onLicenseReceived: "receivedLicense",       onLicenseError: "badLicense",
          onAlbumListReceived: "receivedAlbumList",   onDirectoryReceived: "receivedDirectory",
          onReceivedPlaylists: "receivedPlaylists",   onReceivedPlaylist: "receivedPlaylist",
          onSearchResults: "receivedSearchResults",   onReceivedFolders: "receivedFolders",
          onReceivedIndexes: "receivedIndexes",       onRandomSongsReceived: "receivedRandomSongs",
          onDeletedPlaylist: "deletedPlaylist",       onReceivedUser: "receivedUserInfo",
          onJukeboxPlaylist: "receivedJukeboxPlaylist", onJukeboxStatus: "receivedJukeboxStatus",
          onServerActivity: "serverActivity",
          onError: "serverError",
        },
        { name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", },
        { name: "AppMenu", kind: "AppMenu", lazy: false, components:
            [
                { caption: "Help/About", onclick: "openIntroPopup" },
            ]
        },
        { name: "MainPane", flex: 1, kind: "Pane", components:
            [
                { name: "LogView", kind: "LogView", }, 
                { name: "slider", kind: "SlidingPane", onSelectView: "sliderSelected", components:
                    [
                        { name: "LeftView", width: "50%", kind: "SlidingView", edgeDragging: true,
                          onSelectView: "leftViewSelected", components:
                            [
                                { name: "IntroPopup", kind: "IntroPopup", autoClose: false, dismissWithClick: false, scrim: true },

                                { name: "TabBar", kind: "TabGroup", onChange: "leftTabChange", components:
                                    [
                                        { caption: "Home", },
                                        { caption: "Music", },
                                        { caption: "Search", },
                                        { caption: "Playlists", },
                                    ]
                                },
                                { name: "LeftPane", flex: 1, kind: "Pane", onSelectView: "leftPaneSelected",
                                  transitionKind: isLargeScreen() && window.PalmSystem ? "TestTransition" : "enyo.transitions.LeftRightFlyin",
                                  components:
                                    [
                                        { name: "HomeView", kind: "subsonic.HomeView",
                                          onServerDialog: "openServerDialog", onFolderClick: "loadIndex",
                                          onMusicView: "loadMusicView", onRandomList: "getRandomList" },
                                        { name: "MusicView", kind: "subsonic.NewMusicView",
                                          onEnableSelectButtons: "enableSelectButtons",
                                          onDisableSelectButtons: "disableSelectButtons",
                                          onAlbumClicked: "loadAlbum", onSongClicked: "toggleSongSelection",
                                          onSongHeld: "showSongMenu", },
                                        { name: "SearchView", kind: "subsonic.SearchView",
                                          onSearch: "performSearch", onAlbumClicked: "loadSearchedAlbum",
                                          onArtistClicked: "loadSearchedAlbum", onSongClicked: "toggleSearchSongSelection",
                                          onSongHeld: "showSongMenu", },
                                        { name: "PlaylistsView", kind: "subsonic.PlaylistsView",
                                          onRefreshPlaylists: "refreshPlaylists",
                                          onOpenPlaylist: "openPlaylist", onPlayPlaylist: "playPlaylist",
                                          onDeletePlaylist: "deletePlaylist" },
                                    ]
                                },
                            ]
                        },
                        //{name: "avatar", kind: "Image", className: "app-avatar", src: "http://img91.imageshack.us/img91/3550/nocoverni0.png", showing: false, },
                        { name: "avatar", kind: "ImageFallback", className: "app-avatar",
                          height: "64px", width: "64px", fallbackSrc: "http://img91.imageshack.us/img91/3550/nocoverni0.png",
                          showing: false, },
                        { name: "RightView", kind: "SlidingView", /*dismissible: true,*/
                          edgeDragging: true, components:
                            [
                                { name: "RightTabs", kind: "TabGroup", onChange: "rightTabChange",
                                  showing: prefs.get("righttabsshowing"), components:
                                    [
                                        { caption: "Now Playing" },
                                        { caption: "Player" },
                                        //{ caption: "Lyrics" },
                                    ]
                                },
                                
                                { name: "RightPane", kind: "Pane", flex: 1, onSelectView: "rightPaneSelected", components:
                                    [
                                        { name: "PlaylistView", flex: 1, kind: "subsonic.PlaylistView",
                                            onEnablePrev: "enablePrev", onDisablePrev: "disablePrev",
                                            onEnablePlay: "enablePlay", onDisablePlay: "disablePlay",
                                            onEnableNext: "enableNext", onDisableNext: "disableNext",
                                            onEnableSave: "enableSave", onDisableSave: "disableSave",
                                            onEnableClear: "enableClear", onDisableClear: "disableClear",
                                            onEnableShuffle: "enableShuffle", onDisableShuffle: "disableShuffle",
                                            onClearJukebox: "clearJukeboxPlaylist",
                                            onSongRemove: "menuRemoveSongFromPlaylist",
                                            onItemMenu: "showPlaylistMenu", onSongClicked: "loadSong",
                                            onStartPlaylist: "startPlaylist", ondragout: "dragOutPlaylist",
                                            ondragover: "dragOverPlaylist", ondrop: "dropOnPlaylist",
                                            onmousehold: "hideShowRightTabs", onCycleTab: "cycleRightTab",
                                            onShuffle: "shufflePlaylist", onSavePlaylist: "openSavePlaylist" },
                                        { name: "MediaPlayerView", flex: 1, kind: "VFlexBox", components:
                                            [
                                                { name: "MediaPlayer", flex: 1,
                                                    onPlaying: "playing", onNotPlaying: "notPlaying",
                                                    onEnablePrev: "enablePrev", onDisablePrev: "disablePrev",
                                                    onEnablePlay: "enablePlay", onDisablePlay: "disablePlay",
                                                    onEnableNext: "enableNext", onDisableNext: "disableNext",
                                                    onSetJukeboxPosition: "setJukeboxPosition",
                                                    onPlayPauseJukebox: "playPauseJukebox",
                                                    onJukeboxStatus: "getJukeboxStatus",
                                                    onSongChanged: "songChanged", onNextSong: "playNext",
                                                    onPrevSong: "playPrev", onHideTabs: "hideShowRightTabs",
                                                    onCycleTab: "cycleRightTab", onVideoPlay: "videoStarted",
                                                    onVideoError: "videoError", onShare: "shareMedia",
                                                    style: "background: black; ", kind: "subsonic.MediaPlayerView",
                                                    onJukeboxMode: "jukeboxToggled" },
                                            ]
                                        },
                                        //{ name: "LyricsView", flex: 1, kind: "LyricsView", onmousehold: "hideShowRightTabs", onclick: "cycleRightTab" }
                                    ]
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        { name: "BottomToolbar", kind: "Toolbar", components: [
            { /*caption: "Back",*/ icon: "images/back.png", kind: "ToolButton", onclick: "doBack", showing: isLargeScreen() },
            { name: "SelectAllButton", kind: "ToolButton", /*caption: "+ All",*/ icon: "images/playlistadd.png", onclick: "selectAll", showing: false, },
            { name: "UnselectAllButton", kind: "ToolButton", /*caption: "- All",*/ icon: "images/playlistremove.png", onclick: "unselectAll", showing: false, },
            { kind: "Spacer" },
            { name: "PrevButton", /*caption: "<<",*/ kind: "ToolButton", icon: "images/prev.png", onclick: "playPrev", },
            { name: "PlayButton", /*caption: ">",*/ kind: "ToolButton", icon: "images/play.png", onclick: "playOrPause" },
            { name: "NextButton", /*caption: ">>",*/ kind: "ToolButton", icon: "images/next.png", onclick: "playNext", },
            { kind: "Spacer" },
            { name: "ClearButton",  kind: "ToolButton", /*caption: "Clear",*/ icon: "images/playlistclear.png", onclick: "clearPlaylist", showing: false, },
            { name: "ShuffleButton", kind: "ToolButton", /*caption: "Shuffle",*/ icon: "images/shuffle.png", onclick: "shufflePlaylist" },
            { name: "SaveButton", kind: "ToolButton", /*caption: "Save",*/ icon: "images/playlistsave.png", onclick: "openSavePlaylist", showing: false },
            { name: "JukeboxToggle", kind: "ToggleButton", showing: false,
              onLabel: "Jukebox", offLabel: "Jukebox", onChange: "toggleJukebox" },
        ]},
        { kind: "VFlexBox", components:
            [
                { name: "serverDialog", kind: "subsonic.ServerDialog",
                    onServerChanged: "changedServer",
                },
                { name: "demoServerDialog", kind: "subsonic.DemoServerDialog" },
            ]
        },
        { name: "SongMenu", kind: "SongMenu", onPlaySong: "menuPlaySong",
          onInsertSong: "menuInsertSong", onAddSong: "menuAddSong", onDownloadSong: "downloadSong" },
        { name: "NowPlayingMenu", kind: "NowPlayingMenu", onRemoveSong: "menuRemoveSongFromPlaylist", },
        { name: "ErrorDialog", kind: "ErrorDialog" },
        { name: "SavePlaylistPopup", kind: "Dialog", components:
            [
                { kind: "RowGroup", components:
                    [
                        { content: "Enter Playlist Name" },
                        { name: "SavePlaylistName", kind: "Input" },
                    ]
                },
                { kind: "Button", caption: "OK", onclick: "savePlaylist" },
            ]
        },
        { kind: "AppMenu", lazy: false, components:
            [
                { name: "JukeboxMenuItem", caption: "Jukebox OFF", onclick: "menuToggleJukebox" }
            ]
        },
    ],
    gesturestartHandler: function(inSender, event) {
        //this.log("***** gesturestart: event.scale: " + event.scale + ", event.centerX: " + event.centerX + ", event.centerY: " + event.centerY);
        //event.preventDefault();
        //event.stopPropagation();
    },
    gesturechangeHandler: function(inSender, event) {
        //this.log("***** gesturechange: event.scale: " + event.scale + ", event.centerX: " + event.centerX + ", event.centerY: " + event.centerY);
        if(event.scale > 1.5 && !enyo.application.isFullScreen)
        {
            enyo.setFullScreen(true);
            enyo.application.isFullScreen = true;
            //this.$.BottomToolbar.applyStyle("opacity", "0.5");
            this.$.BottomToolbar.applyStyle("background", "black");
            
            if(window.PalmSystem)
                enyo.windows.setWindowProperties(window, { blockScreenTimeout: true });
                
            //event.preventDefault();
            event.stopPropagation();
        }
        if(event.scale < 0.75 && enyo.application.isFullScreen)
        {
            enyo.setFullScreen(false);
            enyo.application.isFullScreen = false;
            //this.$.BottomToolbar.applyStyle("opacity", "1.0");
            this.$.BottomToolbar.applyStyle("background", "");
            if(window.PalmSystem)
                enyo.windows.setWindowProperties(window, { blockScreenTimeout: false });
            //event.preventDefault();
            event.stopPropagation();
        }
    },
    gestureendHandler: function(inSender, event) {
        //this.log("***** gestureend: event.scale: " + event.scale + ", event.centerX: " + event.centerX + ", event.centerY: " + event.centerY);
        //event.preventDefault();
        //event.stopPropagation();
    },    
    windowParamsChanged: function(inSender, inEvent)
    {
        this.log(enyo.windowParams.cmdType);
        switch(enyo.windowParams.cmdType)
        {
            case "playpause":
                this.$.MediaPlayer.playPauseClicked(inSender, inEvent);
                break;
            case "prev":
                this.playPrev();
                break;
            case "next":
                this.playNext();
                break;
        }
    },
    onLoad: function(x, y, z)
    {
        this.log(x, y, z, "windowType=", enyo.windowParams.windowType);
        
    },
    onUnload: function(x, y, z)
    {
        this.log(x, y, z);
        this.$.MediaPlayer.setSong(undefined);
        if(enyo.application.dash)
            enyo.application.dash.window.close();
    },
    windowActivated: function(inSender)
    {
        this.log();
        enyo.application.active = true;
    },
    windowDeactivated: function(inSender)
    {
        this.log();
        enyo.application.active = false;
    },
    onWindowRotated: function(x, y, z)
    {
        this.$.MediaPlayer.reflow();
    },
    ready: function() {
        this.inherited(arguments);
        this.$.PlaylistView.enableControls();
    },
    enablePrev: function() { this.$.PrevButton.show(); },
    disablePrev: function() { this.$.PrevButton.hide(); },
    enablePlay: function() { this.$.PlayButton.show(); },
    disablePlay: function() {
        if(this.$.MediaPlayer.playing())
        {
            this.enablePlay();
        }
        this.$.PlayButton.hide();
    },
    enableNext: function() { this.$.NextButton.show(); },
    disableNext: function() { this.$.NextButton.hide(); },
    enableClear: function() { this.$.ClearButton.show(); },
    disableClear: function() { this.$.ClearButton.hide(); },
    enableShuffle: function() { this.$.ShuffleButton.show(); },
    disableShuffle: function() { this.$.ShuffleButton.hide(); },
    enableSave: function() { this.$.SaveButton.show(); },
    disableSave: function() { this.$.SaveButton.hide(); },
    sliderSelected: function(inSender, inNewView, inOldView)
    {
        if(inNewView == this.$.RightView)
        {
            if(this.$.RightPane.getView() == this.$.MediaPlayerView)
                this.$.MediaPlayer.disableControls();
            else
                this.$.RightPane.getView().enableControls();
            this.$.LeftPane.getView().disableControls();
        } else {
            this.$.LeftPane.getView().enableControls();
            if(!isLargeScreen()) // Tablets don't dismiss the right hand view
            {
                if(this.$.RightPane.getView() == this.$.MediaPlayerView) 
                    this.$.MediaPlayer.disableControls();
                else
                    this.$.RightPane.getView().disableControls();
            }
        }
    },
    enableJukebox: function() {
        if(isLargeScreen())
            this.$.JukeboxToggle.show();
        this.$.JukeboxMenuItem.setDisabled(false);
    },
    disableJukebox: function() {
        if(isLargeScreen())
            this.$.JukeboxToggle.hide();
        this.$.JukeboxMenuItem.setDisabled(true);
    },
    menuToggleJukebox: function(inSender, inEvent)
    {
        enyo.application.jukeboxMode = !enyo.application.jukeboxMode;
        this.$.JukeboxToggle.setState(enyo.application.jukeboxMode);
        this.toggleJukebox(inSender, enyo.application.jukeboxMode);
    },
    toggleJukebox: function(inSender, inStatus)
    {
        this.$.MediaPlayer.toggleJukebox(inSender, inStatus);
        this.$.JukeboxMenuItem.setCaption("Jukebox " + (enyo.application.jukeboxMode ? "ON" : "OFF"));
    },
    clearPlaylist: function() {
        this.$.PlaylistView.clearPlaylist();
    },
    playOrPause: function(inSender, inEvent)
    {
        this.$.PlayButton.paused = !this.$.PlayButton.paused;
        this.setPlayButton();
        this.$.MediaPlayer.playPauseClicked(inSender, inEvent);
    },
    setPlayButton: function()
    {
        this.$.PlayButton.setIcon(this.$.PlayButton.paused ? "images/play.png" : "images/pause.png");
    },
    playing: function(inSender)
    {
        this.$.PlayButton.paused = false;
        this.enablePlay();
        this.setPlayButton();
    },
    notPlaying: function(inSender)
    {
        this.$.PlayButton.paused = true;
        this.setPlayButton();        
    },
    selectAll: function()
    {
        var songs = this.$.MusicView.getSongs();
        for(var x in songs)
        {
            if(songs[x].id)
            {
                songs[x].isSelected = true;
                enyo.application.addSongToPlaylist(songs[x], true); // TODO: need to write a function that will add only if they aren't already there..
            }
        }
        //enyo.nextTick(this.$.MusicView, this.$.MusicView.renderView);
        this.$.MusicView.renderView();
        this.$.PlaylistView.render();
    },
    unselectAll: function()
    {
        var songs = this.$.MusicView.getSongs();
        for(var x in songs)
        {
            if(songs[x].id)
            {
                songs[x].isSelected = false;
                enyo.application.removeSongFromPlaylist(songs[x], true); // TODO: need to write a function that will add only if they aren't already there..
            }
        }
        this.$.MusicView.renderView();
        //enyo.nextTick(this.$.MusicView, this.$.MusicView.renderView);
        this.$.PlaylistView.render();
    },
    onRelaunch: function(x, y, z)
    {
        this.log("windowType=", enyo.windowParams.windowType);        
    },
    enableSelectButtons: function()
    {
        this.$.SelectAllButton.show();
        this.$.UnselectAllButton.show();
    },
    disableSelectButtons: function()
    {
        this.$.SelectAllButton.hide();
        this.$.UnselectAllButton.hide();
    },
    shareMedia: function(inSender, inEvent, inSong)
    {
        this.$.api.call("createShare", { id: inSong.id });
    },
    clearJukeboxPlaylist: function(inSender)
    {
        this.$.api.call("jukeboxControl", { action: "clear" });
        enyo.nextTick(this.$.api, this.$.api.call, "jukeboxControl", { action: "get" });
    },
    jukeboxToggled: function(inSender)
    {
        if(enyo.application.jukeboxMode)
        {
            this.$.api.call("jukeboxControl", { action: "status" });
            this.$.api.call("jukeboxControl", { action: "get" }); // TODO: get implies a status as well, need to extract the status and set it in jukeboxStatus rather than making two calls
        }
        this.$.PlaylistView.render(); // switch playlists
    },
    getJukeboxStatus: function(inSender)
    {
        this.$.api.call("jukeboxControl", { action: "status" });
    },
    setJukeboxPosition: function(inSender, inPos)
    {
        this.$.api.call("jukeboxControl", { action: "skip", index: enyo.application.jukeboxList.index, offset: Math.floor(inPos) });
    },
    playPauseJukebox: function(inSender)
    {
        if(enyo.application.jukeboxStatus.playing)
            this.$.api.call("jukeboxControl", { action: "stop" });
        else
            this.$.api.call("jukeboxControl", { action: "start" });
    },
    receivedUserInfo: function(inSender, inUser)
    {
        /* {"adminRole":true,"commentRole":true,"coverArtRole":true,"downloadRole":true,"email":"blade.eric@gmail.com","jukeboxRole":true,"playlistRole":true,
          "podcastRole":true,"scrobblingEnabled":false,"settingsRole":true,"shareRole":true,"streamRole":true,"uploadRole":true,"username":"admin"}
        */
        enyo.application.subsonicUser = inUser;
        this.user = enyo.application.subsonicUser;
        this.$.PlaylistView.receivedUser(); // need to notify the playlist view so it can update it's buttons
        this.$.MediaPlayer.receivedUser(); // also need to notify media player so it can update it's buttons
        this.$.JukeboxToggle.setShowing(isLargeScreen() && inUser.jukeboxRole);
        this.$.JukeboxMenuItem.setDisabled(!inUser.jukeboxRole);
    },
    videoError: function(inSender, x, y, z)
    {
        this.$.ErrorDialog.open();
        this.$.ErrorDialog.setMessage("Video Player Error: " + y.errorText + " - Do you have TouchPlayer installed?");
    },
    serverError: function(inSender, x, y, z)
    {
        this.$.ErrorDialog.open();
        this.log(x, y, z);
        this.$.ErrorDialog.setMessage("Server error: " + x.code + " " + x.message);
    },
    deletePlaylist: function(inSender, inId)
    {
        this.$.api.call( "deletePlaylist", { id: inId} );
    },
    deletedPlaylist: function(inSender, inResponse)
    {
        this.refreshPlaylists();
    },
    shakeNotify: function(inSender, inEvent)
    {
        this.$.ErrorDialog.open();
        this.$.ErrorDialog.setMessage("Randomizing and redistributing your playlist...");
    },
    endShakeNotify: function(inSender, inEvent)
    {
        this.$.ErrorDialog.open();
        this.$.ErrorDialog.setMessage(" T I L T -- Playlist Shuffled -- T I L T ");
        this.shufflePlaylist();
        setTimeout(this.$.ErrorDialog.close, 1500);
    },
    showSongMenu: function(inSender, inEvent, inSongInfo)
    {
        this.$.SongMenu.openAtEvent(inEvent);
        this.$.SongMenu.setSong(inSongInfo);
        this.$.SongMenu.sender = inSender;
        inEvent.stopPropagation();
    },
    toggleSongSelection: function(inSender, inEvent, inSongInfo)
    {
        this.$.MusicView.selectSongItem(inEvent.rowIndex, !inSongInfo.isSelected);
        if(this.$.MusicView.querySongItem(inEvent.rowIndex).isSelected)
        {
            this.addSongToPlaylist(inSongInfo);
        } else {
            this.removeSongFromPlaylist(inSongInfo);
        }
        this.$.MusicView.refreshSong(inEvent.rowIndex);

    },
    toggleSearchSongSelection: function(inSender, inEvent, inSongInfo)
    {
        this.$.SearchView.selectSongItem(inEvent.rowIndex, !inSongInfo.isSelected);
        if(this.$.SearchView.querySongItem(inEvent.rowIndex).isSelected)
        {
            this.addSongToPlaylist(inSongInfo);
        } else {
            this.removeSongFromPlaylist(inSongInfo);
        }
        this.$.SearchView.refreshSong(inEvent.rowIndex);        
    },
    showPlaylistMenu: function(inSender, inEvent, inSongInfo)
    {
        this.$.NowPlayingMenu.openAtEvent(inEvent);
        this.$.NowPlayingMenu.setSong(inSongInfo);
    },
    performSearch: function(inSender, inSearch)
    {
        // TODO: allow search only for artist/album/song? allow pagination, using artistOffset, albumOffset, songOffset?
        var params = {
            query: inSearch,
            artistCount: 20,
            albumCount: 20,
            songCount: 20,
        };
        this.$.api.call("search", params);
    },
    openPlaylist: function(inSender, inEvent, inID)
    {
        this.playNextPlaylist = false;
        this.$.api.call("getPlaylist", { id: inID });
    },
    playPlaylist: function(inSender, inEvent, inID)
    {
        this.playNextPlaylist = true;
        this.$.api.call("getPlaylist", { id: inID });
    },
    receivedRandomSongs: function(inSender, inSongs)
    {
        this.$.MusicView.resetViews();
        this.$.MusicView.setMusic(inSongs.randomSongs.song);
        this.selectMusicView();
    },
    /*
        {
            "currentIndex":-1,
            "entry":
            {
                "album":"Appetite for Destruction",
                "artist":"Guns N' Roses",
                "bitRate":128,
                "contentType":"audio/mpeg",
                "coverArt":"633a5c6d757369635c47756e7320274e2720526f7365735c416c62756d735c31393837202d20417070657469746520466f72204465737472756374696f6e5c466f6c6465722e6a7067",
                "duration":407,
                "genre":"Rock",
                "id":"633a5c6d757369635c47756e7320274e2720526f7365735c416c62756d735c31393837202d20417070657469746520466f72204465737472756374696f6e5c30362e20506172616469736520436974792e6d7033","isDir":false,"isVideo":false,"parent":"633a5c6d757369635c47756e7320274e2720526f7365735c416c62756d735c31393837202d20417070657469746520466f72204465737472756374696f6e","path":"Guns 'N' Roses/Albums/1987 - Appetite For Destruction/06. Paradise City.mp3",
                "size":6541312,
                "suffix":"mp3",
                "title":"Paradise City",
                "track":6,
                "year":1987
            },
            "gain":0.5,
            "playing":false,
            "position":0
        }
    */
    receivedJukeboxPlaylist: function(inSender, inPlaylist)
    {
        if(inPlaylist.entry && inPlaylist.entry.album)
            enyo.application.jukeboxList = [ inPlaylist.entry ];
        else
            enyo.application.jukeboxList = inPlaylist.entry;
        if(!enyo.application.jukeboxList)
            enyo.application.jukeboxList = new Array();
        enyo.application.jukeboxList.index = inPlaylist.currentIndex;
        enyo.application.jukeboxList.lastIndex = inPlaylist.currentIndex; // we're re-rendering the entire list, anyway, so just set it
        this.$.PlaylistView.render();
    },
    receivedJukeboxStatus: function(inSender, inStatus)
    {
        /* {"currentIndex":0,"gain":0.5,"playing":true,"position":0} */
        if(enyo.application.jukeboxStatus)
        {
            if(inStatus.playing && !enyo.application.jukeboxStatus.playing)
                this.$.MediaPlayer.jukeboxPlaying();
            else if(!inStatus.playing && enyo.application.jukeboxStatus.playing)
                this.$.MediaPlayer.jukeboxStopped();
        }
        if(enyo.application.jukeboxStatus && !enyo.application.jukeboxStatus.playing && inStatus.playing)
        {
            this.$.MediaPlayer.jukeboxPlaying();
        }
        if(enyo.application.jukeboxList.index != inStatus.currentIndex)
        {
            enyo.application.jukeboxList.lastIndex = enyo.application.jukeboxList.index;
            enyo.application.jukeboxList.index = inStatus.currentIndex;
            //this.$.PlaylistView.render();
            this.$.PlaylistView.renderRow(enyo.application.jukeboxList.lastIndex);
            this.$.PlaylistView.renderRow(enyo.application.jukeboxList.index);
        }
        this.$.MediaPlayer.updateJukebox(inStatus);
        enyo.application.jukeboxStatus = inStatus;
    },
    refreshPlaylists: function(inSender, inEvent)
    {
        this.$.api.call("getPlaylists");
    },
    dragOverPlaylist: function(inSender, inEvent)
    {
        if(!enyo.application.dragging) return;
        if(inEvent.rowIndex != enyo.application.dropIndex)
        {
            var oldindex = enyo.application.dropIndex;
            enyo.application.dropIndex = inEvent.rowIndex;
            /*if(inEvent.rowIndex == undefined)
                this.$.PlaylistView.render();
            else {
                this.$.PlaylistView.renderRow(inEvent.rowIndex);
                if(oldindex)
                    this.$.PlaylistView.renderRow(oldindex);
            }*/
        }
    },
    dragOutPlaylist: function(inSender, inEvent)
    {
        /*if(!enyo.application.dragging) return;
        this.log();
        var old = enyo.application.dropIndex;
        if(inSender != this.$.PlaylistView)
            enyo.application.dropIndex = undefined;
        this.$.PlaylistView.renderRow(old);
        this.log("dragging out", inEvent.rowIndex);
        console.log(inSender);
        console.log(inEvent);*/
        //enyo.application.dropIndex = -1;
        //this.$.PlaylistView.render();
    },
    dropOnPlaylist: function(inSender, inEvent)
    {
        if(!enyo.application.dragging) return;
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
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
        //console.log(inEvent);
        //console.log("rowIndex", inEvent.rowIndex);
        if(inEvent.dragInfo != undefined)
        {
            if(!playlist)
            {
                playlist = [ ];
            }
            var songitem = inEvent.dragInfo.list.querySongItem(inEvent.dragInfo.index);
            if(inEvent.rowIndex == undefined)
            {
                this.addSongToPlaylist(songitem);
            }
            else
            {
                this.insertSongInPlaylist(songitem, inEvent.rowIndex);
            }
        }
        
        if(inEvent.rowIndex == undefined) // we're inserting it last
            this.$.PlaylistView.scrollToBottom();

        if(!enyo.application.jukeboxMode)
            prefs.set("playlist", enyo.application.playlist);
    },
    addSongToPlaylist: function(song, noRefresh)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(this.findItemInPlaylist(song.id) !== false)
            return;
        playlist.push(song);
        if(!noRefresh)
            enyo.nextTick(this.$.PlaylistView, this.$.PlaylistView.render);
        if(!enyo.application.jukeboxMode)
            prefs.set("playlist", enyo.application.playlist);
        else
        {
            this.$.api.call("jukeboxControl", { action: "add", id: song.id });
        }
    },
    insertSongInPlaylist: function(song, row)
    {
        // TODO: we need to support inserting into Jukebox playlists, but that's difficult since there is no "add" command, we'll need to clear it and resend it
        if(enyo.application.jukeboxMode)
        {
            this.addSongToPlaylist(song);
            return;
        }
        if(this.findItemInPlaylist(song.id) !== false)
            return;
        enyo.application.playlist.insert(row, song);
        enyo.nextTick(this.$.PlaylistView, this.$.PlaylistView.render);
        prefs.set("playlist", enyo.application.playlist);        
    },
    removeSongFromPlaylist: function(song, noRefresh)
    {
        var x;
        if( (x = this.findItemInPlaylist(song.id)) !== false)
        {
            if(enyo.application.jukeboxMode)
            {
                this.$.api.call("jukeboxControl", { action: "remove", index: x });
                enyo.nextTick(this.$.api, this.$.api.call, "jukeboxControl", { action: "get" });
                // TODO: do we want to remove this from the list right away, or just depend on a fast connection making it look good?
            } else {
                enyo.application.playlist.remove(x);
                if(enyo.application.playlist.index >= x)
                {
                    enyo.application.playlist.index--;
                }
                if(!noRefresh)
                    this.$.PlaylistView.render();
                prefs.set("playlist", enyo.application.playlist);
            }
        }
    },
    shufflePlaylist: function(inSender, inEvent)
    {
        if(inEvent)
            inEvent.stopPropagation();
        if(enyo.application.jukeboxMode)
        {
            this.$.api.call("jukeboxControl", { action: "shuffle" });
            enyo.nextTick(this.$.api, this.$.api.call, "jukeboxControl", { action: "get" }); /* hope for no race conditions .. sigh */
        } else {
            enyo.application.playlist.index = 0;
            enyo.application.playlist.lastIndex = 0; // rerendering list, so just set it
            enyo.application.playlist.sort(function() { return 0.5 - Math.random()});
            if(this.$.MediaPlayer.playing())
                this.$.MediaPlayer.setSong(enyo.application.playlist[0]);
            this.$.PlaylistView.render();
        }
    },
    openSavePlaylist: function(inSender, inEvent)
    {
        this.$.SavePlaylistPopup.open();
    },
    savePlaylist: function(inSender, inEvent)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        var arr = new Array();
        for(var x = 0; x < playlist.length; x++)
        {
            arr.push(playlist[x].id);
        }
        this.$.api.call("createPlaylist", { name: this.$.SavePlaylistName.getValue(), songId: arr })
        inEvent.stopPropagation();
        this.$.SavePlaylistPopup.close();
    },
    menuRemoveSongFromPlaylist: function(inSender, song)
    {
        this.removeSongFromPlaylist(song);
    },
    menuAddSong: function(inSender, song)
    {
        this.addSongToPlaylist(song);
    },
    menuInsertSong: function(inSender, song)
    {
        this.insertSongInPlaylist(song, enyo.application.playlist.index+1);
    },
    menuPlaySong: function(inSender, song)
    {
        this.loadSong(inSender, undefined, song); // it's expecting an Event in the middle
    },
    downloadFileIndex: function(index)
    {
        var songinfo = this.$.MusicView.queryListItem(index);
        var filename = songinfo.path.replace(/^.*[\\\/]/, '');
        
        this.downloadSubsonicFile(songinfo.id, songinfo.artist + "-"+filename);        
    },
    hideShowRightTabs: function()
    {
        var on = !this.$.RightTabs.showing;
        this.$.RightTabs.setShowing(on);
        prefs.set("righttabsshowing", on);
        this.ignoreCycle = true;
        this.$.MediaPlayer.reflow();        
    },
    cycleRightTab: function(inSender, inEvent)
    {
        if(!this.ignoreCycle && !inEvent.defaultPrevented)
        {
            var curr = this.$.RightPane.getViewIndex();
            //var newind = (curr >= 2) ? 0 : curr+1;
            var newind = 1 - curr;
            this.$.RightTabs.setValue(newind);
            this.$.RightPane.selectViewByIndex(newind);
        }
        this.ignoreCycle = false;
        inEvent.stopPropagation();
        inEvent.preventDefault();        
        return -1;
    },
    rightPaneSelected: function(inSender, inNewView, inOldView)
    {
        if(inNewView == this.$.MediaPlayerView)
            inNewView = this.$.MediaPlayer;
        if(inOldView == this.$.MediaPlayerView)
            inOldView = this.$.MediaPlayer;
        enyo.application.rightPaneView = inNewView;
        inOldView.disableControls();
        inNewView.enableControls();
        /*if(inNewView.name == "LyricsView" && enyo.application.nowplaying)
        {
            inNewView.setSongArtist(enyo.application.nowplaying.artist);
            inNewView.setSongTitle(enyo.application.nowplaying.title);
            this.$.api.call("getLyrics", { artist: enyo.application.nowplaying.artist, title: enyo.application.nowplaying.title });
            inNewView.$.scrim.show();
        }*/
    },
    receivedFolders: function(inSender, inFolders)
    {
        this.$.HomeView.setFolders(inFolders["musicFolders"]);
    },
    receivedLicense: function(inSender, inLicense)
    {
        this.$.HomeView.setLicenseData(inLicense);
        this.$.api.call("getMusicFolders");
    },
    serverActivity: function(inSender, bOn)
    {
        if(bOn)
            this.$.HomeView.$.ServerSpinner.show();
        else
            this.$.HomeView.$.ServerSpinner.hide();
    },
    receivedPlaylists: function(inSender, inLists)
    {
        var list = inLists && inLists.playlists && inLists.playlists.playlist;
        this.$.PlaylistsView.clearPlaylists();
        if(list && list.id)
            list[0] = list;

        this.$.PlaylistsView.clearPlaylists();            
        for(var x in list)
        {
            if(list[x].id)
                this.$.PlaylistsView.addPlaylist(list[x]);
        }
        this.$.PlaylistsView.render();
    },
    create: function()
    {
        enyo.application.mainApp = this;
        enyo.application.active = true;
        this.inherited(arguments);
        Platform.setup();

        if(window.PalmSystem)
            enyo.windows.setWindowProperties(window, { setSubtleLightBar: true }); 
        prefs.def("righttabsshowing", true);        
        //prefs.def("serverip","www.ericbla.de:88");
        prefs.def("serverip", "http://www.subsonic.org/demo");
        //prefs.def("username","slow");
        prefs.def("username", "guest4");
        //prefs.def("password","slow");
        prefs.def("password", "guest");
        prefs.def("playlist", []);
        
        enyo.application.playlist = prefs.get("playlist");
        this.log("got index ", enyo.application.playlist.index, " from config");
        if(typeof enyo.application.playlist.index === 'undefined')
            enyo.application.playlist.index = 0;
        else
            enyo.application.playlist.index = parseInt(enyo.application.playlist.index);
        enyo.application.jukeboxList = new Array();
        
        enyo.application.setDragTracking = enyo.bind(this, function(on, inEvent)
            {
                if(on)
                {
                    this.$.avatar.setSrc(inEvent.dragInfo.art);
                    this.$.avatar.show();
                    this.avatarTrack(inEvent);
                } else {
                    this.$.avatar.hide();
                }
            }
        );
        enyo.application.dragTrack = enyo.bind(this,function(inSender, inEvent)
            {
                //console.log(inEvent);
                if(enyo.application.dragging)
                    this.avatarTrack(inEvent);
            });
        enyo.application.download = enyo.bind(this, this.downloadFileIndex);
        
        enyo.application.loadArtist = enyo.bind(this, this.loadSearchedAlbum); // TODO: well, i guess it'll work .. hmm.
        enyo.application.addSongToPlaylist = enyo.bind(this, this.addSongToPlaylist);
        enyo.application.removeSongFromPlaylist = enyo.bind(this, this.removeSongFromPlaylist);
        //document.addEventListener('shakestart', enyo.bind(this, this.shakeNotify));
        //document.addEventListener('shakeend', enyo.bind(this, this.endShakeNotify));
        enyo.application.downloads = new Array();
        
        if(isLargeScreen() && window.PalmSystem) // TODO: dashboard doesn't currently work on phones
            enyo.application.dash = enyo.windows.openDashboard("dashboard.html", "xodash", {}, { clickableWhenLocked: true });
    },
    avatarTrack: function(inEvent) {
        this.$.avatar.boxToNode({l: inEvent.pageX+20, t: inEvent.pageY - 50});
    },
    pingServer: function()
    {
        this.$.api.call("ping");
    },
    getServerLicense: function()
    {
        this.$.api.call("getLicense");
    },
    getRandomList: function(inSender, inEvent, inFolderId)
    {
        this.$.api.call("getRandomSongs", { size: 50, musicFolderId: inFolderId });
        if(inEvent.preventDefault)
            inEvent.preventDefault();
        if(inEvent.stopPropagation)
            inEvent.stopPropagation();
        return true;
    },
    changedServer: function()
    {
        this.$.api.serverChanged();
        this.$.HomeView.setLicenseData();
        this.$.HomeView.$.ServerSpinner.show();
        this.pingServer();
        this.getServerLicense();
        this.$.api.call("getUser", { username: prefs.get("username") });
        //this.$.api.call("getIndexes");        
    },
    delayedStartup: function()
    {
        this.log("appinfo", enyo.fetchAppId());
        if(enyo.fetchAppId() == "com.ericblade.xodemo")
        {
            prefs.set("serverip", "http://www.subsonic.org/demo");
            //prefs.def("username","slow");
            prefs.set("username", "guest4");
            //prefs.def("password","slow");
            prefs.set("password", "guest");
        }
        if(!this.startupcomplete)
        {
            this.changedServer();
            this.startupcomplete = true;
        }
        enyo.nextTick(this, this.checkWhatsNew);
    },
    checkWhatsNew: function()
    {
        try {
            var appInfo = JSON.parse(enyo.fetchAppInfo());
        } catch(err) {
            var appInfo = enyo.fetchAppInfo();
        }
        var appver = appInfo ? appInfo["version"] : "0.0.0";
        var osver = enyo.fetchDeviceInfo() ? enyo.fetchDeviceInfo()["platformVersion"] : "unknown";
               
        this.log("starting up " + enyo.fetchAppId() + " " + appver + " on " + /*this.$.Platform.platform*/ + " " + osver);
        var firstrun = prefs.get("firstrun");
        if(firstrun != appver)
        {
            prefs.set("firstrun", appver);
            enyo.windows.addBannerMessage("XO: What's New", '{}', "images/subsonic16.png", "/media/internal/ringtones/Triangle (short).mp3")
            Platform.browser("http://ericbla.de/gvoice-webos/xo/whats-new-in-xo/")();
            /*if(window.PalmSystem)
            {
                enyo.windows.addBannerMessage("XO: What's New", '{}', "images/subsonic16.png", "/media/internal/ringtones/Triangle (short).mp3")
                this.$.AppManService.call( { target: "http://ericbla.de/gvoice-webos/xo/whats-new-in-xo/" } );
            } else if(typeof blackberry != "undefined") {
                this.blackberrybrowser("http://ericbla.de/gvoice-webos/xo/whats-new-in-xo/");
            }*/
        }
        //if(enyo.fetchAppId() == "com.ericblade.xodemo" || firstrun != appver)
            setTimeout(enyo.bind(this.$.IntroPopup, this.$.IntroPopup.openAtCenter), 1000);        
    },
    blackberrybrowser: function(address)
    {
        this.log(address);
	var encodedAddress = "";
	// URL Encode all instances of ':' in the address
	encodedAddress = address.replace(/:/g, "%3A");
	// Leave the first instance of ':' in its normal form
	encodedAddress = encodedAddress.replace(/%3A/, ":");
	// Escape all instances of '&' in the address
	encodedAddress = encodedAddress.replace(/&/g, "\&");
	
	if (typeof blackberry !== 'undefined') {
			var args = new blackberry.invoke.BrowserArguments(encodedAddress);
			blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
	} else {
		// If I am not a BlackBerry device, open link in current browser
		window.location = encodedAddress; 
	}
    },
    openIntroPopup: function(inSender, inEvent)
    {
        this.$.IntroPopup.openAtCenter();
        inEvent.preventDefault();
        return true;
    },
    rendered: function()
    {
        this.inherited(arguments);
        this.$.MainPane.selectViewByName("slider");
        
        //enyo.nextTick(this, this.delayedStartup);
        enyo.asyncMethod(this, "delayedStartup");
    },
    openServerDialog: function()
    {
        if(enyo.fetchAppId() == "com.ericblade.xodemo")
            this.$.demoServerDialog.open();
        else
            this.$.serverDialog.open();
    },
    doBack: function(inSender, inEvent)
    {
        var sliderview = this.$.slider.getView();
        var leftview = this.$.LeftPane.getView();
        var rightview = this.$.RightPane.getView();
        
        if(sliderview == this.$.LeftView)
        {
            if(this.$.LeftPane.getViewName() == "MusicView")
            {
                if(this.$.MusicView.goBack())
                {
                    inEvent.stopPropagation();
                    inEvent.preventDefault();
                    return -1;
                }
            }
            if(this.$.LeftPane.history.length)
            {
                this.$.LeftPane.back();
                inEvent.stopPropagation();
                inEvent.preventDefault();
                return -1;
            }
        }
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
                break;
            case "mostplayed":
                type = "frequent";
                apicall = "getAlbumList";
                break;
        }
        this.$.HomeView.$.ServerSpinner.show();
        this.$.MusicView.resetViews();
        this.$.api.call(apicall, { type: type, size: 100 }); // TODO: Must support loading pages, using the offset parameter!
    },
    receivedAlbumList: function(inSender, inAlbumList)
    {
        this.$.HomeView.$.ServerSpinner.hide();
        this.$.MusicView.setMusic(inAlbumList);
        this.selectMusicView();
    },
    receivedIndexes: function(inSender, inIndexes, inRequest)
    {
        // inRequest.params.musicFolderId = the music folder we asked for to begin with
        if(!enyo.application.folders)
            enyo.application.folders = new Array();
        enyo.application.folders[inRequest.params.musicFolderId] = inIndexes.indexes.index;
        this.$.HomeView.receivedIndexes(inRequest.params.musicFolderId);
    },
    receivedSearchResults: function(inSender, inSearchRes)
    {
        this.$.SearchView.setMusic(inSearchRes.album);
        this.$.SearchView.setSongList(inSearchRes.song);
        this.$.SearchView.setArtistList(inSearchRes.artist);
    },
    receivedDirectory: function(inSender, inDirectory, inRequest)
    {
        var x = inDirectory.directory.child;
        if(x.artist) // a single was received.. sigh
            x = [ x ];
        x.folderId = inRequest.params.id;
        this.$.MusicView.setMusic(x);
    },
    receivedPlaylist: function(inSender, inPlaylist)
    {
        if(inPlaylist.album) inPlaylist = [ inPlaylist ];        
        var stupid = { directory: { child: inPlaylist } }; // the subsonic api is dumb sometimes
        if(!this.playNextPlaylist)
        {
            this.$.MusicView.setMusic(stupid);
            this.selectMusicView();
        } else {
            var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
            playlist = inPlaylist;
            playlist.index = 0;
            if(enyo.application.jukeboxMode)
            {
                enyo.application.jukeboxList = playlist;
                var arr = new Array();
                for(var x = 0; x < playlist.length; x++)
                {
                    arr.push(playlist[x].id);
                }                
                this.$.api.call("jukeboxControl", { action: "set", id: arr });
                // .. we don't need to call a get. . . does the "set" return the playlist?
                //enyo.nextTick(this.$.api, this.$.api.call, "jukeboxControl", "get");
            }
            else
            {
                enyo.application.playlist = playlist;
            }
            this.$.PlaylistView.render();
            this.startPlaylist();
        }
        this.playNextPlaylist = false;
    },
    loadSearchedAlbum: function(inSender, inEvent, inId)
    {
        this.$.MusicView.resetViews();
        this.loadAlbum(inSender, inEvent, inId);
    },
    loadAlbum: function(inSender, inEvent, inId)
    {
        this.$.api.call("getMusicDirectory", { id: inId });
        // TODO: we're going to need to create new views in the MusicView internal pane, so that it can nest selections deeply.. sigh.
        this.selectMusicView(); // TODO: should this be conditional, if we're not already in that view?
        //this.$.MusicView.$.ViewPane.selectViewByName("AlbumListView");
    },
    loadIndex: function(inSender, inEvent, inId)
    {
        this.$.api.call("getIndexes", { musicFolderId: inId });
    },
    loadSong: function(inSender, inEvent, inSongData)
    {
        if(!inSongData) return; // this is what happens when we tap an area with no song in it
        if(inSongData.isDir)
        {
            this.loadAlbum(inSender, inEvent, inSongData.id);
            return;
        }
        if(enyo.application.jukeboxMode && inEvent && inEvent.rowIndex !== undefined)
            this.$.api.call("jukeboxControl", { action: "skip", index: inEvent.rowIndex });
        else
            enyo.nextTick(this, function() { this.$.MediaPlayer.setSong(inSongData); });
        if(!inSongData.isVideo && (inEvent && !inEvent.defaultPrevented) ) // if we get here with a prevented default, don't select the player ...
        {
            enyo.nextTick(this, this.selectPlayerView);
            //this.selectPlayerView();
        }
        if(inEvent)
        {
            inEvent.stopPropagation();
            inEvent.preventDefault();
            return -1;
        }
    },
    resumePlaylist: function(inSender, inEvent)
    {
        if(enyo.application.jukeboxMode)
        {
            this.$.api.call("jukeboxControl", { action: "start" });
            return;
        }
        if(!enyo.application.playlist.index || enyo.application.playlist.index > enyo.application.playlist.length)
            enyo.application.playlist.index = 0;
        enyo.application.playlist[enyo.application.playlist.index].startTime = prefs.get("savedtime");
        this.$.MediaPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
        if(!enyo.application.playlist[enyo.application.playlist.index].isVideo)
            this.selectPlayerView();
    },
    startPlaylist: function(inSender, inEvent)
    {
        //enyo.application.playlist.index = 0;
        if(enyo.application.jukeboxMode)
        {
            this.$.api.call("jukeboxControl", { action: "start" });
            return;
        }
        if(!enyo.application.playlist.index || enyo.application.playlist.index > enyo.application.playlist.length)
            enyo.application.playlist.index = 0;
        this.$.MediaPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
        // TODO: if we ever do get internal video playback, uncomment this
        //if(!enyo.application.playlist[enyo.application.playlist.index].isVideo)
        //    this.selectPlayerView();
    },
    playNext: function(inSender, inEvent)
    {
        var currId = this.$.MediaPlayer.song && this.$.MediaPlayer.song.id;
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        var currindex = playlist.index;
        var p = playlist[currindex];
        
        if(p && p.id != currId && currId !== undefined)
        {
            currindex = this.findItemInPlaylist(currId);
        }
        if(!currindex)
            playlist.index = 0;
        else
        {
            if(enyo.application.jukeboxMode)
                enyo.application.jukeboxList.lastIndex = playlist.index;
            else
                enyo.application.playlist.lastIndex = playlist.index;
            playlist.index = parseInt(currindex) + 1;
        }
        if(enyo.application.jukeboxMode)
            this.$.api.call("jukeboxControl", { action: "skip", index: playlist.index });
        else
            this.$.MediaPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
    },
    playPrev: function(inSender, inEvent)
    {
        var currId = this.$.MediaPlayer.song && this.$.MediaPlayer.song.id;
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        var currindex = playlist.index;
        var p = playlist[currindex];
        
        if(p && p.id != currId && currId !== undefined)
        {
            currindex = this.findItemInPlaylist(currId);
        }
        if(!currindex)
            playlist.index = 0;
        else
        {
            if(enyo.application.jukeboxMode)
                enyo.application.jukeboxList.lastIndex = playlist.index;
            else
                enyo.application.playlist.lastIndex = playlist.index;
            
            playlist.index = parseInt(currindex) - 1;
        }
        if(enyo.application.jukeboxMode)
            this.$.api.call("jukeboxControl", { action: "skip", index: playlist.index });
        else
            this.$.MediaPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
    },
    songChanged: function(inSender, inSong) // reset a highlight...
    {
        if(!enyo.application.jukeboxMode)
        {
            if(inSong && inSong.id && !enyo.application.jukeboxMode)
            {
                enyo.application.playlist.index = this.findItemInPlaylist(inSong.id);
            }
            this.log(enyo.application.playlist.lastIndex, enyo.application.playlist.index);
            this.$.PlaylistView.renderRow(enyo.application.playlist.lastIndex);
            this.$.PlaylistView.renderRow(enyo.application.playlist.index);
        } else {
            if(inSong && inSong.id)
            {
                enyo.application.jukeboxList.index = this.findItemInPlaylist(inSong.id);
            }
            this.log(enyo.application.jukeboxList.lastIndex, enyo.application.jukeboxList.index);
            this.$.PlaylistView.renderRow(enyo.application.jukeboxList.lastIndex);
            this.$.PlaylistView.renderRow(enyo.application.jukeboxList.index);
        }
        //this.$.PlaylistView.render();
        //enyo.nextTick(this.$.PlaylistView, this.$.PlaylistView.render);
        this.$.PlaylistView.scrollToCurrentSong();        
    },
    findItemInPlaylist: function(itemID)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        for(x in playlist)
        {
            if(x && playlist.hasOwnProperty(x) && playlist[x] && playlist[x].id == itemID)
            {
                return x;
            }
        }
        return false;
    },
    selectMusicView: function()
    {
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
        enyo.nextTick(this, function() { this.$.slider.selectViewByName("RightView"); });
        this.$.RightPane.selectViewByName("MediaPlayerView");
        this.$.RightTabs.setValue(1);
        /*this.$.slider.selectViewByName("RightView");
        this.$.RightPane.selectViewByName("MediaPlayerView");
        this.$.RightTabs.setValue(1);*/
        setTimeout(enyo.bind(this, this.$.MediaPlayer.hideTips), 5000);
    },
    leftTabChange: function(inSender)
    {
        this.$.LeftPane.selectViewByIndex(inSender.getValue());
    },
    rightTabChange: function(inSender)
    {
        this.$.RightPane.selectViewByIndex(inSender.getValue());
    },
    leftViewSelected: function(inSender, inNewView, inPrevView) // TODO: this is referred to by something not a view.. in valid?
    {
    },
    leftPaneSelected: function(inSender, inNewView, inPrevView)
    {
        switch(inNewView.name)
        {
            case "MusicView":
                inNewView.index = 1;
                this.ForceTabSet = true;
                break;
        }
        inNewView.index = inSender.getViewIndex();
        if(inNewView.index != undefined)
            this.$.TabBar.setValue(inNewView.index);
        inNewView.enableControls();
        inPrevView.disableControls();
    },
    badLicense: function(inSender, inError)
    {
        this.log();
        // TODO: get a real popup. alert doesn't work.. lol
        window.alert("Error: " + inError.code +" " + inError.message);
    },
    downloadSong: function(inSender, song, sender)
    {
        var filename = song.path.replace(/^.*[\\\/]/, '');
        this.downloadSubsonicFile(song.id, filename, sender);
    },
    downloadSubsonicFile: function(id, filename)
    {
        // "http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+a.coverArt+"&u="+ prefs.get("username") + "&v=1.6.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)"
        this.log(id, filename);
        this.$.fileDownload.call( {
            target: "http://" + prefs.get("serverip") + "/rest/download.view?id=" + id + "&u=" + prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO-webOS",
            mime: "audio/mpeg3",
            targetDir: "/media/internal/xo/",
            //cookieHeader: "GALX=" + this.GALX + ";SID="+this.SID+";LSID=grandcentral:"+this.LSID+"gv="+this.LSID,
            targetFilename: filename,
            keepFilenameOnRedirect: true,
            canHandlePause: true,
            subscribe: true,
            subsonicId: id,
        });
        enyo.application.downloads[id].amountReceived = 1;
        enyo.application.downloads[id].amountTotal = 2;
    },
    downloadStatus: function(inSender, inResponse, inRequest)
    {
        //for(var i in inRequest)
        //{
            //this.log(i, inRequest[i]);
        //}
        //return;
        var x = enyo.application.downloads[inRequest.params.subsonicId];
        var prog = enyo.application.downloads[inRequest.params.subsonicId].progress;
        x.amountReceived = inResponse.amountReceived;
        x.amountTotal = inResponse.amountTotal;
        //this.log("downloadStatus: ", inRequest.params.subsonicId, x.amountReceived, x.amountTotal);
        if(prog)
        {
            var perc = (x.amountReceived / x.amountTotal) * 100;
            //this.log(x.amountReceived / x.amountTotal);
            prog.setPosition( (x.amountReceived / x.amountTotal) * 100);
            if(perc >= 100)
                prog.hide();
            else if(!prog.showing)
                prog.show();
        }
        /*
         [20111201-18:04:45.555847] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"amountReceived":13594343,"e_amountReceived":"13594343","amountTotal":13787624,"e_amountTotal":"13787624"} enyo.PalmService.Request, /usr/palm/frameworks/enyo/1.0/framework/build/enyo-build.js:72
[20111201-18:04:45.579501] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"amountReceived":13700846,"e_amountReceived":"13700846","amountTotal":13787624,"e_amountTotal":"13787624"} enyo.PalmService.Request, /usr/palm/frameworks/enyo/1.0/framework/build/enyo-build.js:72
[20111201-18:04:45.654649] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"url":"http://ericbla.de:88/rest/download.view?id=633a5c6d757369635c4d6172696c796e204d616e736f6e5c4d6172696c796e204d616e736f6e202d204c65737420576520466f72676574205468652042657374204f6620283230303429205b4344205269705d2033323020767477696e3838637562655c31372e546865205265666c656374696e6720476f642e6d7033&u=admin&v=1.6.0&p=subgame&c=XO(webOS)(development)","sourceUrl":"http://ericbla.de:88/rest/download.view?id=633a5c6d757369635c4d6172696c796e204d616e736f6e5c4d6172696c796e204d616e736f6e202d204c65737420576520466f72676574205468652042657374204f6620283230303429205b4344205269705d2033323020767477696e3838637562655c31372e546865205265666c656374696e6720476f642e6d7033&u=admin&v=1.6.0&p=subgame&c=XO(webOS)(development)","deviceId":"","authToken":"","destTempPrefix":".","destFile":"download_1.view","destPath":"/media/internal/xo/","mimetype":"application/x-download","amountReceived":13787624,"e_amountReceive
        */
    }
})