var UnitsDisplayLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        /*
         * 以下为敌我标识
         */
        myTroops : "myTroops",
        enemyTroops : "enemyTroops",
        /*
         * 以下name属性实现为faction.iter.property
         * 其中
         * faction = myTroops|enemyTroops
         * iter为数组下标
         * property = unitButton|unitTitle|titleBar
         */
        unitButton : "myUnit",
        unitTitle : "unitTitle",
        titleBar : "titleBar",

        runButton : "runButton",
    },

    unitListener : null,
    runButtonListener : null,
    myUnitsButtons : new Array(10),     // buttons与troops的长度应该相等
    enemyUnitsButtons : new Array(10),

    myTroops : new Array(10),           // FLAG = "myTroops" + "." + NUMBER
    enemyTroops : new Array(10),        // FLAG = "enemyTroops" + "." + NUMBER

    configUnit : null,
    emptyUnitCount : 19,

    testLength : 0,         // 修改此处来处理测试长度，0为正式游戏，双方共有10单位兵种

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
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(200, 200, 200));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
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
            myTitle.setPosition(myTitleBar.x, myTitleBar.y);
            myTitle.setName(this.moduleNameList.myTroops + "." + iter + "." + this.moduleNameList.unitTitle);
            this.addChild(myTitle);
        }
        for(var iter = 0; iter < this.enemyUnitsButtons.length; iter++) {
            var enemyPalUnit = new cc.Sprite(res.UNIT_ON);
            enemyPalUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            enemyPalUnit.y = yEnmyStart * scale;
            enemyPalUnit.setScale(scale, scale);
            enemyPalUnit.setAnchorPoint(0, 0);
            this.enemyUnitsButtons[iter] = enemyPalUnit;
            enemyPalUnit.setName(this.moduleNameList.enemyTroops + "." + iter + "." + this.moduleNameList.unitButton );
            this.addChild(enemyPalUnit);

            //////////////////////////////////////////////////
            // title显示元素
            var enemyTitleBar = new cc.DrawNode();
            enemyTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, titleHeight), cc.color(255, 255, 255), 0);
            enemyTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart + unitWidth);
            enemyTitleBar.setName(this.moduleNameList.enemyTroops + "." + iter + "." + this.moduleNameList.titleBar);
            enemyTitleBar.setAnchorPoint(0, 0);
            this.addChild(enemyTitleBar);
            enemyTitleBar.setVisible(false);
            var enemyTitle = new cc.Sprite();
            enemyTitle.setAnchorPoint(0, 0);
            enemyTitle.setPosition(enemyTitleBar.x, enemyTitleBar.y);
            enemyTitle.setName(this.moduleNameList.enemyTroops + "." + iter + "." + this.moduleNameList.unitTitle);
            this.addChild(enemyTitle);
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
        this[unit.faction][unit.serial] = unit;
        var button = this.getChildByName(unit.faction + "." + unit.serial + "." + this.moduleNameList.unitButton);
        button.setTexture(res["UNIT_" + unit.unit]);
        var title = this.getChildByName(unit.faction + "." + unit.serial + "." + this.moduleNameList.unitTitle);
        var titleBar = this.getChildByName(unit.faction + "." + unit.serial + "." + this.moduleNameList.titleBar);
        title.setTexture(res["TITLE_" + unit.title]);
        titleBar.setVisible(true);
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
            cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.runButton));
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
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.runButton), true);
    },

    onExit : function() {
        this._super();
        cc.eventManager.removeAllListeners();
    }
});