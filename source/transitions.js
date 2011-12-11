enyo.kind( {
    name: "TestTransition",
    kind: enyo.transitions.Simple,
    begin: function()
    {
        this.log();
        var c = this.pane.transitioneeForView(this.fromView).hasNode();

        var t1 = this.pane.transitioneeForView(this.fromView);
        if (t1) {
                t1.show();
        }
        var t2 = this.pane.transitioneeForView(this.toView);
        if (t2) {
            Morf.transition(t2.hasNode(), { "-webkit-transform": "translate3d(-"+window.screen.availWidth+"px, 0, 0)" },
                            {
                                duration: "0ms",
                                timingFunction: "spring",
                            });
            t2.show();
        }
        this.timeout = setTimeout(enyo.bind(this, this.done), 800);
        Morf.transition(c, { "-webkit-transform": "translate3d("+window.screen.availWidth+"px, 0, 0)" },
                        {
                            duration: "700ms",
                            timingFunction: "spring",
                            callback: enyo.bind(this, this.done)
                        });
        c = this.pane.transitioneeForView(this.toView).hasNode();
        Morf.transition(c, { "-webkit-transform": "translate3d(0px, 0, 0)" },
                        {
                            duration: "700ms",
                            timingFunction: "spring",
                        });
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