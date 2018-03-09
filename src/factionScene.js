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
        var btnInterval = 600;
        var attackButton = new cc.MenuItemImage(
            res.ATK_FACTION,
            res.ATK_FACTION
        );
        attackButton.setPosition(size.width / 2 - btnInterval / 2, size.height / 2);
        attackButton.setName(armyTemplate.faction.attackFaction);
        attackButton.setCallback(this.factionCallback.bind(this, attackButton.getName()));
        var defenceButton = new cc.MenuItemImage(
            res.DFC_FACTION,
            res.DFC_FACTION
        );
        defenceButton.setPosition(attackButton.x + btnInterval, size.height / 2);
        defenceButton.setName(armyTemplate.faction.defenceFaction);
        defenceButton.setCallback(this.factionCallback.bind(this, defenceButton.getName()));
        var factionMenu = new cc.Menu(attackButton, defenceButton);
        factionMenu.setPosition(0, 0);
        this.addChild(factionMenu);
    },

    factionCallback : function(faction) {
        var configScene = new ConfigScene();
        configScene.setFaction(faction);
        cc.director.pushScene(configScene);
    },

    onEnter : function() {
        this._super();
    },
    onExit : function() {

    }
});

