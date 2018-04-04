var OutputLayer = cc.Layer.extend({
    ctor : function() {
        this._super();

        ////////////////////////////////////
        // 背景
        return true;
    },

    loadOutput : function(defenceUnit, attackUnit, paintTroops) {
        // 进入本函数后一定要确保unit.life与unit.nowLife相等。
        // 在这里批量对paintTroops进行处理。
        console.log("show output!");
        var showLayer = this.getParent().getChildByName(this.getParent().moduleNameList.showUnitsLayer);

        function paintString(unit, string) {
            // 根据life的数值来给出不同的颜色
            var normalColor = cc.color(125, 125, 125);
            var fleeColor = cc.color(255, 217, 101);
            var deathColor = cc.color(255, 0, 0);
            if (unit.nowLife <= 0)
                string.setColor(deathColor);
            else if (unit.nowLife <= unit.fleeLife)
                string.setColor(deathColor);
            else
                string.setColor(normalColor);
            string.setString(unit.nowLife);
        }

        paintTroops.forEach(function(unit) {
            paintString(unit, showLayer.getChildByName(showLayer.moduleNameList.lifeInfo + "." + unit.faction + "." + unit.serial));
            paintString(unit, showLayer.getChildByName(showLayer.moduleNameList.showLifeInfo + "." + unit.faction + "." + unit.serial));
            var button = showLayer.getChildByName(unit.faction + "." + unit.serial);
            var texture;
            if (unit.nowLife <= 0) {
                texture = "UNIT_OFF_";
                cc.eventManager.pauseTarget(button, true);
            } else if (showLayer.damageCalculator.checkUnitMoved(unit)) {
                // 如果正常通过outputCallback进入本函数，那么movedTroops已经被reset成功，这一部分就不会被调用。
                // 如果初始化过程中直接调用本函数，那么movedTroops不为空，因此会进入这一部分调用。
                texture = "UNIT_OFF_";
            } else
                texture = "UNIT_";
            button.setTexture(res[texture + unit.unit]);
        });

        showLayer.reloadLayer(attackUnit, defenceUnit);
    },

    onEnter : function() {
        this._super();
        console.log("output layer in!!!");
    },

    onExit : function() {
        this._super();
    }
});