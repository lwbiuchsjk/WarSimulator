var UnitsDisplayLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        myUnit : "myUnit",
        enemyUnit : "enemyUnit",
        myUnitsMenu : "myUnitsMenu",
        enemyUnitsMenu : "enemyUnitsMenu",
        myTroops : "myTroops",
        enemyTroops : "enemyTroops"
    },

    unitListener : null,
    myUnitsButtons : new Array(10),     // buttons与troops的长度应该相等
    enemyUnitsButtons : new Array(10),

    myTroops : new Array(10),           // FLAG = "myTroops" + "." + NUMBER
    enemyTroops : new Array(10),        // FLAG = "enemyTroops" + "." + NUMBER

    configUnit : null,

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
        /*
        this.addSeqMenu(globalScale);
        this.addHeavyInfantryMenu(globalScale);
        this.addLightInfantryMenu(globalScale);
        this.addHeavyCavalvyMenu(globalScale);
        this.addLightCavalvyMenu(globalScale);
        this.addRankMenu(globalScale);
        this.addLifeMenu(globalScale);
        this.addPositionMenu(globalScale);
        this.showOutput(globalScale);
        */
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

    setUnitFromFlag : function(string, unit) {
        var point = string.indexOf(".");
        var target = string.slice(0, point);
        var number = string.slice(point + 1, string.length);
        this[target][number] = unit;
    },

    getUnitButtonFromFlag : function(string) {
        var point = string.indexOf(".");
        var target = string.slice(0, point);
        var number = string.slice(point + 1, string.length);
        switch (target) {
            case this.moduleNameList.myTroops : {
                return this.myUnitsButtons[number];
            }
            case this.moduleNameList.enemyTroops : {
                return this.enemyUnitsButtons[number];
            }
        }
    },

    setUnitFlag : function(string) {
        this.configUnit = string;
    },

    eraseUnitFlag : function() {
        this.configUnit = null;
    },

    resumeLayer : function(unit) {
        this.setUnitFromFlag(this.configUnit, unit);
        this.getUnitButtonFromFlag(this.configUnit).setTexture(res.UNIT_DONE);
        this.eraseUnitFlag();
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
    },

    onEnter : function() {
        this._super();

        var layer = this;

        this.unitListener = cc.EventListener.create({
            event :  cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : false,
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
                    for (var iter = 0; iter < layer.myUnitsButtons.length; iter++) {
                        var myButton = layer.myUnitsButtons[iter];
                        if (myButton !== target && layer.myTroops[iter] == null)
                            myButton.setTexture(res.UNIT_OFF);
                        else
                            layer.setUnitFlag(layer.moduleNameList.myTroops + "." + iter);
                    }
                    for (var iter  = 0; iter < layer.enemyUnitsButtons.length; iter++) {
                        var enemyButton = layer.enemyUnitsButtons[iter];
                        if (enemyButton !== target && layer.enemyTroops[iter] == null)
                            enemyButton.setTexture(res.UNIT_OFF);
                        else
                            layer.setUnitFlag(layer.moduleNameList.enemyTroops + "." + iter);
                    }

                    var sceneNode = layer.getParent();
                    var configLayer = sceneNode.getChildByName(sceneNode.moduleNameList.configLayer);
                    configLayer.setVisible(true);
                    configLayer.motiveLayer();
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
    },

    onExit : function() {
        this._super();
    }
});