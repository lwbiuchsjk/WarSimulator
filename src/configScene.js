var ConfigScene = cc.Scene.extend({
    moduleNameList : {
        displayLayer : "displayLayer",
        configLayer : "configLayer",
        outputLayer : "outputLayer",
    },
    onEnter:function () {
        this._super();
        var displayLayer = new UnitsDisplayLayer();
        displayLayer.setName(this.moduleNameList.displayLayer);
        this.addChild(displayLayer);

        var configLayer = new UnitConfigLayer();
        configLayer.setName(this.moduleNameList.configLayer);
        configLayer.setVisible(false);
        
        this.addChild(configLayer);
    }
});

