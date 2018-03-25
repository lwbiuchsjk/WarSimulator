var FactionLayer = cc.Layer.extend({

    moduleList : {
        factionMenu : "factionMenu"
    },

    ctor : function() {
        this._super();


        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1.5;

        this.addFactionButton(globalSize, unitImageScale);
    },

    addFactionButton : function(size, scale) {
        var btnShift = 300, btnInterval = 250;
        var attackButton = new cc.MenuItemImage(
            res.attackFaction,
            res.attackFaction
        );
        attackButton.setPosition(size.width / 2 + btnShift, size.height / 2);
        attackButton.setName(armyTemplate.faction.attackFaction);
        attackButton.setScale(scale, scale);
        var defenceButton = new cc.MenuItemImage(
            res.defenceFaction,
            res.defenceFaction
        );
        defenceButton.setPosition(attackButton.x + btnInterval, size.height / 2);
        defenceButton.setName(armyTemplate.faction.defenceFaction);
        defenceButton.setScale(scale, scale);
        var factionMenu = new cc.Menu(attackButton, defenceButton);
        factionMenu.setPosition(0, 0);
        factionMenu.setName(this.moduleList.factionMenu);
        this.addChild(factionMenu);
    },

    factionCallback : function(faction) {
        var parentNode = this.getParent();
        parentNode.playerInfo.faction = faction;
        if (parentNode.playerInfo.checkConfigReady()) {
            console.log("send user config msg");
            var configScene = new UnitConfigScene(parentNode.webSocket, parentNode.playerInfo, parentNode.battleProp);
            cc.director.pushScene(configScene);
        }
    },

    loadButtonCallback : function() {
        // 根据已经选择的faction情况对faction button做处理。
        var factionMenu = this.getChildByName(this.moduleList.factionMenu),
            attackButton = factionMenu.getChildByName(armyTemplate.faction.attackFaction),
            defenceButton = factionMenu.getChildByName(armyTemplate.faction.defenceFaction);
        var selectedFaction = this.getParent().playerInfo.faction;
        var otherFaction = this.getParent().playerInfo.noFaction() ? null :
            (selectedFaction === armyTemplate.faction.attackFaction ? armyTemplate.faction.defenceFaction : armyTemplate.faction.attackFaction);
        if (otherFaction === null) {
            attackButton.setCallback(this.factionCallback.bind(this, attackButton.getName()));
            defenceButton.setCallback(this.factionCallback.bind(this, defenceButton.getName()));
        } else {
            factionMenu.getChildByName(otherFaction).setCallback(this.factionCallback.bind(this, otherFaction));
            factionMenu.getChildByName(selectedFaction).setVisible(false);
        }
    },

    onEnter : function() {
        this._super();
    },
    onExit : function() {
    }
});

