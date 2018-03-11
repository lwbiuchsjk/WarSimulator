/*
 * armyTemplate作为数据库存在。正常情况下，应该使用一个独立数据库来存储数据。
 * Army应当是一个独立的类，通过参数来索引数据库中的相关条目，然后创建一个独立的army结构。
 *
 * 当前的存储方式，只能手工创建与导入。还没有找到自动化的方法。
 * 另外，当前的engage属性还没有利用起来。
 */

var armyTemplate = {
    sequences : {
        HEAVY_INFANTRY : "heavyInfantry",
        LIGHT_INFANTRY : "lightInfantry",
        HEAVY_CAVALVY : "heavyCavalvy",
        LIGHT_CAVALVY : "lightCavalvy"
    },
    status : {
        ////////////////////////////////////
        // 所有新增的单位状态都需要在这里备案
        DEFENCE : "defence",                                  //近距离防御姿态
        DEFENCE_CHARGE_FACE : "defence_charge_face",          //近距离防御姿态，进攻方正在正面冲锋
        ATTACK : "attack",                                    //近距离进攻姿态
        ATTACK_CHARGE : "attack_charge",                      //近距离进攻_冲锋姿态
        ATTACK_CHARGE_ADVANTAGE : "attack_charge_advantage",  //近距离进攻_冲锋_优势位置姿态
        ATTACK_ENGAGE : "attack_engage",                      //进攻_目标正在交火状态
        ATTACK_REMOTE : "attack_remote",                      //远程攻击姿态
        DEFENCE_REMOTE: "defence_remote"                      //远程防御姿态
    },
    position : {
        FACE : "face",
        SIDE : "side",
        BACK : "back",
        FACE_REMOTE : "face_remote"
    },
    units : {
        SHIELD_MAN : "shieldMan",
        PIKE_MAN : "pikeMan",
        AXE_MAN : "axeMan",
        BOW_MAN : "bowMan",
        IMPACT_HORSE : "impactHorse",
        HUNT_HORSE : "huntHorse"
    },
    faction : {
        attackFaction : "attackFaction",
        defenceFaction: "defenceFaction"
    },
    troops : null                                             //读入兵种信息后，将数据装载在这里
};

function Unit() {
    this.unit = null;
    this.rank = null;
    this.life = null;
    this.status = null;
    this.position = null;
    this.engage = null;
    this.title = null;
    this.faction = null;
    this.serialNum = null;         // 所在数组下标
}

Unit.prototype = {
    _inArray : function(array, ele) {
        for (var i in array) {
            if (array[i] === ele)
                return true;
        }
        return false;
    },

    loadUnit : function() {
        /*
         * 因为loadUnit的时机是在display阶段，导致unit没有status信息。因而判断中取消对status的判断。
         */
        var squad = armyTemplate.troops[this.unit]["troop"];
        console.log(squad);
        this.attackWeapon = squad.attackWeapon;
        this.attackFormation = squad.attackFormation;
        this.defenceWeapon = squad.defenceWeapon;
        this.defenceFormation = squad.defenceFormation;
        this.fleeLife = squad.fleeLife;
        this.maxLife = squad.maxLife;
        this.speciality = squad.speciality;
        if (this.position === undefined || !this._inArray(armyTemplate.position, this.position))
            this.position = armyTemplate.position.FACE;
        this.sequence = armyTemplate.troops[this.unit].sequence;
        this.engage = 0;
    }
};

function UnitLoader() {
    cc.loader.loadJson("res/unit.json", function(err, data) {
        armyTemplate.troops = data;
    });
}


