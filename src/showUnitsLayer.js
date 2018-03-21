var ShowUnitsLayer = cc.Layer.extend({
    /*
     * 在双人同屏设定中，defenceFaction在下方，背景颜色为蓝色；attackFaction在上方，背景颜色为红色。
     * 在双人远程设定中，myTroops在下方；enemyTroops在上方。
     */
    sprite : null,
    moduleNameList : {
        backGround : "backGround",
        defenceFaction : "defenceFaction",
        attackFaction : "attackFaction",
        calculateMenu : "calculateMenu",
        /*
         * 为了区分敌我，以下标签在使用中会遵循以下规则：
         * faction.iter.info
         * 其中
         * faction = defenceFaction|attackFaction
         * iter为索引时数组下标，也就是unit.serial
         * info = attackInfo|defenceInfo|lifeInfo
         */
        attackInfo : "attackInfo",
        defenceInfo : "defenceInfo",
        lifeInfo : "lifeInfo",
        showLifeInfo : "showLifeInfo",
        /*
         * 以下attackFaction与defenceFaction各有一个，命名规则为：
         * faction.buttonName
         */
        resetButton : "resetButton",    // 用于重置damageCalList中的对应部分
        goCalButton : "goCalButton",    // 用于双方确认
        /*
         * 以下用于展示attack/defence动作，命名规则为：
         * status.showElement。
         * 其中status = armyTemplaye.status.ATTACK | armyTemplate.status.DEFNECE
         * showElement = showBar | showUnit
         */
        showBar : "showBar",
        showUnit : "showUnit",
    },

    backGroundColor : {
        attackFaction : cc.color(217, 150, 144),
        defenceFaction : cc.color(147, 205, 221)
    },

    defenceFaction : null,
    attackFaction : null,
    damageCalList : null,
    damageCalculator : null,
    GO_CAL_FLAG : {},

    ctor : function(mines, enemies) {
        this._super();

        mines == null ? this.defenceFaction = mines : 1;
        enemies == null ? this.attackFaction = enemies : 1;
        this.damageCalculator = new DamageCalculator();

        var globalSize = cc.director.getWinSize();

        ////////////////////////////////////
        // 背景
        var bg_attack = new cc.DrawNode();
        var bg_defence = new cc.DrawNode();
        bg_attack.drawRect(cc.p(0, globalSize.height / 2), cc.p(globalSize.width, globalSize.height), this.backGroundColor.attackFaction);
        bg_attack.setAnchorPoint(0.5, 0.5);
        bg_attack.setPosition(0, 0);
        bg_defence.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height / 2), this.backGroundColor.defenceFaction);
        bg_defence.setAnchorPoint(0.5, 0.5);
        bg_defence.setPosition(0, 0);
        this.addChild(bg_attack);
        this.addChild(bg_defence);

        return true;
    },

    addUnitsMenu : function(size, scale, imageScale) {
        console.log(this.attackFaction);
        console.log(this.defenceFaction);
        var unitWidth = 150, unitHeight = 150, unitInterval = 10,
            xStart = 155, yMeStart = 90, yEnmyStart = size.height - yMeStart - unitHeight,
            attackBarHeight = 50, defenceBarHeight = 50, titleBarHeight = 50,
            showEleHeight = 100, showEleWidth = 50;
        var showAttackColor = cc.color(98, 39, 33),
            showDefenceColor = cc.color(33, 89, 104),
            showLifeColor = cc.color(0, 0, 0);
        var fontSize = 40,
            lifeFontSize = 100;
        var normalLifeColor = cc.color(125, 125, 125);
        var layer = this;
        for(var iter = 0; iter < this.defenceFaction.length; iter++) {
            //////////////////////////////////////////////////
            // unit本体
            var myUnit = this.defenceFaction[iter];
            var myPaleUnit = null;
            if (myUnit == null) {
                myPaleUnit = new cc.Sprite(res.UNIT_ON);
                myPaleUnit.setScale(scale, scale);
            }
            else {
                myPaleUnit = new cc.Sprite(res["UNIT_" + myUnit.unit]);
                myPaleUnit.setScale(imageScale, imageScale);
            }
            myPaleUnit.x = (xStart + unitWidth / 2 + iter * (unitWidth + unitInterval)) * scale;
            myPaleUnit.y = (yMeStart + unitHeight / 2) * scale;
            myPaleUnit.setName(this.moduleNameList.defenceFaction + "." + iter);
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
                myAttackString.setName(this.moduleNameList.attackInfo + "." + this.moduleNameList.defenceFaction + "." + iter);
                this.addChild(myAttackString);

                ////////////////////////////////////////////////
                // title显示元素
                var myTitleBar = new cc.DrawNode();
                myTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                myTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight);
                layer.addChild(myTitleBar);
                var myTitle = new cc.Sprite(res["TITLE_" + layer.defenceFaction[iter].title]);
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
                    layer.damageCalculator.getDefenceBasis(layer.defenceFaction[iter]),
                    cc.size(myDefenceBar.width, myDefenceBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                myDefenceString.setPosition(myDefenceBar.x + unitWidth / 2, myDefenceBar.y + defenceBarHeight / 2);
                myDefenceString.setName(this.moduleNameList.defenceInfo + "." + this.moduleNameList.defenceFaction + "." + iter);
                layer.addChild(myDefenceString);

                //////////////////////////////////////////////////
                // life显示元素
                var myLife = new cc.LabelTTF();
                myLife.setString(myUnit.life);
                myLife.setFontSize(lifeFontSize);
                myLife.setPosition(xStart + (unitWidth + unitInterval) * iter + unitWidth / 2, yMeStart + unitHeight / 2);
                myLife.setColor(normalLifeColor);
                myLife.setName(this.moduleNameList.lifeInfo + "." + this.moduleNameList.defenceFaction + "." + iter);
                this.addChild(myLife);

                /////////////////////////////////////////////////////
                // show显示元素
                var showMyAttackBar = new cc.DrawNode();
                showMyAttackBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showAttackColor, 0);
                showMyAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yMeStart + unitHeight + attackBarHeight * 3);
                var showMyAttackString = new cc.LabelTTF(
                    myAttackString.getString(),
                    cc.size(showMyAttackBar.width, showMyAttackBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showMyAttackString.setPosition(showMyAttackBar.x + showEleWidth / 2, showMyAttackBar.y + showEleHeight / 2);
                showMyAttackString.setRotation(180, 180);
                this.addChild(showMyAttackBar);
                this.addChild(showMyAttackString);

                var showMyLifeBar = new cc.DrawNode();
                showMyLifeBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showLifeColor, 0);
                showMyLifeBar.setPosition(xStart + showEleWidth + (unitWidth + unitInterval) * iter, yMeStart + unitHeight + attackBarHeight * 3);
                var showMyLifeString = new cc.LabelTTF(
                    myLife.getString(),
                    cc.size(showMyLifeBar.width, showMyLifeBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showMyLifeString.setPosition(showMyLifeBar.x + showEleWidth / 2, showMyLifeBar.y + showEleHeight / 2);
                showMyLifeString.setRotation(180, 180);
                showMyLifeString.setName(this.moduleNameList.showLifeInfo + "." + this.moduleNameList.defenceFaction + "." + iter);
                this.addChild(showMyLifeBar);
                this.addChild(showMyLifeString);

                var showMyDefenceBar = new cc.DrawNode();
                showMyDefenceBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showDefenceColor, 0);
                showMyDefenceBar.setPosition(xStart + showEleWidth * 2 + (unitWidth + unitInterval) * iter, yMeStart + unitHeight + attackBarHeight * 3);
                var showMyDefenceString = new cc.LabelTTF(
                    myDefenceString.getString(),
                    cc.size(showMyDefenceBar.width, showMyDefenceBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showMyDefenceString.setPosition(showMyDefenceBar.x + showEleWidth / 2, showMyDefenceBar.y + showEleHeight / 2);
                showMyDefenceString.setRotation(180, 180);
                this.addChild(showMyDefenceBar);
                this.addChild(showMyDefenceString);
            }
        }
        for(var iter = 0; iter < this.attackFaction.length; iter++) {
            var enemyUnit = this.attackFaction[iter];
            var enemyPalUnit = null;
            if (enemyUnit == null) {
                enemyPalUnit = new cc.Sprite(res.UNIT_ON);
                enemyPalUnit.setScale(scale, scale);
            }
            else {
                enemyPalUnit = new cc.Sprite(res["UNIT_" + enemyUnit.unit]);
                enemyPalUnit.setScale(imageScale, imageScale);
            }
            enemyPalUnit.x = (xStart + unitWidth / 2 + iter * (unitWidth + unitInterval)) * scale;
            enemyPalUnit.y = (unitHeight / 2 + yEnmyStart) * scale;
            enemyPalUnit.setName(this.moduleNameList.attackFaction + "." + iter);
            enemyPalUnit.setRotation(180, 180);
            this.addChild(enemyPalUnit);

            if (enemyUnit != null) {
                ////////////////////////////////////////////////
                // attackBattle显示元素
                var enemyAttackBar = new cc.DrawNode();
                enemyAttackBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 0, 0), 0);
                enemyAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - attackBarHeight - titleBarHeight);
                layer.addChild(enemyAttackBar);
                var enemyAttackString = new cc.LabelTTF(
                    layer.damageCalculator.getAttackBasis(layer.attackFaction[iter]),
                    cc.size(enemyAttackBar.width, enemyAttackBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                enemyAttackString.setPosition(enemyAttackBar.x + unitWidth / 2, enemyAttackBar.y + attackBarHeight / 2);
                enemyAttackString.setRotation(180, 180);
                enemyAttackString.setName(this.moduleNameList.attackInfo + "." + this.moduleNameList.attackFaction + "." + iter);
                layer.addChild(enemyAttackString);

                //////////////////////////////////////////////////
                // title显示元素
                var enemyTitleBar = new cc.DrawNode();
                enemyTitleBar.drawRect(cc.p(0, 0), cc.p(unitWidth, attackBarHeight), cc.color(255, 255, 255), 0);
                enemyTitleBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - titleBarHeight);
                layer.addChild(enemyTitleBar);
                var enemyTitle = new cc.Sprite(res["TITLE_ON_" + layer.attackFaction[iter].title]);
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
                    layer.damageCalculator.getDefenceBasis(layer.attackFaction[iter]),
                    cc.size(enemyDefenceBar.width, enemyDefenceBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                enemyDefenceString.setPosition(enemyDefenceBar.x + unitWidth / 2, enemyDefenceBar.y + defenceBarHeight / 2);
                enemyDefenceString.setRotation(180, 180);
                enemyDefenceString.setName(this.moduleNameList.defenceInfo + "." + this.moduleNameList.attackFaction + "." + iter);
                layer.addChild(enemyDefenceString);

                //////////////////////////////////////////////////
                // life显示元素
                var enemyLife = new cc.LabelTTF();
                enemyLife.setString(enemyUnit.life);
                enemyLife.setFontSize(lifeFontSize);
                enemyLife.setPosition(xStart + (unitWidth + unitInterval) * iter + unitWidth / 2, yEnmyStart + unitHeight / 2);
                enemyLife.setRotation(180, 180);
                enemyLife.setColor(normalLifeColor);
                enemyLife.setName(this.moduleNameList.lifeInfo + "." + this.moduleNameList.attackFaction + "." + iter);
                this.addChild(enemyLife);

                /////////////////////////////////////////////////////
                // show显示元素
                var showEnemyAttackBar = new cc.DrawNode();
                showEnemyAttackBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showAttackColor, 0);
                showEnemyAttackBar.setPosition(xStart + (unitWidth + unitInterval) * iter, yEnmyStart - showEleHeight - attackBarHeight * 3);
                var showEnemyAttackString = new cc.LabelTTF(
                    enemyAttackString.getString(),
                    cc.size(showEnemyAttackBar.width, showEnemyAttackBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showEnemyAttackString.setPosition(showEnemyAttackBar.x + showEleWidth / 2, showEnemyAttackBar.y + showEleHeight / 2);
                this.addChild(showEnemyAttackBar);
                this.addChild(showEnemyAttackString);

                var showEnemyLifeBar = new cc.DrawNode();
                showEnemyLifeBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showLifeColor, 0);
                showEnemyLifeBar.setPosition(xStart + showEleWidth + (unitWidth + unitInterval) * iter, yEnmyStart - showEleHeight - attackBarHeight * 3);
                var showEnemyLifeString = new cc.LabelTTF(
                    enemyLife.getString(),
                    cc.size(showEnemyLifeBar.width, showEnemyLifeBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showEnemyLifeString.setPosition(showEnemyLifeBar.x + showEleWidth / 2, showEnemyLifeBar.y + showEleHeight / 2);
                showEnemyLifeString.setName(this.moduleNameList.showLifeInfo + "." + this.moduleNameList.attackFaction + "." + iter);
                this.addChild(showEnemyLifeBar);
                this.addChild(showEnemyLifeString);

                var showEnemyDefenceBar = new cc.DrawNode();
                showEnemyDefenceBar.drawRect(cc.p(0, 0), cc.p(showEleWidth, showEleHeight), showDefenceColor, 0);
                showEnemyDefenceBar.setPosition(xStart + showEleWidth * 2 + (unitWidth + unitInterval) * iter, yEnmyStart - showEleHeight - attackBarHeight * 3);
                var showEnemyDefenceString = new cc.LabelTTF(
                    enemyDefenceString.getString(),
                    cc.size(showEnemyDefenceBar.width, showEnemyDefenceBar.height), fontSize,
                    cc.TEXT_ALIGNMENT_CENTER,
                    cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                );
                showEnemyDefenceString.setPosition(showEnemyDefenceBar.x + showEleWidth / 2, showEnemyDefenceBar.y + showEleHeight / 2);
                this.addChild(showEnemyDefenceBar);
                this.addChild(showEnemyDefenceString);
            }
        }
    },

    addOutputMenu : function(size, scale, imageScale) {
        var outerInterval = 50;
        var defenceResetButton = new cc.MenuItemImage(
            res.RESET_BUTTON,
            res.RESET_BUTTON_ON,
            this._resetDamageList.bind(this, null)
        );
        defenceResetButton.setName(armyTemplate.faction.defenceFaction + "." + this.moduleNameList.resetButton);
        defenceResetButton.setPosition(outerInterval, outerInterval);
        defenceResetButton.setAnchorPoint(0, 0);
        defenceResetButton.setScale(2, 2);
        var defenceGoButton = new cc.MenuItemImage(
            res.RETURN_BUTTON,
            res.RETURN_BUTTON_ON,
            this.goButtonCallback.bind(this, armyTemplate.faction.defenceFaction)
        );
        defenceGoButton.setName(armyTemplate.faction.defenceFaction + "." + this.moduleNameList.goCalButton);
        defenceGoButton.setPosition(size.width - outerInterval, outerInterval);
        defenceGoButton.setAnchorPoint(1, 0);
        defenceGoButton.setScale(3, 3);
        var attackResetButton = new cc.MenuItemImage(
            res.RESET_BUTTON,
            res.RESET_BUTTON_ON,
            this._resetDamageList.bind(this, null)
        );
        attackResetButton.setName(armyTemplate.faction.attackFaction + "." + this.moduleNameList.resetButton);
        attackResetButton.setAnchorPoint(0, 0);
        attackResetButton.setPosition(size.width - outerInterval, size.height - outerInterval);
        attackResetButton.setRotation(180, 180);
        attackResetButton.setScale(2, 2);
        var attackGoButton = new cc.MenuItemImage(
            res.RETURN_BUTTON,
            res.RETURN_BUTTON_ON,
            this.goButtonCallback.bind(this, armyTemplate.faction.attackFaction)
        );
        attackGoButton.setName(armyTemplate.faction.attackFaction + "." + this.moduleNameList.goCalButton);
        attackGoButton.setAnchorPoint(1, 0);
        attackGoButton.setPosition(outerInterval, size.height - outerInterval);
        attackGoButton.setRotation(180, 180);
        attackGoButton.setScale(3, 3);
        var calMenu = new cc.Menu(attackResetButton, attackGoButton, defenceResetButton, defenceGoButton);
        calMenu.setPosition(0, 0);
        this.addChild(calMenu);
    },

    addShowBar : function(size, scale, imageScale) {
        var attackShowBar = new cc.Sprite();
        attackShowBar.setName(armyTemplate.status.ATTACK + "." + this.moduleNameList.showBar);
        attackShowBar.setVisible(false);
        this.addChild(attackShowBar);
        var defenceShowBar = new cc.Sprite();
        defenceShowBar.setName(armyTemplate.status.DEFENCE + "." + this.moduleNameList.showBar);
        defenceShowBar.setVisible(false);
        this.addChild(defenceShowBar);
        var attackShowUnit = new cc.Sprite(res.ATK_SHOW_UNIT);
        attackShowUnit.setName(armyTemplate.status.ATTACK + "." + this.moduleNameList.showUnit);
        attackShowUnit.setVisible(false);
        this.addChild(attackShowUnit);
        var defenceShowUnit = new cc.Sprite(res.DFC_SHOW_UNIT);
        defenceShowUnit.setName(armyTemplate.status.DEFENCE + "." + this.moduleNameList.showUnit);
        defenceShowUnit.setVisible(false);
        this.addChild(defenceShowUnit);
    },

    goButtonCallback : function(faction) {
        console.log();
        this.GO_CAL_FLAG[faction] = 1;
        if (this.GO_CAL_FLAG[armyTemplate.faction.attackFaction] && this.GO_CAL_FLAG[armyTemplate.faction.defenceFaction]
        && this.damageCalList[armyTemplate.status.ATTACK] != null && this.damageCalList[armyTemplate.status.DEFENCE] != null)
            this.outputCallback();
        else if(this.GO_CAL_FLAG[armyTemplate.faction.attackFaction] && this.GO_CAL_FLAG[armyTemplate.faction.defenceFaction]) {
            this._resetAtkElement();
            this._resetDfcElement();
        }
    },

    outputCallback : function() {
        /*
         * 通过这个回调函数打开outputLayer
         * 另外，在该函数中还要讲damageCalList清空，以便从outputLayer调用本layer的onPushLayer时，可以重置界面元素。
         */
        //this.damageCalList[armyTemplate.status.DEFENCE].setEngage(this.damageCalList[armyTemplate.status.ATTACK]);
        //this.damageCalList[armyTemplate.status.ATTACK].setEngage(this.damageCalList[armyTemplate.status.DEFENCE]);

        this.damageCalculator.loadDefenceUnit(this.damageCalList[armyTemplate.status.DEFENCE]);
        this.damageCalculator.loadAttackList(this.damageCalList[armyTemplate.status.ATTACK]);

        var damageList = this.damageCalculator.getDamage(this.damageCalculator.attackList, this.damageCalculator.defenceUnit);
        console.log(damageList);
        var defence = damageList[damageList.length - 1];
        var attack = damageList[0];

        var parentNode = this.getParent();
        parentNode.getChildByName(parentNode.moduleNameList.outputLayer).loadOutput(defence, attack);
    },

    reloadLayer : function(output) {
        ////////////////////////////////////////////////
        // 从outputLayer返回需要执行下列内容
        // 将计算结果重载回defenceFaction和attackFaction
        if (output instanceof Array) {
            for (var iter = 0; iter < output.length; iter++) {
                var unit = output[iter];
                this[unit.faction][unit.serial] = unit;
            }
        }

        this.getChildByName(armyTemplate.status.ATTACK + "." + this.moduleNameList.showUnit).setVisible(true);
        this.getChildByName(armyTemplate.status.DEFENCE + "." + this.moduleNameList.showUnit).setVisible(true);
        this._resetDamageList();
    },

    loadTroops : function() {
        var layer = this;
        var socket = new WebSocket(messageCode.COMMUNICATION_ADDRESS);

        socket.onopen = function() {
            console.log("load troops connection is ready...");
            socket.send(messageCode.LOAD_TROOPS);
        };
        socket.onmessage = function(msg) {
            var data = msg.data;
            var jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (error) {
                console.log(data);
                return;
            }
            if (jsonData != null) {
                console.log(jsonData);
                layer[jsonData.faction] = [];
                jsonData.troops.forEach(function(rawUnit) {
                    //layer[jsonData.faction].push(new Unit(rawUnit));
                    var unit = new Unit(rawUnit);
                    layer[jsonData.faction].push(unit.toUnit());
                });
                console.log(layer[jsonData.faction]);
                if (layer.defenceFaction != null && layer.attackFaction != null) {
                    layer._resetDamageList();
                    layer._loadUnitElement();
                }
            } else {
                console.log("server message: " + msg.data);
            }
        };
        socket.onclose = function() {
            console.log("connection is cancelled by server...");
        }
    },

    _loadUnitElement : function() {
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;
        var layer = this;

        this.addUnitsMenu(globalSize, globalScale, unitImageScale);
        this.addOutputMenu(globalSize, globalScale, unitImageScale);
        this.addShowBar(globalSize, globalScale, unitImageScale);


        var unitListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            selectedUnit : null,

            onTouchBegan : function(touch, event) {
                layer.getChildByName(armyTemplate.status.ATTACK + "." + layer.moduleNameList.showUnit).setVisible(false);
                layer.getChildByName(armyTemplate.status.DEFENCE + "." + layer.moduleNameList.showUnit).setVisible(false);

                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                var _toParesFactionNumber = function(string) {
                    var point = string.indexOf(".");
                    return eval(string.slice(point + 1, string.length));
                };
                var _toParesFaction = function(string) {
                    var point = string.indexOf(".");
                    return string.slice(0, point);
                };
                if (cc.rectContainsPoint(rect, pos)) {
                    //////////////////////////////////////////////////////////
                    // 触碰动作开始时，会根据target来选定unit，并且为unit设置最基础的status为armyTemplate.status.ATTACK | armyTemplate.status.DEFENCE
                    // 这就保证了在之后可以通过selecetedUnit.status来选定showBar.
                    var name = target.getName();
                    var unit = layer[_toParesFaction(name)][_toParesFactionNumber(name)];
                    this.selectedUnit = unit;
                    var attackUnit = layer.damageCalList[armyTemplate.status.ATTACK],
                        defenceUnit = layer.damageCalList[armyTemplate.status.DEFENCE];
                    if (attackUnit == null) {
                        target.setTexture(res["UNIT_ATTACK_"  + unit.unit]);
                        unit.status = armyTemplate.status.ATTACK;
                        unit.position = armyTemplate.position.FACE;
                    } else if (this.selectedUnit.faction === attackUnit.faction){
                        layer._resetDamageList(armyTemplate.status.ATTACK);
                        target.setTexture(res["UNIT_ATTACK_"  + unit.unit]);
                        unit.status = armyTemplate.status.ATTACK;
                        unit.position = armyTemplate.position.FACE;
                    } else if (defenceUnit == null) {
                        target.setTexture(res["UNIT_ON_"  + unit.unit]);
                        unit.status = armyTemplate.status.DEFENCE;
                        unit.position = armyTemplate.position.FACE;
                    } else if (this.selectedUnit.faction === defenceUnit.faction){
                        layer._resetDamageList(armyTemplate.status.DEFENCE);
                        target.setTexture(res["UNIT_ON_"  + unit.unit]);
                        unit.status = armyTemplate.status.DEFENCE;
                        unit.position = armyTemplate.position.FACE;
                    }
                    this.selectedUnit = unit;
                    console.log(unit);
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
                var rect = cc.rect(0 ,0, size.width, size.height);
                var listener = this;
                function _loadUnit(string, unit) {
                    // 向layer中对应位置装载unit，并且添加对应的showBar元素。
                    // string = armyTemplate.status.ATTACK | armyTemplate.status.DEFENCE
                    layer.damageCalList[string] = unit;
                    unit = null;

                    var showBar = layer.getChildByName(string + "." + layer.moduleNameList.showBar);
                    showBar.setAnchorPoint(0.5, 0);
                    showBar.setPosition(target.x, target.y);
                    showBar.setRotation(target.getRotationX(), target.getRotationY());

                    var showUnit = layer.getChildByName(string + "." + layer.moduleNameList.showUnit);
                    var moveValue;
                    listener.selectedUnit.faction === armyTemplate.faction.defenceFaction ? moveValue = 25 : moveValue = -25;
                    showUnit.setPosition(target.x , target.y + moveValue);  // 此处的25是attackBar的高度的一半。
                    showUnit.setRotation(target.getRotationX(), target.getRotationY());
                }
                function _resetUnitButton(string) {
                    target.setTexture(res["UNIT_" + listener.selectedUnit.unit]);
                    _loadUnit(string, null);
                    return false;
                }
                if (this.selectedUnit != null) {
                    var showBar = layer.getChildByName(this.selectedUnit.status + "." + layer.moduleNameList.showBar);
                    if (cc.rectContainsPoint(rect, pos)) {
                        if (this.selectedUnit.status === armyTemplate.status.ATTACK) {
                            _loadUnit(armyTemplate.status.ATTACK, this.selectedUnit);
                            showBar.setTexture(res.ATK_SHOW_BAR);
                            showBar.setVisible(true);
                            return true;
                        }
                        if (this.selectedUnit.status === armyTemplate.status.DEFENCE) {
                            layer.damageCalList[armyTemplate.status.ATTACK].position = armyTemplate.position.FACE;
                            _loadUnit(armyTemplate.status.DEFENCE, this.selectedUnit);
                            showBar.setTexture(res.DFC_SHOW_BAR);
                            showBar.setVisible(true);
                            return true;
                        }
                    } else {
                        if (this.selectedUnit.status === armyTemplate.status.ATTACK) {
                            if (pos.y > size.height && (pos.x > 0 && pos.x < size.width)) {
                                // 向前滑动 = attack charge
                                // 先更改attackStatus，然后检测输入是否正确
                                this.selectedUnit.status = armyTemplate.status.ATTACK_CHARGE;
                                console.log(this.selectedUnit.faction + ": " + this.selectedUnit.unit + " : " + this.selectedUnit.status + " : " + this.selectedUnit.position);
                                if (this.selectedUnit.checkStatus()) {
                                    _loadUnit(armyTemplate.status.ATTACK, this.selectedUnit);
                                    showBar.setTexture(res.ATK_CHARGE_SHOW_BAR);
                                    showBar.setVisible(true);
                                    return true;
                                } else {
                                    return _resetUnitButton(armyTemplate.status.ATTACK);
                                }
                            }
                            if (pos.y < 0 && (pos.x > 0 && pos.x < size.width)) {
                                // 向后滑动 = attack remote
                                // 先更改attackStatus，然后检测输入是否正确
                                this.selectedUnit.status = armyTemplate.status.ATTACK_REMOTE;
                                console.log(this.selectedUnit.faction + ": " + this.selectedUnit.unit + " : " + this.selectedUnit.status + " : " + this.selectedUnit.position);
                                if (this.selectedUnit.checkStatus()) {
                                    _loadUnit(armyTemplate.status.ATTACK, this.selectedUnit);
                                    showBar.setAnchorPoint(0.5, 1);
                                    showBar.setTexture(res.ATK_SHOW_BAR);
                                    showBar.setVisible(true);
                                    return true;
                                } else {
                                    return _resetUnitButton(armyTemplate.status.ATTACK);
                                }
                            }
                            return _resetUnitButton(armyTemplate.status.ATTACK);
                        }
                        if (this.selectedUnit.status === armyTemplate.status.DEFENCE) {
                            showBar.setTexture(res.DFC_SHOW_BAR);
                            if ((pos.x < 0 || pos.x > size.width) && (pos.y > 0 &&  pos.y < size.height)) {
                                // defence side attack
                                layer.damageCalList[armyTemplate.status.ATTACK].position = armyTemplate.position.SIDE;
                                _loadUnit(armyTemplate.status.DEFENCE, this.selectedUnit);
                                console.log(layer.damageCalList[armyTemplate.status.ATTACK].position);
                                pos.x > size.width ? showBar.setRotation(showBar.getRotationX() + 90, showBar.getRotationY() + 90) :
                                    showBar.setRotation(showBar.getRotationX() - 90, showBar.getRotationY() - 90);
                                showBar.setVisible(true);
                                return true;
                            }
                            if ((pos.x > 0 && pos.x < size.width) && pos.y < 0) {
                                // defence back attack
                                layer.damageCalList[armyTemplate.status.ATTACK].position = armyTemplate.position.BACK;
                                _loadUnit(armyTemplate.status.DEFENCE, this.selectedUnit);
                                console.log(layer.damageCalList[armyTemplate.status.ATTACK].position);
                                showBar.setRotation(showBar.getRotationX() + 180, showBar.getRotationY() + 180);
                                showBar.setVisible(true);
                                return true;
                            }
                            if ((pos.x > 0 && pos.x < size.width) && pos.y >= 0) {
                                // defence face attack
                                layer.damageCalList[armyTemplate.status.ATTACK].position = armyTemplate.position.FACE;
                                _loadUnit(armyTemplate.status.DEFENCE, this.selectedUnit);
                                console.log(layer.damageCalList[armyTemplate.status.ATTACK].position);
                                showBar.setVisible(true);
                                return true;
                            }
                            return _resetUnitButton(armyTemplate.status.DEFENCE);
                        }
                    }
                }
                return false;
            }
        });
        for (var iter = 0; iter < this.defenceFaction.length; iter++) {
            if (this.defenceFaction[iter] != null)
                cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.defenceFaction + "." + iter));
        }
        for (var iter = 0; iter < this.attackFaction.length; iter++) {
            if (this.attackFaction[iter] != null)
                cc.eventManager.addListener(unitListener.clone(), this.getChildByName(this.moduleNameList.attackFaction + "." + iter));
        }
    },

    _resetDamageList : function(FLAG) {
        var layer = this;
        if (this.damageCalList == null) {
            // 初始化
            this.damageCalList = {};
            this.damageCalList[armyTemplate.status.ATTACK] = null;
            this.damageCalList[armyTemplate.status.DEFENCE] = null;
            console.log("init damageCalList...");
        } else {
            // 之后每次调用
            switch (FLAG) {
                case armyTemplate.status.ATTACK : {
                    console.log("reset attack unit...");
                    this._resetAtkElement();
                    break;
                }
                case armyTemplate.status.DEFENCE : {
                    console.log("reset defence unit...");
                    this._resetDfcElement();
                    break;
                }
                default : {
                    console.log(FLAG);
                    if (!FLAG) {
                        console.log("reset damageCalList...");
                        this._resetAtkElement();
                        this._resetDfcElement();
                    } else {
                        throw "WRONG reset element FLAG!"
                    }
                    break
                }
            }
        }
    },

    _resetAtkElement : function() {
        var attackUnit = this.damageCalList[armyTemplate.status.ATTACK];
        if (attackUnit != null) {
            this.damageCalList[armyTemplate.status.ATTACK] = null;
            this.GO_CAL_FLAG[attackUnit.faction] = 0;
            this._resetUnitButtonImage(attackUnit);
            this.getChildByName(armyTemplate.status.ATTACK + "." + this.moduleNameList.showBar).setVisible(false);
        }
    },

    _resetDfcElement : function() {
        var defenceUnit = this.damageCalList[armyTemplate.status.DEFENCE];
        if (defenceUnit != null) {
            this.damageCalList[armyTemplate.status.DEFENCE] = null;
            this.GO_CAL_FLAG[defenceUnit.faction] = 0;
            this._resetUnitButtonImage(defenceUnit);
            this.getChildByName(armyTemplate.status.DEFENCE + "." + this.moduleNameList.showBar).setVisible(false);
        }
    },

    _resetUnitButtonImage : function(unit) {
        var button = this.getChildByName(unit.faction + "." + unit.serial);
        var tmpString;
        if (unit.life <= 0) {
            tmpString = "UNIT_OFF_";
            cc.eventManager.pauseTarget(button, true);
        }
        else
            tmpString = "UNIT_";
        button.setTexture(res[tmpString + unit.unit]);
    },

    onEnter : function() {
        this._super();
        console.log("show units!");
        var layer = this;

        this.loadTroops();
    },

    onExit : function() {
        this._super();
    }
});