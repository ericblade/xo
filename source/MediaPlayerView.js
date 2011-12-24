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
    },
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
                        { name: "AlbumNameLabel", content: "Song Name", style: "color: white; max-width: 95%; ", },
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
                                { name: "PlayerStatus", content: "", showing: false, className: "enyo-item-ternary", style: "color: white;" },
                                { name: "PlayerSpinner", kind: isLargeScreen() ? "SpinnerLarge" : "Spinner" },
                            ]
                        },
                        { kind: "Spacer", },
                    ]
                },
                { kind: "Spacer", },
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
                { kind: "HFlexBox", components:
                    [
                        { kind: "GrabButton", style: "background-color: #121212" },
                        { kind: "Spacer", },
                        { kind: "Button", caption: "Prev", onclick: "doPrevSong", },
                        { kind: "Button", caption: "Play/Pause", onclick: "playPauseClicked", },
                        { kind: "Button", caption: "Next", onclick: "doNextSong", },
                        { kind: "Spacer", },
                    ]
                },
            ]                            
        },
    ],
    hideTips: function() { this.log(this); this.$.MediaPlayer.$.PlayerTips.hide(); },
    progressSliderChange: function(inSender, x)
    {
        this.log(x);
        //this.log(this.$.MusicPlayer.audio.currentTime, this.$.ProgressSlider.getPosition(), (this.$.ProgressSlider.getPosition() / 100) * this.song.duration);
        var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
        
        player.currentTime = (this.$.ProgressSlider.getPosition() / 100) * this.song.duration;
        //this.log(this.$.MusicPlayer.audio.currentTime);
        return true;
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
            this.timer = setInterval(enyo.bind(this, this.checkStatus), 500);
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
    songChanged: function()
    {
        this.setupPlayer();
        console.log("songChanged", this.song.isVideo);
        console.log(this.song);
        var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
        this.$.MusicPlayer.audio.pause();
        if(this.$.VideoPlayer && this.$.VideoPlayer.node)
            this.$.VideoPlayer.node.pause();
        if(this.song.isVideo)
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
        enyo.application.nowplaying = this.song;
        if(this.song)
        {
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
            this.$.ArtistNameLabel.addRemoveClass("enyo-item-secondary", this.song.artist.length > 15);
            this.$.ArtistNameLabel.addRemoveClass("enyo-item-ternary", this.song.artist.length > 25);
            this.$.AlbumNameLabel.setContent(this.song.album);
            this.$.AlbumNameLabel.addRemoveClass("enyo-item-secondary", this.song.album.length > 25);
            this.$.AlbumNameLabel.addRemoveClass("enyo-item-ternary", this.song.album.length > 40);
            this.$.SongNameLabel.setContent(this.song.title);
            this.$.SongNameLabel.addRemoveClass("enyo-item-secondary", this.song.title.length > 15);
            this.$.SongNameLabel.addRemoveClass("enyo-item-ternary", this.song.title.length > 25);
            this.$.MediaLengthLabel.setContent(secondsToTime(this.song.duration));
            player.setSrc("http://" + prefs.get("serverip") + "/rest/stream.view?id=" + this.song.id + "&u=" + prefs.get("username") + "&p=" + prefs.get("password") + "&v=1.7.0" + "&c=XO(webOS)(development)");
            this.$.ProgressSlider.setBarPosition(0);
            this.$.ProgressSlider.setAltBarPosition(0);        
            player.play();
            this.checkTimer();
            if(this.song.startTime)
            {
                player.currentTime =  this.song.startTime;
            }
        } else {
            this.$.SongInfoBox.hide();
            player.setSrc("");
            this.clearTimer();
            delete this.timer;
            this.checkStatus();
        }
        this.doSongChanged(this.song);
    },
    playPauseClicked: function(inSender, inEvent)
    {
        var player = this.song.isVideo ? this.$.VideoPlayer : this.$.MusicPlayer;
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
        this.checkTimer();
        inEvent.stopPropagation();
        return true;
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
        if(!player || !node)
            return;
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
        this.$.PlayerStatus.setContent(node.seeking + " " + state + " " +  node.paused);
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
        if(node.currentTime > (this.song.duration - 0.6))
        {
            this.doNextSong();
        }
    }
});
