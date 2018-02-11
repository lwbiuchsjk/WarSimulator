var BattleLayer = cc.Layer.extend({
    defenceUnit : null,
    currentUnit : null,
    positionMenu : null,

    moduleNameList : {
        positionMenu : "positionMenu",
        defenceButton : "defenceButton"
    },

    ctor : function() {
        this._super();
        console.log("battle layer loading!");

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

        this.addPositionMenu(globalSize, globalScale, unitImageScale);
        return true;
    },
    addPositionMenu : function(size, gScale, imageScale) {
        ////////////////////////////////////////////////
        // 以下是position菜单
        var defenceButton = new cc.Sprite(res.UNIT_ON);
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
        defenceButton.setScale(imageScale, imageScale);

        // 给按钮设置名称，方便检索
        facePositionToggleBtn.setName(armyTemplate.position.FACE);
        rightPositionToggleBtn.setName("RIGHT_" + armyTemplate.position.SIDE);
        leftPositionToggleBtn.setName("LEFT_" + armyTemplate.position.SIDE);
        backPositionToggleBtn.setName(armyTemplate.position.BACK);

        var slfBtnWidth = facePositionToggleBtn.width * 2.5;
        defenceButton.x = facePositionToggleBtn.x = backPositionToggleBtn.x = size.width / 2;
        defenceButton.y = leftPositionToggleBtn.y = rightPositionToggleBtn.y = size.height / 2;
        facePositionToggleBtn.y = defenceButton.y + slfBtnWidth;
        backPositionToggleBtn.y = defenceButton.y - slfBtnWidth;
        leftPositionToggleBtn.x = defenceButton.x - slfBtnWidth;
        rightPositionToggleBtn.x = defenceButton.x + slfBtnWidth;
        var positionMenu = new cc.Menu(facePositionToggleBtn, backPositionToggleBtn, leftPositionToggleBtn, rightPositionToggleBtn);
        positionMenu.x = positionMenu.y = 0;
        positionMenu.setName(this.moduleNameList.positionMenu);
        defenceButton.setName(this.moduleNameList.defenceButton);
        this.addChild(positionMenu);
        this.addChild(defenceButton);
    },

    onPushLayer : function() {
        ////////////////////////////////////////////////
        // 调整不同图层显示。显示本图层，隐藏unit展示图层
        this.setVisible(true);
        cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.defenceButton));
        cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.FACE));
        cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.BACK));
        cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("RIGHT_" + armyTemplate.position.SIDE));
        cc.eventManager.resumeTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("LEFT_" + armyTemplate.position.SIDE));
    },

    onPopLayer : function() {
        ////////////////////////////////////////////////
        // 调整不同图层显示。显示unit展示图层，隐藏本图层。
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.defenceButton), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.FACE), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.BACK), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
        this.setVisible(false);
    },

    loadDefenceUnit : function(unit) {
        this.defenceUnit = unit;
        this.getChildByName(this.moduleNameList.defenceButton).setTexture(res["UNIT_" + unit.unit]);
    },

    loadAttackUnit : function(unit) {
        this.currentUnit = unit;
    },

    eraseUnits : function() {
        this.defenceUnit = null;
        this.currentUnit = null;
    },

    onEnter : function() {
        this._super();
        console.log("battle layer loading");

        var layer = this;
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
                    if (target.getName() === armyTemplate.position.FACE || target.getName() === armyTemplate.position.BACK)
                        layer.currentUnit.position = target.getName();
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
                var middle = layer.getChildByName(layer.moduleNameList.defenceButton),
                    posToMiddle = middle.convertToNodeSpace(touch.getLocation()),
                    middleSize = middle.getContentSize(),
                    middleRect = cc.rect(0, 0, middleSize.width, middleSize.height);

                var target = event.getCurrentTarget(),
                    targetSize = target.getContentSize(),
                    targetRect = cc.rect(0, 0, targetSize.width, targetSize.height),
                    posToTarget = target.convertToNodeSpace(touch.getLocation());

                var parentNode = layer.getParent();
                var showUnitsLayer = parentNode.getChildByName(parentNode.moduleNameList.showUnitsLayer);

                if (cc.rectContainsPoint(middleRect, posToMiddle)) {
                    console.log(event.getCurrentTarget().getName());
                    layer.currentUnit.status = armyTemplate.status.ATTACK_CHARGE;
                    console.log(layer.currentUnit.status);

                    layer.onPopLayer();
                    showUnitsLayer.onPushLayer(layer.currentUnit);
                    return true;
                }
                var targetName = target.getName();
                if ((targetName === armyTemplate.position.FACE && posToTarget.y > targetSize.height) ||
                    (targetName === armyTemplate.position.BACK && posToTarget.y < 0) ||
                    (targetName === "RIGHT_" + armyTemplate.position.SIDE && posToTarget.x > targetSize.width) ||
                    (targetName === "LEFT_" + armyTemplate.position.SIDE && posToTarget.x < 0)) {
                    layer.currentUnit.status = armyTemplate.status.ATTACK_REMOTE;
                    console.log(layer.currentUnit.status);

                    layer.onPopLayer();
                    showUnitsLayer.onPushLayer(layer.currentUnit);
                    return true;
                }

                if (cc.rectContainsPoint(targetRect, posToTarget)) {
                    console.log(layer.currentUnit.status);

                    layer.onPopLayer();
                    showUnitsLayer.onPushLayer(layer.currentUnit);
                    return true;
                }
                return false;
            }
        });
        var dfsBtnListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : false,
            onTouchBegan : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos))
                    target.setTexture(res["UNIT_" + layer.defenceUnit.unit + "_ON"]);
                return true;
            },
            onTouchMoved : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos))
                    target.setTexture(res["UNIT_" + layer.defenceUnit.unit + "_ON"]);
                return true;
            },
            onTouchEnded : function(touch, event) {
                var target = event.getCurrentTarget();
                var pos = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0 ,0, size.width, size.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    target.setTexture(res["UNIT_" + layer.defenceUnit.unit]);
                    return true;
                } else
                    return false;
            }
        });

        // 针对ios添加的监听器，使用touch_one_by_one
        cc.eventManager.addListener(dfsBtnListener, this.getChildByName(this.moduleNameList.defenceButton));
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.defenceButton), true);

        cc.eventManager.addListener(this.posListener, this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.FACE));
        cc.eventManager.addListener(this.posListener.clone(), this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.BACK));
        cc.eventManager.addListener(this.posListener.clone(), this.getChildByName(this.moduleNameList.positionMenu).getChildByName("RIGHT_" + armyTemplate.position.SIDE));
        cc.eventManager.addListener(this.posListener.clone(), this.getChildByName(this.moduleNameList.positionMenu).getChildByName("LEFT_" + armyTemplate.position.SIDE));
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.FACE), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName(armyTemplate.position.BACK), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("RIGHT_" + armyTemplate.position.SIDE), true);
        cc.eventManager.pauseTarget(this.getChildByName(this.moduleNameList.positionMenu).getChildByName("LEFT_" + armyTemplate.position.SIDE), true);
    },
    onExit : function() {
        this._super();
        console.log("battle layer wiping");
    }
});