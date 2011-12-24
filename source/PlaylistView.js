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
        "onCycleTab": "",
        "onShuffle": "",
    },
    components: [
        { kind: "VFlexBox", flex: 1, onclick: "cycleTab", components:
            [
                isLargeScreen() ? { content: "Drag songs from the Music list and drop them in the list. Tap here to change view, Hold to toggle Tabs. Hold on an individual item for options. Swipe an item to delete.", className: "enyo-item-ternary", ondragover: "scrollUp" } : { },
                { name: "Scroller", kind: "FadeScroller", flex: 1, accelerated: true, components:
                    [
                        { name: "PlaylistRepeater", flex: 1, kind: "VirtualRepeater", onclick: "songClicked",onmousehold: "songHeld", accelerated: true, onSetupRow: "getListItem", components:
                            [
                                //{ name: "Song", kind: "subsonic.SongItem", draggable: false, },
                                { name: "Song", kind: "subsonic.AlbumOrSongItem",  onConfirm: "removeSong", swipeable: true, draggable: false, },
                            ]
                        },
                    ]
                },
                //{ kind: "Spacer" },
                { kind: "Toolbar", ondragover: "scrollDown", components:
                    [
                        { kind: "GrabButton" },
                        { caption: "Shuffle", onclick: "shuffleTap" },
                        { caption: "Play", onclick: "doStartPlaylist" },
                        { caption: "Clear", onclick: "clearPlaylist" },
                    ]
                },
            ]
        },
    ],
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
        inEvent.preventDefault();
        this.log();
        return -1;
    },
    getListItem: function(inSender, inRow)
    {
        if(enyo.application.playlist && enyo.application.playlist[inRow])
        {
            this.$.Song.addRemoveClass("playhighlight", inRow == enyo.application.playlist.index);
            var p = enyo.application.playlist[inRow];
            var si = this.$.Song;
            
            si.setSongInfo(p);
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
