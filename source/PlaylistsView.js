/*
  {"subsonic-response":
  {"searchResult2":
  {"song":
    [
        {"album":"Least Worst of",
            "artist":"Type O Negative",
            "bitRate":192,
            "contentType":"audio/mpeg",
            "coverArt":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f665c54797065204f204e65676174697665202d20313220426c61636b205261696e626f77732e6d7033",
            "duration":749,
            "genre":"Metal",
            "id":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f665c54797065204f204e65676174697665202d20556e7375636365737366756c6c7920436f70696e67205769746820746865204e61747572616c20426561757479206f6620496e666964656c6974792e6d7033",
            "isDir":false,"isVideo":false,"parent":"633a5c6d757369635c54797065204f204e656761746976655c4c6561737420576f727374206f66","path":"Type O Negative/Least Worst of/Type O Negative - Unsuccessfully Coping With the Natural Beauty of Infidelity.mp3","size":18042880,"suffix":"mp3","title":"Unsuccessfully Coping With the Natural Beauty of Infidelity","track":13,"year":2000},{"album":"Slow Deep & Hard","artist":"Type O Negative","bitRate":192,"contentType":"audio/mpeg","coverArt":"633a5c6d757369635c54797065204f204e656761746976655c536c6f772044656570202620486172645c466f6c6465722e6a7067","duration":759,"id":"633a5c6d757369635c54797065204f204e656761746976655c536c6f772044656570202620486172645c54797065204f204e65676174697665202d20556e7375636365737366756c6c7920436f70696e67205769746820746865204e61747572616c20426561757479206f6620496e666964656c6974792e6d7033","isDir":false,"isVideo":false,"parent":"633a5c6d757369635c54797065204f204e656761746976655c536c6f77204465657020262048617264","path":"Type O Negative/Slow Deep & Hard/Type O Negative - Unsuccessfully Coping With the Natural Beauty of Infidelity.mp3","size":18468864,"suffix":"mp3","title":"Unsuccessfully Coping With the Natural Beauty of Infidelity","track":1,"year":1991}]},"status":"ok","version":"1.7.0","xmlns":"http://subsonic.org/restapi"}}
*/
enyo.kind({
    name: "subsonic.PlaylistsView",
    kind: "VFlexBox",
    events: {
        "onRefreshPlaylists":"",
        "onOpenPlaylist":"",
        "onPlayPlaylist":"",
        "onDeletePlaylist":"",
    },
    components: [
        { kind: "FadeScroller", flex: 1, components:
            [
                { kind: "VirtualList", onSetupRow: "getPlaylistItem", components:
                    [
                        { kind: "SwipeableItem", onclick: "clickItem", layoutKind: "HFlexLayout", onConfirm: "deletePlaylist", components:
                            [
                                { name: "PlaylistName", flex: 1 },
                                { kind: "Button", caption: "Play", onclick: "clickPlay" },
                            ]
                        },
                    ]
                }
            ]
        },
        { kind: "Toolbar", components:
            [
                { caption: "Refresh", onclick: "doRefreshPlaylists" },
            ]
        },
    ],
    deletePlaylist: function(inSender, inRow)
    {
        //this.log(inSender, inEvent);
        this.doDeletePlaylist(this.playlists[inRow].id);
    },
    clearPlaylists: function() {
        this.playlists = [ ];
    },
    clickItem: function(inSender, inEvent)
    {
        var row = inEvent.rowIndex;
        this.doOpenPlaylist(inEvent, this.playlists[row].id);
        inEvent.stopPropagation();
    },
    clickPlay: function(inSender, inEvent)
    {
        this.log();
        var row = inEvent.rowIndex;
        this.doPlayPlaylist(inEvent, this.playlists[row].id);
        inEvent.stopPropagation();
    },
    addPlaylist: function(list)
    {
        //this.log(list);
        if(!this.playlists)
            this.playlists = [ ];
        this.playlists.push(list);
    },
    getPlaylistItem: function(inSender, inRow)
    {
        if(this.playlists == undefined)
        {
            this.doRefreshPlaylists();
            return false;
        }
        if(this.playlists[inRow])
        {
            this.$.PlaylistName.setContent("Playlist: " + this.playlists[inRow].name);
            this.$.PlaylistName.playlistID = this.playlists[inRow].id;
            return true;
        }
        return false;
    }
});
