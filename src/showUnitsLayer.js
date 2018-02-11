var ShowUnitsLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        myTroops : "myTroops",
        enemyTroops : "enemyTroops",
        calculateMenu : "calculateMenu",
    },

    myTroops : null,
    enemyTroops : null,
    damageCalList : [],       // 用于存储当前伤害计算序列。第一个都是防御方。

    ctor : function(mines, enemies) {
        this._super();

        this.myTroops = mines;
        this.enemyTroops = enemies;

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
        var unitWidth = 150, unitHeight = 200, unitInterval = 30,
            xStart = 75, yMeStart = 215, yEnmyStart = size.height - yMeStart - unitHeight;
        for(var iter = 0; iter < this.myTroops.length; iter++) {
            var myUnit = this.myTroops[iter];
            //var myPaleUnit = new cc.Sprite(res["UNIT_" + myUnit.unit]);
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
            //myPaleUnit.setScale(imageScale, imageScale);
            myPaleUnit.setAnchorPoint(0, 0);
            //this.myUnitsButtons[iter] = myPaleUnit;
            myPaleUnit.setName(this.moduleNameList.myTroops + "." + iter);
            this.addChild(myPaleUnit);
        }
        for(var iter = 0; iter < this.enemyTroops.length; iter++) {
            var enemyUnit = this.enemyTroops[iter];
            //var enemyPalUnit = new cc.Sprite(res["UNIT_" + enemyUnit.unit]);
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
            //enemyPalUnit.setScale(imageScale, imageScale);
            enemyPalUnit.setAnchorPoint(0, 0);
            //this.enemyUnitsButtons[iter] = enemyPalUnit;
            enemyPalUnit.setName(this.moduleNameList.enemyTroops + "." + iter);
            this.addChild(enemyPalUnit);
        }
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
        var calculator = new DamageCalculator(this.damageCalList);

        var damageList = calculator.getDamage(calculator.attackList, calculator.defenceUnit);
        console.log(damageList);
        var defence = damageList[damageList.length - 1];
        var attack = damageList[0];

        var parentNode = this.getParent();
        parentNode.getChildByName(parentNode.moduleNameList.battleLayer).eraseUnits();
        this.onPopLayer();
        parentNode.getChildByName(parentNode.moduleNameList.outputLayer).loadOutput(defence, attack, defence.damage, attack.damage);
    },

    onPushLayer : function(unit) {
        this.setVisible(true);
        this.getChildByName(this.moduleNameList.calculateMenu).setVisible(true);
        this.damageCalList.push(unit);
        console.log(this.damageCalList);

        for (var iter = 0; iter < this.myTroops.length; iter++) {
            cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.myTroops + "." + iter));
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.enemyTroops + "." + iter));
        }
    },

    onPopLayer : function() {
        for (var iter = 0; iter < this.myTroops.length; iter++) {
            cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.myTroops + "." + iter), true);
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
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
                        unit.status = armyTemplate.status.ATTACK;
                        battleLayer.loadAttackUnit(unit);
                        layer.onPopLayer();
                        battleLayer.onPushLayer();
                    }
                    console.log(layer.damageCalList);
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(unitListener, this.getChildByName(this.moduleNameList.myTroops + "." + 0));
        for (var iter = 1; iter < this.myTroops.length; iter++) {
            cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.myTroops + "." + iter));
        }
        for (var iter = 0; iter < this.enemyTroops.length; iter++) {
            cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.enemyTroops + "." + iter));
        }
    },

    onExit : function() {
        this._super();
    }
});