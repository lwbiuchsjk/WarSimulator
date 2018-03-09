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
        displayLayer.wipeTroops();
        this.addChild(displayLayer);

        var configLayer = new UnitConfigLayer();
        configLayer.setName(this.moduleNameList.configLayer);
        configLayer.wipeTitle();
        this.addChild(configLayer);
    },
    setFaction : function(faction) {
        this.faction = faction;
    },

    onEnter:function () {
        this._super();
        this.getChildByName(this.moduleNameList.displayLayer).loadFaction(this.faction);
    }
});

