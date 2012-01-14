/* This kind contains two images, and starts off showing the "DummyImage".  When the "MainImage" loads, it switches to that one. */

enyo.kind({
    name: "ImageFallback",
    kind: enyo.Control,
    published: {
        src: "",
        fallbackSrc: "",
        width: "",
        height: "",
        loadedclass: "albumimageloaded",
        defaultclass: "albumimage",
    },
    components: [
        { name: "MainImage", kind: enyo.Image, src: this.src, height: this.height, width: this.width, className: this.defaultclass, onload: "mainLoaded" },
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
        this.$.MainImage.setClassName(this.loadedclass);
    },
    swapImages: function()
    {
        this.log();
        this.setFallbackSrc(this.$.MainImage.src);
        //this.$.MainImage.hide();
        this.$.MainImage.setClassName(this.defaultclass);
    },
    srcChanged: function()
    {
        if(this.$.MainImage.src != this.src)
        {
            this.$.MainImage.setSrc(this.src);
            this.$.MainImage.setClassName(this.defaultclass);
        }
    },
    fallbackSrcChanged: function()
    {
        this.applyStyle("background", "url("+this.fallbackSrc+")");
    },
    widthChanged: function()
    {
        this.$.MainImage.applyStyle("width", this.width);
        this.applyStyle("width", this.width);
    },
    heightChanged: function()
    {
        this.$.MainImage.applyStyle("height", this.height);
        this.applyStyle("height", this.height);
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
	name: "Example",
	kind: enyo.Control,
	published: {
		caption: ""
	},
	style: "margin: 24px 12px; border: 1px solid #333;",
	components: [
		{name: "caption", style: "padding: 6px; background: #bbb"},
		{name: "client", style: "padding: 12px"}
	],
	create: function() {
		this.inherited(arguments);
		this.captionChanged();
	},
	captionChanged: function() {
		this.$.caption.setContent(this.caption);
	},
	layoutKindChanged: function() {
		this.$.client.align = this.align;
		this.$.client.pack = this.pack;
		this.$.client.setLayoutKind(this.layoutKind);
	}
});

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
    confirmRequired: false,
    components: [
        //{ kind: "ProgressButton", flex: 1, layoutKind: "HFlexLayout", pack: "center", position: 50, ondragstart: "dragStart", ondrag: "dragged", ondragfinish: "dragFinish", components:
        { kind: "HFlexBox", flex: 1, pack: "center", ondragstart: "dragStart", ondrag: "dragged", ondragfinish: "dragFinish", components:
            [
                { name: "AlbumArt", kind: "ImageFallback", defaultclass: "albumimagenoanim", loadedclass: "albumimagenoanim", height: "48px", width: "48px", fallbackSrc: "images/noart48.png" },
                { name: "Info", kind: "VFlexBox", flex: 1, style: "padding-left: 5px;", pack: "center", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "TitleLabel", style: "max-width: 75%", content: "Album or Song Title" },
                                { kind: "Spacer" },
                                { name: "SongLengthLabel", kind: "Control", className: "enyo-item-ternary", content: "5:42" },
                            ]
                        },
                        { name: "DownloadProgress", kind: "ProgressBarItem", showing: false, position: 10, },
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
        if(!song.coverArt)
        {
            //this.log(" *** NO COVER ART ", song.title);
        }
        this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id=" + song.coverArt + "&size=54&u=" + prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
        this.oldSongId = song.id;
        this.$.TitleLabel.applyStyle("max-width", "75%");
        this.setDraggable(true);
        if(!enyo.application.downloads[song.id])
            enyo.application.downloads[song.id] = { progress: this.$.DownloadProgress };
        else
            enyo.application.downloads[song.id].progress = this.$.DownloadProgress;
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
        this.$.TitleLabel.applyStyle("max-width", "95%");
        this.setDraggable(false);
    },
    dragStart: function(inSender, inEvent)
    {
        if(!this.draggable || !isLargeScreen())
        {
            return false;
        }
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
            return true;
        }
        return false;
    },
    dragged: function(inSender, inEvent)
    {
        if(enyo.application.dragging)
        {
            enyo.application.dragTrack(inSender, inEvent);
            inEvent.stopPropagation();
            return true;
        }
        return false;
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

