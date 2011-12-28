enyo.kind({
    name: "MusicListView",
    //flex: 1,
    events: {
        "onAlbumClicked": "",
        "onSongClicked": "",
        "onAlbumHeld": "",
        "onSongHeld": "",
    },
    kind: "VFlexBox", components:
        [
            { name: "ViewLabel", content: "View" },
            { kind: isLargeScreen() ? "FadeScroller" : "Scroller", accelerated: true, flex: 1, components:
                [
                    { name: "SongList", kind: "VirtualRepeater", lookAhead: 20, flex: 1, accelerated: true, layoutKind: "HFlexLayout", onSetupRow: "getSongListItem", components:
                        [
                            { name: "SongItem", kind: "subsonic.AlbumOrSongItem", draggable: true, onclick: "songClicked", onmousehold: "songHeld" },
                        ]
                    },
                    { name: "AlbumList", kind: "VirtualRepeater", lookAhead: 20, flex: 1, accelerated: true, layoutKind: "HFlexLayout", onSetupRow: "getAlbumListItem", components:
                        [
                            { name: "AlbumItem", kind: "subsonic.AlbumOrSongItem", draggable: false, onclick: "albumClicked", onmousehold: "albumHeld" },
                        ]
                    },
                ]
            },
        ],
    getSongListItem: function(inSender, inRow)
    {
        var s = this.songs;
        if(s)
            s = s[inRow];
        if(s)
        {
            //this.log(inRow, s.title);
            if(this.$.SongItem.getSongInfo() != s)
                this.$.SongItem.setSongInfo(s);
            this.$.SongItem.addRemoveClass("selectedhighlight", s.isSelected);
            return true;
        }
        return false;
    },
    querySongItem: function(inIndex)
    {
        return this.songs[inIndex];
    },
    getAlbumListItem: function(inSender, inRow)
    {
        var a = this.albums;
        if(a)
            a = a[inRow];
        if(a)
        {
            //this.log(inRow, a.title);
            if(this.$.AlbumItem.getAlbumInfo() != a)
                this.$.AlbumItem.setAlbumInfo(a);
            this.$.AlbumItem.addRemoveClass("selectedhighlight", a.isSelected);
            return true;
        }
        return false;
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
    },
    songHeld: function(inSender, inEvent)
    {
        this.log();
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.log(id); this.doSongHeld(inEvent, id); }), inEvent, this.songs[inEvent.rowIndex]);   
    },
    albumHeld: function(inSender, inEvent)
    {
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doAlbumHeld(inEvent, id); }), inEvent, this.albums[inEvent.rowIndex].id);
    }
});

enyo.kind({
    name: "subsonic.NewMusicView",
    kind: "VFlexBox",
    flex: 1,
    published: {
        "music": undefined, /* The complete list of Music we received for this folder */
    },
    events: {
        "onAlbumClicked": "",
        "onSongClicked": "",
        "onSongHeld": "",
        "onAlbumHeld": "",
        "onGetRandom": "",
        "onEnableSelectButtons": "",
        "onDisableSelectButtons": "",
    },
    components: [
        { name: "ViewPane", flex: 1, kind: "Pane", onSelectView: "viewSelected", transitionKind: isLargeScreen() ? "TestTransition" : "enyo.transitions.LeftRightFlyin", components:
            [
                { content: "Loading content from server..." }, // apparently have to have a view in it to begin with, otherwise the Pane doesn't work right
            ]
        },
    ],
    viewSelected: function(inSender, inNewView, inOldView)
    {
        this.log();
        if(inNewView.songs && inNewView.songs.length > 0)
            this.doEnableSelectButtons();
        else
            this.doDisableSelectButtons();
    },
    ready: function()
    {
        this.inherited(arguments);
        //this.createNewView();
    },
    createNewView: function(folderId)
    {
        var newview;
        var stamp = Date.now();
        if(!this.myViews)
            this.myViews = new Array();
        this.myViews.push(newview = this.$.ViewPane.createComponent({ kind: "MusicListView", "onSongHeld": "songHeld", "onAlbumHeld":"albumHeld", "onSongClicked":"songClicked", "onAlbumClicked":"albumClicked" }, { owner: this }));
        newview.$.ViewLabel.setContent("View " + this.myViews.length + (folderId ? (" folder " + folderId) : ""));
        this.log("create new view completed in " + (Date.now() - stamp) + " ms");
        // TODO: Figure out a way to display this toolbar if there are any songs in the list .. or just display it all the time? argh. we want to be able to Select All on a Random.
        if(this.myViews.length > 1)
        {
            /*newview.createComponent(
                { kind: "Toolbar", components:
                    [
                        { kind: "ToolButton", caption: "Back", onclick: "goBack", },
                        { kind: "Spacer" },
                        //folderId ? { kind: "ToolButton", caption: "Random", onclick: "getRandomList", } : {},
                        { kind: "ToolButton", caption: "Select All", onclick: "selectAll" },
                        { kind: "ToolButton", caption: "Unselect All", onclick: "unselectAll" },
                    ]
                },
                { owner: this }
            );*/
        }
        /*else
        {
            if(folderId)
            {
                newview.createComponent(
                    { kind: "Toolbar", components:
                        [
                            { kind: "ToolButton", caption: "Random", onclick: "getRandomList", },
                        ]
                    },
                    { owner: this }
                )
            }
        }*/
        this.$.ViewPane.selectView(newview);
        //this.$.ViewPane.render();
        newview.render();
        return newview;
    },
    /*getRandomList: function(inSender, inEvent)
    {
        var view = this.$.ViewPane.getView();
        this.doGetRandom(inEvent, view.folderId);
    },*/
    getSongs: function()
    {
        var view = this.$.ViewPane.getView();
        return view.songs;
    },
    selectSongItem: function(index, selected)
    {
        var view = this.$.ViewPane.getView();
        view.songs[index].isSelected = selected;
        this.refreshSong(index);
    },
    querySongItem: function(index)
    {
        var view = this.$.ViewPane.getView();
        return view.songs[index];
    },
    refreshSong: function(index)
    {
        var view = this.$.ViewPane.getView();
        view.$.SongList.renderRow(index);
    },
    selectAlbumItem: function(index, selected)
    {
        var view = this.$.ViewPane.getView();
        view.$.albums[index].isSelected = selected;
    },
    renderView: function()
    {
        var view = this.$.ViewPane.getView();
        view.$.SongList.render();
        view.$.AlbumList.render();
    },
    resetViews: function()
    {
        var stamp = Date.now();
        this.$.ViewPane.selectViewByIndex(0);
        if(this.myViews)
        {
            for(x = 0; x < this.myViews.length; x++)
            {
                if(x.destroy)
                    x.destroy();
            }
            this.myViews.length = 0;
        }
        this.log("reset views completed in " + (Date.now() - stamp) + " ms");
    },
    goBack: function()
    {
        var stamp = Date.now();
        if(this.myViews && this.myViews.length > 1)
        {
            this.$.ViewPane.selectView(this.myViews[this.myViews.length-2]);
            //this.myViews[this.myViews.length-1].destroy();
            this.myViews.length -= 1;
            this.log("back completed in " + (Date.now() - stamp) + " ms");
            return true;
        }
        return false;
    },
    /*
        {
            "directory":
            {
                "child":
                [
                    {
                        "id":"633a5c6d757369635c47756e7320274e2720526f7365735c47756e73204e2720526f73657320446973636f6772617068795c416c62756d73",
                        "isDir":true,
                        "parent":"633a5c6d757369635c47756e7320274e2720526f7365735c47756e73204e2720526f73657320446973636f677261706879",
                        "title":"Albums"
                    }
                ]
            }
        } ...
        {
            "directory":
            {
                "child":
                {
                    "artist":"Guns N' Roses",
                    "id":"633a5c6d757369635c47756e7320274e2720526f7365735c47756e73204e2720526f73657320446973636f6772617068795c416c62756d735c31393939202d204c69766520457261202738372d2739335c4469736b2032",
                    "isDir":true,
                    "parent":"633a5c6d757369635c47756e7320274e2720526f7365735c47756e73204e2720526f73657320446973636f6772617068795c416c62756d735c31393939202d204c69766520457261202738372d273933",
                    "title":"Disk 2"
                },
                "id":"633a5c6d757369635c47756e7320274e2720526f7365735c47756e73204e2720526f73657320446973636f6772617068795c416c62756d735c31393939202d204c69766520457261202738372d273933",
                "name":"1999 - Live Era '87-'93"
            },
            "status":"ok",
            "version":"1.7.0",
            "xmlns":"http://subsonic.org/restapi"
        }
    */
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
        this.log();
        //this.log("music=", this.music );
        var view = this.createNewView(this.music.folderId);
        if(this.music && this.music.album)
            this.music = [ this.music ];
        else if(this.music && this.music.albumList)
            this.music = this.music.albumList.album;
        else if(this.music && this.music.directory)
            this.music = this.music.directory.child;
        //this.log("music=", this.music );
        view.albums = new Array();
        view.songs = new Array();
        for(var x = 0; x < this.music.length; x++)
        {
            this.music[x].isSelected = (this.findItemInPlaylist(this.music[x].id) !== false);

            //this.log(this.music[x].path);
            if(this.music[x].isDir)
                view.albums.push(this.music[x]);
            else
                view.songs.push(this.music[x]);
        }
        view.folderId = this.music.folderId;
        view.$.SongList.render();
        view.$.AlbumList.render();
        if(view.songs.length > 0)
            this.doEnableSelectButtons();
        else
            this.doDisableSelectButtons();
    },

    songClicked: function(inSender, inEvent, songInfo)
    {
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doSongClicked(inEvent, id); }), inEvent, songInfo);
    },
    albumClicked: function(inSender, inEvent, albumIndex)
    {
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doAlbumClicked(inEvent, id); }), inEvent, albumIndex);
    },
    songHeld: function(inSender, inEvent, songInfo)
    {
        this.log();
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.log(id); this.doSongHeld(inEvent, id); }), inEvent, songInfo);
    },
    albumHeld: function(inSender, inEvent, albumIndex)
    {
        enyo.asyncMethod(this, enyo.bind(this, function(inEvent, id) { this.doAlbumHeld(inEvent, id); }), inEvent, albumIndex);
    }
    
});