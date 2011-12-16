
// TODO: when starting up with Subsonic, call getMusicFolders and populate that to Home

// IDEA: "Search" brings up a completely new main-view that is three-panes, and shows the search results from each type in each pane?!

// TODO: stop the Interval that is set in the MusicPlayer when application is not foreground, resume when it is.  Also stop it when that pane is switched to a different view.
// TODO: half implemented scrolling when dragging music to top or bottom of list ?
// TODO: half implemented downloading of files
// TODO: Jukebox mode .. with volume buttons on device directly controlling the jukebox volume
// TODO: stop play at App Exit . . unless going to dashboard mode?
// TODO: if a file in the list is playing or downloading, have it have it work as a ProgressButton ?
// TODO: drag-drop to player (add to playlist, or play now?)
// TODO: add (optional?) banner notification of new song info when player switches songs, if app is in background, or player view is not visible
// TODO: when highlighting song in playlist that is active in player, attempt to scroll it into view?
// TODO: download button on Search view doesn't work
// TODO: if you start typing it should just pop over to the search tab, and focus the search input (see fahhem's blog)
// TODO: selecting a playlist opens it drawer-fashion like under it, instead of opening it in the Music tab?
// TODO: (option to?) disable sleep while player screen is up
// TODO: Exhibition mode
// TODO: had to add a timeout in the Transition code to deal with transitioning failure when auto-flipping from Search to Music tab.. investigate why the transition fails.
// TODO: "gapless" playback?

// INVESTIGATE: time on B.Y.O.B. on Mezmerize by SOAD is showing as 36:34 .. mp3 corrupt?

// TODO: getting a blank list from server results in error: Uncaught TypeError: Cannot read property 'child' of undefined, source/Views.js:404
// TODO: popup a "No results received" toaster, for this and any other situation that gives no results?
// TODO: set drag cursor to the album art for what we are dragging?
// TODO: "shake to shuffle" hehe

// TODO: Have search also send a search query to Amazon, linking for purchasing? hmmm...
// TODO: Saving of current index in playlist does not appear to be working
// TODO: Why is it when I hit "Play" in Now Playing, it refreshes the entire list?
// TODO: is the draggable stuff draggable on phones? shouldn't be..
// TODO: array.Remove in globals is -not- reliably working right

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
    transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin",
    components: [        
        { name: "fileDownload", kind: "PalmService", service: "palm://com.palm.downloadmanager/", method: "download", onSuccess: "downloadStatus", subscribe: true },
        { kind: "ApplicationEvents", onBack: "doBack" },
        { name: "api", kind: "subsonic.api",
            onLicenseReceived: "receivedLicense",
            onLicenseError: "badLicense",
            onAlbumListReceived: "receivedAlbumList",
            onDirectoryReceived: "receivedDirectory",
            onReceivedPlaylists: "receivedPlaylists",
            onReceivedPlaylist: "receivedPlaylist",
            onSearchResults: "receivedSearchResults",
            onReceivedFolders: "receivedFolders",
            onReceivedIndexes: "receivedIndexes",
        },
        { name: "MainPane", flex: 1, kind: "Pane", components:
            [
                { name: "LogView", kind: "LogView", },
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
                                        { name: "HomeView", kind: "subsonic.HomeView", onServerDialog: "openServerDialog", onFolderClick: "loadIndex", onMusicView: "loadMusicView" },
                                        { name: "MusicView", kind: "subsonic.MusicView", onAlbumClicked: "loadAlbum", onSongClicked: "showSongMenu", },
                                        { name: "SearchView", kind: "subsonic.SearchView", onSearch: "performSearch", onAlbumClicked: "loadAlbum", onArtistClicked: "loadAlbum", onSongClicked: "showSongMenu", },
                                        { name: "PlaylistsView", kind: "subsonic.PlaylistsView", onRefreshPlaylists: "refreshPlaylists", onOpenPlaylist: "openPlaylist", onPlayPlaylist: "playPlaylist" },
                                    ]
                                },
                            ]
                        },
                        //{name: "avatar", kind: "Image", className: "app-avatar", src: "http://img91.imageshack.us/img91/3550/nocoverni0.png", showing: false, },
                        { name: "avatar", kind: "ImageFallback", className: "app-avatar", height: "64px", width: "64px", fallbackSrc: "http://img91.imageshack.us/img91/3550/nocoverni0.png", showing: false, },
                        { name: "RightView", kind: "SlidingView", /*dismissible: true,*/ edgeDragging: true, components:
                            [
                                { name: "RightTabs", kind: "TabGroup", onChange: "rightTabChange", showing: prefs.get("righttabsshowing"), components:
                                    [
                                        { caption: "Now Playing" },
                                        { caption: "Player" },
                                        //{ caption: "Lyrics" },
                                    ]
                                },
                                
                                { name: "RightPane", kind: "Pane", flex: 1, onSelectView: "rightPaneSelected", components:
                                    [
                                        { name: "PlaylistView", flex: 1, kind: "subsonic.PlaylistView", onSongRemove: "menuRemoveSongFromPlaylist", onItemMenu: "showPlaylistMenu", onSongClicked: "loadSong", onStartPlaylist: "startPlaylist", ondragout: "dragOutPlaylist", ondragover: "dragOverPlaylist", ondrop: "dropOnPlaylist", onmousehold: "hideShowRightTabs", onclick: "cycleRightTab",},
                                        { name: "MusicPlayerView", flex: 1, kind: "VFlexBox", components:
                                            [
                                                { name: "MusicPlayer", flex: 1, onSongChanged: "songChanged", onNextSong: "playNext", onPrevSong: "playPrev", onHideTabs: "hideShowRightTabs", onCycleTab: "cycleRightTab", style: "background: black; ", kind: "subsonic.MusicPlayerView" },
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
        { kind: "VFlexBox", components:
            [
                { name: "serverDialog", kind: "subsonic.ServerDialog",
                    onServerChanged: "changedServer",
                },
            ]
        },
        { name: "SongMenu", kind: "SongMenu", onPlaySong: "menuPlaySong", onInsertSong: "menuInsertSong", onAddSong: "menuAddSong", },
        { name: "NowPlayingMenu", kind: "NowPlayingMenu", onRemoveSong: "menuRemoveSongFromPlaylist", },
    ],
    showSongMenu: function(inSender, inEvent, inSongInfo)
    {
        this.$.SongMenu.openAtEvent(inEvent);
        this.$.SongMenu.setSong(inSongInfo);
        inEvent.stopPropagation();
    },
    showPlaylistMenu: function(inSender, inEvent, inSongInfo)
    {
        this.log();
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
        this.log(inSender, inEvent, inID);
        this.playNextPlaylist = true;
        this.$.api.call("getPlaylist", { id: inID });
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
            this.log("Dragging something over Playlist row " + inEvent.rowIndex + " last row was " + enyo.application.dropIndex);
            enyo.application.dropIndex = inEvent.rowIndex;
            this.log("new dropIndex: " + enyo.application.dropIndex);
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

        prefs.set("playlist", enyo.application.playlist);
    },
    addSongToPlaylist: function(song)
    {
        enyo.application.playlist.push(song);
        this.$.PlaylistView.render();
        prefs.set("playlist", enyo.application.playlist);        
    },
    insertSongInPlaylist: function(song, row)
    {
        enyo.application.playlist.insert(row, song);
        this.$.PlaylistView.render();
        prefs.set("playlist", enyo.application.playlist);        
    },
    removeSongFromPlaylist: function(song)
    {
        var x;
        if(x = this.findItemInPlaylist(song.id))
        {
            this.log("Removing item ", x, "from playlist");
            enyo.application.playlist.remove(x);
            if(enyo.application.playlist.index >= x)
            {
                enyo.application.playlist.index--;
            }
        }
        this.$.PlaylistView.render();
        prefs.set("playlist", enyo.application.playlist);        
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
    },
    cycleRightTab: function()
    {
        if(!this.ignoreCycle)
        {
            var curr = this.$.RightPane.getViewIndex();
            //var newind = (curr >= 2) ? 0 : curr+1;
            var newind = 1 - curr;
            this.$.RightTabs.setValue(newind);
            //this.log(curr, newind);
            this.$.RightPane.selectViewByIndex(newind);
        }
        this.ignoreCycle = false;
    },
    rightPaneSelected: function(inSender, inNewView, inOldView)
    {
        this.log(inNewView.name, this.$.MusicPlayerView.song);
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
        //this.log(inFolders);
        this.$.HomeView.setFolders(inFolders["musicFolders"]);
    },
    receivedLicense: function(inSender, inLicense)
    {
        this.log(inLicense);
        this.$.HomeView.setLicenseData(inLicense);
        this.$.HomeView.$.ServerSpinner.hide();
        this.$.api.call("getMusicFolders");
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
        enyo.application.playlist.index = parseInt(enyo.application.playlist.index);
        
        enyo.application.setDragTracking = enyo.bind(this, function(on, inEvent)
            {
                this.log(on);
                if(on)
                {
                    // TODO: figure out what we're dragging and highlight it (maybe that should be in the ondrag .. )
                    this.$.avatar.setSrc(inEvent.dragInfo.art);
                    this.$.avatar.show();
                    this.avatarTrack(inEvent);
                } else {
                    // TODO: unhighlight what we were dragging
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
    },
    avatarTrack: function(inEvent) {
        //this.log();
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
        this.$.MainPane.selectViewByName("slider");
        
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
        this.$.api.call(apicall, { type: type, size: 500 }); // TODO: Must support loading pages, using the offset parameter!
    },
    receivedAlbumList: function(inSender, inAlbumList)
    {
        this.log();
        this.$.HomeView.$.ServerSpinner.hide();
        this.$.MusicView.setMusic(inAlbumList);
        this.selectMusicView();
    },
    receivedIndexes: function(inSender, inIndexes, inRequest)
    {
        // inRequest.params.musicFolderId = the music folder we asked for to begin with
        //this.log(inIndexes, inRequest);
        if(!enyo.application.folders)
            enyo.application.folders = new Array();
        this.log(inIndexes.indexes.index);
        enyo.application.folders[inRequest.params.musicFolderId] = inIndexes.indexes.index;
        this.$.HomeView.render();
    },
    receivedSearchResults: function(inSender, inSearchRes)
    {
        this.$.SearchView.setMusic(inSearchRes.album);
        this.$.SearchView.setSongList(inSearchRes.song);
        this.$.SearchView.setArtistList(inSearchRes.artist);
    },
    receivedDirectory: function(inSender, inDirectory)
    {
        this.log();
        this.$.MusicView.setSongList(inDirectory);
    },
    receivedPlaylist: function(inSender, inPlaylist)
    {
        this.log(inPlaylist, this.playNextPlaylist);
        var stupid = { directory: { child: inPlaylist } }; // the subsonic api is dumb sometimes
        if(!this.playNextPlaylist)
        {
            this.$.MusicView.setSongList(stupid);
            this.selectMusicView();
        } else {
            enyo.application.playlist = inPlaylist;
            enyo.application.playlist.index = 0;
            this.$.PlaylistView.render();
            this.startPlaylist();
        }
        this.playNextPlaylist = false;
    },
    loadAlbum: function(inSender, inEvent, inId)
    {
        this.log(inId);
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
        //this.log(inSongData);
        if(inSongData.isDir)
        {
            this.loadAlbum(inSender, inEvent, inSongData.id);
            return;
        }
        this.$.MusicPlayer.setSong(inSongData);
        this.selectPlayerView(); 
    },
    startPlaylist: function(inSender, inEvent)
    {
        //enyo.application.playlist.index = 0;
        if(!enyo.application.playlist.index || enyo.application.playlist.index > enyo.application.playlist.length)
            enyo.application.playlist.index = 0;
        this.$.MusicPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
        this.selectPlayerView();
    },
    playNext: function(inSender, inEvent)
    {
        var currId = this.$.MusicPlayer.song.id;
        var currindex = enyo.application.playlist.index;
        var p = enyo.application.playlist[currindex];
        
        this.log("playNext", currId, currindex, p);
        if(p && p.id != currId)
        {
            currindex = this.findItemInPlaylist(currId);
        }
        enyo.application.playlist.index = parseInt(currindex) + 1;
        this.log("moving to ", enyo.application.playlist.index, enyo.application.playlist[enyo.application.playlist.index]);
        this.$.MusicPlayer.setSong(enyo.application.playlist[enyo.application.playlist.index]);
    },
    playPrev: function(inSender, inEvent)
    {
        var currId = this.$.MusicPlayer.song.id;
        var currindex = enyo.application.playlist.index;
        var p = enyo.application.playlist[currindex];
        if(p && p.id != currId)
        {
            currindex = this.findItemInPlaylist(currId);
        }
        enyo.application.playlist.index = parseInt(currindex) - 1;
        this.$.MusicPlayer.setSong(enyo.application.playlist[currindex-1]);
    },
    songChanged: function(inSender, inSong) // reset a highlight...
    {
        if(inSong && inSong.id)
        {
            enyo.application.playlist.index = this.findItemInPlaylist(inSong.id);
            this.log("song changed, now playing playlist #" + enyo.application.playlist.index);
        }
        this.$.PlaylistView.render();
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
        this.log(id, filename);
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
    },
    downloadStatus: function(x, y, z)
    {
        this.log(x, y, z);
        /*
         [20111201-18:04:45.555847] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"amountReceived":13594343,"e_amountReceived":"13594343","amountTotal":13787624,"e_amountTotal":"13787624"} enyo.PalmService.Request, /usr/palm/frameworks/enyo/1.0/framework/build/enyo-build.js:72
[20111201-18:04:45.579501] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"amountReceived":13700846,"e_amountReceived":"13700846","amountTotal":13787624,"e_amountTotal":"13787624"} enyo.PalmService.Request, /usr/palm/frameworks/enyo/1.0/framework/build/enyo-build.js:72
[20111201-18:04:45.654649] info: xo.downloadFinished():  enyo.PalmService {"ticket":1824,"url":"http://ericbla.de:88/rest/download.view?id=633a5c6d757369635c4d6172696c796e204d616e736f6e5c4d6172696c796e204d616e736f6e202d204c65737420576520466f72676574205468652042657374204f6620283230303429205b4344205269705d2033323020767477696e3838637562655c31372e546865205265666c656374696e6720476f642e6d7033&u=admin&v=1.6.0&p=subgame&c=XO(webOS)(development)","sourceUrl":"http://ericbla.de:88/rest/download.view?id=633a5c6d757369635c4d6172696c796e204d616e736f6e5c4d6172696c796e204d616e736f6e202d204c65737420576520466f72676574205468652042657374204f6620283230303429205b4344205269705d2033323020767477696e3838637562655c31372e546865205265666c656374696e6720476f642e6d7033&u=admin&v=1.6.0&p=subgame&c=XO(webOS)(development)","deviceId":"","authToken":"","destTempPrefix":".","destFile":"download_1.view","destPath":"/media/internal/xo/","mimetype":"application/x-download","amountReceived":13787624,"e_amountReceive
        */
    }
})