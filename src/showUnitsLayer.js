var ShowUnitsLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        myTroops : "myTroops",
        enemyTroops : "enemyTroops",
        calculateMenu : "calculateMenu",
        attackInfo : "attackInfo",              // 为了区分敌我，作为名字时，这些info信息前都会添加myTroops/enemyTroops
        defenceInfo : "defenceInfo",
        lifeInfo : "lifeInfo",
    },

    myTroops : null,
    enemyTroops : null,
    damageCalList : [],       // 用于存储当前伤害计算序列。第一个都是防御方。
    damageCalculator : null,

    ctor : function(mines, enemies) {
        this._super();

        this.myTroops = mines;
        this.enemyTroops = enemies;
        this.damageCalculator = new DamageCalculator();

        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 0.3;

        ////////////////////////////////////
        // 背景
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        this.addUnitsMenu(globalSize, globalScale, unitImageScale);
        this.addOutputMenu(globalSize, globalScale, unitImageScale);
        return true;
    },

    addUnitsMenu : function(size, scale, imageScale) {
        var unitWidth = 150, unitHeight = 150, unitInterval = 30,
            xStart = 75, yMeStart = 190, yEnmyStart = size.height - yMeStart - unitHeight,
            attackBarHeight = 50, defenceBarHeight = 50, titleBarHeight = 50;
        var fontSize = 40;
        var layer = this;
        for(var iter = 0; iter < this.myTroops.length; iter++) {
            var myUnit = this.myTroops[iter];
            var myPaleUnit = null;
            if (myUnit == null) {
                myPaleUnit = new cc.Sprite(res.UNIT_ON);
                myPaleUnit.setScale(scale, scale);
            }
            else {
                myPaleUnit = new cc.Sprite(res["UNIT_" + myUnit.unit]);
                myPaleUnit.setScale(imageScale, imageScale);
            }
            myPaleUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            myPaleUnit.y = yMeStart * scale;
            myPaleUnit.setAnchorPoint(0, 0);
            myPaleUnit.setName(this.moduleNameList.myTroops + "." + iter);
            this.addChild(myPaleUnit);
        }
        for(var iter = 0; iter < this.enemyTroops.length; iter++) {
            var enemyUnit = this.enemyTroops[iter];
            var enemyPalUnit = null;
            if (enemyUnit == null) {
                enemyPalUnit = new cc.Sprite(res.UNIT_ON);
                enemyPalUnit.setScale(scale, scale);
            }
            else {
                enemyPalUnit = new cc.Sprite(res["UNIT_" + enemyUnit.unit]);
                enemyPalUnit.setScale(imageScale, imageScale);
            }
            enemyPalUnit.x = (xStart + iter * (unitWidth + unitInterval)) * scale;
            enemyPalUnit.y = yEnmyStart * scale;
            enemyPalUnit.setAnchorPoint(0, 0);
            enemyPalUnit.setName(this.moduleNameList.enemyTroops + "." + iter);
            this.addChild(enemyPalUnit);
        }

        function addAttackElement() {
            for(var iter = 0; iter < layer.myTroops.length; iter++) {
                if (layer.myTroops[iter] != null) {
                    var myAttackBar = new cc.DrawNode();
                    myAttackBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 0, 0), 0);
                    myAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight + titleBarHeight);
                    layer.addChild(myAttackBar);
                    var myAttackString = new cc.LabelTTF(
                        layer.damageCalculator.getAttackBasis(layer.myTroops[iter]),
                        cc.size(myAttackBar.width, myAttackBar.height), fontSize,
                        cc.TEXT_ALIGNMENT_CENTER,
                        cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                    );
                    myAttackString.setPosition(myAttackBar.x + unitWidth / 2, myAttackBar.y + attackBarHeight / 2);
                    myAttackString.setName(layer.moduleNameList.myTroops + layer.moduleNameList.attackInfo + iter);
                    layer.addChild(myAttackString);
                }
            }
            for(var iter = 0; iter < layer.enemyTroops.length; iter++) {
                if (layer.enemyTroops[iter] != null) {
                    var enemyAttackBar = new cc.DrawNode();
                    enemyAttackBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 0, 0), 0);
                    enemyAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - attackBarHeight - titleBarHeight);
                    layer.addChild(enemyAttackBar);
                    var enemyAttackString = new cc.LabelTTF(
                        layer.damageCalculator.getAttackBasis(layer.enemyTroops[iter]),
                        cc.size(enemyAttackBar.width, enemyAttackBar.height), fontSize,
                        cc.TEXT_ALIGNMENT_CENTER,
                        cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                    );
                    enemyAttackString.setPosition(enemyAttackBar.x + unitWidth / 2, enemyAttackBar.y + attackBarHeight / 2);
                    enemyAttackString.setName(layer.moduleNameList.enemyTroops + layer.moduleNameList.attackInfo + iter);
                    layer.addChild(enemyAttackString);
                }
            }
        }
        function addTitleElement() {
            for(var iter = 0; iter < layer.myTroops.length; iter++) {
                if (layer.myTroops[iter] != null) {
                    var myTitleBar = new cc.DrawNode();
                    myTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                    myTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight);
                    layer.addChild(myTitleBar);
                    var myTitle = new cc.Sprite(res["TITLE_" + layer.myTroops[iter].title]);
                    myTitle.setAnchorPoint(0, 0);
                    myTitle.setPosition(myTitleBar.x, myTitleBar.y);
                    //myAttackString.setName(layer.moduleNameList.myTroops + layer.moduleNameList.attackInfo + iter);
                    layer.addChild(myTitle);
                }
            }
            for(var iter = 0; iter < layer.enemyTroops.length; iter++) {
                if (layer.enemyTroops[iter] != null) {
                    var enemyTitleBar = new cc.DrawNode();
                    enemyTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                    enemyTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - titleBarHeight);
                    layer.addChild(enemyTitleBar);
                    var enemyTitle = new cc.Sprite(res["TITLE_ON_" + layer.enemyTroops[iter].title]);
                    enemyTitle.setAnchorPoint(0, 0);
                    enemyTitle.setPosition(enemyTitleBar.x, enemyTitleBar.y);
                    //enemyTitle.setName(layer.moduleNameList.enemyTroops + layer.moduleNameList.attackInfo + iter);
                    layer.addChild(enemyTitle);
                }
            }
        }
        function addDefenceElement() {
            for(var iter = 0; iter < layer.myTroops.length; iter++) {
                if (layer.myTroops[iter] != null) {
                    var myDefenceBar = new cc.DrawNode();
                    myDefenceBar.drawRect(cc.p(0, 0), cc.p(unitWidth, defenceBarHeight), cc.color(75, 172, 198), 0);
                    myDefenceBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart - defenceBarHeight);
                    layer.addChild(myDefenceBar);
                    var myDefenceString = new cc.LabelTTF(
                        layer.damageCalculator.getDefenceBasis(layer.myTroops[iter]),
                        cc.size(myDefenceBar.width, myDefenceBar.height), fontSize,
                        cc.TEXT_ALIGNMENT_CENTER,
                        cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                    );
                    myDefenceString.setPosition(myDefenceBar.x + unitWidth / 2, myDefenceBar.y + defenceBarHeight / 2);
                    myDefenceString.setName(layer.moduleNameList.myTroops + layer.moduleNameList.defenceInfo + iter);
                    layer.addChild(myDefenceString);
                }
            }
            for(var iter = 0; iter < layer.enemyTroops.length; iter++) {
                if (layer.enemyTroops[iter] != null) {
                    var enemyDefenceBar = new cc.DrawNode();
                    enemyDefenceBar.drawRect(cc.p(0, 0), cc.p(unitWidth, defenceBarHeight), cc.color(75, 172, 198), 0);
                    enemyDefenceBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart + unitHeight);
                    layer.addChild(enemyDefenceBar);
                    var enemyDefenceString = new cc.LabelTTF(
                        layer.damageCalculator.getDefenceBasis(layer.enemyTroops[iter]),
                        cc.size(enemyDefenceBar.width, enemyDefenceBar.height), fontSize,
                        cc.TEXT_ALIGNMENT_CENTER,
                        cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                    );
                    enemyDefenceString.setPosition(enemyDefenceBar.x + unitWidth / 2, enemyDefenceBar.y + defenceBarHeight / 2);
                    enemyDefenceString.setName(layer.moduleNameList.enemyTroops + layer.moduleNameList.defenceInfo + iter);
                    layer.addChild(enemyDefenceString);
                }
            }

        }

        addAttackElement();
        addTitleElement();
        addDefenceElement();
    },

    addOutputMenu : function(size, scale, imageScale) {
        var calculateButton = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.BUTTON_RUN, res.BUTTON_RUN_GO
            ),
            this.outputCallback,
            this
        );

        calculateButton.setPosition(size.width / 2, size.height / 2);
        calculateButton.setScale(2.5, 2.5);
        var calculateMenu = new cc.Menu(calculateButton);
        calculateMenu.setPosition(0, 0);
        calculateMenu.setName(this.moduleNameList.calculateMenu);
        calculateMenu.setVisible(false);
        this.addChild(calculateMenu);
    },

    outputCallback : function() {
        /*
         * 通过这个回调函数打开outputLayer
         * 另外，在该函数中还要讲damageCalList清空，以便从outputLayer调用本layer的onPushLayer时，可以重置界面元素。
         */
        this.damageCalculator.loadDefenceUnit(this.damageCalList[0]);
        this.damageCalculator.loadAttackList(this.damageCalList.slice(1, this.damageCalList.length));
        this.damageCalList = [];

        var damageList = this.damageCalculator.getDamage(this.damageCalculator.attackList, this.damageCalculator.defenceUnit);
        console.log(damageList);
        var defence = damageList[damageList.length - 1];
        var attack = damageList[0];

        var parentNode = this.getParent();
        parentNode.getChildByName(parentNode.moduleNameList.battleLayer).eraseUnits();
        this.onPopLayer();
        parentNode.getChildByName(parentNode.moduleNameList.outputLayer).loadOutput(defence, attack, defence.damage, attack.damage);
    },

    resetShow : function() {
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            if (this.myTroops[iter] != null)
                this.getChildByName(this.moduleNameList.myTroops + "." + iter).setTexture(res["UNIT_" + this.myTroops[iter].unit]);
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            if (this.enemyTroops[iter] != null)
                this.getChildByName(this.moduleNameList.enemyTroops + "." + iter).setTexture(res["UNIT_" + this.enemyTroops[iter].unit]);
        }
    },

    onPushLayer : function(unit) {
        this.setVisible(true);
        if (this.damageCalList.length > 0) {
            this.getChildByName(this.moduleNameList.calculateMenu).setVisible(true);
            this.damageCalList.push(unit);
            console.log(this.damageCalList);
        }
        else
            this.resetShow();
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            if (this.myTroops[iter] !== null && !this._inArray(this.myTroops[iter], this.damageCalList))
                cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.myTroops + "." + iter));
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            if (this.enemyTroops[iter] !== null && !this._inArray(this.enemyTroops[iter], this.damageCalList))
                cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.enemyTroops + "." + iter));
        }
    },

    _inArray : function(ele, array) {
        for (var iter in array) {
            if (ele === array[iter])
                return true;
        }
        return false;
    },

    onPopLayer : function() {
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            if (this.myTroops[iter] !== null)
                cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.myTroops + "." + iter), true);
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            if (this.enemyTroops[iter] !== null)
                cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.enemyTroops + "." + iter), true);
        }
        this.setVisible(false);
        this.getChildByName(this.moduleNameList.calculateMenu).setVisible(false);

        console.log("pop " + this.getName());
    },

    onEnter : function() {
        this._super();
        console.log("show units!");
        var layer = this;

        var unitListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
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
                function toParseArrayNumber(string) {
                    var point = string.indexOf(".");
                    return eval(string.slice(point + 1, string.length));
                }
                function toParesArray(string) {
                    var point = string.indexOf(".");
                    return string.slice(0, point);
                }

                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    var name = target.getName();
                    var unit = layer[toParesArray(name)][toParseArrayNumber(name)];
                    var parentNode = layer.getParent();
                    var battleLayer = parentNode.getChildByName(parentNode.moduleNameList.battleLayer);
                    if (layer.damageCalList.length === 0) {
                        unit.status = armyTemplate.status.DEFENCE;
                        unit.position = armyTemplate.position.FACE;
                        target.setTexture(res["UNIT_" + unit.unit + "_ON"]);
                        battleLayer.loadDefenceUnit(unit);
                        layer.damageCalList.push(unit);
                    } else if (unit !== battleLayer.defenceUnit) {
                        target.setTexture(res["UNIT_ATTACK_" + unit.unit]);
                        unit.status = armyTemplate.status.ATTACK;
                        battleLayer.loadAttackUnit(unit);
                        layer.onPopLayer();
                        battleLayer.onPushLayer();
                    }
                    return true;
                }
                return false;
            }
        });
        //cc.eventManager.addListener(unitListener, this.getChildByName(this.moduleNameList.myTroops + "." + 0));
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            if (this.myTroops[iter] != null)
                cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.myTroops + "." + iter));
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            if (this.enemyTroops[iter] != null)
                cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.enemyTroops + "." + iter));
        }
    },

    onExit : function() {
        this._super();
    }
});