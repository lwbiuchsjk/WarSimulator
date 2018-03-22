var FactionScene = cc.Scene.extend({
    moduleNameList : {
        factionLayer : "factionLayer",
    },
    onEnter:function () {
        this._super();
        var factionLayer = new FactionLayer();
        factionLayer.setName(this.moduleNameList.factionLayer);
        cc.loader.loadJson(messageCode.CONFIG_FILE, function(err, data) {
            messageCode.COMMUNICATION_ADDRESS = data["server"];
        });
        this.addChild(factionLayer);
    }
});

var FactionLayer = cc.Layer.extend({
    webSocket : null,

    ctor : function() {
        this._super();
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 2;
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(200, 200, 200));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        this.addFactionButton(globalSize, unitImageScale);
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
        attackButton.setScale(scale, scale);
        var defenceButton = new cc.MenuItemImage(
            res.DFC_FACTION,
            res.DFC_FACTION
        );
        defenceButton.setPosition(attackButton.x + btnInterval, size.height / 2);
        defenceButton.setName(armyTemplate.faction.defenceFaction);
        defenceButton.setCallback(this.factionCallback.bind(this, defenceButton.getName()));
        defenceButton.setScale(scale, scale);
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

        this.webSocket = new WebSocket(messageCode.COMMUNICATION_ADDRESS);
        var socket = this.webSocket;
        this.webSocket.onopen = function() {
            socket.send(new WebMsgMaker(WebMsgMaker.TYPE_CLASS.STRING, messageCode.LOAD_UNIT_TEMPLATE).toJSON());
        };
        this.webSocket.onmessage = function(msg) {
            var paresMsg = new WebMsgParser(msg);
            switch (paresMsg.type) {
                case WebMsgParser.TYPE_CLASS.STRING : {
                    console.log(paresMsg.value);
                    break;
                }
                case WebMsgParser.TYPE_CLASS.DATA_RECORD : {
                    var troops = {};
                    for (var iter in paresMsg.value) {
                        var unit = paresMsg.value[iter].unit;
                        troops[unit] = paresMsg.value[iter];
                        delete troops["createdAt"];
                        delete troops["updatedAt"];
                    }
                    armyTemplate.troops = troops;
                    console.log(armyTemplate.troops);
                    break;
                }
            }
        };
        this.webSocket.onclose = function() {
            console.log("load unit template is closed by server...")
        };
    },
    onExit : function() {

    }
});

