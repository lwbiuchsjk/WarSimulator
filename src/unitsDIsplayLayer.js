/*
 * 在使用本layer的过程中，需要根据this.faction字段来判断runButton的功能与纹理，因此在创建runButton = new cc.Sprite时，通过其name属性来做标志。代价是不能通过name来索引该组件。
 */
var messageSocket = new WebSocket(messageCode.COMMUNICATION_ADDRESS);
messageSocket.onopen = function() {
    console.log("connect ready...");
};
messageSocket.onclose = function() {
    console.log("connect cancelled!");
};

var UnitsDisplayLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        /*
         * 以下为敌我标识
         */
        myTroops : "myTroops",
        /*
         * 以下name属性实现为faction.iter.property
         * 其中
         * faction = myTroops|attackFaction
         * iter为数组下标
         * property = unitButton|unitTitle|titleBar
         */
        unitButton : "myUnit",
        unitTitle : "unitTitle",
        titleBar : "titleBar",

        runButton : "runButton",
        backGround : "backGround"
    },

    unitListener : null,
    runButtonListener : null,
    myUnitsButtons : new Array(10),     // buttons与troops的长度应该相等

    myTroops : null,           // FLAG = "myTroops" + "." + NUMBER
    faction : null,

    backGroundColor : {
        attackFaction : cc.color(217, 150, 144),
        defenceFaction : cc.color(147, 205, 221)
    },

    runButton : null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;

        ////////////////////////////////////
        // 背景
        var bg = new cc.DrawNode();
        //bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(200, 200, 200));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        bg.setName(this.moduleNameList.backGround);
        this.addChild(bg);

        this.addUnitsMenu(globalSize, globalScale);
        this.addRunButton(globalSize, globalScale);
        return true;
    },

    addUnitsMenu : function(size, scale) {
        var unitWidth = 150, unitHeight = 200, unitInterval = 30, titleHeight = 50,
            xStart = 75, yMeStart = 80, yEnmyStart = size.height - yMeStart - unitHeight;
        for(var iter = 0; iter < this.myUnitsButtons.length; iter++) {
            var myPaleUnit = new cc.Sprite(res.UNIT_ON);
            myPaleUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            myPaleUnit.y = yMeStart * scale;
            myPaleUnit.setScale(scale, scale);
            myPaleUnit.setAnchorPoint(0, 0);
            this.myUnitsButtons[iter] = myPaleUnit;
            myPaleUnit.setName(this.moduleNameList.myTroops + "." + iter + "." + this.moduleNameList.unitButton );
            this.addChild(myPaleUnit);

            ////////////////////////////////////////////////
            // title显示元素
            var myTitleBar = new cc.DrawNode();
            myTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, titleHeight), cc.color(255, 255, 255), 0);
            myTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitWidth);
            myTitleBar.setName(this.moduleNameList.myTroops + "." + iter + "." + this.moduleNameList.titleBar);
            myTitleBar.setAnchorPoint(0, 0);
            myTitleBar.setVisible(false);
            this.addChild(myTitleBar);
            var myTitle = new cc.Sprite();
            myTitle.setAnchorPoint(0, 0);
            myTitle.setPosition(0, 0);
            myTitle.setName(this.moduleNameList.unitTitle);
            myTitleBar.addChild(myTitle);
        }
    },

    addRunButton : function(size, scale) {
        var runButton = new cc.Sprite();
        runButton.setPosition(1750, size.height / 2);
        this.runButton = runButton;
        this.addChild(runButton);
    },

    resumeLayer : function(unit) {
        if (unit) {
            this.myTroops[unit.serial] = unit;
            this.getParent().getChildByName(this.getParent().moduleNameList.configLayer).resetUnit();
            var button = this.getChildByName(this.moduleNameList.myTroops + "." + unit.serial + "." + this.moduleNameList.unitButton);
            button.setTexture(res["UNIT_" + unit.unit]);
            var titleBar = this.getChildByName(this.moduleNameList.myTroops + "." + unit.serial + "." + this.moduleNameList.titleBar);
            titleBar.getChildByName(this.moduleNameList.unitTitle).setTexture(res["TITLE_" + unit.title]);
            titleBar.setVisible(true);

            console.log("my troops----------------------------");
            console.log(this.myTroops);

            this.toSetBlankUnit();
        }
    },

    toSetBlankUnit : function() {
        var blankNum = null;
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            if (this.myTroops[iter] == null) {
                blankNum = iter;
                break;
            }
        }
        if (blankNum != null) {
            this._changeBlankUnitImage(blankNum);
            var unit = new Unit();
            unit.faction = this.faction;
            unit.serial = blankNum;
            var sceneNode = this.getParent();
            var configLayer = sceneNode.getChildByName(sceneNode.moduleNameList.configLayer);
            console.log("motive config...");
            configLayer.motiveLayer(unit);
        }
    },

    _changeBlankUnitImage : function(num) {
        this.myUnitsButtons[num].setTexture(res.UNIT_ON);
        this.getChildByName(this.moduleNameList.myTroops + "." + num + "." + this.moduleNameList.titleBar).setVisible(false);
        for (var iter in this.myUnitsButtons) {
            if (iter != num && this.myTroops[iter] == null) {
                this.myUnitsButtons[iter].setTexture(res.UNIT_OFF);
            }
        }
    },

    loadFaction : function(faction) {
        this.faction = faction;
        var layer = this;

        var globalSize = cc.director.getWinSize();
        this.getChildByName(this.moduleNameList.backGround).drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), this.backGroundColor[this.faction]);

        messageSocket.send(layer.faction);
        messageSocket.onmessage = function(data) {
            switch (data.data) {
                case armyTemplate.faction.attackFaction : {
                    if (layer.runButton.getName() !== layer.moduleNameList.runButton) {
                        layer.runButton.setName(armyTemplate.faction.defenceFaction);
                        layer.runButton.setScale(1, 1);
                        layer.runButton.setTexture(res.DFC_FACTION);
                    }
                    break;
                }
                case armyTemplate.faction.defenceFaction : {
                    if (layer.runButton.getName() !== layer.moduleNameList.runButton) {
                        layer.runButton.setName(armyTemplate.faction.attackFaction);
                        layer.runButton.setScale(1, 1);
                        layer.runButton.setTexture(res.ATK_FACTION);
                    }
                    break;
                }
                case messageCode.TROOP_CONFIG_READY : {
                    console.log(data.data + " ready to run...");
                    layer.runButton.setName(layer.moduleNameList.runButton);
                    layer.runButton.setScale(2, 2);
                    layer.runButton.setTexture(res.BUTTON_RUN);
                    break;
                }
                case messageCode.WAR_BEGIN : {
                    console.log("go to battle scene...");
                    cc.director.pushScene(new BattleScene());
                    break
                }
                default : {
                    console.log(data.data);
                    break;
                }
            }
        };

        this.toSetBlankUnit();
    },

    wipeTroops : function() {
        this.myTroops = new Array(10);
    },

    onEnter : function() {
        this._super();

        function getUnitIter(name) {
            var dot1 = name.indexOf(".");
            var dot2 = name.indexOf(".", dot1 + 1);
            return Number(name.slice(dot1 + 1, dot2));
        }
        var layer = this;
        this.unitListener = cc.EventListener.create({
            event :  cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                return cc.rectContainsPoint(rect, pos);
            },
            onTouchMoved : function(touch, event) {
                return true;
            },
            onTouchEnded : function(touch, event) {
                // 在这里统一将敌我单位数量视作10
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    var iter = getUnitIter(target.getName());
                    var unit = new Unit();
                    unit.faction = this.faction;
                    unit.serial = iter;
                    layer._changeBlankUnitImage(iter);
                    var sceneNode = layer.getParent();
                    var configLayer = sceneNode.getChildByName(sceneNode.moduleNameList.configLayer);
                    configLayer.motiveLayer(unit);
                    return true;
                }
                return false;
            }
        });
        for (var iter = 0; iter < this.myUnitsButtons.length; iter++) {
            cc.eventManager.addListener(this.unitListener.clone(), this.myUnitsButtons[iter]);
        }

        this.runButtonListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    return true;
                }
                return false;
            },
            onTouchMoved : function(touch, event) {
                return true;
            },
            onTouchEnded : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    console.log("click");
                    var targetName = target.getName();
                    var troopMsg = new FactionTroopMessage();
                    troopMsg.faction = layer.faction;
                    troopMsg.troops = layer.myTroops;
                    messageSocket.send(JSON.stringify(troopMsg));
                    var configScene = new ConfigScene();
                    configScene.setFaction(targetName);
                    if (targetName === armyTemplate.faction.attackFaction || targetName === armyTemplate.faction.defenceFaction) {
                        messageSocket.send("config " + targetName);
                        cc.director.pushScene(configScene);
                    } else if (targetName === messageCode.TROOP_CONFIG_READY) {
                        console.log("ready to war!!!");
                    }
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.runButtonListener, this.runButton);
    },

    onExit : function() {
        this._super();
        cc.eventManager.removeAllListeners();
    }
});