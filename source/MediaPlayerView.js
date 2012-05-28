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
                                { name: "AlbumArt", onmousehold: "doHideTabs", onclick: "doCycleTab", kind: "ImageFallback", height: isLargeScreen() ? "320px" : "240px", fallbackSrc: ""/*"http://www.synoiz.com/images/releases/no-cover-art_400x400.jpg"*/ },
                                // TODO: adjust albumart height when rotating to landscape on telephones
                                { name: "PlayerTips", content: "Tap to change display, hold to toggle tabs. Zoom/Pinch to Fullscreen/Restore", className: "enyo-item-ternary", style: "color: white;" },
                                { name: "PlayerSpinner", kind: isLargeScreen() ? "SpinnerLarge" : "Spinner", className: "xospinner" },
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
            var player = (this.song && this.song.isVideo) ? this.$.VideoPlayer : this.Player;
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
            } else {
                this.setSong(undefined);
            }
        }
    },
    progressSliderChange: function(inSender, x)
    {
        this.log(x);
        var player = this.song.isVideo ? this.$.VideoPlayer : this.Player;
        var node = player && player.audio;
        var newTime = (this.$.ProgressSlider.getPosition() / 100) * this.song.duration;
        
        if(enyo.application.jukeboxMode)
            this.doSetJukeboxPosition(newTime);
        else
            this.Player.seekTo(newTime);
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
        if(this.Player)
        {
            this.Player.release();
        }
        this.Player = this.createComponent({ name: "MusicPlayer", kind: "PlatformSound", preload: true, audioClass: "media", }, {owner: this});
        this.log("*** New audio component: ", this.Player);
        if(this.Player.audio)
        {
            this.Player.audio.setAttribute("x-palm-media-audio-class", "media");
            
            this.Player.audio.addEventListener('loadstart', e);
            this.Player.audio.addEventListener('onloadstart', enyo.bind(this, this.playerEvent));
            this.Player.audio.addEventListener('canplay', e);
            this.Player.audio.addEventListener('canplaythrough', e);
            this.Player.audio.addEventListener('durationchange', e);
            this.Player.audio.addEventListener('emptied', e);
            this.Player.audio.addEventListener('ended', e);
            this.Player.audio.addEventListener('error', e);
            this.Player.audio.addEventListener('loadeddata', e);
            this.Player.audio.addEventListener('loadedmetadata', e);
            this.Player.audio.addEventListener('pause', e);
            this.Player.audio.addEventListener('onpause', e);
            this.Player.audio.addEventListener('play', e);
            this.Player.audio.addEventListener('playing', e);
            this.Player.audio.addEventListener('progress', e);
            this.Player.audio.addEventListener('ratechange', e);
            this.Player.audio.addEventListener('readystatechange', e);
            this.Player.audio.addEventListener('seeked', e);
            this.Player.audio.addEventListener('seeking', e);
            this.Player.audio.addEventListener('stalled', e);
            this.Player.audio.addEventListener('suspend', e);
            this.Player.audio.addEventListener('timeupdate', e);
            this.Player.audio.addEventListener('volumechange', e);
            this.Player.audio.addEventListener('waiting', e);
        }
        
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
                break;
            case "stalled":
                this.$.PlayerStatus.setContent("CONNECTION STALLED");
                this.$.PlayerSpinner.hide();
                break;
            case "ended":
                this.log(inEvent, "*************************** SONG ENDED **********************");
                break;
            default:
                this.$.PlayerStatus.setContent("");
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
        var player = this.song.isVideo ? this.$.VideoPlayer : this.Player;
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
    reflow: function()
    {
        var newheight;
        if(!isLargeScreen())
        {
            if(enyo.application.mainApp.$.RightTabs.showing)
            {
                newheight = isWideScreen() ? "150px" : "200px";
            } else {
                newheight = isWideScreen() ? "200px" : "240px";
            }
            if(isWideScreen())
            {
                this.$.AlbumArt.applyStyle("position", "absolute");
                this.$.AlbumArt.applyStyle("left", "5px");
                this.$.AlbumArt.applyStyle("top", "5px");
                this.$.AlbumNameLabel.applyStyle("position", "absolute");
                this.$.AlbumNameLabel.applyStyle("right", "0px");
                this.$.SongNameLabel.applyStyle("position", "absolute");
                this.$.SongNameLabel.applyStyle("right", "0px");
                this.$.SongNameLabel.applyStyle("top", "24px");
                this.$.ArtistNameLabel.applyStyle("position", "absolute");
                this.$.ArtistNameLabel.applyStyle("right", "0px");
                this.$.ArtistNameLabel.applyStyle("top", "48px");
            } else {
                this.$.AlbumArt.applyStyle("position", "");
                this.$.AlbumArt.applyStyle("left", "");
                this.$.AlbumArt.applyStyle("top", "");
                this.$.AlbumNameLabel.applyStyle("position", "");
                this.$.AlbumNameLabel.applyStyle("right", "");
                this.$.SongNameLabel.applyStyle("position", "");
                this.$.SongNameLabel.applyStyle("right", "");
                this.$.SongNameLabel.applyStyle("top", "");
                this.$.ArtistNameLabel.applyStyle("position", "");
                this.$.ArtistNameLabel.applyStyle("right", "");
                this.$.ArtistNameLabel.applyStyle("top", "");
            }
            this.$.AlbumArt.setHeight(newheight);
        }
    },
    songChanged: function()
    {
        this.updatePlayerControls();
        if(!enyo.application.jukeboxMode && !this.justToggled) // don't create a new player if we're just going back to controlling the already playing one from jukebox mode
        {
            this.setupPlayer();
        }
        var player = this.song && (this.song.isVideo ? this.$.VideoPlayer : this.Player);
        var node = player && player.audio;        
        if(!enyo.application.jukeboxMode && !this.justToggled)
        {
            this.Player.pause();
            if(this.$.VideoPlayer && this.$.VideoPlayer.node)
                this.$.VideoPlayer.node.pause();
        }
        if(this.song && this.song.isVideo)
        {
            // TODO: if we ever get video streaming straight to app, use this line not the one under it ..
            var url = sanitizeServer(prefs.get("serverip")) + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS";
            url = sanitizeServer(prefs.get("serverip")) + "/rest/videoPlayer.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS";
            this.log("*** Playing Video URL ", url);
            enyo.windows.addBannerMessage("Launching Video Player...", '{}', "", "")
            this.$.VideoService.request( { itemId: this.song.id });
            return;
        }
        if(!enyo.application.jukeboxMode)
            enyo.application.nowplaying = this.song;
        if(this.song)
        {
            if(!enyo.application.active)
            {
                enyo.windows.addBannerMessage(this.song.artist + "-" + this.song.title, '{ }' );
            }
            if(enyo.application.dash && enyo.application.dash.name == "xodash" && window.PalmSystem)
                enyo.windows.setWindowParams(enyo.application.dash, { objTrackInfo: { strTrackTitle: this.song.title, strTrackArtist: this.song.artist }, boolAudioPlaying: true });
            this.doPlaying();
            this.log("using player", player);
            this.$.SongInfoBox.show();
            if(!this.song.coverArt)
                this.$.AlbumArt.setSrc("images/noart.png");
            else
            {
                var arturl = coverArtUrl(this.song.coverArt, "400");
                if(this.$.AlbumArt.src != arturl)
                {
                    this.$.AlbumArt.setSrc(arturl);
                }
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
                this.log("music playing:", sanitizeServer(prefs.get("serverip")) + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS");
                player.setSrc(sanitizeServer(prefs.get("serverip")) + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO-webOS");
                this.$.ProgressSlider.setPosition(0);
                this.$.ProgressSlider.setBarPosition(0);
                this.$.ProgressSlider.setAltBarPosition(0);
            }
            if(!enyo.application.jukeboxMode && !this.justToggled)
                player.play();
            this.checkTimer();
            this.justToggled = false;

        } else {
            this.doNotPlaying();
            this.$.AlbumArt.setSrc("");
            this.$.AlbumNameLabel.setContent("");
            this.$.SongInfoBox.hide();
            this.$.ProgressSlider.setPosition(0);
            this.$.ProgressSlider.setBarPosition(0);
            this.$.ProgressSlider.setAltBarPosition(0);
            if(player)
                player.setSrc("");
            this.clearTimer();
            delete this.timer;
            this.checkStatus();
        }
        enyo.nextTick(this, this.doSongChanged, this.song);
        //this.doSongChanged(this.song);
    },
    playPauseClicked: function(inSender, inEvent)
    {
        this.log();
        var playlist = enyo.application.jukeboxMode ? enyo.application.jukeboxList : enyo.application.playlist;
        if(!this.song)
        {
            if(!enyo.application.playlist)
                return false;
            if(isNaN(playlist.index) || playlist.index > playlist.length)
                playlist.index = 0;
            else
            {
                if(enyo.application.playlist[playlist.index])
                    enyo.application.playlist[playlist.index].startTime = prefs.get("savedtime");
            }
            this.log("starting song ", playlist.index);
            this.setSong(playlist[playlist.index]);
            return true;
        }
        var player = (this.song && this.song.isVideo) ? this.$.VideoPlayer : this.Player;
        if(enyo.application.jukeboxMode)
        {
            this.doPlayPauseJukebox();
        } else {
            if(this.song.isVideo)
            {
                if(!player.Paused)
                    player.pause();
                else
                    player.play();
            } else {
                if(!this.Player.Paused)
                {
                    this.Player.pause();
                    if(enyo.application.dash && enyo.application.dash.name == "xodash" && window.PalmSystem)
                        enyo.windows.setWindowParams(enyo.application.dash, { objTrackInfo: { strTrackTitle: this.song.title, strTrackArtist: this.song.artist }, boolAudioPlaying: false });
                }
                else
                {
                    if(enyo.application.dash && enyo.application.dash.name == "xodash" && window.PalmSystem)
                        enyo.windows.setWindowParams(enyo.application.dash, { objTrackInfo: { strTrackTitle: this.song.title, strTrackArtist: this.song.artist }, boolAudioPlaying: true });        
                    this.Player.play();
                }
            }
        }
        this.checkTimer();
        inEvent.stopPropagation();
        return true;
    },
    playing: function()
    {
        var node = this.Player && this.Player.audio && this.Player.audio.hasNode && this.Player.audio.hasNode();
        return !enyo.application.jukeboxMode && this.song && node && !node.ended;
    },
    checkStatus: function()
    {
        //this.log(this.showing);
        var state;
        var node;
        //var player = this.song.isVideo ? this.$.VideoPlayer : this.Player;
        //var node = this.song.isVideo ? player.node : player.audio;
        var player = this.Player;
        var node = player && player.audio;
        if(!enyo.application.jukeboxMode && !player)
            return;
        if(enyo.application.jukeboxMode)
        {
            //this.log("checkStatus in Jukebox Mode");
            this.doJukeboxStatus();
            return;
        }
        if(node) {
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
            if(node.readyState >= 1 && enyo.application.playlist[enyo.application.playlist.index] && enyo.application.playlist[enyo.application.playlist.index].startTime)
            {
                this.Player.audio.volume = 100;
                node.currentTime = enyo.application.playlist[enyo.application.playlist.index].startTime;
                enyo.application.playlist[enyo.application.playlist.index].startTime = 0;
            }
            try {
                this.$.PlayerStatus.setContent("");
                this.$.ProgressSlider.setAltBarPosition(parseInt( (node.buffered.end(0) / node.duration) * 100));
                //this.$.PlayerStatus.setContent(/*"Seeking: " + node.seeking + " Paused: " + node.paused + " Ended: " + node.ended + */" N: " + node.networkState + " R: " + node.readyState + " P: " + parseInt( (node.buffered.end(0) / node.duration) * 100) );
            } catch(err) {
                // we need a catch here because this throws a DOM ERROR 1 if it's called too early.. why? who the fuck knows..
            }
        } else {
            if(enyo.application.playlist[enyo.application.playlist.index].startTime)
            {
                this.Player.seekTo(enyo.application.playlist[enyo.application.playlist.index].startTime);
                enyo.application.playlist[enyo.application.playlist.index].startTime = 0;
            }
        }
        //this.$.PlayerStatus.setContent(node.seeking + " " + state + " " +  node.paused);
        //this.$.PlayerStatus.setContent("status" + " " + node.buffered.length + " " + node.buffered.start(0) + " " + node.buffered.end(0) + " " + node.ended);
        //this.log(node.buffered);
        if(!this.song)
            return;
        if( (node && node.readyState < 2) || this.Player.getCurrentPosition() < 0)
        {
            this.$.SliderBox.hide();
            if(!node || (!node.paused && !this.$.PlayerSpinner.showing && node.readyState < 3))
            {
                this.$.PlayerSpinner.show();
            }
        }
        else
        {
            if(!this.$.SliderBox.showing)
                this.$.SliderBox.show();
            if((!node && this.Player.getCurrentPosition() < 0) || (node && !node.paused && !this.$.PlayerSpinner.showing && node.readyState < 3))
            {
                this.$.PlayerSpinner.show();
            } else {
                if(this.$.PlayerSpinner.showing)
                    this.$.PlayerSpinner.hide();
            }
        }
        //enyo.log("Current Position " + this.Player.getCurrentPosition());
        var prog = (this.Player.getCurrentPosition() / this.song.duration) * 100;
        prefs.set("savedtime", this.Player.getCurrentPosition());
        //this.log("song progress = ", this.Player.audio.currentTime, this.song.duration, prog);
        this.$.ProgressSlider.setBarPosition( prog );
        if(!this.Player.audio || !this.Player.audio.seeking)
            this.$.ProgressSlider.setPosition(prog);
        var duration = this.Player.getDuration();
        if(duration < 1)
            duration = Math.floor(this.song.duration)-0.5;
        if(node && node.ended !== undefined && node.ended) {
            this.log("Song Ended by Audio Node telling us this");
            this.doNextSong();
        } else if(!node && Math.ceil(this.Player.getCurrentPosition()) >= duration) {
            this.log("Song Ended by reported Position > reported Duration");
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
        //if(!this.Player.audio.seeking)
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
