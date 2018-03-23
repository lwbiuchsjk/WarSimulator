var LoadConfigScene = cc.Scene.extend({
   ctor : function() {
       this._super();
       this.addChild(new LoadConfigLayer());
   }
});

var LoadConfigLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        this._super();


        var globalSize = cc.director.getWinSize();
        var globalScale = globalSize.width / 1920;
        var unitImageScale = 1;
        var boxSize = cc.size(300, 100);

        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(0, 0), cc.p(globalSize.width, globalSize.height), cc.color(125, 125, 125));
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(0, 0);
        this.addChild(bg);


    },

    onEnter : function() {
        cc.loader.loadJson(messageCode.CONFIG_FILE, function(err, data) {
            console.log(data["server"]);
            messageCode.COMMUNICATION_ADDRESS = data["server"];
            cc.director.pushScene(new UserScene());
        });
    }
});