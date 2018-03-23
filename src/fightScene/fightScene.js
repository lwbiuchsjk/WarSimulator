var BattleScene = cc.Scene.extend({
    enemyTroops : null,
    myTroops : null,

    moduleNameList : {
        showUnitsLayer : "showUnitsLayer",
        battleLayer : "battleLayer",
        outputLayer : "outputLayer"
    },

    ctor : function(mines, enemies) {
        this._super();

        this.myTroops = mines;
        this.enemyTroops = enemies;

        var showUnitsLayer = new ShowUnitsLayer();
        showUnitsLayer.setName(this.moduleNameList.showUnitsLayer);
        this.addChild(showUnitsLayer);

        var battleLayer = new BattleLayer();
        battleLayer.setName(this.moduleNameList.battleLayer);
        battleLayer.setVisible(false);
        this.addChild(battleLayer);

        var outputLayer = new OutputLayer();
        outputLayer.setName(this.moduleNameList.outputLayer);
        outputLayer.setVisible(false);
        this.addChild(outputLayer);

        return true;
    },

    onEnter : function() {
        this._super();
    },

    onExit : function() {
        this._super();
    }
});