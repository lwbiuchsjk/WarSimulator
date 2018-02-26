var ShowUnitsLayer = cc.Layer.extend({
    sprite : null,
    moduleNameList : {
        myTroops : "myTroops",
        enemyTroops : "enemyTroops",
        calculateMenu : "calculateMenu",
        /*
         * 为了区分敌我，以下标签在使用中会遵循以下规则：
         * faction.iter.info
         * 其中
         * faction = myTroops|enemyTroops
         * iter为索引时数组下标
         * info = attackInfo|defenceInfo|lifeInfo
         */
        attackInfo : "attackInfo",
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
        var unitImageScale = 1;

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
        var fontSize = 40,
            lifeFontSize = 100;
        var normalLifeColor = cc.color(125, 125, 125);
        var layer = this;
        for(var iter = 0; iter < this.myTroops.length; iter++) {
            //////////////////////////////////////////////////
            // unit本体
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

            if (myUnit != null) {
                ////////////////////////////////////////////
                // attackBattle显示元素
                var myAttackBar = new cc.DrawNode();
                myAttackBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 0, 0), 0);
                myAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight + titleBarHeight);
                this.addChild(myAttackBar);
                var myAttackString = new cc.LabelTTF(
                    this.damageCalculator.getAttackBasis(myUnit),
                    cc.size(myAttackBar.width, myAttackBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                myAttackString.setPosition(myAttackBar.x + unitWidth / 2, myAttackBar.y + attackBarHeight / 2);
                myAttackString.setName(this.moduleNameList.attackInfo + "." + this.moduleNameList.myTroops + "." + iter);
                this.addChild(myAttackString);

                ////////////////////////////////////////////////
                // title显示元素
                var myTitleBar = new cc.DrawNode();
                myTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                myTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight);
                layer.addChild(myTitleBar);
                var myTitle = new cc.Sprite(res["TITLE_" + layer.myTroops[iter].title]);
                myTitle.setAnchorPoint(0, 0);
                myTitle.setPosition(myTitleBar.x, myTitleBar.y);
                layer.addChild(myTitle);

                /////////////////////////////////////////////////
                // defenceBattle显示元素
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
                myDefenceString.setName(this.moduleNameList.defenceInfo + "." + this.moduleNameList.myTroops + "." + iter);
                layer.addChild(myDefenceString);

                //////////////////////////////////////////////////
                // life显示元素
                var myLife = new cc.LabelTTF();
                myLife.setString(myUnit.life);
                myLife.setFontSize(lifeFontSize);
                myLife.setPosition(xStart + (unitWidth + unitInterval) * iter + unitWidth / 2, yMeStart + unitHeight / 2);
                myLife.setColor(normalLifeColor);
                myLife.setName(this.moduleNameList.lifeInfo + "." + this.moduleNameList.myTroops + "." + iter);
                this.addChild(myLife);
            }
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

            if (enemyUnit != null) {
                ////////////////////////////////////////////////
                // attackBattle显示元素
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
                enemyAttackString.setName(this.moduleNameList.attackInfo + "." + this.moduleNameList.enemyTroops + "." + iter);
                layer.addChild(enemyAttackString);

                //////////////////////////////////////////////////
                // title显示元素
                var enemyTitleBar = new cc.DrawNode();
                enemyTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                enemyTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - titleBarHeight);
                layer.addChild(enemyTitleBar);
                var enemyTitle = new cc.Sprite(res["TITLE_ON_" + layer.enemyTroops[iter].title]);
                enemyTitle.setAnchorPoint(0, 0);
                enemyTitle.setPosition(enemyTitleBar.x, enemyTitleBar.y);
                layer.addChild(enemyTitle);

                ////////////////////////////////////////////////////
                // defenceBattle显示元素
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
                enemyDefenceString.setName(this.moduleNameList.defenceInfo + "." + this.moduleNameList.enemyTroops + "." + iter);
                layer.addChild(enemyDefenceString);

                //////////////////////////////////////////////////
                // life显示元素
                var enemyLife = new cc.LabelTTF();
                enemyLife.setString(enemyUnit.life);
                enemyLife.setFontSize(lifeFontSize);
                enemyLife.setPosition(xStart + (unitWidth + unitInterval) * iter + unitWidth / 2, yEnmyStart + unitHeight / 2);
                enemyLife.setColor(normalLifeColor);
                enemyLife.setName(this.moduleNameList.lifeInfo + "." + this.moduleNameList.enemyTroops + "." + iter);
                this.addChild(enemyLife);
            }
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
        parentNode.getChildByName(parentNode.moduleNameList.outputLayer).loadOutput(defence, attack);
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

    onPushLayer : function(output) {
        this.setVisible(true);

        ////////////////////////////////////////////
        // 从battleLayer返回需要执行下列内容
        if (output !== undefined && typeof output === 'object' && this.damageCalList.length > 0) {
            this.getChildByName(this.moduleNameList.calculateMenu).setVisible(true);
            this.damageCalList.push(output);
            console.log(this.damageCalList);
        }
        else
            this.resetShow();

        ////////////////////////////////////////////////
        // 从outputLayer返回需要执行下列内容
        // 将计算结果重载回myTroops和enemyTroops
        if (output instanceof Array) {
            for (var iter = 0; iter < output.length; iter++) {
                var unit = output[iter];
                this[unit.faction][unit.serial] = unit;
            }
        }

        /////////////////////////////////////////////////
        // 通用，唤醒非空白组件的监听器
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