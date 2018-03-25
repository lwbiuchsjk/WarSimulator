var UnitConfigScene = cc.Scene.extend({
    moduleNameList : {
        displayLayer : "displayLayer",
        configLayer : "configLayer"
    },
    playerInfo : null,
    webSocket : null,
    battleProp : null,

    ctor : function(webSocket, playerInfo, battleProp) {
        /*
         * 只有在unitConfig之前才发起询问unit config阶段是否要根据情况跳过。
         */
        this._super();
        this.webSocket = webSocket;
        this.battleProp = battleProp;
        if (playerInfo instanceof PlayerMsg) {
            this.playerInfo = playerInfo;
        } else {
            console.log("reload player info in UnitConfigScene...");
            this.playerInfo = new PlayerMsg(playerInfo);
        }

        this.addChild(new BackGroundLayer());

        var self = this;
        this.webSocket.send(new WebMsg(WebMsg.TYPE_CLASS.PLAYER_DATA, this.playerInfo.getMsg()).toJSON());
        this.webSocket.onmessage = function(msg) {
            var parsedMsg = new WebMsg(msg.data);
            switch(parsedMsg.type) {
                case WebMsg.TYPE_CLASS.CODE_DATA : {
                    switch (parsedMsg.value) {
                        case armyTemplate.faction.attackFaction || armyTemplate.faction.defenceFaction : {
                            if (self.battleProp === messageCode.SET_SINGLE_BATTLE){
                                if (parsedMsg.value === self.playerInfo.faction) {
                                    var displayLayer = new UnitsDisplayLayer();
                                    displayLayer.setName(self.moduleNameList.displayLayer);
                                    displayLayer.wipeTroops();
                                    self.addChild(displayLayer);

                                    var configLayer = new UnitConfigLayer();
                                    configLayer.setName(self.moduleNameList.configLayer);
                                    configLayer.wipeTitle();
                                    self.addChild(configLayer);
                                    self.getChildByName(self.moduleNameList.displayLayer).loadFaction(parsedMsg.value);
                                }
                            }
                            break;
                        }
                    }
                }
                break;
                case WebMsg.TYPE_CLASS.MSG : {
                    console.log(parsedMsg.value);
                    break;
                }
                default : {
                    console.log("get msg type : " + parsedMsg.type + " with value : ");
                    console.log(parsedMsg.value);
                }
            }
        };
    },

    onEnter:function () {
        this._super();
    }
});

var BackGroundLayer = cc.Layer.extend({
    ctor : function() {
        this._super();

        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;
        var boxSize = cc.size(300, 100);

        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);
    }
});



