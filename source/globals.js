prefs = {
    set: function(prop, setting)
    {
        localStorage.setItem(prop, setting);
        enyo.setCookie(prop, setting, { "Max-Age": 31536000 });
    },
    get: function(prop)
    {
        var x = localStorage.getItem(prop);
        if(x == "false") return false;
        else if(x == "true") return true;
        return x ? x : enyo.getCookie(prop);
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
    return window.screen.availWidth > 480;
}

