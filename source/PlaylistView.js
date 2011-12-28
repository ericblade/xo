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
                isLargeScreen() ? { content: "Drag songs from the Music list and drop them in the list. Tap here to change view, Hold to toggle Tabs. Hold on an individual item for options. Swipe an item to delete.", className: "enyo-item-ternary", ondragover: "scrollUp" } : { },
                { name: "Scroller", kind: isLargeScreen() ? "FadeScroller" : "Scroller", ondragover: "dragOver", horizontal: false, autoHorizontal: false, flex: 1, accelerated: true, components:
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
    rendered: function()
    {
        this.inherited(arguments);
        this.enableControls();
        this.log(enyo.application.rightPaneView);
        if(enyo.application.rightPaneView != this)
            this.disableControls();
    },
    enableControls: function()
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(playlist.index > 0)
            this.doEnablePrev();
        else
            this.doDisablePrev();
        if(playlist.length > 0)
        {
            this.doEnablePlay();
            this.doEnableClear();
            if(enyo.application.subsonicUser && enyo.application.subsonicUser.playlistRole)
                this.doEnableSave();
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
        this.log();
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        this.doItemMenu(inEvent, playlist[inEvent.rowIndex]);
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
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        this.renderRow(enyo.application.playlist.index);
        playlist.index = inEvent.rowIndex;
        this.renderRow(inEvent.rowIndex);
        //this.render();
        this.doSongClicked(inEvent, playlist[inEvent.rowIndex]);
        inEvent.stopPropagation();
        inEvent.preventDefault();
        this.log();
        return -1;
    },
    getListItem: function(inSender, inRow)
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(playlist && playlist[inRow])
        {            
            this.$.Song.addRemoveClass("playhighlight", inRow == playlist.index);
            this.$.Song.addRemoveClass("dragoverhighlight", enyo.application.dragging && inRow == this.dragTarget);
            var p = playlist[inRow];
            var si = this.$.Song;
            
            si.setSongInfo(p);
            this.$.Song.setDraggable(false);
            
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
        if(enyo.application.jukeboxMode)
            this.doClearJukebox();
        else
        {
            enyo.application.playlist = [ ];
            this.$.PlaylistRepeater.render();
        }
        inEvent.stopPropagation();
    },
    scrollUp: function(inSender, inEvent)
    {
        
    },
    scrollDown: function(inSender, inEvent)
    {
        
    }
});
