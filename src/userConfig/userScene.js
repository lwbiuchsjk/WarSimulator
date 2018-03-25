var UserScene = cc.Scene.extend({

    moduleNameList : {
        userLayer : "userLayer",
        factionLayer : "factionLayer",
    },

    webSocket : null,
    playerInfo : null,

    ctor : function(webSocket, playerInfo, battleProp) {
        this._super();

        var layer = this;
        this.playerInfo = playerInfo;
        this.battleProp = battleProp;

        this.webSocket = webSocket;
        this.webSocket.onmessage = function(msg) {
            var paresMsg;
            try {
                paresMsg = new WebMsg(msg.data);
            } catch (error) {
                console.log(error);
                return;
            }
            switch (paresMsg.type) {
                case WebMsg.TYPE_CLASS.CODE_DATA : {
                    console.log(paresMsg.value);
                    break;
                }
                case WebMsg.TYPE_CLASS.UNIT_DATA : {
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
                default : {
                    console.log(paresMsg.type + " type msg with: ");
                    console.log(paresMsg.value);
                }
            }
        };
        this.webSocket.onclose = function() {
            console.log("load unit template is closed by server...")
        };


        var userLayer = new UserLayer();
        userLayer.setName(this.moduleNameList.userLayer);
        this.addChild(userLayer);

        var factionLayer = new FactionLayer();
        factionLayer.setName(this.moduleNameList.factionLayer);
        this.addChild(factionLayer);
        factionLayer.loadButtonCallback();

        return true;
    },

    onEnter : function() {
        this._super();
    },

    onExit : function() {
        this._super();
    }
});

var UserLayer = cc.Layer.extend({
    moduleList : {
        account : "account",
    },

    ctor : function() {
        this._super();
    },

    onEnter : function() {
        this._super();

        var layer = this;

        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;
        var boxSize = cc.size(300, 100);

        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);


        var account = new cc.EditBox(boxSize, new cc.Scale9Sprite(res.TEXT_RECT));

        //默认提示输入文本
        account.setPlaceHolder("请输入手机号");
        //提示字体
        account.setPlaceholderFontSize(32);
        account.setFontColor(cc.color.WHITE);
        account.setPosition(globalSize.width / 2, globalSize.height / 2);
        account.setFontSize(account.getContentSize().height * 0.5);
        account.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        account.setName(this.moduleList.account);
        //account.node.on(account.getName(), this.accountCallback, this);

        this.addChild(account);

        var accountCallback = new cc.Node();
        accountCallback.attr({
            editBoxEditingDidBegin: function (editBox) {
                console.log("editBox " + editBox.getTag() + " DidBegin !");
            },
            editBoxEditingDidEnd : function(editBox) {
                console.log("editBox " + editBox.getTag() + " DidEnd !");
            },
            editBoxTextChanged : function(editBox, text) {
                console.log("editBox " + editBox.getTag() + ", TextChanged, text: " + text);
            },
            editBoxReturn : function(editBox) {
                console.log("editBox " + editBox.getTag() + " was returned !");
                var parentNode = layer.getParent();
                var playerID = Number(editBox.getString());
                parentNode.playerInfo.playerID = playerID;
                if (parentNode.playerInfo.checkConfigReady()) {
                    console.log("send config msg");
                    var configScene = new UnitConfigScene(parentNode.webSocket, parentNode.playerInfo, parentNode.battleProp);
                    cc.director.pushScene(configScene);
                }
            }
        });
        account.setDelegate(accountCallback);
        this.addChild(accountCallback);
    }
});