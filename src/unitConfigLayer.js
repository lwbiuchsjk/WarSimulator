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
     * 在各troop中，如果一个unit第一次被选择，则新建一个该unit的array(6)结构，并推入对应troop。
     * 在该array中，数组下标装在对应的title，对应关系为iter = title - 1。这是因为在所有title与iter共存的环境中，约定两者之间差1。
     * 特别是res中，title图片的url是从1开始命名。在title组件中，name属性中包含的数字也是从1开始。
     * 这就使得当前unit的array(6)结构中，与title组件button的数组下标有对应关系。方便快速检索。
     */
    titledUnits : {
        myTroops : [],
        enemyTroops : []
    },
    posListener : null,
    currentUnit: null,          // 取到当前正在处理的unit

    ctor : function() {
        this._super();
        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var imageScale = 1;
        this.addSeqMenu(globalSize, globalScale, imageScale);
        this.addHeavyInfantryMenu(globalSize, globalScale, imageScale);
        this.addLightInfantryMenu(globalSize, globalScale, imageScale);
        this.addHeavyCavalvyMenu(globalSize, globalScale, imageScale);
        this.addLightCavalvyMenu(globalSize, globalScale, imageScale);
        this.addRankMenu(globalSize, globalScale, imageScale);
        this.addLifeMenu(globalSize, globalScale, imageScale);
        this.addTitleMenu(globalSize, globalScale, 1);
        return true;

    },
    addSeqMenu : function(size, gScale, iScale) {
        //////////////////////////////
        // seq菜单创建
        // 以下建立四个兵种的菜单。只有他们需要this[]来索引。其他Menu项可以直接通过this.来索引。
        var hvyInfToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.SEQ_HEAVY_INFANTRY, res.SEQ_HEAVY_INFANTRY_ON
            ),
            this.seqBtnCallback.bind(this, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var lghtInfToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.SEQ_LIGHT_INFANTRY, res.SEQ_LIGHT_INFANTRY_ON
            )/*,
            this.seqBtnCallback.bind(this, armyTemplate.sequences.LIGHT_INFANTRY),
            this
            */
        );
        var hvyCvyToggleBtn =  new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.SEQ_HEAVY_CAVALVY, res.SEQ_HEAVY_CAVALVY_ON
            ),
            this.seqBtnCallback.bind(this, armyTemplate.sequences.HEAVY_CAVALVY),
            this
        );
        var lghtCvyToggleBtn =  new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.SEQ_LIGHT_CAVALVY, res.SEQ_LIGHT_CAVALVY_ON
            ),
            this.seqBtnCallback.bind(this, armyTemplate.sequences.LIGHT_CAVALVY),
            this
        );

        var btnInterval = 200;
        var btnWidth = 150;
        hvyCvyToggleBtn.setScale(iScale, iScale);
        lghtInfToggleBtn.setScale(iScale, iScale);
        hvyInfToggleBtn.setScale(iScale, iScale);
        lghtCvyToggleBtn.setScale(iScale, iScale);
        hvyCvyToggleBtn.x = size.width / 2 + (btnInterval + btnWidth) / 2;
        lghtInfToggleBtn.x = hvyCvyToggleBtn.x - btnWidth - btnInterval;
        hvyInfToggleBtn.x = lghtInfToggleBtn.x - btnWidth - btnInterval;
        lghtCvyToggleBtn.x = hvyCvyToggleBtn.x + btnWidth + btnInterval;
        lghtInfToggleBtn.y = hvyInfToggleBtn.y = lghtCvyToggleBtn.y = hvyCvyToggleBtn.y = size.height / 2;

        var seqMenu = new cc.Menu(hvyInfToggleBtn, lghtInfToggleBtn, hvyCvyToggleBtn, lghtCvyToggleBtn);
        seqMenu.x = 0;
        seqMenu.y = 0;
        seqMenu.setName(this.moduleNameList.seqMenu);
        this.addChild(seqMenu);
    },

    addHeavyInfantryMenu : function(size, gScale, iScale) {
        //////////////////////////////
        // 以下是heavy infantry的菜单
        var btnInterval = 60;
        var btnWidth = 250;
        var shldmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_shieldMan, res.UNIT_SHIELDMAN_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.SHIELD_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var bwmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_bowMan, res.UNIT_bowMan_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.BOW_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var pkmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_pikeMan, res.UNIT_pikeMan_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.PIKE_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var axmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_axeMan, res.UNIT_axeMan_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.AXE_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );

        shldmnToggleBtn.setScale(iScale, iScale);
        bwmnToggleBtn.setScale(iScale, iScale);
        pkmnToggleBtn.setScale(iScale, iScale);
        axmnToggleBtn.setScale(iScale, iScale);
        pkmnToggleBtn.x = size.width / 2 - btnInterval / 2 - btnWidth / 2;
        shldmnToggleBtn.x = pkmnToggleBtn.x - btnInterval - btnWidth;
        axmnToggleBtn.x = size.width / 2 + btnInterval / 2 + btnWidth / 2;
        bwmnToggleBtn.x = axmnToggleBtn.x + btnInterval + btnWidth;
        shldmnToggleBtn.y = pkmnToggleBtn.y = axmnToggleBtn.y = bwmnToggleBtn.y = size.height / 2;
        var hvyInfMenu = new cc.Menu(shldmnToggleBtn, pkmnToggleBtn, axmnToggleBtn, bwmnToggleBtn);
        hvyInfMenu.x = 0;
        hvyInfMenu.y = 0;
        hvyInfMenu.setVisible(false);
        hvyInfMenu.setName(this.moduleNameList.heavyInfantryMenu);
        this.addChild(hvyInfMenu);
    },

    addLightInfantryMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是light infantry的菜单
    },

    addHeavyCavalvyMenu : function(size, gScale, iScale) {
        /////////////////////////////////////////
        // 以下是heavy cavalvy的菜单
        var impcthrsToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_impactHorse, res.UNIT_impactHorse_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.IMPACT_HORSE, armyTemplate.sequences.HEAVY_CAVALVY),
            this
        );
        impcthrsToggleBtn.setScale(iScale, iScale);
        impcthrsToggleBtn.x = size.width / 2;
        impcthrsToggleBtn.y = size.height / 2;
        var hvyCvyMenu = new cc.Menu(impcthrsToggleBtn);
        hvyCvyMenu.x = 0;
        hvyCvyMenu.y = 0;
        hvyCvyMenu.setVisible(false);
        hvyCvyMenu.setName(this.moduleNameList.heavyCavalvyMenu);
        this.addChild(hvyCvyMenu);
    },

    addLightCavalvyMenu : function(size, gScale, iScale) {
        //////////////////////////////////////////
        // 以下是light cavalvy的菜单
        var hnthrsToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_huntHorse, res.UNIT_huntHorse_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.HUNT_HORSE, armyTemplate.sequences.LIGHT_CAVALVY),
            this
        );
        hnthrsToggleBtn.setScale(iScale, iScale);
        hnthrsToggleBtn.x = size.width / 2;
        hnthrsToggleBtn.y = size.height / 2;
        var lghtCvyMenu = new cc.Menu(hnthrsToggleBtn);
        lghtCvyMenu.x = 0;
        lghtCvyMenu.y = 0;
        lghtCvyMenu.setVisible(false);
        lghtCvyMenu.setName(this.moduleNameList.lightCavalvyMenu);
        this.addChild(lghtCvyMenu);
    },

    addRankMenu : function(size, gScale, iScale) {
        ///////////////////////////////////////////////
        // 以下是rank菜单
        var btnInterval = 60;
        var btnWidth = 250;
        var rank2ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.RANK2, res.RANK2_ON
            ),
            this.rnkBtnCallback.bind(this, 2),
            this
        );
        var rank1ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.RANK1, res.RANK1_ON
            ),
            this.rnkBtnCallback.bind(this, 1),
            this
        );
        var rank3ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.RANK3, res.RANK3_ON
            ),
            this.rnkBtnCallback.bind(this, 3),
            this
        );
        rank1ToggleBtn.setScale(2.5, 2.5);
        rank2ToggleBtn.setScale(2.5, 2.5);
        rank3ToggleBtn.setScale(2.5, 2.5);
        rank2ToggleBtn.x = size.width / 2;
        rank1ToggleBtn.x = rank2ToggleBtn.x - btnWidth - btnInterval;
        rank3ToggleBtn.x = rank2ToggleBtn.x + btnWidth + btnInterval;
        rank1ToggleBtn.y = rank3ToggleBtn.y = rank2ToggleBtn.y = size.height / 2;
        var rankMenu = new cc.Menu(rank1ToggleBtn, rank2ToggleBtn, rank3ToggleBtn);
        rankMenu.x = 0;
        rankMenu.y = 0;
        rankMenu.setVisible(false);
        rankMenu.setName(this.moduleNameList.rankMenu);
        this.addChild(rankMenu);
    },

    addTitleMenu : function(size, gScale, iScale) {
        var titleButtons = [];
        var startX = 435,         // 85
            middleInterval = 30;       // 80
        for (var iter = 0; iter < 6; iter++) {
            var titleButton = new cc.MenuItemImage(
                res["TITLE_" + (iter + 1)],
                res["TITLE_ON_" + (iter + 1)],
                this.titleBtnCallback.bind(this, iter + 1),
                this
            );
            titleButton.setPosition(startX + (titleButton.width + middleInterval) * iter, size.height / 2);
            titleButton.setAnchorPoint(0, 0);
            titleButton.setScale(iScale, iScale);
            titleButtons.push(titleButton);
            titleButton.setName(this.moduleNameList.titleMenu + "." + (iter + 1));
            console.log(titleButton);
        }
        var titleMenu = new cc.Menu(titleButtons);
        titleMenu.setPosition(0, 0);
        titleMenu.setName(this.moduleNameList.titleMenu);
        titleMenu.setVisible(false);
        this.addChild(titleMenu);
    },

    addLifeMenu : function(size, gScale, iScale) {
        ///////////////////////////////////////
        // 以下是LIFE菜单
        var btnInterval = 60;
        var btnWidth = 250;
        var life1ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE1, res.LIFE1_ON
            ),
            this.lfBtnCallback.bind(this, 1),
            this
        );
        var life2ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE2, res.LIFE2_ON
            ),
            this.lfBtnCallback.bind(this, 2),
            this
        );
        var life3ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE3, res.LIFE3_ON
            ),
            this.lfBtnCallback.bind(this, 3),
            this
        );
        var life4ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE4, res.LIFE4_ON
            ),
            this.lfBtnCallback.bind(this, 4),
            this
        );
        var life5ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE5, res.LIFE5_ON
            ),
            this.lfBtnCallback.bind(this, 5),
            this
        );
        var life0ToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.LIFE0, res.LIFE0_ON
            ),
            this.lfBtnCallback.bind(this, 0),
            this
        );
        life1ToggleBtn.setScale(2.5, 2.5);
        life2ToggleBtn.setScale(2.5, 2.5);
        life3ToggleBtn.setScale(2.5, 2.5);
        life4ToggleBtn.setScale(2.5, 2.5);
        life5ToggleBtn.setScale(2.5, 2.5);
        life0ToggleBtn.setScale(2.5, 2.5);
        life2ToggleBtn.x = size.width / 2 - btnInterval / 2 - btnWidth / 2;
        life3ToggleBtn.x = size.width /2 + btnInterval / 2 + btnWidth / 2;
        life1ToggleBtn.x = life2ToggleBtn.x - btnWidth - btnInterval;
        life0ToggleBtn.x = life1ToggleBtn.x - btnWidth - btnInterval;
        life4ToggleBtn.x = life3ToggleBtn.x + btnWidth + btnInterval;
        life5ToggleBtn.x = life4ToggleBtn.x + btnWidth + btnInterval;
        life1ToggleBtn.y = life2ToggleBtn.y = life3ToggleBtn.y = life4ToggleBtn.y = life5ToggleBtn.y = life0ToggleBtn.y = size.height / 2;
        var lifeMenu = new cc.Menu(life1ToggleBtn, life2ToggleBtn, life3ToggleBtn, life4ToggleBtn, life5ToggleBtn, life0ToggleBtn);
        lifeMenu.x = lifeMenu.y = 0;
        lifeMenu.setVisible(false);
        lifeMenu.setName(this.moduleNameList.lifeMenu);
        this.addChild(lifeMenu);
    },

    seqBtnCallback : function(seq) {
        var seqMenu = this.getChildByName(this.moduleNameList.seqMenu);
        seqMenu.setVisible(false);
        var armyMenu = this.getChildByName(seq + "Menu");
        armyMenu.setVisible(true);
        console.log(seq + " chosen!");
    },

    unitBtnCallback : function(unit, seq) {
        this.getChildByName(seq + "Menu").setVisible(false);
        this.getChildByName(this.moduleNameList.rankMenu).setVisible(true);
        this.currentUnit.unit = unit;
        console.log(unit + " chosen!");
    },

    rnkBtnCallback : function(rank) {
        this.currentUnit.rank = rank;
        this.getChildByName(this.moduleNameList.rankMenu).setVisible(false);
        var titleMenu = this.getChildByName(this.moduleNameList.titleMenu);
        titleMenu.setVisible(true);

        //////////////////////////////////////////////////////////////
        // 以下是通过titleUnits结果来检索当前unit的title的选取结果。将已经选取的title处理为不可选取。
        var titledSeq = this.titledUnits[this.currentUnit.faction][this.currentUnit.unit];
        for (var iter = 0; iter < titleMenu.getChildren().length; iter++) {
            var titleItem = titleMenu.getChildByName(this.moduleNameList.titleMenu + "." + (iter + 1));

            if (!titledSeq) {
                titleItem.setNormalSpriteFrame(res["TITLE_" + (iter + 1)]);
                titleItem.setCallback(this.titleBtnCallback.bind(this, iter + 1));
                continue;
            }
            if (titledSeq[iter]) {
                titleItem.setNormalSpriteFrame(res["TITLE_ON_" + (iter + 1)]);
                titleItem.setCallback(function() {console.log("well done!!!");});
            } else {
                titleItem.setNormalSpriteFrame(res["TITLE_" + (iter + 1)]);
                titleItem.setCallback(this.titleBtnCallback.bind(this, iter + 1));
            }
            console.log(titleItem);
        }

        console.log("rank " +  rank + " chosen!");
    },

    titleBtnCallback : function(title) {
        this.currentUnit.title = title;

        // 以下是通过titledUnits结构来更新并记录已经选取过的unit的title。
        var titledSeq = this.titledUnits[this.currentUnit.faction][this.currentUnit.unit];
        if (!titledSeq)
            this.titledUnits[this.currentUnit.faction][this.currentUnit.unit] = new Array(6);
        this.titledUnits[this.currentUnit.faction][this.currentUnit.unit][title - 1] = title;
        console.log(this.titledUnits);
        this.getChildByName(this.moduleNameList.titleMenu).setVisible(false);
        //this.getChildByName(this.moduleNameList.lifeMenu).setVisible(true);
        this.lfBtnCallback(0);
        console.log("title " + title + " chosen!");
    },

    lfBtnCallback : function(life) {
        this.currentUnit.loadUnit();

        this.currentUnit.life = this.currentUnit.maxLife - life;
        console.log("life " + this.currentUnit.life + " chosen!");
        var parentNode = this.getParent();
        var displayLayer = parentNode.getChildByName(parentNode.moduleNameList.displayLayer);
        displayLayer.resumeLayer(this.currentUnit);
        this.setVisible(false);
    },

    motiveLayer : function(unit) {
        this.currentUnit = unit;
        this.setVisible(true);
        this.getChildByName(this.moduleNameList.lifeMenu).setVisible(false);
        this.getChildByName(this.moduleNameList.seqMenu).setVisible(true);
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