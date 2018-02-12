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

    /*
     * 以下是重装步兵
     */
    shieldMan : {
        unit : "shieldMan",
        sequence : "heavyInfantry",
        troop : [
            {
                rank : 1,
                attackWeapon : 3,
                attackFormation : 3,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 2,
                moraleDestroy : 4,
                speciality : ""
            },
            {
                rank : 2,
                attackWeapon : 3,
                attackFormation : 3,
                defenceWeapon : 4,
                defenceFormation : 4,
                moraleFlee : 3,
                moraleDestroy : 5,
                speciality : ""
            },
            {
                rank : 3,
                attackWeapon : 2,
                attackFormation : 3,
                defenceWeapon : 4,
                defenceFormation : 4,
                moraleFlee : 4,
                moraleDestroy : 6,
                speciality : [
                    "defence.heavyInfantry.defence.pls.weapon.1",
                    "defence.heavyInfantry.defence.pls.formation.1",
                    "defence.lightInfantry.defence.pls.weapon.1",
                    "defence.lightInfantry.defence.pls.formation.1"
                ]
            }
        ]
    },
    pikeMan : {
        unit : "pikeMan",
        sequence : "heavyInfantry",
        troop : [
            {
                rank : 1,
                attackWeapon : 4,
                attackFormation : 3,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 2,
                moraleDestroy : 4,
                speciality : ""
            },
            {
                rank : 2,
                attackWeapon : 4,
                attackFormation : 3,
                defenceWeapon : 4,
                defenceFormation : 4,
                moraleFlee : 3,
                moraleDestroy : 5,
                speciality : ""
            },
            {
                rank : 3,
                attackWeapon : 3,
                attackFormation : 3,
                defenceWeapon : 4,
                defenceFormation : 4,
                moraleFlee : 4,
                moraleDestroy : 6,
                speciality : [
                    "defence_charge_face.heavyCavalvy.attack.pls.weapon.1",
                    "defence_charge_face.heavyCavalvy.attack.pls.formation.1",
                    "defence_charge_face.lightCavalvy.attack.pls.weapon.1",
                    "defence_charge_face.lightCavalvy.attack.pls.formation.1",
                    "defence_charge_face.heavyCavalvy.defence.pls.weapon.2",
                    "defence_charge_face.lightCavalvy.defence.pls.weapon.2"
                ]
            }
        ]
    },
    axeMan : {
        unit : "axeMan",
        sequence : "heavyInfantry",
        troop : [
            {
                rank : 1,
                attackWeapon : 4,
                attackFormation : 3,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 2,
                moraleDestroy : 4,
                speciality : ""
            },
            {
                rank : 2,
                attackWeapon : 5,
                attackFormation : 4,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 3,
                moraleDestroy : 5,
                speciality : ""
            },
            {
                rank : 3,
                attackWeapon : 4,
                attackFormation : 4,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 4,
                moraleDestroy : 6,
                speciality : [
                    "attack.heavyInfantry.attack.pls.weapon.2",
                    "attack.heavyInfantry.attack.pls.formation.1",
                    "attack.heavyCavalvy.attack.pls.weapon.2",
                    "attack.heavyCavalvy.attack.pls.formation.1"
                ]
            }
        ]
    },
    bowMan : {      // 考虑到当前还没有实现engage判断，因此现在将每个阶级的bowMan的attackWeapon+1.
        unit : "bowMan",
        sequence : "heavyInfantry",
        troop : [
            {
                rank : 1,
                attackWeapon : 3,   // +1down
                attackFormation : 3,
                defenceWeapon : 2,
                defenceFormation : 3,
                moraleFlee : 2,
                moraleDestroy : 4,
                speciality : [
                    "attack_engage.heavyInfantry.attack.pls.formation.1",
                    "attack_engage.lightInfantry.attack.pls.formation.1",
                    "attack_engage.heavyCavalvy.attack.pls.formation.1",
                    "attack_engage.lightCavalvy.attack.pls.formation.1"
                ]
            },
            {
                rank : 2,
                attackWeapon : 5,   // +1down
                attackFormation : 3,
                defenceWeapon : 2,
                defenceFormation : 3,
                moraleFlee : 3,
                moraleDestroy : 5,
                speciality : [
                    "attack_engage.heavyInfantry.attack.pls.formation.1",
                    "attack_engage.lightInfantry.attack.pls.formation.1",
                    "attack_engage.heavyCavalvy.attack.pls.formation.1",
                    "attack_engage.lightCavalvy.attack.pls.formation.1"
                ]
            },
            {
                rank : 3,
                attackWeapon : 6,   // +1down
                attackFormation : 4,
                defenceWeapon : 2,
                defenceFormation : 3,
                moraleFlee : 4,
                moraleDestroy : 6,
                speciality : [
                    "attack_engage.heavyInfantry.attack.pls.formation.1",
                    "attack_engage.lightInfantry.attack.pls.formation.1",
                    "attack_engage.heavyCavalvy.attack.pls.formation.1",
                    "attack_engage.lightCavalvy.attack.pls.formation.1"
                ]
            }
        ]
    },
    /*
     * 以下是重装骑兵
     */
    impactHorse : {
        unit : "impactHorse",
        sequence : "heavyCavalvy",
        troop : [
            {
                rank : 1,
                attackWeapon : 3,
                attackFormation : 2,
                defenceWeapon : 3,
                defenceFormation : 2,
                moraleFlee : 3,
                moraleDestroy : 4,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.2",
                    "attack_charge.heavyInfantry.attack.pls.formation.2",
                    "attack_charge.lightInfantry.attack.pls.weapon.2",
                    "attack_charge.lightInfantry.attack.pls.formation.2"
                ]
            },
            {
                rank : 2,
                attackWeapon : 3,
                attackFormation : 3,
                defenceWeapon : 3,
                defenceFormation : 3,
                moraleFlee : 4,
                moraleDestroy : 5,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.3",
                    "attack_charge.heavyInfantry.attack.pls.formation.3",
                    "attack_charge.lightInfantry.attack.pls.weapon.3",
                    "attack_charge.lightInfantry.attack.pls.formation.3"
                ]
            },
            {
                rank : 3,
                attackWeapon : 4,
                attackFormation : 3,
                defenceWeapon : 4,
                defenceFormation : 3,
                moraleFlee : 5,
                moraleDestroy : 6,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.3",
                    "attack_charge.heavyInfantry.attack.pls.formation.3",
                    "attack_charge_side.heavyInfantry.attack.pls.weapon.2",
                    "attack_charge_side.heavyInfantry.attack.pls.formation.1",
                    "attack_charge.lightInfantry.attack.pls.weapon.3",
                    "attack_charge.lightInfantry.attack.pls.formation.3",
                    "attack_charge_side.lightInfantry.attack.pls.weapon.2",
                    "attack_charge_side.lightInfantry.attack.pls.formation.1"
                ]
            }
        ]
    },
    /*
     * 以下是轻装骑兵
     */
    huntHorse : {
        unit : "impactHorse",
        sequence : "lightCavalry",
        troop : [
            {
                rank : 1,
                attackWeapon : 3,
                attackFormation : 2,
                defenceWeapon : 2,
                defenceFormation : 2,
                moraleFlee : 3,
                moraleDestroy : 4,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.1",
                    "attack_charge.heavyInfantry.attack.pls.formation.1",
                    "attack_charge.lightInfantry.attack.pls.weapon.1",
                    "attack_charge.lightInfantry.attack.pls.formation.1",
                    "attack_charge.heavyCavalvy.attack.pls.weapon.1",
                    "attack_charge.heavyCavalvy.attack.pls.formation.1",
                    "attack_advantage.heavyCavalvy.attack.pls.weapon.1",
                    "attack_advantage.heavyCavalvy.attack.pls.formation.1",
                    "attack_charge.lightCavalvy.attack.pls.weapon.1",
                    "attack_charge.lightCavalvy.attack.pls.formation.1",
                    "attack_advantage.lightCavalvy.attack.pls.weapon.1",
                    "attack_advantage.lightCavalvy.attack.pls.formation.1"
                ]
            },
            {
                rank : 2,
                attackWeapon : 4,
                attackFormation : 3,
                defenceWeapon : 2,
                defenceFormation : 2,
                moraleFlee : 4,
                moraleDestroy : 5,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.1",
                    "attack_charge.heavyInfantry.attack.pls.formation.1",
                    "attack_charge.lightInfantry.attack.pls.weapon.1",
                    "attack_charge.lightInfantry.attack.pls.formation.1",
                    "attack_charge.heavyCavalvy.attack.pls.weapon.1",
                    "attack_charge.heavyCavalvy.attack.pls.formation.1",
                    "attack_advantage.heavyCavalvy.attack.pls.weapon.2",
                    "attack_advantage.heavyCavalvy.attack.pls.formation.1",
                    "attack_charge.lightCavalvy.attack.pls.weapon.1",
                    "attack_charge.lightCavalvy.attack.pls.formation.1",
                    "attack_advantage.lightCavalvy.attack.pls.weapon.2",
                    "attack_advantage.lightCavalvy.attack.pls.formation.1"
                ]
            },
            {
                rank : 3,
                attackWeapon : 5,
                attackFormation : 4,
                defenceWeapon : 3,
                defenceFormation : 2,
                moraleFlee : 5,
                moraleDestroy : 6,
                speciality : [
                    "attack_charge.heavyInfantry.attack.pls.weapon.2",
                    "attack_charge.heavyInfantry.attack.pls.formation.1",
                    "attack_charge.lightInfantry.attack.pls.weapon.2",
                    "attack_charge.lightInfantry.attack.pls.formation.1",
                    "attack_charge.heavyCavalvy.attack.pls.weapon.1",
                    "attack_charge.heavyCavalvy.attack.pls.formation.1",
                    "attack_advantage.heavyCavalvy.attack.pls.weapon.2",
                    "attack_advantage.heavyCavalvy.attack.pls.formation.1",
                    "attack_charge.lightCavalvy.attack.pls.weapon.1",
                    "attack_charge.lightCavalvy.attack.pls.formation.1",
                    "attack_advantage.lightCavalvy.attack.pls.weapon.2",
                    "attack_advantage.lightCavalvy.attack.pls.formation.1"
                ]
            }
        ]
    }
};

function Unit() {
    this._unit = null;
    this._rank = null;
    this._morale = null;
    this._status = null;
    this._position = null;
    this._engage = null;
    this._title = null;
}

Unit.prototype = {
    set unit(unit) {
        if (this._inArray(armyTemplate.units, unit))
            this._unit = unit;
        else
            throw "unit error!"
    },
    get unit() {
        return this._unit;
    },

    set rank(rank) {
        this._rank = rank;
    },
    get rank() {
        return this._rank;
    },

    set morale(morale) {
        this._morale = morale;
    },
    get morale() {
        return this._morale;
    },

    set status(status) {
        this._status = status;
    },
    get status() {
        return this._status;
    },

    set position(position) {
        if (this._inArray(armyTemplate.position, position))
            this._position = position;
        else
            throw "position error!"
    },
    get position() {
        return this._position;
    },

    set title(FLAG) {
        this._title = FLAG;
    },
    get title() {
        return this._title;
    },

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
        if (this._unit in armyTemplate) {
            var squad = armyTemplate[this._unit].troop;
            for (var team in squad) {
                if (squad[team].rank === this._rank) {
                    this.attackWeapon = squad[team].attackWeapon;
                    this.attackFormation = squad[team].attackFormation;
                    this.defenceWeapon = squad[team].defenceWeapon;
                    this.defenceFormation = squad[team].defenceFormation;
                    this.moraleFlee = squad[team].moraleFlee;
                    this.moraleDestroy = squad[team].moraleDestroy;
                    this.speciality = squad[team].speciality;
                    break;
                }
            }
            if (this._position === undefined || !this._inArray(armyTemplate.position, this._position))
                this._position = armyTemplate.position.FACE;
            this.sequence = armyTemplate[this._unit].sequence;
            this._engage = 0;
        }
    }
};


