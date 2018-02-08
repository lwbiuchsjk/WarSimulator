
var HelloWorldLayer = cc.Layer.extend({
    sprite : null,
    seqMenu : null,
    rankMenu : null,
    lifeMenu : null,
    runMenu : null,
    positionMenu : null,
    loopMenu : null,
    posListener : null,

    unitList : [],
    currentUnit: null,          // 取到当前正在处理的unit

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.director.getWinSize();

        ////////////////////////////////////
        // 背景
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(size.width, size.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        //////////////////////////////
        // seq菜单创建
        // 以下建立四个兵种的菜单。只有他们需要this[]来索引。其他Menu项可以直接通过this.来索引。
        this[armyTemplate.sequences.HEAVY_CAVALVY + "Menu"] = null;
        this[armyTemplate.sequences.HEAVY_INFANTRY + "Menu"] = null;
        this[armyTemplate.sequences.LIGHT_CAVALVY + "Menu"] = null;
        this[armyTemplate.sequences.LIGHT_INFANTRY + "Menu"] = null;

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
             ),
            this.seqBtnCallback.bind(this, armyTemplate.sequences.LIGHT_INFANTRY),
            this
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
        var runToggleBtn =  new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.BUTTON_RUN, res.BUTTON_RUN_GO
            ),
            this.outputCallback,
            this
        );
        var btnInterval = 60;
        var btnWidth = 250;
        hvyCvyToggleBtn.setScale(0.5, 0.5);
        lghtInfToggleBtn.setScale(0.5, 0.5);
        hvyInfToggleBtn.setScale(0.5, 0.5);
        lghtCvyToggleBtn.setScale(0.5, 0.5);
        runToggleBtn.setScale(2.5, 2.5);
        hvyCvyToggleBtn.x = size.width / 2;
        lghtInfToggleBtn.x = hvyCvyToggleBtn.x - btnWidth - btnInterval;
        hvyInfToggleBtn.x = lghtInfToggleBtn.x - btnWidth - btnInterval;
        lghtCvyToggleBtn.x = hvyCvyToggleBtn.x + btnWidth + btnInterval;
        runToggleBtn.x = lghtCvyToggleBtn.x + btnWidth + btnInterval;
        lghtInfToggleBtn.y = hvyInfToggleBtn.y = lghtCvyToggleBtn.y = runToggleBtn.y = hvyCvyToggleBtn.y = size.height / 2;

        var seqMenu = new cc.Menu(hvyInfToggleBtn, lghtInfToggleBtn, hvyCvyToggleBtn, lghtCvyToggleBtn, runToggleBtn);
        seqMenu.x = 0;
        seqMenu.y = 0;
        this.seqMenu = seqMenu;
        this.addChild(seqMenu);

        //////////////////////////////
        // 以下是heavy infantry的菜单
        var shldmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_SHIELDMAN, res.UNIT_SHIELDMAN_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.SHIELD_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var bwmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_BOWMAN, res.UNIT_BOWMAN_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.BOW_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var pkmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_PIKEMAN, res.UNIT_PIKEMAN_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.PIKE_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );
        var axmnToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_AXEMAN, res.UNIT_AXEMAN_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.AXE_MAN, armyTemplate.sequences.HEAVY_INFANTRY),
            this
        );

        shldmnToggleBtn.setScale(0.5, 0.5);
        bwmnToggleBtn.setScale(0.5, 0.5);
        pkmnToggleBtn.setScale(0.5, 0.5);
        axmnToggleBtn.setScale(0.5, 0.5);

        pkmnToggleBtn.x = size.width / 2 - btnInterval / 2 - btnWidth / 2;
        shldmnToggleBtn.x = pkmnToggleBtn.x - btnInterval - btnWidth;
        axmnToggleBtn.x = size.width / 2 + btnInterval / 2 + btnWidth / 2;
        bwmnToggleBtn.x = axmnToggleBtn.x + btnInterval + btnWidth;
        shldmnToggleBtn.y = pkmnToggleBtn.y = axmnToggleBtn.y = bwmnToggleBtn.y = size.height / 2;
        var hvyInfMenu = new cc.Menu(shldmnToggleBtn, pkmnToggleBtn, axmnToggleBtn, bwmnToggleBtn);
        hvyInfMenu.x = 0;
        hvyInfMenu.y = 0;
        hvyInfMenu.setVisible(false);
        this[armyTemplate.sequences.HEAVY_INFANTRY + "Menu"] = hvyInfMenu;
        this.addChild(hvyInfMenu);

        /////////////////////////////////////////
        // 以下是light infantry的菜单

        /////////////////////////////////////////
        // 以下是heavy cavalvy的菜单
        var impcthrsToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_IMPACTHORSE, res.UNIT_IMPACTHORSE_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.IMPACT_HORSE, armyTemplate.sequences.HEAVY_CAVALVY),
            this
        );
        impcthrsToggleBtn.setScale(0.5, 0.5);
        impcthrsToggleBtn.x = size.width / 2;
        impcthrsToggleBtn.y = size.height / 2;
        var hvyCvyMenu = new cc.Menu(impcthrsToggleBtn);
        hvyCvyMenu.x = 0;
        hvyCvyMenu.y = 0;
        hvyCvyMenu.setVisible(false);
        this[armyTemplate.sequences.HEAVY_CAVALVY + "Menu"] = hvyCvyMenu;
        this.addChild(hvyCvyMenu);

        //////////////////////////////////////////
        // 以下是light cavalvy的菜单
        var hnthrsToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.UNIT_HUNTHORSE, res.UNIT_HUNTHORSE_ON
            ),
            this.unitBtnCallback.bind(this, armyTemplate.units.HUNT_HORSE, armyTemplate.sequences.LIGHT_CAVALVY),
            this
        );
        hnthrsToggleBtn.setScale(0.5, 0.5);
        hnthrsToggleBtn.x = size.width / 2;
        hnthrsToggleBtn.y = size.height / 2;
        var lghtCvyMenu = new cc.Menu(hnthrsToggleBtn);
        lghtCvyMenu.x = 0;
        lghtCvyMenu.y = 0;
        lghtCvyMenu.setVisible(false);
        this[armyTemplate.sequences.LIGHT_CAVALVY + "Menu"] = lghtCvyMenu;
        this.addChild(lghtCvyMenu);

        ///////////////////////////////////////////////
        // 以下是rank菜单
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
        this.rankMenu = rankMenu;
        this.addChild(rankMenu);

        ///////////////////////////////////////
        // 以下是LIFE菜单
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
        this.lifeMenu = lifeMenu;
        this.addChild(lifeMenu);

        ////////////////////////////////////////////////
        // 以下是position菜单
        var pstUntToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.POSITION_UNIT, res.POSITION_UNIT_ON
            )
        );
        var facePositionToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.POSITION_FACE, res.POSITION_FACE_ON
            )
        );
        var leftPositionToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.POSITION_SIDE, res.POSITION_SIDE_ON
            )
        );
        var rightPositionToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.POSITION_SIDE, res.POSITION_SIDE_ON
            )
        );
        var backPositionToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.POSITION_BACK, res.POSITION_BACK_ON
            )
        );
        facePositionToggleBtn.setScale(2.5, 2.5);
        rightPositionToggleBtn.setScale(2.5, 2.5);
        leftPositionToggleBtn.setScale(2.5, 2.5);
        backPositionToggleBtn.setScale(2.5, 2.5);
        pstUntToggleBtn.setScale(2.5, 2.5);
        facePositionToggleBtn.setName(armyTemplate.position.FACE);
        rightPositionToggleBtn.setName("RIGHT_" + armyTemplate.position.SIDE);
        leftPositionToggleBtn.setName("LEFT_" + armyTemplate.position.SIDE);
        backPositionToggleBtn.setName(armyTemplate.position.BACK);
        pstUntToggleBtn.setName(armyTemplate.status.DEFENCE);

        var slfBtnWidth = pstUntToggleBtn.width * 2.5;
        pstUntToggleBtn.x = facePositionToggleBtn.x = backPositionToggleBtn.x = size.width / 2;
        pstUntToggleBtn.y = leftPositionToggleBtn.y = rightPositionToggleBtn.y = size.height / 2;
        facePositionToggleBtn.y = pstUntToggleBtn.y + slfBtnWidth;
        backPositionToggleBtn.y = pstUntToggleBtn.y - slfBtnWidth;
        leftPositionToggleBtn.x = pstUntToggleBtn.x - slfBtnWidth;
        rightPositionToggleBtn.x = pstUntToggleBtn.x + slfBtnWidth;
        var positionMenu = new cc.Menu(pstUntToggleBtn, facePositionToggleBtn, backPositionToggleBtn, leftPositionToggleBtn, rightPositionToggleBtn);
        positionMenu.x = positionMenu.y = 0;
        positionMenu.setVisible(false);
        this.positionMenu = positionMenu;
        this.addChild(positionMenu);

        ///////////////////////////////////////////////////
        // 以下是展示/loop环节
        var loopToggleBtn = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.BUTTON_RUN, res.BUTTON_RUN_GO
            ),
            this.loopBtnCallback,
            this
        );
        var bar = 300;
        var fontSize = 50;

        loopToggleBtn.x = size.width - bar / 2;
        loopToggleBtn.y = bar / 2;
        loopToggleBtn.setScale(2.5, 2.5);
        var loopMenu = new cc.Menu(loopToggleBtn);
        loopMenu.x = loopMenu.y = 0;
        this.loopMenu = loopMenu;
        loopMenu.setVisible(false);
        this.addChild(loopMenu);

        var defenceImage = new cc.Sprite();
        defenceImage.setScale(0.5, 0.5);
        var defenceString = new cc.LabelTTF();
        defenceString.setFontSize(fontSize);
        defenceImage.x = size.width / 2 - bar;
        defenceImage.y = defenceString.y = size.height / 2 + bar;
        defenceString.x = size.width / 2 + bar;
        defenceImage.setVisible(false);
        defenceString.setVisible(false);
        this.addChild(defenceImage, 0, armyTemplate.status.DEFENCE + "_IMAGE");
        this.addChild(defenceString, 0, armyTemplate.status.DEFENCE + "_STRING");

        var attackImage = new cc.Sprite();
        attackImage.setScale(0.5, 0.5);
        var attackString = new cc.LabelTTF();
        attackString.setFontSize(fontSize);
        attackImage.x = defenceImage.x;
        attackImage.y = attackString.y = size.height / 2 - bar;
        attackString.x = defenceString.x;
        attackImage.setVisible(false);
        attackImage.setVisible(false);
        this.addChild(attackImage, 0, armyTemplate.status.ATTACK + "_IMAGE");
        this.addChild(attackString, 0, armyTemplate.status.ATTACK + "_STRING");

        return true;
    },

    seqBtnCallback : function(seq) {
        this.seqMenu.setVisible(false);
        this[seq + "Menu"].setVisible(true);
        this.currentUnit = new Unit();
        console.log(seq + " chosen!");
    },

    unitBtnCallback : function(unit, seq) {
        this[seq + "Menu"].setVisible(false);
        this.rankMenu.setVisible(true);
        this.currentUnit.unit = unit;
        console.log(unit + " chosen!");
    },

    rnkBtnCallback : function(rank) {
        this.currentUnit.rank = rank;
        this.rankMenu.setVisible(false);
        this.lifeMenu.setVisible(true);
        console.log("rank " +  rank + " chosen!");
    },

    lfBtnCallback : function(life) {
        this.currentUnit.morale = life;
        if (this.unitList.length > 0) {
            // 已经处理过defenceUnit的情况下，选择attackUnit的位置
            this.lifeMenu.setVisible(false);
            this.positionMenu.setVisible(true);
            cc.eventManager.resumeTarget(this.positionMenu.getChildByName(armyTemplate.position.FACE), true);
            cc.eventManager.resumeTarget(this.positionMenu.getChildByName(armyTemplate.position.BACK), true);
            cc.eventManager.resumeTarget(this.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
            cc.eventManager.resumeTarget(this.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
        } else {
            this.currentUnit.status = armyTemplate.status.DEFENCE;
            this.currentUnit.position = armyTemplate.position.FACE;
            this.lifeMenu.setVisible(false);
            this.currentUnit.loadUnit();
            this.pstBtnCallback();
        }
        console.log("life " + life + " chosen!");
    },

    pstBtnCallback : function() {
        this.positionMenu.setVisible(false);
        this.unitList.push(this.currentUnit);
        this.seqMenu.setVisible(true);
    },

    outputCallback : function() {
        this.seqMenu.setVisible(false);
        var calculator = new DamageCalculator(this.unitList);
        console.log(calculator);

        var damageList = calculator.getDamage(calculator.attackList, calculator.defenceUnit);
        console.log(damageList);
        var defence = damageList[damageList.length - 1];
        var attack = damageList[0];

        var attackString = this.getChildByName(armyTemplate.status.ATTACK + "_STRING");
        var defenceString = this.getChildByName(armyTemplate.status.DEFENCE + "_STRING");
        defenceString.setString(defence.troop.status + " : " + defence.damage);
        attackString.setString(attack.troop.status + " : " + attack.damage);
        function paintString(unit, string) {
            // 根据life的数值来给出不同的颜色
            var normalColor = cc.color(0, 0, 0);
            var fleeColor = cc.color(255, 255, 255);
            var deathColor = cc.color(255, 0, 0);
            if (unit.damage >= unit.troop.moraleDestroy)
                string.setColor(deathColor);
            else if (unit.damage >= unit.troop.moraleFlee)
                string.setColor(fleeColor);
            else
                string.setColor(normalColor);
        }
        paintString(defence, defenceString);
        paintString(attack, attackString);

        var defenceImage = this.getChildByName(armyTemplate.status.DEFENCE + "_IMAGE");
        var attackImage = this.getChildByName(armyTemplate.status.ATTACK + "_IMAGE");
        defenceImage.setTexture(res["UNIT_" + defence.troop.unit.toUpperCase()]);
        attackImage.setTexture(res["UNIT_" + attack.troop.unit.toUpperCase()]);

        defenceString.setVisible(true);
        attackString.setVisible(true);
        defenceImage.setVisible(true);
        attackImage.setVisible(true);

        this.loopMenu.setVisible(true);
    },

    loopBtnCallback : function() {
        this.unitList = [];

        this.getChildByName(armyTemplate.status.DEFENCE + "_IMAGE").setVisible(false);
        this.getChildByName(armyTemplate.status.ATTACK + "_IMAGE").setVisible(false);
        this.getChildByName(armyTemplate.status.DEFENCE + "_STRING").setVisible(false);
        this.getChildByName(armyTemplate.status.ATTACK + "_STRING").setVisible(false);

        this.loopMenu.setVisible(false);
        this.seqMenu.setVisible(true);
    },

    onEnter : function() {
        this._super();

        var layer = this;

        /*
        if ("mouse" in cc.sys.capabilities) {
            this.posListener = cc.EventListener.create({
                event : cc.EventListener.MOUSE,

                onMouseDown : function(event) {
                    var target = event.getCurrentTarget();
                    var pos = target.convertToNodeSpace(event.getLocation());
                    var size = target.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);
                    if (cc.rectContainsPoint(rect, pos)) {
                        if (target.getName() === armyTemplate.position.FACE || target.getName() === armyTemplate.position.BACK) {
                            layer.currentUnit.position = target.getName();
                        }
                        else
                            layer.currentUnit.position = armyTemplate.position.SIDE;
                        layer.currentUnit.status = armyTemplate.status.ATTACK;
                        console.log("on " + layer.currentUnit.position + "\n" + layer.currentUnit.status);
                        return true;
                    }

                    return false;
                },
                onMouseMove : function(event) {
                },
                onMouseUp : function(event) {
                    var middle = layer.positionMenu.getChildByName(armyTemplate.status.DEFENCE);
                    var pos = middle.convertToNodeSpace(event.getLocation());
                    var size = middle.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);

                    if (cc.rectContainsPoint(rect, pos)) {
                        console.log(event.getCurrentTarget().getName());
                        layer.currentUnit.status = armyTemplate.status.ATTACK_CHARGE;
                    }

                    if (layer.currentUnit.status != null) {
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.FACE), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.BACK), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
                        layer.currentUnit.loadUnit();
                    }
                    return true;
                }
            });
            cc.eventManager.addListener(this.posListener, this.positionMenu.getChildByName(armyTemplate.position.FACE));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName(armyTemplate.position.BACK));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE));
        } else {
            this.posListener = cc.EventListener.create({
                event : cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches : true,

                onTouchBegan : function(touch, event) {
                    console.log("in");
                    var target = event.getCurrentTarget();
                    var pos = target.convertToNodeSpace(touch.getLocation());
                    var size = target.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);
                    if (cc.rectContainsPoint(rect, pos)) {
                        if (target.getName() === armyTemplate.position.FACE || target.getName() === armyTemplate.position.BACK) {
                            layer.currentUnit.position = target.getName();
                        }
                        else
                            layer.currentUnit.position = armyTemplate.position.SIDE;
                        layer.currentUnit.status = armyTemplate.status.ATTACK;
                        console.log("on " + layer.currentUnit.position + "\n" + layer.currentUnit.status);
                        return true;
                    }

                    return false;
                },
                onTouchMoved : function(touch, event) {
                },
                onTouchEnded : function(touch, event) {
                    var middle = layer.positionMenu.getChildByName(armyTemplate.status.DEFENCE);
                    var pos = middle.convertToNodeSpace(touch.getLocation());
                    var size = middle.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);

                    if (cc.rectContainsPoint(rect, pos)) {
                        console.log(event.getCurrentTarget().getName());
                        layer.currentUnit.status = armyTemplate.status.ATTACK_CHARGE;
                    }

                    if (layer.currentUnit.status != null) {
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.FACE), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.BACK), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
                        cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
                        layer.currentUnit.loadUnit();
                    }
                    return true;
                }
            });
            // 针对ios添加的监听器，使用touch_one_by_one
            cc.eventManager.addListener(this.posListener, this.positionMenu.getChildByName(armyTemplate.position.FACE));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName(armyTemplate.position.BACK));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE));
            cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE));
        }
        */

        this.posListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : false,

            onTouchBegan : function(touch, event) {
                console.log("in");
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    if (target.getName() === armyTemplate.position.FACE || target.getName() === armyTemplate.position.BACK) {
                        layer.currentUnit.position = target.getName();
                    }
                    else
                        layer.currentUnit.position = armyTemplate.position.SIDE;
                    layer.currentUnit.status = armyTemplate.status.ATTACK;
                    console.log("on " + layer.currentUnit.position + "\n" + layer.currentUnit.status);
                    return true;
                }

                return false;
            },
            onTouchMoved : function(touch, event) {
            },
            onTouchEnded : function(touch, event) {
                var middle = layer.positionMenu.getChildByName(armyTemplate.status.DEFENCE);
                var pos = middle.convertToNodeSpace(touch.getLocation());
                var size = middle.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);

                if (cc.rectContainsPoint(rect, pos)) {
                    console.log(event.getCurrentTarget().getName());
                    layer.currentUnit.status = armyTemplate.status.ATTACK_CHARGE;
                } else {
                    var targetName = event.getCurrentTarget().getName();
                    if ((targetName === armyTemplate.position.FACE && pos.y - 2 * size.height > 0) ||
                        (targetName === armyTemplate.position.BACK && pos.y + size.height < 0) ||
                        (targetName === "RIGHT_" + armyTemplate.position.SIDE && pos.x - 2 * size.width > 0) ||
                        (targetName === "LEFT_" + armyTemplate.position.SIDE && pos.x + size.width < 0)) {
                        layer.currentUnit.status = armyTemplate.status.ATTACK_REMOTE;
                        console.log(layer.currentUnit.status);
                    }
                }
                if (layer.currentUnit.status != null) {
                    console.log("pause");
                    cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.FACE), true);
                    cc.eventManager.pauseTarget(layer.positionMenu.getChildByName(armyTemplate.position.BACK), true);
                    cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
                    cc.eventManager.pauseTarget(layer.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
                    layer.currentUnit.loadUnit();
                    layer.pstBtnCallback();
                }
                return true;
            }
        });
        // 针对ios添加的监听器，使用touch_one_by_one
        cc.eventManager.addListener(this.posListener, this.positionMenu.getChildByName(armyTemplate.position.FACE));
        cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName(armyTemplate.position.BACK));
        cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE));
        cc.eventManager.addListener(this.posListener.clone(), this.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE));

        console.log(this.posListener);
        cc.eventManager.pauseTarget(this.positionMenu.getChildByName(armyTemplate.position.FACE), true);
        cc.eventManager.pauseTarget(this.positionMenu.getChildByName(armyTemplate.position.BACK), true);
        cc.eventManager.pauseTarget(this.positionMenu.getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
        cc.eventManager.pauseTarget(this.positionMenu.getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
    },

    onExit : function() {
        this._super();
        cc.eventManager.removeAllEventListeners();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

