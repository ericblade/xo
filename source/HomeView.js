// http://www.ericbla.de:88/rest/stream.view?id=633a5c6d757369635c54797065204f204e656761746976655c4f63746f62657220527573745c54797065204f204e65676174697665202d204261642047726f756e642e6d7033&u=admin&p=subgame&v=1.6.0&c=XO(webOS)(development)

enyo.kind({
    name: "IndexArtistRepeater",
    kind: "VFlexBox",
    published: {
        "artists": "",
    },
    components: [
        { name: "Repeater", kind: "VirtualRepeater", onSetupRow: "setupRow", onclick: "artistClicked", components:
            [
                { name: "ArtistItem", kind: "subsonic.ArtistItem" },
            ]
        }
    ],
    setupRow: function(inSender, inRow)
    {
        var x = this.artists.artist[inRow];
        if(x) {
            this.$.ArtistItem.setContent(x.name);
            this.$.ArtistItem.artistId = x.id;
            return true;
        }
        return false;
    },
    artistsChanged: function()
    {
        if(this.artists.artist.id)
            this.artists.artist[0] = this.artists.artist;
        this.$.Repeater.render();
    },
    artistClicked: function(inSender, inEvent)
    {
        //this.log("clicked on artist ", this.artists.artist[inEvent.rowIndex]);
        enyo.application.loadArtist(inSender, inEvent, this.artists.artist[inEvent.rowIndex].id);
        inEvent.stopPropagation();
    }
});

enyo.kind({
    name: "IndexRepeater",
    kind: "VFlexBox",
    published: {
        "folder": "",
    },
    components: [
        { kind: "VirtualRepeater",style: "padding-left: 20px; padding-right: 20px;", onSetupRow: "setupRow", components:
            [
                { name: "IndexLabel", kind: "DividerDrawer", open: false, onclick: "IndexClicked", components:
                    [
                        { name: "ArtistRepeater", kind: "IndexArtistRepeater"},
                    ]
                },
            ]
        }
    ],
    setupRow: function(inSender, inRow)
    {
        if(enyo.application.folders) {
            var x = enyo.application.folders[this.folder.id];
            if(x[inRow]) {
                //this.log(x[inRow]);
                /* {
                      "artist":
                          [
                              {
                                  "id":"633a5c6d757369635c41626261","name":"Abba"},
                                  {"id":"633a5c6d757369635c616263","name":"abc"},
                                  {"id":"633a5c6d757369635c41432d4443","name":"AC-DC"},
                                  {"id":"633a5c6d757369635c416363657074","name":"Accept"},
                                }
                            ],
                        "name":"A"
                    }
                */
                this.$.IndexLabel.setCaption(x[inRow].name);
                this.$.ArtistRepeater.setArtists(x[inRow]);
                this.$.ArtistRepeater.render();
                return true;
            }
        }
        return false;
    },
    folderChanged: function() {
        this.log(this.folder);
    },
    IndexClicked: function(inSender, inEvent) {
        var x = enyo.application.folders[this.folder.id][inEvent.rowIndex];
        this.log(x);
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    }
});

enyo.kind({
    name: "subsonic.HomeView",
    kind: "VFlexBox",
    events: {
        onServerDialog: "",
        onMusicView: "",
        onFolderClick: "",
        onRandomList: "",
    },
    published: {
        licenseData: "",
        folders: "",
    },
    components:
        [
            { name: "appLauncher", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", },            
            { kind: isLargeScreen() ? "FadeScroller" : "Scroller", flex: 1, accelerated: true, components:
                [
                    !isLargeScreen() ? { content: "Slide from right edge to access Player views", className: "enyo-item-ternary" } : { },
                    { name: "serverItem", kind: "Item", onclick: "doServerDialog", layoutKind: "VFlexLayout", components:
                        [
                            { kind: "HFlexBox", components:
                                [
                                    { content: "Server" },
                                    { name: "ServerNameLabel", style: "padding-left: 10px;" },
                                    { kind: "Spacer" },
                                    { name: "ServerSpinner", kind: "Spinner", }
                                ]
                            },
                            { kind: "HFlexBox", components:
                                [
                                    { name: "ServerVersionLabel", content: "", className: "enyo-item-ternary" },
                                    { kind: "Spacer" },
                                    { name: "ServerLicenseLabel", content: "", style: "color: red;", className: "enyo-item-ternary" },
                                ]
                            },
                        ]
                    },
                    /*{ kind: "Item", content: "What is XO?", onclick: "clickwhat" },
                    { kind: "Item", content: "Help", onclick: "clickhelp" },
                    { kind: "Item", content: "If you like XO, please leave a review", onclick: "clickreview" },
                    { kind: "Item", content: "If you don't, please let me know why.", onclick: "clickemail" },*/
                    { kind: "Divider", caption: "Albums" },
                    { kind: "Item", content: "Recently added", onclick: "clickRecentlyAdded", },
                    { kind: "Item", content: "Random", onclick: "clickRandom" },
                    { kind: "Item", content: "Top Rated", onclick: "clickTopRated" },
                    { kind: "Item", content: "Recently Played", onclick: "clickRecentlyPlayed" },
                    { kind: "Item", content: "Most Played", onclick: "clickMostPlayed", },
                    { kind: "Divider", caption: "Folders" },
                    { name: "FolderRepeater", style: "padding-left: 20px; padding-right: 20px;", kind: "VirtualRepeater", layoutKind: "HFlexLayout", onclick: "folderClicked", onSetupRow: "getFolderRow", components:
                        [
                            { kind: "HFlexBox", components:
                                [
                                    { name: "FolderItem", flex: 1, kind: "DividerDrawer", open: false, content: "Folder", components:
                                        [
                                            { name: "IndexRepeater", kind: "IndexRepeater", },
                                        ]
                                    },
                                    //{ kind: "ToolButton", style: "max-height: 55px;", /*caption: "Shuffle",*/ icon: "images/shuffledark.png", onclick: "getRandomList" },
                                    { kind: "enyo.Image", style: "padding-left: 5px; position: relative; top: 7px;", src: "images/shuffledark.png", onclick: "getRandomList" },
                                    //{ kind: "IconButton", icon: "images/shuffle32.png", onclick: "getRandomList" },
                                ]
                            },
                        ]
                    },
                ]
            }
        ],
        // {"musicFolder":{"id":4,"name":"Music"}
    clickreview: function() {
        var url = "http://developer.palm.com/appredirect/?packageid=com.ericblade.googlevoiceapp";
        this.$.WebLauncher.call( { target: url });
    },
    clickemail: function() {
        var url = "mailto:blade.eric@gmail.com?subject=XO-Demo-email";
        this.$.WebLauncher.call( { target: url });
    },
    clickwhat: function()
    {
        var url = "http://www.ericbla.de/gvoice-webos/xo/";
        this.$.WebLauncher.call( { target: url });
    },
    clickhelp: function() {
        var url = "http://ericbla.de/gvoice-webos/xo/help/";
        this.$.WebLauncher.call( { target: url });        
    },
    enableControls: function()
    {
        
    },
    disableControls: function()
    {
        
    },
    getRandomList: function(inSender, inEvent)
    {
        this.doRandomList(inEvent, this.folderList[inEvent.rowIndex].id);
        inEvent.stopPropagation();
    },
    receivedIndexes: function(folderId)
    {
        this.log(folderId);
        this.repeaters[folderId].render();
        //this.$.FolderRepeater.render();
    },
    getFolderRow: function(inSender, inRow)
    {
        var x = this.folderList && this.folderList[inRow];
        this.log(inRow, x, this.folderList);
        if(x)
        {
            this.$.FolderItem.setCaption(x.name);
            this.$.FolderItem.folderId = x.id;
            this.$.IndexRepeater.setFolder(x);
            if(!this.repeaters)
                this.repeaters = new Array();
            this.repeaters[x.id] = this.$.IndexRepeater;
            return true;
        }
        return false;
    },
    folderClicked: function(inSender, inEvent)
    {
        this.log(inSender, inSender.open);
        if(!this.folderList[inEvent.rowIndex].loaded)
        {
            this.doFolderClick(inEvent, this.folderList[inEvent.rowIndex].id);
            this.folderList[inEvent.rowIndex].loaded = true;
        }
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    },
    foldersChanged: function()
    {
        if(this.folders.musicFolder.name) { // only one.. sigh
            this.folderList = new Array();
            this.folderList[0] = this.folders.musicFolder;
        } else {
            this.folderList = this.folders.musicFolder;
        }
        this.$.FolderRepeater.render();
    },
    licenseDataChanged: function()
    {
        var ld = this.licenseData;
        this.log(ld);
        this.$.ServerNameLabel.setContent(prefs.get("serverip"));
        if(ld && ld.license && ld.license.valid != undefined)
        {
            this.$.ServerVersionLabel.setContent("Version: " + ld.version);
            this.$.ServerLicenseLabel.setContent(ld.license.valid ? "" : "NOT LICENSED");
        }
        else
        {
            this.$.ServerVersionLabel.setContent("");
            this.$.ServerLicenseLabel.setContent("");
        }
    },
    opened: function()
    {
        this.inherited(arguments);
        this.$.ServerNameLabel.setContent("Server: " + prefs.get("serverip"));
    },
    clickRecentlyAdded: function()
    {
        this.doMusicView("recentlyadded");
    },
    clickRandom: function()
    {
        this.doMusicView("random");
    },
    clickTopRated: function()
    {
        this.doMusicView("toprated");
    },
    clickRecentlyPlayed: function()
    {
        this.doMusicView("recentlyplayed");
    },
    clickMostPlayed: function()
    {
        this.doMusicView("mostplayed");
    },
});
