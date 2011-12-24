enyo.kind({
    name: "LyricsView",
    kind: "VFlexBox",
    published: {
        "songArtist" : "",
        "songTitle" : "",
        "songLyrics": "",
    },
    components: [
        { kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [ { kind: "SpinnerLarge" } ], },
        { kind: "FadeScroller", accelerated: true, flex:1, components:
            [
                { kind: "RowGroup", layoutKind: "HFlexLayout", components:
                    [
                        { name: "TitleLabel", flex: 1, content: "Title" },
                        { name: "ArtistLabel", content: "Artist" },
                    ]
                },
                { kind: "Group", components:
                    [
                        { name: "Lyrics", content: "Lyrics here" },
                    ]
                },
            ]
        },
        { kind: "Toolbar", components:
            [
                { kind: "GrabButton" },
            ]
        },
    ],
    songArtistChanged: function()
    {
        this.$.ArtistLabel.setContent(this.songArtist);
    },
    songTitleChanged: function()
    {
        this.$.TitleLabel.setContent(this.songTitle);
    },
    songLyricsChanged: function()
    {
        this.$.Lyrics.setContent(this.songLyrics);
    },
})

