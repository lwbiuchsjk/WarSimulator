var UserScene = cc.Scene.extend({

    moduleNameList : {
        userLayer : "userLayer",
    },

    ctor : function() {
        this._super();

        var userLayer = new UserLayer();
        userLayer.setName(this.moduleNameList.userLayer);
        this.addChild(userLayer);

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

    webSocket : null,

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
        var layer = this;

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
                console.log(typeof editBox.getString());
                layer.webSocket.send(new WebMsgMaker(WebMsgMaker.TYPE_CLASS.STRING, editBox.getString()).toJSON());
                cc.director.pushScene(new FactionScene())
            }
        });
        account.setDelegate(accountCallback);

        this.addChild(accountCallback);
    },

    onEnter : function() {
        this._super();

        this.webSocket = new WebSocket(messageCode.COMMUNICATION_ADDRESS);
        var socket = this.webSocket;
        this.webSocket.onopen = function() {
            socket.send(new WebMsgMaker(WebMsgMaker.TYPE_CLASS.STRING, messageCode.CHECK_PLAYER).toJSON());
        };
        this.webSocket.onmessage = function(msg) {
            var msgPackage;
            try {
                msgPackage = new WebMsgParser(msg);
            } catch (error) {
                console.log(error);
            }
            switch (msgPackage.type) {
                case WebMsgParser.TYPE_CLASS.STRING : {
                    console.log(msgPackage.value);
                    break;
                }
                case WebMsgParser.TYPE_CLASS.DATA_RECORD : {
                    console.log("data record");
                    break;
                }
            }
        };
        this.webSocket.onclose = function() {
            console.log("load unit template is closed by server...")
        };
    }
});