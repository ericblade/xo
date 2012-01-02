enyo.kind({
    name: "subsonic.MediaPlayerView",
    kind: "VFlexBox",
    flex: 1,
    events: {
        "onHideTabs": "",
        "onCycleTab": "",
        "onNextSong": "",
        "onPrevSong": "",
        "onSongChanged": "",
        "onVideoError": "",
        "onVideoPlay": "",
        "onShare": "",
        "onJukeboxMode": "",
        "onJukeboxStatus": "",
        "onPlayPauseJukebox": "",
        "onSetJukeboxPosition": "",
        "onDisablePrev": "",
        "onDisablePlay": "",
        "onDisableNext": "",
        "onEnablePrev": "",
        "onEnablePlay": "",
        "onEnableNext": "",
        "onPlaying": "",
        "onNotPlaying": "",
    },
    style: "padding-left: 3px; padding-right: 3px; ",
        videoLaunched: function(inSender, x, y, z)
        {
            this.log(inSender, x, y, z);
            this.doVideoPlay(inSender, x, y, z);
        },
        videoFailed: function(inSender, x, y, z)
        {
            this.log(inSender, x, y, z);
            this.doVideoError(inSender, x, y, z);
        },
    components: [
        { name: "VideoLauncher", kind: "PalmService", service: "palm://com.wordpress.mobilecoder.touchplayer.service/", method: "play", onSuccess: "videoLaunched", onFailure: "videoFailed" },
        { name: "AppLauncher", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open" },
        { name: "VideoService", kind: "BasicService", requestKind: "VideoRequest" },
        //{ name: "MusicPlayer", kind: "Sound", preload: true, audioClass: "media", },
        //{ name: "VideoPlayer", kind: "Video", preload: true, flex: 1, },
        { kind: "VFlexBox", flex: 1, components:
            [
                { kind: "HFlexBox", components:
                    [
                        { kind: "Spacer", },
                        { name: "AlbumNameLabel", content: "", style: "color: white; max-width: 95%; ", },
                        { kind: "Spacer", },
                    ]
                },

                { kind: "HFlexBox", components:
                    [
                        { kind: "Spacer", },
                        { kind: "VFlexBox", components:
                            [
                                //{ name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: enyo.Image, height: isLargeScreen() ? "320px" : "240px", src: "http://img91.imageshack.us/img91/3550/nocoverni0.png" },
                                { name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: "ImageFallback", height: isLargeScreen() ? "320px" : "240px", fallbackSrc: ""/*"http://img91.imageshack.us/img91/3550/nocoverni0.png"*/ },
                                // TODO: adjust albumart height when rotating to landscape on telephones
                                { name: "PlayerTips", content: "Tap to change display, hold to toggle tabs.", className: "enyo-item-ternary", style: "color: white;" },
                                { name: "PlayerSpinner", kind: isLargeScreen() ? "SpinnerLarge" : "Spinner" },
                            ]
                        },
                        { kind: "Spacer", },
                    ]
                },
                { kind: "Spacer", },
                { name: "PlayerStatus", content: "", showing: true, className: "enyo-item-ternary", style: "color: white;" },
                
                { name: "SliderBox", kind: "VFlexBox", components:
                    [
                        { kind: "VFlexBox", components:
                            [
                                { name: "ProgressSlider", kind: "ProgressSlider", barMinimum: 0, barMaximum: 100, barPosition: 0, altBarPosition: 0, position: 0, onChange: "progressSliderChange", style: "padding-left: 2px; padding-right: 2px;" },
                                { kind: "HFlexBox", components:
                                    [
                                        { content: "0:00", className: "enyo-item-ternary", pack: "center" },
                                        { kind: "Spacer", },
                                        { name: "MediaLengthLabel", content: "5:43", pack: "center", className: "enyo-item-ternary" },                                                
                                    ]
                                }
                            ]
                        },
                    ]
                },
                //{ kind: "Spacer", },
                { name: "SongInfoBox", kind: "VFlexBox", showing: false, components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "ArtistNameLabel", content: "Artist Name", style: "color: white; max-width: 50%; ", },
                                { kind: "Spacer", },
                                { name: "SongNameLabel", content: "Album Name", style: "color: white; max-width: 50%; ", },
                            ]
                        },
                    ]
                },
                //{ kind: "HFlexBox", flex: 1, components:
                //    [
                //        { kind: "GrabButton", style: "background-color: #121212" },
                        /*{ name: "JukeboxButton", style: "padding-left: 50px;", kind: "ToggleButton", onLabel: "Jukebox On", offLabel: "Jukebox Off", onChange: "toggleJukebox", disabled: true },
                        { kind: "Spacer", },
                        { name: "PrevButton", kind: "Button", caption: "Prev", onclick: "doPrevSong", },
                        { kind: "Button", caption: "Play/Pause", onclick: "playPauseClicked", },
                        { kind: "Button", caption: "Next", onclick: "doNextSong", },
                        { kind: "Spacer", },*/
                        //{ name: "ShareButton", kind: "Button", caption: "Share", onclick: "clickShare", disabled: true },
                        // TODO : wtf? Sharing is only supported for *.subsonic.org domain names.
                //    ]
                //},
            ]                            
        },
    ],
    hideTips: function() { this.log(this); this.$.MediaPlayer.$.PlayerTips.hide(); },
    toggleJukebox: function(inSender, inState)
    {
        this.log("Jukebox state ", inState);
        enyo.application.jukeboxMode = inState;
        this.doJukeboxMode();
        if(inState)
        {
            var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
            var node = player && player.audio;
            this.localSong = this.song;
            // don't need to set this now that i've got it not pausing
            //this.localSong.startTime = node.currentTime;
            this.setSong(undefined); // the jukebox status should come back and tell us what song it's playing
        } else {
            if(this.localSong)
            {
                this.justToggled = true;
                this.setSong(this.localSong);
            }
        }
    },
    progressSliderChange: function(inSender, x)
    {
        this.log(x);
        //this.log(this.$.MusicPlayer.audio.currentTime, this.$.ProgressSlider.getPosition(), (this.$.ProgressSlider.getPosition() / 100) * this.song.duration);
        var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
        var node = player && player.audio;
        var newTime = (this.$.ProgressSlider.getPosition() / 100) * this.song.duration;
        
        if(enyo.application.jukeboxMode)
            this.doSetJukeboxPosition(newTime);
        else
            node.currentTime = (this.$.ProgressSlider.getPosition() / 100) * this.song.duration;
        //this.log(this.$.MusicPlayer.audio.currentTime);
        return true;
    },
    clickShare: function(inSender, inEvent)
    {
        this.doShare(inEvent, this.song);
    },
    published: {
        song: "",
    },
    rendered: function()
    {
        this.inherited(arguments);
        this.checkStatus();
        this.checkTimer();
    },
    receivedUser: function()
    {
        if(this.$.ShareButton && this.$.ShareButton.disabled && enyo.application.subsonicUser && enyo.application.subsonicUser.shareRole)
        {
            this.$.ShareButton.setShowing(enyo.application.subsonicUser.shareRole);
        }
        if(this.$.JukeboxButton && this.$.JukeboxButton.disabled && enyo.application.subsonicUser && enyo.application.subsonicUser.jukeboxRole)
        {
            this.$.JukeboxButton.setShowing(enyo.application.subsonicUser.jukeboxRole);
        }
    },
    setupPlayer: function()
    {
        var e = enyo.bind(this, this.playerEvent);
        if(this.$.MusicPlayer)
        {
            this.$.MusicPlayer.audio.pause();
            this.$.MusicPlayer.destroy();
        }
        this.createComponent({ name: "MusicPlayer", kind: "Sound", preload: true, audioClass: "media", }, {owner: this});
        this.$.MusicPlayer.audio.addEventListener('loadstart', e);
        //this.$.MusicPlayer.audio.addEventListener('onloadstart', enyo.bind(this, this.playerEvent));
        this.$.MusicPlayer.audio.addEventListener('canplay', e);
        this.$.MusicPlayer.audio.addEventListener('canplaythrough', e);
        this.$.MusicPlayer.audio.addEventListener('durationchange', e);
        this.$.MusicPlayer.audio.addEventListener('emptied', e);
        this.$.MusicPlayer.audio.addEventListener('ended', e);
        this.$.MusicPlayer.audio.addEventListener('error', e);
        this.$.MusicPlayer.audio.addEventListener('loadeddata', e);
        this.$.MusicPlayer.audio.addEventListener('loadedmetadata', e);
        this.$.MusicPlayer.audio.addEventListener('pause', e);
        this.$.MusicPlayer.audio.addEventListener('onpause', e);
        this.$.MusicPlayer.audio.addEventListener('play', e);
        this.$.MusicPlayer.audio.addEventListener('playing', e);
        this.$.MusicPlayer.audio.addEventListener('progress', e);
        this.$.MusicPlayer.audio.addEventListener('ratechange', e);
        this.$.MusicPlayer.audio.addEventListener('readystatechange', e);
        this.$.MusicPlayer.audio.addEventListener('seeked', e);
        this.$.MusicPlayer.audio.addEventListener('seeking', e);
        this.$.MusicPlayer.audio.addEventListener('stalled', e);
        this.$.MusicPlayer.audio.addEventListener('suspend', e);
        this.$.MusicPlayer.audio.addEventListener('timeupdate', e);
        this.$.MusicPlayer.audio.addEventListener('volumechange', e);
        this.$.MusicPlayer.audio.addEventListener('waiting', e);
        
        if(this.$.VideoPlayer && this.$.VideoPlayer.node)
        {
            this.$.VideoPlayer.node.addEventListener('loadstart', e);
            //this.$.VideoPlayer.node.addEventListener('onloadstart', enyo.bind(this, this.playerEvent));
            this.$.VideoPlayer.node.addEventListener('canplay', e);
            this.$.VideoPlayer.node.addEventListener('canplaythrough', e);
            this.$.VideoPlayer.node.addEventListener('durationchange', e);
            this.$.VideoPlayer.node.addEventListener('emptied', e);
            this.$.VideoPlayer.node.addEventListener('ended', e);
            this.$.VideoPlayer.node.addEventListener('error', e);
            this.$.VideoPlayer.node.addEventListener('loadeddata', e);
            this.$.VideoPlayer.node.addEventListener('loadedmetadata', e);
            this.$.VideoPlayer.node.addEventListener('pause', e);
            this.$.VideoPlayer.node.addEventListener('onpause', e);
            this.$.VideoPlayer.node.addEventListener('play', e);
            this.$.VideoPlayer.node.addEventListener('playing', e);
            this.$.VideoPlayer.node.addEventListener('progress', e);
            this.$.VideoPlayer.node.addEventListener('ratechange', e);
            this.$.VideoPlayer.node.addEventListener('readystatechange', e);
            this.$.VideoPlayer.node.addEventListener('seeked', e);
            this.$.VideoPlayer.node.addEventListener('seeking', e);
            this.$.VideoPlayer.node.addEventListener('stalled', e);
            this.$.VideoPlayer.node.addEventListener('suspend', e);
            this.$.VideoPlayer.node.addEventListener('timeupdate', e);
            this.$.VideoPlayer.node.addEventListener('volumechange', e);
            this.$.VideoPlayer.node.addEventListener('waiting', e);
        }

    },
    enableControls: function()
    {
    
    },
    disableControls: function()
    {
        
    },
    playerEvent: function(inEvent, x, y)
    {
        this.log(inEvent.type);
        this.checkStatus();
        switch(inEvent.type)
        {
            case "error":
                this.$.PlayerStatus.setContent("ERROR LOADING MEDIA");
                this.$.PlayerSpinner.hide();
                this.log(inEvent, x, y);
                break;
            case "stalled":
                this.$.PlayerStatus.setContent("CONNECTION STALLED");
                this.$.PlayerSpinner.hide();
                this.log(inEvent, x, y);
                break;
        }
    },
    checkTimer: function() {
        if(!this.timer)
            this.timer = setInterval(enyo.bind(this, this.checkStatus), enyo.application.jukeboxMode ? 1000 : 500);
    },
    clearTimer: function() {
        if(this.timer)
        {
            clearInterval(this.timer);
            delete this.timer;
        }
    },
    play: function() {
        var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
        player.play();
        this.checkTimer();
    },
    jukeboxPlaying: function()
    {
        this.log();
        this.checkTimer();
    },
    jukeboxStopped: function()
    {
        this.log();
        this.clearTimer();
    },
    songChanged: function()
    {
        this.log(this.justToggled);
        this.updatePlayerControls();
        if(!enyo.application.jukeboxMode && !this.justToggled) // don't create a new player if we're just going back to controlling the already playing one from jukebox mode
        {
            this.setupPlayer();
        }
        //console.log("songChanged", this.song.isVideo);
        console.log(this.song);
        var player = this.song && (this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer);
        var node = player && player.audio;        
        if(!enyo.application.jukeboxMode && !this.justToggled)
        {
            this.$.MusicPlayer.audio.pause();
            if(this.$.VideoPlayer && this.$.VideoPlayer.node)
                this.$.VideoPlayer.node.pause();
        }
        if(this.song && this.song.isVideo)
        {
            var url = "http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.6.0" + "&c=XO(webOS)(development)";
            url = "http://" + prefs.get("serverip") + "/rest/videoPlayer.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.6.0" + "&c=XO(webOS)(development)";
            this.log("*** Playing Video URL ", url);
            //this.$.MusicPlayer.hide();
            //this.$.VideoPlayer.show();
            //this.$.AppLauncher.call( { target: url } );
            //this.$.AppLauncher.call( { id: "com.palm.app.videoplayer", params: { target: url } });
            //enyo.windows.addBannerMessage("Launching TouchPlayer...", '{}', "", "")
            enyo.windows.addBannerMessage("Launching Video Player...", '{}', "", "")
            //this.$.VideoLauncher.call( { source: url });
            this.$.VideoService.request( { itemId: this.song.id });
            return;
        }
        if(!enyo.application.jukeboxMode)
            enyo.application.nowplaying = this.song;
        if(this.song)
        {
            this.doPlaying();
            this.log("using player", player);
            this.$.SongInfoBox.show();
            if(!this.song.coverArt)
                this.$.AlbumArt.setSrc("images/noart.png");
            else
            {
                var arturl = "http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+this.song.coverArt+"&u="+ prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)";
                if(this.$.AlbumArt.src != arturl)
                    this.$.AlbumArt.setSrc("http://" + prefs.get("serverip") + "/rest/getCoverArt.view?id="+this.song.coverArt+"&u="+ prefs.get("username") + "&v=1.7.0&p=" + prefs.get("password") + "&c=XO(webOS)(development)");
            }
            this.$.ArtistNameLabel.setContent(this.song.artist);
            this.$.ArtistNameLabel.addRemoveClass("enyo-item-secondary", !isLargeScreen() && this.song.artist.length > 15);
            this.$.ArtistNameLabel.addRemoveClass("enyo-item-ternary", !isLargeScreen() && this.song.artist.length > 25);
            this.$.AlbumNameLabel.setContent(this.song.album);
            this.$.AlbumNameLabel.addRemoveClass("enyo-item-secondary", !isLargeScreen() && this.song.album.length > 25);
            this.$.AlbumNameLabel.addRemoveClass("enyo-item-ternary", !isLargeScreen() && this.song.album.length > 40);
            this.$.SongNameLabel.setContent(this.song.title);
            this.$.SongNameLabel.addRemoveClass("enyo-item-secondary", !isLargeScreen() && this.song.title.length > 15);
            this.$.SongNameLabel.addRemoveClass("enyo-item-ternary", !isLargeScreen() && this.song.title.length > 25);
            this.$.MediaLengthLabel.setContent(secondsToTime(this.song.duration));
            if(!enyo.application.jukeboxMode && !this.justToggled)
            {
                player.setSrc("http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO(webOS)(development)");
                this.$.ProgressSlider.setBarPosition(0);
                this.$.ProgressSlider.setAltBarPosition(0);
            }
            if(!enyo.application.jukeboxMode && !this.justToggled)
                player.play();
            this.checkTimer();
            this.justToggled = false;

        } else {
            this.doNotPlaying();
            this.$.SongInfoBox.hide();
            if(player)
                player.setSrc("");
            this.clearTimer();
            delete this.timer;
            this.checkStatus();
        }
        this.doSongChanged(this.song);
    },
    playPauseClicked: function(inSender, inEvent)
    {
        this.log();
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(!this.song)
        {
            if(isNaN(playlist.index) || playlist.index > playlist.length)
                playlist.index = 0;
            this.log("starting song ", playlist.index);
            this.setSong(playlist[playlist.index]);
            return true;
        }
        var player = (this.song && this.song.isVideo) ? this.$.VideoPlayer : this.$.MusicPlayer;
        if(enyo.application.jukeboxMode)
        {
            this.doPlayPauseJukebox();
        } else {
            if(this.song.isVideo)
            {
                if(!player.node.paused)
                    player.node.pause();
                else
                    player.node.play();
            } else {
                if(!this.$.MusicPlayer.audio.paused)
                    this.$.MusicPlayer.audio.pause();
                else
                    this.$.MusicPlayer.audio.play();
            }
        }
        this.checkTimer();
        inEvent.stopPropagation();
        return true;
    },
    playing: function()
    {
        var node = this.$.MusicPlayer && this.$.MusicPlayer.audio.node;
        return !enyo.application.jukeboxMode && this.song && node && !node.ended;
    },
    checkStatus: function()
    {
        //this.log(this.showing);
        //this.log();
        var state;
        var node;
        //var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
        //var node = this.song.isVideo ? player.node : player.audio;
        var player = this.$.MusicPlayer;
        var node = player && player.audio;
        if(!enyo.application.jukeboxMode && (!player || !node))
            return;
        if(enyo.application.jukeboxMode)
        {
            //this.log("checkStatus in Jukebox Mode");
            this.doJukeboxStatus();
            return;
        }
        switch(node.readyState)
        {
            case 0:
                state = "NO DATA LOADED";
                break;
            case 1:
                state = "HAVE METADATA";
                break;
            case 2:
                state = "HAVE CURRENT DATA";
                break;
            case 3:
                state = "HAVE FUTURE DATA";
                break;
            case 4:
                state = "HAVE ENOUGH DATA";
                break;
        }
        // we have to wait until readyState >= 1 to restore our current time in the song
        if(node.readyState >= 1 && this.song.startTime)
        {
            node.currentTime = this.song.startTime;
            this.song.startTime = 0;
        }
        //this.$.PlayerStatus.setContent(node.seeking + " " + state + " " +  node.paused);
        try {
            this.$.PlayerStatus.setContent(/*"Seeking: " + node.seeking + " Paused: " + node.paused + " Ended: " + node.ended + */" N: " + node.networkState + " R: " + node.readyState + " P: " + parseInt( (node.buffered.end(0) / node.duration) * 100) );
        } catch(err) {
            // we need a catch here because this throws a DOM ERROR 1 if it's called too early.. why? who the fuck knows..
        }
        //this.$.PlayerStatus.setContent("status" + " " + node.buffered.length + " " + node.buffered.start(0) + " " + node.buffered.end(0) + " " + node.ended);
        //this.log(node.buffered);
        if(!this.song)
            return;
        if(node.readyState != 4)
        {
            this.$.SliderBox.hide();
            if(!node.paused && !this.$.PlayerSpinner.showing)
            {
                this.$.PlayerSpinner.show();
            }
        }
        else
        {
            this.$.SliderBox.show();
            if(this.$.PlayerSpinner.showing)
                this.$.PlayerSpinner.hide();
        }
        var prog = (node.currentTime / this.song.duration) * 100;
        prefs.set("savedtime", node.currentTime);
        //this.log("song progress = ", this.$.MusicPlayer.audio.currentTime, this.song.duration, prog);
        this.$.ProgressSlider.setBarPosition( prog );
        if(!this.$.MusicPlayer.audio.seeking)
            this.$.ProgressSlider.setPosition(prog);
        // TODO: we need to check to see what our last time was, and if we're looping within 1sec of the end, then cut
        if( (node.ended !== undefined && node.ended) || (node.currentTime > (this.song.duration - 0.6)) ) // use node.ended if it's available, otherwise fall back to old code
        {
            this.doNextSong();
        }
    },
    updateJukebox: function(inStatus)
    {
        /* {"currentIndex":0,"gain":0.5,"playing":true,"position":0} */
        //this.log(inStatus.gain, inStatus.playing);
        if(this.song != enyo.application.jukeboxList[inStatus.currentIndex])
            this.setSong(enyo.application.jukeboxList[inStatus.currentIndex]);
        var prog;
        if(this.song && this.song.duration)
            prog = (inStatus.position / this.song.duration) * 100;
        else
            prog = 0;
        //this.log("song progress = ", inStatus.currentTime, this.song.duration, prog);
        this.$.ProgressSlider.setBarPosition( prog );
        //if(!this.$.MusicPlayer.audio.seeking)
            this.$.ProgressSlider.setPosition(prog);
        
    },
    updatePlayerControls: function()
    {
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(playlist.index > 0)
            this.doEnablePrev();
        else
            this.doDisablePrev();
        if(playlist.length > 0)
        {
            this.doEnablePlay();
        }
        else
        {
            this.doDisablePlay();
        }
        if(playlist.index < playlist.length-1)
            this.doEnableNext();
        else
            this.doDisableNext();        
        
    }
});
