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
        this.currentSrc = this.$.DummyImage.src;
    },
    mainLoaded: function(inSender, inEvent)
    {
        this.$.MainImage.show();
        this.$.DummyImage.hide();
        this.currentSrc = this.$.MainImage.src;
    },
    srcChanged: function()
    {
        //this.$.DummyImage.show(); // reshow the dummy, as we're loading a new src
        //this.$.MainImage.hide();
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
    name: "subsonic.AlbumOrSongItem",
    kind: "SwipeableItem",
    flex: 1,
    swipeable: false,
    published: {
        songInfo: undefined,
        albumInfo: undefined,
        draggable: false,
    },
    components: [
        { kind: "HFlexBox", flex: 1, pack: "center", ondragstart: "dragStart", ondrag: "dragged", ondragfinish: "dragFinish", components:
            [
                { name: "AlbumArt", kind: "ImageFallback", height: "48px", width: "48px", fallbackSrc: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
                { name: "Info", kind: "VFlexBox", flex: 1, style: "padding-left: 5px;", pack: "center", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "TitleLabel", style: "max-width: 75%", content: "Album or Song Title" },
                                { kind: "Spacer" },
                                { name: "SongLengthLabel", kind: "Control", className: "enyo-item-ternary", content: "5:42" },
                            ]
                        },
                        { kind: "HFlexBox", components:
                            [
                                { name: "ArtistLabel", kind: "Control", className: "enyo-item-ternary", content: "Artist Name" },
                                //{ kind: "Spacer" },
                                { name: "AlbumNameLabel", kind: "Control", style: "padding-left: 10px; max-width: 60%", className: "enyo-item-ternary", content: "AlbumName" },
                                { kind: "Spacer" },
                                { name: "SongFileTypeLabel", kind: "Control", className: "enyo-item-ternary", content: "mp3" },
                            ]
                        },
                    ]
                }
            ]
        },
    ],
    songInfoChanged: function()
    {
        //this.log(this, this.songInfo);
        var song = this.getSongInfo();
        this.$.TitleLabel.setContent(song.title);
        this.$.SongLengthLabel.setContent(secondsToTime(song.duration));
        this.$.ArtistLabel.setContent(song.artist);
        this.$.AlbumNameLabel.setContent(song.album);
        this.$.SongFileTypeLabel.setContent(song.bitRate + " " + song.suffix);
        this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id=" + song.coverArt + "&size=54&u=" + prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
        this.oldSongId = song.id;
        this.setDraggable(true);
    },
    albumInfoChanged: function()
    {
        //this.log(this, this.albumInfo);
        var album = this.getAlbumInfo();
        this.$.TitleLabel.setContent(album.title);
        this.$.SongLengthLabel.hide();
        this.$.ArtistLabel.setContent(album.artist);
        this.$.AlbumNameLabel.hide();
        this.$.SongFileTypeLabel.hide();
        if(album.coverArt)
        {
            this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id=" + album.coverArt + "&size=54&u=" + prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
        }
        this.setDraggable(false);
    },
    dragStart: function(inSender, inEvent)
    {
        if(!this.draggable)
            return;
        if(inEvent.horizontal)
        {
            var song = this.owner.querySongItem(inEvent.rowIndex);
            inEvent.dragInfo = { index: inEvent.rowIndex, list: this.owner,
                art: "http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id=" + song.coverArt + "&size=54&u=" + prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)",
            }
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
    
})

/* album info
  artist: "Metallica"
id: "633a5c6d757369635cefbcadefbca5efbcb4efbca1efbcacefbcacefbca9efbca3efbca15c4e6f204c6966652054696c6c204c656174686572"
isDir: true
parent: "633a5c6d757369635cefbcadefbca5efbcb4efbca1efbcacefbcacefbca9efbca3efbca1"
title: "No Life Till Leather"
*/

/* song info
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

