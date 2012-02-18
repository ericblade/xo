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
        },
        /* Platform boolean functions -- return truthy if specific platform */        
        isWebOS: function() { return this.platform == "webos"; },
        isAndroid: function() { return this.platform == "android"; },
        isBlackBerry: function() { return this.platform == "blackberry" || this.platform == "webworks" },
        isWebWorks: function() { return this.platform == "webworks"; },
        isiOS: function() { return this.platform == "iphone"; },
        isMobile: function() { return this.platform != "web"; },
        /* General screen size functions -- tablet vs phone, landscape vs portrait */
        isLargeScreen: function() { return window.innerWidth > 480; },
        isWideScreen: function() { return window.innerWidth > window.innerHeight; },
        /* Platform-supplied UI concerns */
        hasBack: function()
        {
            return this.platform == "android" || (this.platform == "webos" && this.platformVersion < 3);
        },
        hasMenu: function()
        {
            /* You may want to include Android here if you're using a target
             * API of less than 14 (Ice Cream Sandwich)
             */
            return this.platform == "webos"; 
        },
        /* Platform Specific Web Browser -- returns a function that should
         * launch the OS's web browser.  Having trouble thinking of a way to do
         * this in webOS, since we can't create a PalmSystem component here . .
         * or can we?
         * call: Platform.browser("http://www.google.com/", this)();
         */
        browser: function(url, thisObj)
        {
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