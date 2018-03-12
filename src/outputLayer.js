var OutputLayer = cc.Layer.extend({
    moduleNameList : {
        loopMenu : "loopMenu"
    },

    ctor : function() {
        this._super();

        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;

        ////////////////////////////////////
        // 背景
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(200, 200, 200));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);

        this.addOutputInfo(globalSize, globalScale, unitImageScale);
        this.addLoopButton(globalSize, globalScale, 2.5);

        return true;
    },

    addOutputInfo : function(size, gScale, imageScale) {
        var bar = 300;
        var fontSize = 50;

        var defenceImage = new cc.Sprite();
        defenceImage.setScale(imageScale, imageScale);
        var defenceString = new cc.LabelTTF();
        defenceString.setFontSize(fontSize);
        defenceImage.x = size.width / 2 - bar;
        defenceImage.y = defenceString.y = size.height / 2 + bar;
        defenceString.x = size.width / 2 + bar;
        this.addChild(defenceImage, 0, armyTemplate.status.DEFENCE + "_IMAGE");
        this.addChild(defenceString, 0, armyTemplate.status.DEFENCE + "_STRING");

        var attackImage = new cc.Sprite();
        attackImage.setScale(imageScale, imageScale);
        var attackString = new cc.LabelTTF();
        attackString.setFontSize(fontSize);
        attackImage.x = defenceImage.x;
        attackImage.y = attackString.y = size.height / 2 - bar;
        attackString.x = defenceString.x;
        this.addChild(attackImage, 0, armyTemplate.status.ATTACK + "_IMAGE");
        this.addChild(attackString, 0, armyTemplate.status.ATTACK + "_STRING");
    },

    addLoopButton : function(size, gScale, iScale) {
        console.log("add loop button!");

        var bar = 150;
        var loopButton = new cc.MenuItemToggle(
            new cc.MenuItemImage(
                res.BUTTON_RUN,
                res.BUTTON_RUN_GO
            ),
            this.loopBtnCallback,
            this
        );
        loopButton.setPosition(size.width - bar, bar);
        loopButton.setScale(iScale, iScale);
        var loopMenu = new cc.Menu(loopButton);
        loopMenu.setPosition(0, 0);
        loopMenu.setName(this.moduleNameList.loopMenu);
        this.addChild(loopMenu);
    },

    loopBtnCallback : function() {
        this.onPopLayer();
        var parentNode = this.getParent();
        parentNode.getChildByName(parentNode.moduleNameList.showUnitsLayer).onPushLayer();
    },

    loadOutput : function(defenceUnit, attackUnit) {
        console.log("show output!");

        this.onPushLayer();
        var showLayer = this.getParent().getChildByName(this.getParent().moduleNameList.showUnitsLayer);

        var attackString = this.getChildByName(armyTemplate.status.ATTACK + "_STRING");
        var defenceString = this.getChildByName(armyTemplate.status.DEFENCE + "_STRING");
        function paintString(unit, string) {
            // 根据life的数值来给出不同的颜色
            var normalColor = cc.color(125, 125, 125);
            var fleeColor = cc.color(255, 217, 101);
            var deathColor = cc.color(255, 0, 0);
            if (unit.life <= 0) {
                string.setColor(deathColor);
            }
            else if (unit.life <= unit.fleeLife)
                string.setColor(fleeColor);
            else
                string.setColor(normalColor);
            string.setString(unit.life);
        }
        paintString(defenceUnit, defenceString);
        paintString(attackUnit, attackString);
        paintString(defenceUnit, showLayer.getChildByName(showLayer.moduleNameList.lifeInfo + "." + defenceUnit.faction + "." + defenceUnit.serial));
        paintString(defenceUnit, showLayer.getChildByName(showLayer.moduleNameList.showLifeInfo + "." + defenceUnit.faction + "." + defenceUnit.serial));
        paintString(attackUnit, showLayer.getChildByName(showLayer.moduleNameList.lifeInfo + "." + attackUnit.faction + "." + attackUnit.serial));
        paintString(attackUnit, showLayer.getChildByName(showLayer.moduleNameList.showLifeInfo + "." + attackUnit.faction + "." + attackUnit.serial));

        var defenceImage = this.getChildByName(armyTemplate.status.DEFENCE + "_IMAGE");
        var attackImage = this.getChildByName(armyTemplate.status.ATTACK + "_IMAGE");
        defenceImage.setTexture(res["UNIT_" + defenceUnit.unit + "_ON"]);
        attackImage.setTexture(res["UNIT_ATTACK_" + attackUnit.unit]);
    },

    onPushLayer : function() {
        this.setVisible(true);
    },

    onPopLayer : function() {
        this.setVisible(false);
    },

    onEnter : function() {
        this._super();
        console.log("output layer in!!!");
    },

    onExit : function() {
        this._super();
    }
});