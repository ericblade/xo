enyo.kind({
    name: "MyScroller",
    kind: "TransformScroller",
    scrollToItem: function(index, maxItems)
    {
        var bounds = this.getBoundaries();
        var size = { x: bounds.bottom, y: bounds.left };
        var avgsize = { x: size.x / maxItems, y: size.y / maxItems };
        this.scrollTo(avgsize.x * index, avgsize.y * index);
    }
});

enyo.kind({
    name: "MyFadeScroller",
    kind: "FadeScroller",
    scrollToItem: function(index, maxItems)
    {
        var bounds = this.getBoundaries();
        var size = { x: bounds.bottom, y: bounds.left };
        var avgsize = { x: size.x / maxItems, y: size.y / maxItems };
        this.scrollTo(avgsize.x * index, avgsize.y * index);
    }    
});

enyo.kind({
    name: "MyRegularScroller",
    kind: "Scroller",
    scrollToItem: function(index, maxItems)
    {
        var bounds = this.getBoundaries();
        var size = { x: bounds.bottom, y: bounds.left };
        var avgsize = { x: size.x / maxItems, y: size.y / maxItems };
        this.scrollTo(avgsize.x * index, avgsize.y * index);
    }    
});

enyo.kind({
    name: "subsonic.PlaylistView",
    kind: "VFlexBox",
    events: {
        "onStartPlaylist" : "",
        "onSongClicked" : "",
        "onItemMenu": "",
        "onSongRemove": "",
        "onCycleTab": "",
        "onShuffle": "",
        "onSavePlaylist": "",
        "onClearJukebox": "",
        "onEnablePrev": "",
        "onDisablePrev": "",
        "onEnablePlay": "",
        "onDisablePlay": "",
        "onEnableNext": "",
        "onDisableNext": "",
        "onEnableSave": "",
        "onDisableSave": "",
        "onEnableClear": "",
        "onDisableClear": "",
        "onEnableShuffle": "",
        "onDisableShuffle": "",
    },
    components: [
        { kind: "VFlexBox", flex: 1, onclick: "cycleTab", components:
            [
                isLargeScreen() ? { content: "Drag songs from Music list and drop them into this list.", className: "enyo-item-ternary" } : {},
                { content: "Tap here to change view - Swipe to FullScreen / Dismiss - Hold to toggle Tabs - Swipe an item to delete.", className: "enyo-item-ternary",  },
                //{ kind: "Button", caption: "Test", onclick: "test" },
                /* Using a TransformScroller here causes the entire scroller to stop working on refresh of the view */
                { name: "Scroller", kind: isLargeScreen() ? "MyFadeScroller" : "MyRegularScroller"/* "MyScroller"*/, ondragover: "dragOver", horizontal: false, autoHorizontal: false, flex: 1, accelerated: true, components:
                    [
                        { name: "PlaylistRepeater", flex: 1, kind: "VirtualRepeater", onclick: "songClicked",onmousehold: "songHeld", accelerated: true, onSetupRow: "getListItem", components:
                            [
                                { name: "Song", kind: "subsonic.AlbumOrSongItem",  onConfirm: "removeSong", swipeable: true, draggable: false, },
                            ]
                        },
                    ]
                },
                /*{ kind: "Toolbar", ondragover: "scrollDown", components:
                    [
                        { kind: "GrabButton" },
                        { caption: "Shuffle", onclick: "shuffleTap" },
                        { caption: "Play", onclick: "doStartPlaylist" },
                        { caption: "Clear", onclick: "clearPlaylist" },
                        { name: "SaveButton", caption: "Save", onclick: "savePlaylist", disabled: true, },
                    ]
                },*/
            ]
        },
    ],
    refresh: function() {
        this.$.PlaylistRepeater.render();
    },
    rendered: function()
    {
        this.inherited(arguments);
        this.log();
        this.enableControls();
    },
    scrollToCurrentSong: function(inSender, inEvent)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        this.$.Scroller.scrollToItem(playlist.index, playlist.length);
        if(inEvent)
            inEvent.stopPropagation();
    },
    dragOver: function(inSender, inEvent)
    {
        if(enyo.application.dragging)
        {
            if(this.dragTarget != inEvent.rowIndex)
            {
                this.oldDragTarget = this.dragTarget;
                this.dragTarget = inEvent.rowIndex;
                //this.log("Now dragging over ", this.dragTarget);
                if(this.oldDragTarget !== undefined) {
                    this.$.PlaylistRepeater.renderRow(this.oldDragTarget);
                    //this.$.PlaylistRepeater.controlsToRow(this.oldDragTarget);
                    //this.$.PlaylistRepeater.$.client.transitionRow(this.oldDragTarget);
                    //this.$.Song.addRemoveClass("dragoverhighlight", enyo.application.dragging && inEvent.rowIndex == this.dragTarget);
                    //this.log("old", this.oldDragTarget, this.$.Song.$.TitleLabel.content);
                }
                if(this.dragTarget !== undefined)
                {
                    //this.$.PlaylistRepeater.controlsToRow(this.dragTarget);
                    //this.$.PlaylistRepeater.$.client.transitionRow(this.dragTarget);
                    this.$.PlaylistRepeater.renderRow(this.dragTarget);
                    //this.$.Song.addRemoveClass("dragoverhighlight", enyo.application.dragging && inEvent.rowIndex == this.dragTarget);
                    //this.log("new", this.dragTarget, this.$.Song.$.TitleLabel.content);
                }
            }
        }
    },
    enableControls: function()
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        //enyo.nextTick(this, this.scrollToCurrentSong);
        if(playlist.index > 0)
            this.doEnablePrev();
        else
            this.doDisablePrev();
        if(playlist.length > 0)
        {
            this.doEnablePlay();
            if(isLargeScreen() || (enyo.application.mainApp.$.slider.getViewName() == "RightView" && enyo.application.mainApp.$.RightPane.getViewName() == "PlaylistView"))
            {
                this.doEnableClear();
                if(enyo.application.subsonicUser && enyo.application.subsonicUser.playlistRole)
                    this.doEnableSave();
            }
        }
        else
        {
            this.doDisablePlay();
            this.doDisableClear();
            this.doDisableSave();
        }
        if(playlist.length > 1)
            this.doEnableShuffle();
        else
            this.doDisableShuffle();

        if(playlist.index < playlist.length-1)
            this.doEnableNext();
        else
            this.doDisableNext();        
    },
    disableControls: function()
    {
        // play, prev, next, should always be visible if available
        //this.doDisablePlay();
        this.doDisableClear();
        this.doDisableSave();
        this.doDisableShuffle();
    },
    receivedUser: function()
    {
    },
    shuffleTap: function(inSender, inEvent)
    {
        this.doShuffle(inEvent);
    },
    cycleTab: function(inSender, inEvent)
    {
        this.log(inSender, inEvent);
        if(!inEvent.defaultPrevented)
        {
            this.log("WTF IS GOING ON", inEvent.defaultPrevented);
            this.doCycleTab(inEvent);
        }
    },
    savePlaylist: function(inSender, inEvent)
    {
        this.log(inSender, inEvent);
        this.doSavePlaylist(inEvent);
    },
    removeSong: function(inSender, inIndex) // TODO: This is all fucked in Chrome .. will it be all fucked on devices?
    {
        this.log();
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        this.doSongRemove(playlist[inIndex]);
    },
    songHeld: function(inSender, inEvent)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        this.log(inSender, inEvent.rowIndex);
        if(typeof inEvent.rowIndex !== 'undefined')
        {
            this.doItemMenu(inEvent, playlist[inEvent.rowIndex]);
            inEvent.stopPropagation();
        }
    },
    scrollToBottom: function()
    {
        this.$.Scroller.scrollToBottom();
    },
    songClicked: function(inSender, inEvent)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        var oldIndex;
        oldIndex = enyo.application.jukeboxMode ? enyo.application.jukeboxList.index : enyo.application.playlist.index;
        if(enyo.application.jukeboxMode)
        {
            enyo.application.jukeboxList.index = inEvent.rowIndex;
            enyo.application.jukeboxList.lastIndex = oldIndex;
        }
        else
        {
            enyo.application.playlist.index = inEvent.rowIndex;
            enyo.application.playlist.lastIndex = oldIndex;
        }
        //this.renderRow(oldIndex);
        //this.renderRow(inEvent.rowIndex);
        this.doSongClicked(inEvent, playlist[inEvent.rowIndex]);
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    },
    getListItem: function(inSender, inRow)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(playlist && playlist[inRow])
        {            
            this.$.Song.addRemoveClass("dragoverhighlight", enyo.application.dragging && inRow == this.dragTarget);
            this.$.Song.addRemoveClass("playhighlight", inRow == playlist.index);
            var p = playlist[inRow];
            var si = this.$.Song;
            
            si.setSongInfo(p);
            this.$.Song.setDraggable(false);
            
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
        if(enyo.application.jukeboxMode)
            this.doClearJukebox();
        else
        {
            enyo.application.playlist = [ ];
        }
        this.$.PlaylistRepeater.render();
        this.enableControls();
    },
    songChange: function() {
        this.scrollToCurrentSong();
    }
});
