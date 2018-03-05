var FactionScene = cc.Scene.extend({
    moduleNameList : {
        factionLayer : "factionLayer",
    },
    onEnter:function () {
        this._super();
        var factionLayer = new FactionLayer();
        factionLayer.setName(this.moduleNameList.factionLayer);
        this.addChild(factionLayer);
    }
});

var FactionLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(200, 200, 200));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        this.addFactionButton(globalSize, globalScale);
    },

    addFactionButton : function(size, scale) {
    },
    onEnter : function() {
        this._super();
    },
    onExit : function() {

    }
});

