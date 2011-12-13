/* This kind contains two images, and starts off showing the "DummyImage".  When the "MainImage" loads, it switches to that one. */

enyo.kind({
    name: "ImageFallback",
    kind: enyo.Control,
    published: {
        src: "",
        fallbackSrc: "",
        width: "",
        height: "",
    },
    components: [
        { name: "MainImage", kind: enyo.Image, src: this.src, height: this.height, width: this.width, showing: false, onload: "mainLoaded" },
        { name: "DummyImage", kind: enyo.Image, src: this.fallbackSrc, height: this.height, width: this.width, showing: true },
    ],
    create: function()
    {
        this.inherited(arguments);
        this.widthChanged();
        this.heightChanged();
        this.srcChanged();
        this.fallbackSrcChanged();
    },
    mainLoaded: function(inSender, inEvent)
    {
        this.$.MainImage.show();
        this.$.DummyImage.hide();
    },
    srcChanged: function()
    {
        this.$.DummyImage.show(); // reshow the dummy, as we're loading a new src
        this.$.MainImage.hide();
        this.$.MainImage.setSrc(this.src);
    },
    fallbackSrcChanged: function()
    {
        this.$.DummyImage.setSrc(this.fallbackSrc);
    },
    widthChanged: function()
    {
        this.$.MainImage.applyStyle("width", this.width);
        this.$.DummyImage.applyStyle("width", this.width);
    },
    heightChanged: function()
    {
        this.$.MainImage.applyStyle("height", this.height);
        this.$.DummyImage.applyStyle("height", this.height);
    }
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
        { name: "AlbumArt", kind: "ImageFallback", height: "48px", width: "48px", fallbackSrc: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
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
    ],

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
    /*kind: "SwipeableItem",
    swipeable: false,*/
    kind: "Progress",
    position: 50,
    layoutKind: "VFlexLayout",
    flex: 1,
    pack: "center",
    style: "padding-left: 5px; padding-right: 5px;",
    published: {
        draggable: isLargeScreen(),
    },
    components: [
        { kind: "VFlexBox", onmousehold: "mousehold", pack: "center", ondragstart: "dragStart", ondrag: "dragged", ondragfinish: "dragFinish", components:
            [
                { kind: "HFlexBox", pack: "center", components:
                    [ // TODO: put album image in here?
                        { name: "SongNameLabel", kind: "Control", content: "Song Name" },
                        { kind: "Spacer" },
                        { name: "SongLengthLabel", kind: "Control", className: "enyo-item-ternary", content: "5:42" },
                    ]
                },
                { kind: "HFlexBox", pack: "center", components:
                    [
                        { name: "ArtistNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Artist Name" },
                        { kind: "Spacer" },
                        { name: "AlbumNameLabel", kind: "Control", className: "enyo-item-ternary", content: "Album Name" },
                        { kind: "Spacer" },
                        { name: "SongFileTypeLabel", kind: "Control", className: "enyo-item-ternary", content: "128kbps mp3" },
                        //{ kind: "NotificationButton", caption: "DL", onclick: "DownloadFile" },
                        
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
        if(!this.draggable)
            return;
        if(inEvent.horizontal)
        {
            this.log(this, "dragging!");
            /*inEvent.dragInfo = inSender.parent.songInfo;
            inEvent.dragInfo.itemID = inSender.parent.parent.itemID;
            inEvent.dragInfo.coverArt = inSender.parent.parent.$.AlbumArt.coverArt;*/
            inEvent.dragInfo = inEvent.rowIndex;
            enyo.application.dragging = true;
            enyo.application.dropIndex = -1;
            enyo.application.setDragTracking(true, inEvent);
            this.parent.addRemoveClass("draghighlight", enyo.application.dragging);
            inEvent.stopPropagation();
        }
    },
    dragged: function(inSender, inEvent)
    {
        enyo.application.dragTrack(inSender, inEvent);
        inEvent.stopPropagation();
    },
    dragFinish: function(inSender, inEvent)
    {
        if(enyo.application.dragging)
        {
            enyo.application.dragging = false;
            enyo.application.dropIndex = -1;
            enyo.application.setDragTracking(false, inEvent);
            console.log(inEvent);
            this.parent.addRemoveClass("draghighlight", enyo.application.dragging);
        }
    },
    DownloadFile: function(inSender, inEvent)
    {
        this.log(inEvent.rowIndex);
        enyo.application.download(inEvent.rowIndex);
        inEvent.stopPropagation();
    }
});

