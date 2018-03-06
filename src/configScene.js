var ConfigScene = cc.Scene.extend({
    moduleNameList : {
        displayLayer : "displayLayer",
        configLayer : "configLayer"
    },
    faction : null,

    ctor : function() {
        this._super();
        var displayLayer = new UnitsDisplayLayer();
        displayLayer.setName(this.moduleNameList.displayLayer);
        this.addChild(displayLayer);

        var configLayer = new UnitConfigLayer();
        configLayer.setName(this.moduleNameList.configLayer);
        this.addChild(configLayer);
    },
    setFaction : function(faction) {
        this.faction = faction;
    },

    onEnter:function () {
        this._super();
        console.log(this.faction);
        this.getChildByName(this.moduleNameList.displayLayer).loadFaction(this.faction);
    }
});

