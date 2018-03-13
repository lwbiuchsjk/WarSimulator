var OutputLayer = cc.Layer.extend({
    ctor : function() {
        this._super();

        ////////////////////////////////////
        // 背景
        return true;
    },

    loadOutput : function(defenceUnit, attackUnit) {
        console.log("show output!");
        var showLayer = this.getParent().getChildByName(this.getParent().moduleNameList.showUnitsLayer);

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
        paintString(defenceUnit, showLayer.getChildByName(showLayer.moduleNameList.lifeInfo + "." + defenceUnit.faction + "." + defenceUnit.serial));
        paintString(defenceUnit, showLayer.getChildByName(showLayer.moduleNameList.showLifeInfo + "." + defenceUnit.faction + "." + defenceUnit.serial));
        paintString(attackUnit, showLayer.getChildByName(showLayer.moduleNameList.lifeInfo + "." + attackUnit.faction + "." + attackUnit.serial));
        paintString(attackUnit, showLayer.getChildByName(showLayer.moduleNameList.showLifeInfo + "." + attackUnit.faction + "." + attackUnit.serial));

        var parentNode = this.getParent();
        parentNode.getChildByName(parentNode.moduleNameList.showUnitsLayer).reloadLayer([defenceUnit, attackUnit]);
    },

    onEnter : function() {
        this._super();
        console.log("output layer in!!!");
    },

    onExit : function() {
        this._super();
    }
});