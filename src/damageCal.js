/*
 * 当前的结算方式，是将所有attackUnit的battle加起来之后，与defenceUnit的battle作用一次，然后计算damage。
 * 这样的坏处是，defenceUnit的defence battle只计算一次，即只对所有被激发的attack属性，每次结算attackUnit时都会覆盖之前的defence状况。
 * 考虑到日后如果多种attack都可以激发defence属性的话，并且需要综合考虑的情况，当前的模型十分不便。
 *
 * 当前没有考虑地形影响。
 *
 * 当前对于advantage的设计还存有问题。将defence分为weapon与formation。那么自然的思路是，如果attack处于advantage情况，那么defenceWeapon或者defenceFormation中有一个应该失效。
 * 而当前的方案是增加attack battle。
 *
 * 当前没有在结算时考虑engage属性的影响。
 *
 */
function DamagePair(unit, damage) {
    this._troop = unit;
    this._damage = damage;
}
DamagePair.prototype = {
    get troop() {
        return this._troop;
    },

    get damage() {
        return this._damage;
    }
};

function DamageCalculator(armyList) {
    this.defenceUnit = armyList[0];
    this.attackList = armyList.slice(1, armyList.length);
}

DamageCalculator.prototype = {
    getAttackBasis : function(attackUnit) {
        /*
         * 用于计算基础的攻击值。
         * 因为getBonus与getAdvantage调用该函数，并且他们的返回值都是string。本函数也需要返回string，方便最后统一计算。
         *
         * 返回值为string.
         */
        //console.log("attackUnit: " + attackUnit.unit + "; attackBasis: " + (attackUnit.attackWeapon + attackUnit.attackFormation));
        return (attackUnit.attackWeapon + attackUnit.attackFormation).toString();
    },
    getDefenceBasis : function(defenceUnit) {
        /*
         * 用于计算基础的防御值。
         * 因为getBonus与getAdvantage调用该函数，并且他们的返回值都是string。本函数也需要返回string，方便最后统一计算。
         *
         * 返回值为string.
         */
        //console.log("defenceUnit: " + defenceUnit.unit + "; defenceBasis: " + (defenceUnit.defenceWeapon + defenceUnit.defenceFormation));
        return (defenceUnit.defenceWeapon + defenceUnit.defenceFormation).toString();
    },
    getSpeciality : function(status, position, driveUnit, supportUnit, FLAG) {
        /*
         * 获得当前状况下该单位适合的speciality。
         * speciality相关详细参见armyTemplate。数据类型为String_Array。array中每个元素都是一条speciality记录。
         * 每条记录顺序包含status(status+position)，targetUnit，calculator(pls/dlt），point。每个字段用.符号间隔。
         *
         * 在程序中，会直接判断status的情况，所以要求status在输入时已经过规范化处理。
         *
         * 返回值是String
         */
        var movement;
        switch (FLAG) {
            // 获取FLAG所指的attack或者defence动作。
            case armyTemplate.status.ATTACK : {
                movement = "." + armyTemplate.status.ATTACK + ".";
                break;
            }
            case armyTemplate.status.DEFENCE : {
                movement = "." + armyTemplate.status.DEFENCE + ".";
                break;
            }
        }
        function getAction(sepString, iter) {
            // 子函数中取出包含iter个分割符的字符串，作为action标准返回。
            var index = sepString.indexOf(".");
            var statusString = sepString.slice(0, index + 1);
            if (iter > 1)
                return statusString + getAction(sepString.slice(index + 1, sepString.length), iter - 1);
            else
                return statusString;
        }
        function reloadAction(actionString) {
            // 将备用action规范化
            return actionString + "." + supportUnit.sequence + movement;
        }

        var gift = driveUnit.speciality;
        var output = "";
        for (var i in gift) {
            // 获得当前的speciality记录。
            var record = gift[i];
            var action = getAction(record, 3);      //取3的原因为，前三个分隔符包括的字段分为别status.target.movement，函数中movement由FLAG确定。
            var actionTmp = reloadAction(status);
            var actionPositionTmp = reloadAction(status + "_" + position);
            if (action.indexOf(actionTmp) >= 0 || action.indexOf(actionPositionTmp) >= 0) {
                // 判断speciality中status字段内容。
                // 在有符合的情况下，获取calculator。因为calculator占据3个字符，并且action字符串最后一个字符为"."。因此可以通过action.length + 3取出符号。
                var cal = record.slice(action.length, action.length + 3);
                if (cal === "pls") {
                    output += "+";
                } else if (cal === "dlt") {
                    output += "-";
                }
                // 返回结果为一个字符串
                output += record.slice(record.lastIndexOf(".") + 1, record.length);
            }
        }

        return output;
    },
    getAdvantage : function(position, defenceUnit) {
        /*
         * 当前的advantage只考虑攻防单位之间的关系。还不涉及地形因素。
         * 攻防单位关系只有在side（进攻方攻击防守方侧面）和back（进攻方攻击防守方背面）时才会获得奖励。
         *
         * 返回值是String。
         */
        var output = "";
        switch (position) {
            case armyTemplate.position.SIDE : {
                output += ("+" + Math.ceil(this.getDefenceBasis(defenceUnit) / 2));
                break;
            }
            case armyTemplate.position.BACK : {
                output += ("+" + this.getDefenceBasis(defenceUnit));
                break;
            }
        }

        return output;
    },
    getBonus : function(trigger, driveUnit, supportUnit, FLAG) {
        /*
         * 本函数计算battle的奖励值bonus。
         * bonus分为兵种自带的属性奖励speciality，与因为不同的位置position给进攻方的奖励advantage。
         *
         * 返回值是String。
         */
        return this.getSpeciality(trigger, driveUnit.position, driveUnit, supportUnit, FLAG) + this.getAdvantage(driveUnit.position, supportUnit);
    }
    ,
    getAttack : function(attackUnit, defenceUnit) {
        var battle = this.getAttackBasis(attackUnit) + this.getBonus(attackUnit.status, attackUnit, defenceUnit, armyTemplate.status.ATTACK);
        return eval(battle);
    },
    getDefence : function(attackUnit, defenceUnit) {
        var battle = this.getDefenceBasis(defenceUnit) + this.getBonus(defenceUnit.status, defenceUnit, attackUnit, armyTemplate.status.DEFENCE);
        return eval(battle);
    },
    calDamage : function(sufferUnit, morale, attackBattle, defenceBattle) {
        /*
         * 结算damage的函数。damage与life/morale的换算，在临界点上下情况不同。在没有超过morale.flee的时候，所有换算时向上取证。
         * 在满足morale.flee与大于flee小于destroy的时候，换算需向下取证。
         *
         * 返回值为伤害结算之后当前的morale数。
         */
        console.log("attack battle: " + attackBattle);
        console.log("defence battle: " + defenceBattle);
        var damageTmp = attackBattle / defenceBattle;
        if (damageTmp + morale < sufferUnit.moraleFlee - 1)
            return Math.round(damageTmp + morale);
        else if (damageTmp + morale >= sufferUnit.moraleFlee - 1)
            return Math.floor(damageTmp + morale);
    },
    getDamage : function(attackList, defenceUnit) {
        /*
         * 最终执行函数，将所有伤害累加，然后结算防御方受到的伤害。只有正面面对防御方的进攻单位，才会收到反击伤害。
         * 返回结果是一个damageSequence队列。队列中元素是DamagePair.
         * 队列最末尾的是防守方收到的伤害。
         * 通常情况下，damageSequence长度为2。因为只有防守方正面可以造成伤害，并且正面只能与一个单位交锋。
         */
        function loadDefenceTrigger(attackUnit, defenceUnit) {
            /*
             * 考虑到防御属性是由进攻属性触发的，所以在这里通过attackUnit的status重载defenceUnit的status。
             */
            var trigger = attackUnit.status;
            defenceUnit.status = armyTemplate.status.DEFENCE + trigger.slice(trigger.indexOf(armyTemplate.status.ATTACK) + armyTemplate.status.ATTACK.length, trigger.length);
        }

        var damageSequence = [];
        var attackBattle = 0;
        var defenceBattle = this.getDefenceBasis(defenceUnit);

        for (var num in attackList) {
            // 累计进攻方伤害
            var attackUnit = attackList[num];
            console.log(attackUnit);
            loadDefenceTrigger(attackUnit, defenceUnit);
            attackBattle += this.getAttack(attackUnit, defenceUnit);
            if (attackUnit.position === armyTemplate.position.FACE) {
                // 处理防守方的反击情况
                defenceBattle = this.getDefence(attackUnit, defenceUnit);
                var counterAtcBattle = this.getAttack(defenceUnit, attackUnit);
                var sufferBattle = this.getDefence(defenceUnit, attackUnit);
                var counterAtcDamage = this.calDamage(attackUnit, attackUnit.morale, counterAtcBattle, sufferBattle);
                damageSequence.push(new DamagePair(attackUnit, counterAtcDamage));
            }
        }
        if (damageSequence.length === 0)
            damageSequence.push(new DamagePair(attackList[0], 0));
        var attackDamage = this.calDamage(defenceUnit, defenceUnit.morale, attackBattle, defenceBattle);
        damageSequence.push(new DamagePair(defenceUnit, attackDamage));

        return damageSequence;
    }
};