prefs = {
    set: function(prop, setting)
    {
        setting = JSON.stringify(setting);
        localStorage.setItem(prop, setting);
        enyo.setCookie(prop, setting, { "Max-Age": 31536000 });
    },
    get: function(prop)
    {
        var x = localStorage.getItem(prop);
        if(x == "false") return false;
        else if(x == "true") return true;
        try {
            return JSON.parse(x ? x : enyo.getCookie(prop));
        } catch(err) {
            return undefined;
        }
    },
    del: function(prop)
    {
        localStorage.removeItem(prop);
        enyo.setCookie(prop, undefined, { "Max-Age": 0 } );
    },
    def: function(prop, setting)
    {
        if(prefs.get(prop) === undefined)
            prefs.set(prop, setting);
    }
};

function isLargeScreen()
{
    //console.log("********************************************* screen width " + window.screen.availWidth);
    //console.log(window.innerWidth);
    //return window.screen.availWidth > 480;
    return window.innerWidth > 480;
}

function isWideScreen()
{
    return window.innerWidth > window.innerHeight;
}

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if(hours > 0)
        return hours+":" + (minutes < 10 ? "0" : "") + minutes+":"+(seconds < 10 ? "0" : "") + seconds;
    return (minutes < 10 ? "0" : "") + minutes+":" + (seconds < 10 ? "0" : "") + seconds;
}

// http://ejohn.org/blog/javascript-array-remove/
/*Array.prototype.remove = function(from, to) {
   var rest = this.slice((to || from) + 1 || this.length);
   this.length = from < 0 ? this.length + from : from;
   return this.push.apply(this, rest);
};*/
Array.prototype.remove = function(from, to){
  this.splice(from,
    !to ||
    1 + to - from + (!(to < 0 ^ from >= 0) && (to < 0 || -1) * this.length));
  return this.length;
};

Array.prototype.insert = function(index, item)
{
    this.splice(index, 0, item);
};
