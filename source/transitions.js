enyo.kind( {
    name: "TestTransition",
    kind: enyo.transitions.Simple,
    begin: function()
    {
        var a = alice.init();
        this.log();
        var c = this.pane.transitioneeForView(this.fromView).hasNode();

        var t1 = this.pane.transitioneeForView(this.fromView);
        if (t1) {
                t1.show();
        }
        var t2 = this.pane.transitioneeForView(this.toView);
        if (t2) {
            //a.slide(t2.hasNode().id, "left", "10", "700ms", "ease", "0ms", "1", "normal", "running");
//alice.cheshire({"elems": [t2.hasNode().id],"delay": {"value": "0ms","randomness": "0%"},"duration": {"value": "700ms","randomness": "0%"},"timing": "ease","iteration": "1","direction": "normal","playstate": "running","move": "left","rotate": "0%","flip": "","turns": "1","fade": "","scale": {"from": "100%","to": "100%"},"shadow": "true","overshoot": "0%","perspective": "1000","perspectiveOrigin": "center","backfaceVisibility": "visible"});

            
            /*Morf.transition(t2.hasNode(), { "-webkit-transform": "translate3d(-"+window.screen.availWidth+"px, 0, 0)" },
                            {
                                duration: "0ms",
                                timingFunction: "spring",
                            });*/
            t2.show();
        }
        a.slide(c.id, { direction: "down", start: 1, end: window.screen.availHeight }, "0", "500ms", "easeOutCirc", "0ms", "1", "normal", "running");
        this.timeout = setTimeout(enyo.bind(this, this.done), 510);
        /*Morf.transition(c, { "-webkit-transform": "translate3d("+window.screen.availWidth+"px, 0, 0)" },
                        {
                            duration: "700ms",
                            timingFunction: "spring",
                            callback: enyo.bind(this, this.done)
                        });*/
        c = this.pane.transitioneeForView(this.toView).hasNode();
        a.slide(c.id, "left", "0", "500ms", "ease-in", "0ms", "1", "easeInCirc", "running");
        /*Morf.transition(c, { "-webkit-transform": "translate3d(0px, 0, 0)" },
                        {
                            duration: "700ms",
                            timingFunction: "spring",
                        });*/
    },
    done: function()
    {
        if(this.timeout)
            clearTimeout(this.timeout);
        var f = this.pane.transitioneeForView(this.fromView);
        //f.hide();
        var c = this.pane.transitioneeForView(this.toView);
        if (c && c.hasNode()) {
            //c.hide();
                var s = c.node.style;
                s.position = null;
                s.display = "";
                s.zIndex = null;
                s.opacity = null;
                s.top = null;
        }
        
        this.inherited(arguments);
        this.log();
    }
});