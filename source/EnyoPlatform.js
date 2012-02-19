/* Enyo Platform encapsulation. Include this FIRST in your depends.js, and
 * call Platform.setup() at the very start of the "created" function in your
 * application's first instanced kind. 
 *
 * This prefers direct access to APIs whenever possible - although you CAN run
 * webOS and WebWorks apps with PhoneGap, I'm trying to avoid going through any
 * extra layers here.
 *
 * If you are deploying to iOS, set a new parameter in your appinfo.json: iTunesAppId
 * to your application id as found in the Apple Dev Portal.
 */
enyo.kind({
    name: "Platform",
    kind: "Component",
    statics: {
        setup: function()
        {
            enyo.log("********* Setting up Platform Variables *************");
            enyo.log("window.PalmSystem "+ window.PalmSystem);
            enyo.log("window.blackberry "+ window.blackberry);
            enyo.log("window.PhoneGap "+ window.PhoneGap);
            enyo.log("window.device "+ window.device);
            if(window.device)
                enyo.log("window.device.platform "+ window.device.platform);
            enyo.log("window.chrome "+ window.chrome);
            if(window.PhoneGap && !window.device) {
                enyo.log("EnyoPlatform: PhoneGap detected, device not (yet) available. Bailing until next call.");
                return;
            }
            if(typeof window.PalmSystem !== "undefined")
            {
                var deviceInfo = enyo.fetchDeviceInfo();
                this.platform = "webos";
                this.platformVersion = deviceInfo ? deviceInfo.platformVersion : "unknown";
            }
            else if(typeof blackberry !== "undefined")
            {
                if(typeof PhoneGap !== "undefined")
                {
                    this.platform = "blackberry";
                }
                else
                {
                    this.platform = "webworks";
                }
                /* According to the BlackBerry docs,  to get the version number,
                 * we have to actually make an AJAX request to
                 * http://localhost:8472/blackberry/system/get . Screw that.
                 */
                this.platformVersion = "unknown";
            }
            else if(typeof PhoneGap !== "undefined")
            {
                this.platform = device.platform.toLowerCase();
                this.platformVersion = device.version;
            }
            else
            {
                /* Someone with more time on their hands might be interested in
                 * breaking this out to determine various web browsers and their
                 * respective versions.  Not for me at this time.
                 */
                this.platform = "web";
                this.platformVersion = "unknown";
            }
            enyo.log("Platform detected: " + this.platform + " version " + this.platformVersion);
            enyo.log(" ************************************** ");
        },
        getPlatformName: function() { this.platform || this.setup(); return this.platform; },
        /* Platform boolean functions -- return truthy if specific platform */        
        isWebOS: function() { this.platform || this.setup(); return this.platform == "webos"; },
        isAndroid: function() { this.platform || this.setup(); return this.platform == "android"; },
        isBlackBerry: function() { this.platform || this.setup(); return this.platform == "blackberry" || this.platform == "webworks" },
        isWebWorks: function() { this.platform || this.setup(); return this.platform == "webworks"; },
        isiOS: function() { this.platform || this.setup(); return this.platform == "iphone"; },
        isMobile: function() { this.platform || this.setup(); return this.platform != "web"; },
        /* General screen size functions -- tablet vs phone, landscape vs portrait */
        isLargeScreen: function() { this.platform || this.setup(); return window.innerWidth > 480; },
        isWideScreen: function() { this.platform || this.setup(); return window.innerWidth > window.innerHeight; },
        /* Platform-supplied UI concerns */
        hasBack: function()
        {
            this.platform || this.setup(); 
            return this.platform == "android" || (this.platform == "webos" && this.platformVersion < 3);
        },
        hasMenu: function()
        {
            /* You may want to include Android here if you're using a target
             * API of less than 14 (Ice Cream Sandwich)
             */
            this.platform || this.setup(); 
            return this.platform == "webos"; 
        },
        /* Platform-specific Audio functions */
        useHTMLAudio: function()
        {
            this.platform || this.setup(); 
            return this.isWebOS() || this.isWebWorks() || !this.isMobile();
        },
        /* Platform Specific Web Browser -- returns a function that should
         * launch the OS's web browser.  Having trouble thinking of a way to do
         * this in webOS, since we can't create a PalmSystem component here . .
         * or can we?
         * call: Platform.browser("http://www.google.com/", this)();
         */
        browser: function(url, thisObj)
        {
            this.platform || this.setup(); 
            if(this.isWebOS())
            {
                return enyo.bind(thisObj, (function(args) {
                    var x = thisObj.createComponent({ name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open" });
                    x.call({ target: url });
                }));
            }
            else if(this.platform == "web")
            {
                /* If web, just open a new tab/window */
                return enyo.bind(thisObj, function(x) { window.open(x, '_blank'); }, url);
            }
            else if(this.isBlackBerry())
            {
                /* If BlackBerry, go through their ridiculous parsing rules */
                /* Make sure you have the invoke and invoke.BrowserArguments
                 * configured in your config.xml.
                 */
                var args = new blackberry.invoke.BrowserArguments(this.blackBerryURLEncode(url));
                return enyo.bind(thisObj, blackberry.invoke.invoke, blackberry.invoke.APP_BROWSER, args);
            }
            else if(typeof PhoneGap !== "undefined" && window.plugins && window.plugins.childBrowser)
            {
                /* If you have the popular childBrowser plugin for PhoneGap */
                return enyo.bind(thisObj, window.plugins.childBrowser.openExternal, url);
            }
            else
            {
                /* Fall back to something that could possibly work
                 * One could also make a case for just setting window.location
                 */
                return enyo.bind(thisObj, function(x) { window.open(x, '_blank'); }, url);
            }
        },
        /* A ridiculous function for parsing URLs into something that RIM's
         * BrowserArguments call can deal with "properly", thanks to their
         * forums.
         */
        blackBerryURLEncode: function(address) {
            var encodedAddress = "";
            // URL Encode all instances of ':' in the address
            encodedAddress = address.replace(/:/g, "%3A");
            // Leave the first instance of ':' in its normal form
            encodedAddress = encodedAddress.replace(/%3A/, ":");
            // Escape all instances of '&' in the address
            encodedAddress = encodedAddress.replace(/&/g, "\&");

            if (typeof blackberry !== 'undefined') {
                var args = new blackberry.invoke.BrowserArguments(encodedAddress);
                blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
            } else {
                // If I am not a BlackBerry device, open link in current browser
                window.location = encodedAddress; 
            }            
        },
        getReviewURL: function()
        {
            this.platform || this.setup(); 
            var url = "";
            switch(Platform.platform) {
                case "webos":
                    url = "http://developer.palm.com/appredirect/?packageid=" + enyo.fetchAppId();
                    break;
                case "android":
                    url = "market://details?id=" + enyo.fetchAppId();
                    break;
                case "blackberry":  // intentional fallthrough
                case "webworks":
                    url = "";
                    break;
                case "iphone":
                    var appInfo = enyo.fetchAppInfo();
                    if(enyo.isString(appInfo))
                        appInfo = JSON.parse(appInfo);
                    url = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id="+appInfo.iTunesAppId;
                    break;
            }
            return url;
        }
    }
});

enyo.kind({
    name: "PlatformSound",
    kind: "Sound",
    position: -1,
    play: function() {
        if(!Platform.useHTMLAudio()) {
            if(window.PhoneGap)
                this.media.play();
        } else {
            if (!this.audio.paused) {
                this.audio.currentTime = 0;
            } else {
                this.audio.play();
            }
        }
        this.Paused = false;
        if(!Platform.useHTMLAudio())
        {
            /* The PhoneGap media API does not document it's "MediaStatus" callback, so at the moment
             * i'm going to just run a timer to the getCurrentPosition call to make sure that
             * the media object's _position is updated regularly.  Sick.
             */
            this.Timer = setInterval(enyo.bind(this, this.getMediaPos), 100);
        }
    },
    srcChanged: function() {
        var path = enyo.path.rewrite(this.src);
        if(!Platform.useHTMLAudio()) {
            if(window.PhoneGap)
                this.media = new Media(path, this.MediaSuccess, this.mediaFail, this.mediaStatus, this.mediaProgress);
            else
                enyo.log("*** Don't know how to play media without HTML5 or PhoneGap!", Platform.platform);
        } else {
            this.audio = new Audio();
            this.audio.src = path;
        }
    },    
    getMediaPos: function(x, y, z) {
        this.media.getCurrentPosition(enyo.bind(this, this.posReceived));
    },
    posReceived: function(x, y, z) {
        this.position = x;
    },
    mediaSuccess: function(x, y, z) {
        enyo.log("mediaSuccess"+ x+ y+ z);
    },
    mediaFail: function(x, y, z) {
        enyo.log("mediaFail"+ x+ y+ z);
    },
    mediaStatus: function(x, y, z) {
        if(x == Media.MEDIA_Paused)
            this.Paused = true;
        else
            this.Paused = false;
        enyo.log("mediaStatus"+ x+ y+ z);
    },
    mediaProgress: function(x, y, z) {
        enyo.log("mediaProgress"+ x+ y+ z);
    },
    getCurrentPosition: function() { 
        return Platform.useHTMLAudio() ? this.audio.currentTime : this.position; /* PhoneGap's media._position doesn't seem to load? */
    },
    getDuration: function() {
        return !Platform.useHTMLAudio() ? this.media.getDuration() : this.audio.duration;
    },
    pause: function() {
        this.Paused = true;
        clearInterval(this.Timer);
        !Platform.useHTMLAudio() ? this.media.pause() : this.audio.pause();
    },
    release: function() {
        this.pause();
        if(!Platform.useHTMLAudio()) {
            this.media.release();
        }
        this.destroy();
    },
    seekTo: function(loc) {
        if(!Platform.useHTMLAudio() ) {
            this.media.seekTo(loc * 1000);
        } else {
            this.audio.currentTime = loc;
        }
    },
    stop: function() {
        clearInterval(this.Timer);
        if(!Platform.useHTMLAudio() ) {
            this.media.stop();
        } else {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
});