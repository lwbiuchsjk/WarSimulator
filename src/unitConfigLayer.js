var UnitConfigLayer = cc.Layer.extend({
    sprite : null,

    moduleNameList : {
        seqMenu : "seqMenu",
        heavyCavalvyMenu : armyTemplate.sequences.HEAVY_CAVALVY,
        lightCavalvyMenu : armyTemplate.sequences.LIGHT_CAVALVY,
        heavyInfantryMenu : armyTemplate.sequences.HEAVY_INFANTRY,
        lightInfantryMenu : armyTemplate.sequences.LIGHT_INFANTRY,

        rankMenu : "rankMenu",
        /*
         * 使用titleMenu字段来索引menu本身与其子节点的每一个toggle。
         * 索引toggle时，name属性为titleMenu.(iter+1)
         * 其中iter为数组下标。
         */
        titleMenu : "titleMenu",
        lifeMenu : "lifeMenu",
        runMenu : "runMenu",
        posListener : "posListener",
    },

    /*
     * 使用titledUnits结构对已经选择过title的unit做记录。
     * 在各troop中，如果一个unit第一次被选择，则新建一个该unit的[]结构，并推入对应troop。
     * 在该array中，数组下标装在对应的title，对应关系为iter = title - 1。这是因为在所有title与iter共存的环境中，约定两者之间差1。
     * 特别是res中，title图片的url是从1开始命名。在title组件中，name属性中包含的数字也是从1开始。
     * 这就使得当前unit的array(6)结构中，与title组件button的数组下标有对应关系。方便快速检索。
     */
    titledUnits : [],
    maxTitleLength : 6,
    posListener : null,
    currentUnit: null,          // 取到当前正在处理的unit

    ctor : function() {
        this._super();
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var imageScale = 1;

        this.addHeavyInfantryMenu(globalSize, globalScale, imageScale);
        this.addLightInfantryMenu(globalSize, globalScale, imageScale);
        this.addHeavyCavalvyMenu(globalSize, globalScale, imageScale);
        this.addLightCavalvyMenu(globalSize, globalScale, imageScale);
        return true;

    },

    addHeavyInfantryMenu : function(size, gScale, iScale) {
        //////////////////////////////
        // 以下是heavy infantry的菜单
        var btnInterval = 100, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 900 + btnWidth / 2;
        var heavyInfantryImage = new cc.Sprite(res.SEQ_HEAVY_INFANTRY);
        var shldmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_shieldMan, res.UNIT_ON_shieldMan, res.UNIT_OFF_shieldMan,
            this.unitBtnCallback.bind(this, armyTemplate.units.SHIELD_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        var bwmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_bowMan, res.UNIT_ON_bowMan, res.UNIT_OFF_bowMan,
            this.unitBtnCallback.bind(this, armyTemplate.units.BOW_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        var spmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_spearMan, res.UNIT_ON_spearMan, res.UNIT_OFF_spearMan,
            this.unitBtnCallback.bind(this, armyTemplate.units.SPEAR_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        var pkmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_pikeMan, res.UNIT_ON_pikeMan, res.UNIT_OFF_pikeMan,
            this.unitBtnCallback.bind(this, armyTemplate.units.PIKE_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        shldmnToggleBtn.setScale(iScale, iScale);
        shldmnToggleBtn.setName(armyTemplate.units.SHIELD_MAN);
        bwmnToggleBtn.setScale(iScale, iScale);
        bwmnToggleBtn.setName(armyTemplate.units.BOW_MAN);
        spmnToggleBtn.setScale(iScale, iScale);
        spmnToggleBtn.setName(armyTemplate.units.SPEAR_MAN);
        pkmnToggleBtn.setScale(iScale, iScale);
        pkmnToggleBtn.setName(armyTemplate.units.PIKE_MAN);

        heavyInfantryImage.setPosition(startX, startY);
        shldmnToggleBtn.setPosition(heavyInfantryImage.x + btnWidth + middleInterval, startY);
        bwmnToggleBtn.setPosition(shldmnToggleBtn.x + btnWidth + btnInterval, startY);
        spmnToggleBtn.setPosition(bwmnToggleBtn.x + btnWidth + btnInterval, startY);
        pkmnToggleBtn.setPosition(spmnToggleBtn.x + btnWidth + btnInterval, startY);

        var hvyInfMenu = new cc.Menu(shldmnToggleBtn, pkmnToggleBtn, spmnToggleBtn, bwmnToggleBtn);
        hvyInfMenu.x = 0;
        hvyInfMenu.y = 0;
        hvyInfMenu.setName(this.moduleNameList.heavyInfantryMenu);
        this.addChild(heavyInfantryImage);
        this.addChild(hvyInfMenu);

        for (var iter in hvyInfMenu.getChildren()) {
            var unitButton = hvyInfMenu.getChildren()[iter];
            var barHeight = unitButton.height, barWidth = 30,
                fontSize = 40,
                attackColor = cc.color(255, 0, 0),
                defenceColor = cc.color(49, 133, 156);
            var unitAttackBar = new cc.DrawNode();
            unitAttackBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), attackColor, 0);
            unitAttackBar.setPosition(unitButton.x - unitButton.width / 2 - barWidth, unitButton.y - unitButton.height / 2);
            this.addChild(unitAttackBar);
            var unitAttackString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].attackWeapon + armyTemplate.troops[unitButton.getName()].attackFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitAttackString.setPosition(unitAttackBar.x + barWidth / 2, unitAttackBar.y + barHeight / 2);
            this.addChild(unitAttackString);

            var unitDefenceBar = new cc.DrawNode();
            unitDefenceBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), defenceColor, 0);
            unitDefenceBar.setPosition(unitButton.x + unitButton.width / 2, unitAttackBar.y);
            this.addChild(unitDefenceBar);
            var unitDefenceString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].defenceWeapon + armyTemplate.troops[unitButton.getName()].defenceFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitDefenceString.setPosition(unitDefenceBar.x + barWidth / 2, unitDefenceBar.y + barHeight / 2);
            this.addChild(unitDefenceString);
        }
    },

    addLightInfantryMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是light infantry的菜单
        var btnInterval = 100, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 720 + btnWidth / 2;
        var lightInfantryImage = new cc.Sprite(res.SEQ_LIGHT_INFANTRY);
        lightInfantryImage.setPosition(startX, startY);
        var attackerButton = new cc.MenuItemImage(
            res.UNIT_attacker, res.UNIT_ON_attacker, res.UNIT_OFF_attacker,
            this.unitBtnCallback.bind(this, armyTemplate.units.ATTACKER, this.moduleNameList.lightInfantryMenu),
            this
        );
        var chargerButton = new cc.MenuItemImage(
            res.UNIT_charger, res.UNIT_ON_charger, res.UNIT_OFF_charger,
            this.unitBtnCallback.bind(this, armyTemplate.units.CHARGER, this.moduleNameList.lightInfantryMenu),
            this
        );
        var shooterButton = new cc.MenuItemImage(
            res.UNIT_shooter, res.UNIT_ON_shooter, res.UNIT_OFF_shooter,
            this.unitBtnCallback.bind(this, armyTemplate.units.SHOOTER, this.moduleNameList.lightInfantryMenu),
            this
        );
        var interceptorButton = new cc.MenuItemImage(
            res.UNIT_interceptor, res.UNIT_ON_interceptor, res.UNIT_OFF_interceptor,
            this.unitBtnCallback.bind(this, armyTemplate.units.INTERCEPTOR, this.moduleNameList.lightInfantryMenu),
            this
        );
        attackerButton.setScale(iScale, iScale);
        attackerButton.setName(armyTemplate.units.ATTACKER);
        chargerButton.setScale(iScale, iScale);
        chargerButton.setName(armyTemplate.units.CHARGER);
        shooterButton.setScale(iScale, iScale);
        shooterButton.setName(armyTemplate.units.SHOOTER);
        interceptorButton.setScale(iScale, iScale);
        interceptorButton.setName(armyTemplate.units.INTERCEPTOR);

        attackerButton.setPosition(lightInfantryImage.x + btnWidth + middleInterval, startY);
        chargerButton.setPosition(attackerButton.x + btnWidth + btnInterval, startY);
        shooterButton.setPosition(chargerButton.x + btnWidth + btnInterval, startY);
        interceptorButton.setPosition(shooterButton.x + btnWidth + btnInterval, startY);

        var lightInfMenu = new cc.Menu(attackerButton, chargerButton, shooterButton, interceptorButton);
        lightInfMenu.x = 0;
        lightInfMenu.y = 0;
        lightInfMenu.setName(this.moduleNameList.lightInfantryMenu);
        this.addChild(lightInfMenu);
        this.addChild(lightInfantryImage);

        for (var iter in lightInfMenu.getChildren()) {
            var unitButton = lightInfMenu.getChildren()[iter];
            var barHeight = unitButton.height, barWidth = 30,
                fontSize = 40,
                attackColor = cc.color(255, 0, 0),
                defenceColor = cc.color(49, 133, 156);
            var unitAttackBar = new cc.DrawNode();
            unitAttackBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), attackColor, 0);
            unitAttackBar.setPosition(unitButton.x - unitButton.width / 2 - barWidth, unitButton.y - unitButton.height / 2);
            this.addChild(unitAttackBar);
            var unitAttackString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].attackWeapon + armyTemplate.troops[unitButton.getName()].attackFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitAttackString.setPosition(unitAttackBar.x + barWidth / 2, unitAttackBar.y + barHeight / 2);
            this.addChild(unitAttackString);

            var unitDefenceBar = new cc.DrawNode();
            unitDefenceBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), defenceColor, 0);
            unitDefenceBar.setPosition(unitButton.x + unitButton.width / 2, unitAttackBar.y);
            this.addChild(unitDefenceBar);
            var unitDefenceString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].defenceWeapon + armyTemplate.troops[unitButton.getName()].defenceFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitDefenceString.setPosition(unitDefenceBar.x + barWidth / 2, unitDefenceBar.y + barHeight / 2);
            this.addChild(unitDefenceString);
        }
    },

    addHeavyCavalvyMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是heavy cavalvy的菜单
        var btnInterval = 100, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 540 + btnWidth / 2;
        var heavyCavalvyImage = new cc.Sprite(res.SEQ_HEAVY_CAVALVY);
        heavyCavalvyImage.setPosition(startX, startY);
        var impactHorseButton = new cc.MenuItemImage(
            res.UNIT_impactHorse, res.UNIT_ON_impactHorse, res.UNIT_OFF_impactHorse,
            this.unitBtnCallback.bind(this, armyTemplate.units.IMPACT_HORSE, this.moduleNameList.heavyCavalvyMenu),
            this
        );
        var dragonHorseButton = new cc.MenuItemImage(
            res.UNIT_dragonHorse, res.UNIT_ON_dragonHorse, res.UNIT_OFF_dragonHorse,
            this.unitBtnCallback.bind(this, armyTemplate.units.DRAGON_HORSE, this.moduleNameList.heavyCavalvyMenu),
            this
        );
        var shootHorseButton = new cc.MenuItemImage(
            res.UNIT_shootHorse, res.UNIT_ON_shootHorse, res.UNIT_OFF_shootHorse,
            this.unitBtnCallback.bind(this, armyTemplate.units.SHOOT_HORSE, this.moduleNameList.heavyCavalvyMenu),
            this
        );

        impactHorseButton.setScale(iScale, iScale);
        impactHorseButton.setName(armyTemplate.units.IMPACT_HORSE);
        dragonHorseButton.setScale(iScale, iScale);
        dragonHorseButton.setName(armyTemplate.units.DRAGON_HORSE);
        shootHorseButton.setScale(iScale, iScale);
        shootHorseButton.setName(armyTemplate.units.SHOOT_HORSE);

        impactHorseButton.setPosition(heavyCavalvyImage.x + btnWidth + middleInterval, startY);
        dragonHorseButton.setPosition(impactHorseButton.x + btnWidth + btnInterval, startY);
        shootHorseButton.setPosition(dragonHorseButton.x + btnWidth + btnInterval, startY);

        var hvyCvyMenu = new cc.Menu(impactHorseButton, dragonHorseButton, shootHorseButton);
        hvyCvyMenu.x = 0;
        hvyCvyMenu.y = 0;
        hvyCvyMenu.setName(this.moduleNameList.heavyCavalvyMenu);
        this.addChild(heavyCavalvyImage);
        this.addChild(hvyCvyMenu);

        for (var iter in hvyCvyMenu.getChildren()) {
            var unitButton = hvyCvyMenu.getChildren()[iter];
            var barHeight = unitButton.height, barWidth = 30,
                fontSize = 40,
                attackColor = cc.color(255, 0, 0),
                defenceColor = cc.color(49, 133, 156);
            var unitAttackBar = new cc.DrawNode();
            unitAttackBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), attackColor, 0);
            unitAttackBar.setPosition(unitButton.x - unitButton.width / 2 - barWidth, unitButton.y - unitButton.height / 2);
            this.addChild(unitAttackBar);
            var unitAttackString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].attackWeapon + armyTemplate.troops[unitButton.getName()].attackFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitAttackString.setPosition(unitAttackBar.x + barWidth / 2, unitAttackBar.y + barHeight / 2);
            this.addChild(unitAttackString);

            var unitDefenceBar = new cc.DrawNode();
            unitDefenceBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), defenceColor, 0);
            unitDefenceBar.setPosition(unitButton.x + unitButton.width / 2, unitAttackBar.y);
            this.addChild(unitDefenceBar);
            var unitDefenceString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].defenceWeapon + armyTemplate.troops[unitButton.getName()].defenceFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitDefenceString.setPosition(unitDefenceBar.x + barWidth / 2, unitDefenceBar.y + barHeight / 2);
            this.addChild(unitDefenceString);
        }
    },

    addLightCavalvyMenu : function(size, gScale, iScale) {
        //////////////////////////////////////////
        // 以下是light cavalvy的菜单
        var btnInterval = 100, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 360 + btnWidth / 2;
        var lightCavalvyImage = new cc.Sprite(res.SEQ_LIGHT_CAVALVY);
        lightCavalvyImage.setPosition(startX, startY);

        var huntMountButton = new cc.MenuItemImage(
            res.UNIT_huntMount, res.UNIT_ON_huntMount, res.UNIT_OFF_huntMount,
            this.unitBtnCallback.bind(this, armyTemplate.units.HUNT_MOUNT, this.moduleNameList.lightCavalvyMenu),
            this
        );
        var bowMountButton = new cc.MenuItemImage(
            res.UNIT_bowMount, res.UNIT_ON_bowMount, res.UNIT_OFF_bowMount,
            this.unitBtnCallback.bind(this, armyTemplate.units.BOW_MOUNT, this.moduleNameList.lightCavalvyMenu),
            this
        );
        var attackMountButton = new cc.MenuItemImage(
            res.UNIT_attackMount, res.UNIT_ON_attackMount, res.UNIT_OFF_attackMount,
            this.unitBtnCallback.bind(this, armyTemplate.units.ATTACK_MOUNT, this.moduleNameList.lightCavalvyMenu),
            this
        );

        huntMountButton.setScale(iScale, iScale);
        huntMountButton.setName(armyTemplate.units.HUNT_MOUNT);
        bowMountButton.setScale(iScale, iScale);
        bowMountButton.setName(armyTemplate.units.BOW_MOUNT);
        attackMountButton.setScale(iScale, iScale);
        attackMountButton.setName(armyTemplate.units.ATTACK_MOUNT);

        huntMountButton.setPosition(lightCavalvyImage.x + btnWidth + middleInterval, startY);
        bowMountButton.setPosition(huntMountButton.x + btnWidth + btnInterval, startY);
        attackMountButton.setPosition(bowMountButton.x + btnWidth + btnInterval, startY);

        var lghtCvyMenu = new cc.Menu(huntMountButton, bowMountButton, attackMountButton);
        lghtCvyMenu.x = 0;
        lghtCvyMenu.y = 0;
        lghtCvyMenu.setName(this.moduleNameList.lightCavalvyMenu);
        this.addChild(lightCavalvyImage);
        this.addChild(lghtCvyMenu);

        for (var iter in lghtCvyMenu.getChildren()) {
            var unitButton = lghtCvyMenu.getChildren()[iter];
            var barHeight = unitButton.height, barWidth = 30,
                fontSize = 40,
                attackColor = cc.color(255, 0, 0),
                defenceColor = cc.color(49, 133, 156);
            var unitAttackBar = new cc.DrawNode();
            unitAttackBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), attackColor, 0);
            unitAttackBar.setPosition(unitButton.x - unitButton.width / 2 - barWidth, unitButton.y - unitButton.height / 2);
            this.addChild(unitAttackBar);
            var unitAttackString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].attackWeapon + armyTemplate.troops[unitButton.getName()].attackFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitAttackString.setPosition(unitAttackBar.x + barWidth / 2, unitAttackBar.y + barHeight / 2);
            this.addChild(unitAttackString);

            var unitDefenceBar = new cc.DrawNode();
            unitDefenceBar.drawRect(cc.p(0, 0), cc.p(barWidth, barHeight), defenceColor, 0);
            unitDefenceBar.setPosition(unitButton.x + unitButton.width / 2, unitAttackBar.y);
            this.addChild(unitDefenceBar);
            var unitDefenceString = new cc.LabelTTF(
                armyTemplate.troops[unitButton.getName()].defenceWeapon + armyTemplate.troops[unitButton.getName()].defenceFormation,
                null , fontSize,
                cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER
            );
            unitDefenceString.setPosition(unitDefenceBar.x + barWidth / 2, unitDefenceBar.y + barHeight / 2);
            this.addChild(unitDefenceString);
        }
    },

    unitBtnCallback : function(unit, seq) {
        // 重要函数。通过点选来对单位进行配置。
        if (this.currentUnit) {
            this.currentUnit.unit = unit;
            this.titledUnits[this.currentUnit.unit] == null ? this.titledUnits[this.currentUnit.unit] = new Array(6) : 1;
            var titledSeq = this.titledUnits[this.currentUnit.unit];
            var blankTitle = this._checkBlankTitle();
            if (blankTitle === false) {
                throw "no blank title already!!!";
            } else {
                this.currentUnit.title = titledSeq[blankTitle] = blankTitle + 1;
                if (this._checkBlankTitle() === false) {
                    this.getChildByName(seq).getChildByName(unit).setNormalSpriteFrame(res["UNIT_OFF_" + unit]);
                    this.getChildByName(seq).getChildByName(unit).setCallback(function() {console.log("well done!")});
                }
            }
            console.log(unit + " chosen!");
            this.lfBtnCallback(0);
        } else {
            this._resumeDisplayLayer();
        }
    },

    lfBtnCallback : function(life) {
        this.currentUnit.loadUnit();
        this.currentUnit.life = this.currentUnit.maxLife - life;
        this._resumeDisplayLayer(this.currentUnit);
    },

    _checkBlankTitle : function() {
        var titleList = this.titledUnits[this.currentUnit.unit];
        for (var iter = 0; iter < titleList.length; iter++) {
            if (titleList[iter] == null)
                return iter;
        }
        return false;
    },

    _resumeDisplayLayer : function(unit) {
        var parentNode = this.getParent();
        var displayLayer = parentNode.getChildByName(parentNode.moduleNameList.displayLayer);
        displayLayer.resumeLayer(unit);
    },

    deleteUnitTitle : function(unit) {
        this.titledUnits[unit.unit][unit.title - 1] = null;
        this.getChildByName(unit.sequence).getChildByName(unit.unit).setNormalSpriteFrame(res["UNIT_" + unit.unit]);
        this.getChildByName(unit.sequence).getChildByName(unit.unit).setCallback(this.unitBtnCallback.bind(this, unit.unit, unit.sequence));
    },

    motiveLayer : function(unit) {
        this.currentUnit = unit;
        console.log(this.currentUnit);
    },

    resetUnit : function() {
        this.currentUnit = null;
    },

    wipeTitle : function() {
        this.titledUnits = [];
    },

    onEnter : function() {
        this._super();
    },

    onExit : function() {
        this._super();
    }
});