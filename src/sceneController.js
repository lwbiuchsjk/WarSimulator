var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new UnitsDisplayLayer();
        this.addChild(layer);
    }
});

