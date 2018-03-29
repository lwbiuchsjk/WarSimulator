var FightScene = cc.Scene.extend({
    enemyTroops : null,
    myTroops : null,

    moduleNameList : {
        showUnitsLayer : "showUnitsLayer",
        battleLayer : "battleLayer",
        outputLayer : "outputLayer"
    },
    webSocket : null,
    playerInfo : null,

    ctor : function(webSocket, playerInfo) {
        this._super();

        this.addChild(new BackGroundLayer());
        this.playerInfo = playerInfo instanceof PlayerMsg ? playerInfo : (function() {
            throw new Error("...fight scene get player info with wrong format...");
        })();

        var self = this;
        this.webSocket = webSocket;
        var myTroops = [],
            enemyTroops = [];

        this.webSocket.onmessage = function(msg) {
            var parsedMsg = new WebMsg(msg.data);
            switch (parsedMsg.type) {
                case WebMsg.TYPE_CLASS.CODE_DATA : {
                    console.log(parsedMsg.value);
                    break;
                }
                case WebMsg.TYPE_CLASS.MSG : {
                    console.log("server msg : " + parsedMsg.value);
                    break;
                }
                case WebMsg.TYPE_CLASS.CHECK_BATTLE_PROP : {
                    var battleMsg = new BattleMsg(parsedMsg.value);
                    var showUnitsLayer = new ShowUnitsLayer(battleMsg.battleProp, self.playerInfo.faction, myTroops, enemyTroops);
                    showUnitsLayer.setName(self.moduleNameList.showUnitsLayer);
                    self.addChild(showUnitsLayer);

                    var battleLayer = new BattleLayer();
                    battleLayer.setName(self.moduleNameList.battleLayer);
                    battleLayer.setVisible(false);
                    self.addChild(battleLayer);

                    var outputLayer = new OutputLayer();
                    outputLayer.setName(self.moduleNameList.outputLayer);
                    outputLayer.setVisible(false);
                    self.addChild(outputLayer);
                    break;
                }
                case WebMsg.TYPE_CLASS.UNIT_DATA : {
                    // 此时传入的是一个unitMsg的array.
                    if (parsedMsg.value instanceof Array && parsedMsg.value.length === 2) {
                        parsedMsg.value.forEach(function(troops) {
                            var unitMsg = new UnitMsg(troops);
                            if (unitMsg.playerID !== self.playerInfo.playerID) {
                                unitMsg.troops.forEach(function(rawUnit) {
                                    enemyTroops.push(new Unit(rawUnit).toUnit());
                                });
                                console.log("...enemy troops loaded successfully...");
                                console.log(enemyTroops);
                            }
                            if (unitMsg.playerID === self.playerInfo.playerID) {
                                unitMsg.troops.forEach(function(rawUnit) {
                                    myTroops.push(new Unit(rawUnit).toUnit());
                                });
                                console.log("...my troops loaded successfully...");
                                console.log(myTroops);
                            }
                        });
                        console.log("...go to battle...");
                        self.webSocket.send(new WebMsg(WebMsg.TYPE_CLASS.CHECK_BATTLE_PROP, new BattleMsg(self.playerInfo.battleID).getMsg()).toJSON());
                    } else {
                        throw new Error("...wrong troops input in battle...");
                    }

                    break;
                }
                default : {
                    console.log("..." + parsedMsg.type + " type msg with: " + "...");
                    console.log(parsedMsg.value);
                }
            }
        };
        console.log(playerInfo);
        this.webSocket.send(new WebMsg(WebMsg.TYPE_CLASS.LOAD_TROOPS_TO_CLIENT, new PlayerMsg(self.playerInfo.battleID, self.playerInfo.playerID).getMsg()).toJSON());

        return true;
    },

    onEnter : function() {
        this._super();
    },

    onExit : function() {
        this._super();
    }
});