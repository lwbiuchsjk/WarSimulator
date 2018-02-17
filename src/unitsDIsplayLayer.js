var UnitsDisplayLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        myUnit : "myUnit",
        enemyUnit : "enemyUnit",
        myUnitsMenu : "myUnitsMenu",
        enemyUnitsMenu : "enemyUnitsMenu",
        myTroops : "myTroops",
        enemyTroops : "enemyTroops",
        runButton : "runButton",
    },

    unitListener : null,
    runButtonListener : null,
    myUnitsButtons : new Array(10),     // buttons与troops的长度应该相等
    enemyUnitsButtons : new Array(10),

    myTroops : new Array(10),           // FLAG = "myTroops" + "." + NUMBER
    enemyTroops : new Array(10),        // FLAG = "enemyTroops" + "." + NUMBER

    unitImageScale : 0.3,  // 在新图标上线前，暂用参数。

    configUnit : null,
    emptyUnitCount : 20,

    testLength : 17,         // 修改此处来处理测试长度

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
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        this.addUnitsMenu(globalSize, globalScale);
        this.addRunButton(globalSize, globalScale);
        return true;
    },

    addUnitsMenu : function(size, scale) {
        var unitWidth = 150, unitHeight = 200, unitInterval = 30,
            xStart = 75, yMeStart = 215, yEnmyStart = size.height - yMeStart - unitHeight;
        for(var iter = 0; iter < this.myUnitsButtons.length; iter++) {
            var myPaleUnit = new cc.Sprite(res.UNIT_ON);
            myPaleUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            myPaleUnit.y = yMeStart * scale;
            myPaleUnit.setScale(scale, scale);
            myPaleUnit.setAnchorPoint(0, 0);
            this.myUnitsButtons[iter] = myPaleUnit;
            myPaleUnit.setName(this.moduleNameList.myUnit + iter);
            this.addChild(myPaleUnit);
        }
        for(var iter = 0; iter < this.enemyUnitsButtons.length; iter++) {
            var enemyPalUnit = new cc.Sprite(res.UNIT_ON);
            enemyPalUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            enemyPalUnit.y = yEnmyStart * scale;
            enemyPalUnit.setScale(scale, scale);
            enemyPalUnit.setAnchorPoint(0, 0);
            this.enemyUnitsButtons[iter] = enemyPalUnit;
            enemyPalUnit.setName(this.moduleNameList.enemyUnit + iter);
            this.addChild(enemyPalUnit);
        }
    },

    addRunButton : function(size, scale) {
        var runButton = new cc.Sprite(res.BUTTON_RUN);
        runButton.setPosition(size.width / 2, size.height / 2);
        runButton.setScale(2.5, 2.5);
        runButton.setName(this.moduleNameList.runButton);
        runButton.setVisible(false);
        this.addChild(runButton);
    },

    resumeLayer : function(unit) {
        console.log(unit);
        var that = this;
        function _getUnitButtonFromFlag(faction, number) {
            switch (faction) {
                case that.moduleNameList.myTroops : {
                    return that.myUnitsButtons[number];
                }
                case that.moduleNameList.enemyTroops : {
                    return that.enemyUnitsButtons[number];
                }
            }
        }

        this[unit.faction][unit.serial] = unit;
        var button = _getUnitButtonFromFlag(unit.faction, unit.serial);
        button.setTexture(res["UNIT_" + unit.unit]);
        button.setScale(this.unitImageScale, this.unitImageScale);
        for (var iter = 0; iter < this.myUnitsButtons.length; iter++) {
            var myButton = this.myUnitsButtons[iter];
            if (this.myTroops[iter] == null) {
                myButton.setTexture(res.UNIT_ON);
                cc.eventManager.resumeTarget(myButton);
            }
        }
        for (var iter = 0; iter < this.enemyUnitsButtons.length; iter++) {
            var enemyButton = this.enemyUnitsButtons[iter];
            if (this.enemyTroops[iter] == null){
                enemyButton.setTexture(res.UNIT_ON);
                cc.eventManager.resumeTarget(enemyButton);
            }
        }

        if (this.emptyUnitCount > this.testLength) {
            this.emptyUnitCount--;
        }else {
            console.log("ready to run");
            this.getChildByName(this.moduleNameList.runButton).setVisible(true);
        }

        console.log("my troops----------------------------");
        console.log(this.myTroops);
        console.log("enemy troops-------------------------");
        console.log(this.enemyTroops);
    },

    onEnter : function() {
        this._super();

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
                    var unit = new Unit();
                    for (var iter = 0; iter < layer.myUnitsButtons.length; iter++) {
                        var myButton = layer.myUnitsButtons[iter];
                        if (myButton !== target && layer.myTroops[iter] == null)
                            myButton.setTexture(res.UNIT_OFF);
                        else if (myButton === target && layer.myTroops[iter] == null) {
                            // 首先确定unit的faction与serialNumber。这是myTroop。
                            unit.faction = layer.moduleNameList.myTroops;
                            unit.serial = iter;
                            console.log("chosen unit:" + myButton.getName());
                        }
                    }
                    for (var iter  = 0; iter < layer.enemyUnitsButtons.length; iter++) {
                        var enemyButton = layer.enemyUnitsButtons[iter];
                        if (enemyButton !== target && layer.enemyTroops[iter] == null)
                            enemyButton.setTexture(res.UNIT_OFF);
                        else if (enemyButton === target && layer.enemyTroops[iter] == null) {
                            // 首先确定unit的faction与serialNumber。这是enemyTroop。
                            unit.faction = layer.moduleNameList.enemyTroops;
                            unit.serial = iter;
                            console.log("chosen unit:" + enemyButton.getName());
                        }
                    }

                    var sceneNode = layer.getParent();
                    var configLayer = sceneNode.getChildByName(sceneNode.moduleNameList.configLayer);
                    configLayer.motiveLayer(unit);
                    for (var iter = 0; iter < layer.myUnitsButtons.length; iter++) {
                        cc.eventManager.pauseTarget(layer.myUnitsButtons[iter]);
                    }
                    for (var iter = 0; iter < layer.enemyUnitsButtons.length; iter++) {
                        cc.eventManager.pauseTarget(layer.enemyUnitsButtons[iter]);
                    }
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.unitListener, this.myUnitsButtons[0]);
        for (var iter = 1; iter < this.myUnitsButtons.length; iter++) {
            cc.eventManager.addListener(this.unitListener.clone(), this.myUnitsButtons[iter]);
        }
        for (var iter = 0; iter < this.enemyUnitsButtons.length; iter++) {
            cc.eventManager.addListener(this.unitListener.clone(), this.enemyUnitsButtons[iter]);
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
                    target.setTexture(res.BUTTON_RUN_GO);
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
                    cc.director.pushScene(new BattleScene(layer.myTroops, layer.enemyTroops));
                    //cc.director.replaceScene(cc.TransitionPageTurn(1, new BattleScene(layer.myTroops, layer.enemyTroops), false));
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.runButtonListener, this.getChildByName(this.moduleNameList.runButton))
    },

    onExit : function() {
        this._super();
        cc.eventManager.removeAllListeners();
    }
});