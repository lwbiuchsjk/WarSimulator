var UnitConfigLayer = cc.Layer.extend({
    sprite : null,

    moduleNameList : {
        seqMenu : "seqMenu",
        heavyCavalvyMenu : "heavyCavalvyMenu",
        lightCavalvyMenu : "lightCavalvyMenu",
        heavyInfantryMenu : "heavyInfantryMenu",
        lightInfantryMenu : "lightInfantryMenu",

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
    unitLoader : null,

    ctor : function() {
        this._super();
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var imageScale = 1;

        this.unitLoader = new UnitLoader();
        this.addHeavyInfantryMenu(globalSize, globalScale, imageScale);
        this.addLightInfantryMenu(globalSize, globalScale, imageScale);
        this.addHeavyCavalvyMenu(globalSize, globalScale, imageScale);
        this.addLightCavalvyMenu(globalSize, globalScale, imageScale);
        return true;

    },

    addHeavyInfantryMenu : function(size, gScale, iScale) {
        //////////////////////////////
        // 以下是heavy infantry的菜单
        var btnInterval = 60, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 900 + btnWidth / 2;
        var heavyInfantryImage = new cc.Sprite(res.SEQ_HEAVY_INFANTRY);
        var shldmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_shieldMan, res.UNIT_shieldMan_ON, res.UNIT_shieldMan_OFF,
            this.unitBtnCallback.bind(this, armyTemplate.units.SHIELD_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        var bwmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_bowMan, res.UNIT_bowMan_ON, res.UNIT_bowMan_OFF,
            function() {console.log("well done")},
            this
        );
        var pkmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_pikeMan, res.UNIT_pikeMan_ON, res.UNIT_pikeMan_OFF,
            this.unitBtnCallback.bind(this, armyTemplate.units.PIKE_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        var axmnToggleBtn = new cc.MenuItemImage(
            res.UNIT_axeMan, res.UNIT_axeMan_ON, res.UNIT_axeMan_OFF,
            this.unitBtnCallback.bind(this, armyTemplate.units.AXE_MAN, this.moduleNameList.heavyInfantryMenu),
            this
        );
        shldmnToggleBtn.setScale(iScale, iScale);
        shldmnToggleBtn.setName(armyTemplate.units.SHIELD_MAN);
        bwmnToggleBtn.setScale(iScale, iScale);
        bwmnToggleBtn.setName(armyTemplate.units.BOW_MAN);
        pkmnToggleBtn.setScale(iScale, iScale);
        pkmnToggleBtn.setName(armyTemplate.units.PIKE_MAN);
        axmnToggleBtn.setScale(iScale, iScale);
        axmnToggleBtn.setName(armyTemplate.units.AXE_MAN);

        heavyInfantryImage.setPosition(startX, startY);
        shldmnToggleBtn.setPosition(heavyInfantryImage.x + btnWidth + middleInterval, startY);
        bwmnToggleBtn.setPosition(shldmnToggleBtn.x + btnWidth + btnInterval, startY);
        pkmnToggleBtn.setPosition(bwmnToggleBtn.x + btnWidth + btnInterval, startY);
        axmnToggleBtn.setPosition(pkmnToggleBtn.x + btnWidth + btnInterval, startY);

        var hvyInfMenu = new cc.Menu(shldmnToggleBtn, pkmnToggleBtn, axmnToggleBtn, bwmnToggleBtn);
        hvyInfMenu.x = 0;
        hvyInfMenu.y = 0;
        hvyInfMenu.setName(this.moduleNameList.heavyInfantryMenu);
        this.addChild(heavyInfantryImage);
        this.addChild(hvyInfMenu);
    },

    addLightInfantryMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是light infantry的菜单
        var btnInterval = 60, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 720 + btnWidth / 2;
        var lightInfantryImage = new cc.Sprite(res.SEQ_LIGHT_INFANTRY);
        lightInfantryImage.setPosition(startX, startY);
        this.addChild(lightInfantryImage);
    },

    addHeavyCavalvyMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是heavy cavalvy的菜单
        var btnInterval = 60, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 540 + btnWidth / 2;
        var heavyCavalvyImage = new cc.Sprite(res.SEQ_HEAVY_CAVALVY);
        var impcthrsToggleBtn = new cc.MenuItemImage(
            res.UNIT_impactHorse, res.UNIT_impactHorse_ON, res.UNIT_impactHorse_OFF,
            this.unitBtnCallback.bind(this, armyTemplate.units.IMPACT_HORSE, this.moduleNameList.heavyCavalvyMenu),
            this
        );
        heavyCavalvyImage.setPosition(startX, startY);
        impcthrsToggleBtn.setScale(iScale, iScale);
        impcthrsToggleBtn.setName(armyTemplate.units.IMPACT_HORSE);
        impcthrsToggleBtn.setPosition(heavyCavalvyImage.x + btnWidth + middleInterval, startY);

        var hvyCvyMenu = new cc.Menu(impcthrsToggleBtn);
        hvyCvyMenu.x = 0;
        hvyCvyMenu.y = 0;
        hvyCvyMenu.setName(this.moduleNameList.heavyCavalvyMenu);
        this.addChild(heavyCavalvyImage);
        this.addChild(hvyCvyMenu);
    },

    addLightCavalvyMenu : function(size, gScale, iScale) {
        //////////////////////////////////////////
        // 以下是light cavalvy的菜单
        var btnInterval = 60, btnWidth = 150, middleInterval = 200,
            startX = 300 + btnWidth / 2, startY = 360 + btnWidth / 2;
        var hnthrsToggleBtn = new cc.MenuItemImage(
            res.UNIT_huntHorse, res.UNIT_huntHorse_ON, res.UNIT_huntHorse_OFF,
            this.unitBtnCallback.bind(this, armyTemplate.units.HUNT_HORSE, this.moduleNameList.lightCavalvyMenu),
            this
        );
        var lightCavalvyImage = new cc.Sprite(res.SEQ_LIGHT_CAVALVY);
        lightCavalvyImage.setPosition(startX, startY);
        hnthrsToggleBtn.setScale(iScale, iScale);
        hnthrsToggleBtn.setName(armyTemplate.units.HUNT_HORSE);
        hnthrsToggleBtn.setPosition(lightCavalvyImage.x + btnWidth + middleInterval, startY);

        var lghtCvyMenu = new cc.Menu(hnthrsToggleBtn);
        lghtCvyMenu.x = 0;
        lghtCvyMenu.y = 0;
        lghtCvyMenu.setName(this.moduleNameList.lightCavalvyMenu);
        this.addChild(lightCavalvyImage);
        this.addChild(lghtCvyMenu);
    },

    unitBtnCallback : function(unit, seq) {
        this.currentUnit.unit = unit;
        this.titledUnits[this.currentUnit.unit] == null ? this.titledUnits[this.currentUnit.unit] = [] : 1;
        var titledSeq = this.titledUnits[this.currentUnit.unit];
        this.currentUnit.title = titledSeq.length + 1;
        titledSeq.push(this.currentUnit.title);
        if (titledSeq.length === this.maxTitleLength) {
            this.getChildByName(seq).getChildByName(unit).setNormalSpriteFrame(res["UNIT_" + unit +  "_OFF"]);
            this.getChildByName(seq).getChildByName(unit).setCallback(function() {console.log("well done!")});
        }

        console.log(unit + " chosen!");
        this.lfBtnCallback(0);
    },

    lfBtnCallback : function(life) {
        this.currentUnit.loadUnit();
        this.currentUnit.life = this.currentUnit.maxLife - life;
        console.log(this.currentUnit);
        var parentNode = this.getParent();
        var displayLayer = parentNode.getChildByName(parentNode.moduleNameList.displayLayer);
        displayLayer.resumeLayer(this.currentUnit);
    },

    motiveLayer : function(unit) {
        this.currentUnit = unit;
    },

    onEnter : function() {
        this._super();

        console.log("config begin");
    },

    onExit : function() {
        this._super();
        //cc.eventManager.removeAllEventListeners();
    }
});