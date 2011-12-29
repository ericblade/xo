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
                        { name: "SongItem", kind: "subsonic.AlbumOrSongItem", onclick: "clickSong", onmousehold: "holdSong"}, // TODO: AlbumItem has a SongItem inside it already .. sigh
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
        "onSongHeld":"",
    },
    published: {
        "songList" : "",
        "music": "",
        "artistList": "",
    },
    enableControls: function() {
        
    },
    disableControls: function() {
        
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
    holdSong: function(inSender, inEvent)
    {
        var x = inEvent.rowIndex;
        this.doSongHeld(inEvent, this.songList[x]);
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
        for(var x = 0; x < this.songList.length; x++)
        {
            this.songList[x].isSelected = (this.findItemInPlaylist(this.songList[x].id) !== false);
        }
        this.$.SongList.render();
    },
    selectSongItem: function(index, selected)
    {
        this.songList[index].isSelected = selected;
        this.refreshSong(index);
    },
    refreshSong: function(index)
    {
        this.$.SongList.renderRow(index);
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
            this.$.SongItem.addRemoveClass("selectedhighlight", a.isSelected);
            return true;
        }
        return false;
    },
    querySongItem: function(inRow)
    {
        return this.songList && this.songList[inRow];
    }
});
