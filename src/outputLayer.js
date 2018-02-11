var OutputLayer = cc.Layer.extend({
    ctor : function() {
        this._super();

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

        this.addOutputInfo(globalSize, globalScale, unitImageScale);
        this.addLoopButton(globalSize, globalScale, unitImageScale);

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

    addLoopButton : function() {
        console.log("add loop button!");
    },

    onPushLayer : function() {
        this.setVisible(true);
    },

    onPopLayer : function() {
        this.setVisible(false);

    },

    loadOutput : function(defenceUnit, attackUnit, battleDamage, counterDamage) {
        console.log("show output!");

        this.onPushLayer();

        var attackString = this.getChildByName(armyTemplate.status.ATTACK + "_STRING");
        var defenceString = this.getChildByName(armyTemplate.status.DEFENCE + "_STRING");
        defenceString.setString(defenceUnit.troop.status + " : " + battleDamage);
        attackString.setString(attackUnit.troop.status + " : " + counterDamage);
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
        paintString(defenceUnit, defenceString);
        paintString(attackUnit, attackString);

        var defenceImage = this.getChildByName(armyTemplate.status.DEFENCE + "_IMAGE");
        var attackImage = this.getChildByName(armyTemplate.status.ATTACK + "_IMAGE");
        defenceImage.setTexture(res["UNIT_" + defenceUnit.troop.unit]);
        attackImage.setTexture(res["UNIT_" + attackUnit.troop.unit]);
    },

    onEnter : function() {
        this._super();
        console.log("output layer in!!!");
    },

    onExit : function() {
        this._super();
    }
});