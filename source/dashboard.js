/*globals enyo, $L, event, Utilities, window */
enyo.kind({
        name: "DashControlsApp",
        kind: "HFlexBox",
        align:"center",
        className: "music-notification",
        components: [
                { name: "appEvent", kind: "ApplicationEvents", onWindowParamsChange: "windowParamsChangeHandler"},
                {kind: "Control", flex:1, className: "info", onclick: "onclick_focus", components: [
                        {name: "lblSongTitle", content: $L("No Song Playing"), className: "title"},
                        {name: "lblArtistName", content: $L(""), className: "artist"}
                ]},
                {kind: "Control", className: "playback-controls", layoutKind: "HFlexLayout", pack: "start", align: "center", components: [
                        {name: "btnPrev", kind: "IconButton", className: "prev", icon:"images/prev.png", onclick: "onclick_prev"}, 
                        {name: "btnPlay", kind: "IconButton", className: "play paused", icon:"images/play.png", label: " ", onclick: "onclick_playpause" },
                        {name: "btnNext", kind: "IconButton", className: "next", icon:"images/next.png", onclick: "onclick_next"} 
                ]}

        ],

        create: function ()
        {
                this.inherited(arguments);
                this.log();

        },

        windowParamsChangeHandler: function()
        {
                this.log(enyo.windowParams.objTrackInfo);
                if(enyo.windowParams.objTrackInfo)
                {
                        this.updateTrackInfoDisplay(enyo.windowParams.objTrackInfo);
                }

                if(enyo.windowParams.boolAudioPlaying !== undefined)
                {
                        this.setPlayPause(enyo.windowParams.boolAudioPlaying);
                }


        },

        updateTrackInfoDisplay: function(objTrackInfo)
        {

                        this.log();
                        this.$.lblSongTitle.setContent(objTrackInfo.strTrackTitle);
                        this.$.lblArtistName.setContent(objTrackInfo.strTrackArtist);


        },


        setPlayPause: function (boolAudioPlaying)
        {

                this.log(boolAudioPlaying);
                if(boolAudioPlaying)
                    this.$.btnPlay.setIcon("images/pause.png");
                else
                    this.$.btnPlay.setIcon("images/play.png");
                //this.$.btnPlay.addRemoveClass("paused", !boolAudioPlaying);

        },



        onclick_prev: function (sender, event)
        {
                this.log();
                this.sendCommand("prev");


        },


        onclick_playpause: function (sender, event)
        {
                this.log();
                this.sendCommand("playpause");
        },


        onclick_next: function (sender, event)
        {
                this.log();
                this.sendCommand("next");
        },

        onclick_focus: function(sender, event){
                this.log();
                // TODO: when we change this to use a noWindow app we won't be able to use Root Window anymore, follow example
                enyo.windows.activate(undefined, "XO", {"gotoNowPlaying": true});
                //enyo.windows.activateWindow(enyo.windows.getRootWindow(), { "gotoNowPlaying": true });
        },

        sendCommand: function (cmdType)
        {
                //var winRoot = enyo.windows.getRootWindow();
                this.log(winRoot);
                
                var winRoot = enyo.windows.fetchWindow("XO");
                if(winRoot)
                {
                        enyo.windows.setWindowParams(winRoot, {cmdType: cmdType });
                }
        }



});
