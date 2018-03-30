/*
 * 当前的结算模型为瞬时结算，不保留状态。
 * 当前的模型中，交战双方各有一支单位。即使实际情况中有多支单位参与到交火中，每次都只结算两者之间的关系。
 * attackUnit的position属性解释为“攻击目标的某一面”。也就是说，如果attackUnit.position = BACK，那么则是attackUnit对defenceUnit的背面发起进攻。
 * 在计算反击的时候，考虑的也是attackUnit.position是否为FACE。因此在当前瞬时结算模型中，defenceUnit的position属性暂时无用。
 *
 * 当前没有考虑地形影响。
 *
 * 当前对于advantage的设计还存有问题。将defence分为weapon与formation。那么自然的思路是，如果attack处于advantage情况，那么defenceWeapon或者defenceFormation中有一个应该失效。
 * 而当前的方案是增加attack battle。
 *
 * 当前没有在结算时考虑engage属性的影响。
 *
 * 在考虑side与back情况下
 *
 */
function DamageCalculator(attackTroops, defenceTroops, round) {
    this.defenceUnit = null;
    this.attackList = null;
    // 用于存储已经行动过的单位。从左至右为 0 - attackTroops - end - end - defenceTroops - 0;
    this._attackFaction = attackTroops;
    this._defenceFaction = defenceTroops;
    this._movedTroops = new Array(attackTroops.length + defenceTroops.length);
    this._round = round != null ? round : 0;
}

DamageCalculator.prototype = {
    loadDefenceUnit : function(unit) {
        this.defenceUnit = unit;
        this.setUnitMoved(unit);
    },
    loadAttackList : function(input) {
        if (input instanceof  Array)
            this.attackList = input;
        else {
            this.attackList = [input];
        }
        var self = this;
        this.attackList.forEach(function(unit) {
            self.setUnitMoved(unit);
        })
    },
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
    getSpeciality : function(status, position, driveUnit, sufferUnit, FLAG) {
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
            return actionString + "." + sufferUnit.sequence + movement;
        }

        var gift = driveUnit.speciality;
        var output = "";
        for (var i in gift) {
            // 获得当前的speciality记录。
            var record = gift[i];
            var actionOfRecord = getAction(record, 3);      //取3的原因为，前三个分隔符包括的字段分为别status.target.movement.，函数中movement由FLAG确定。
            var action = reloadAction(status);
            var actionInPosition = reloadAction(status + "_" + position);
            if (action === actionOfRecord || actionInPosition === actionOfRecord) {
                // 判断speciality中status字段内容。
                // 在这里需要精确匹配。即attackStatus_position | attackStatus 与 记录的前半部分严格一致才可以。
                // 在有符合的情况下，获取calculator。因为calculator占据3个字符，并且action字符串最后一个字符为"."。因此可以通过action.length + 3取出符号。
                var cal = record.slice(actionOfRecord.length, actionOfRecord.length + 3);
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
    getAdvantage : function(driveUnit, sufferUnit, status) {
        /*
         * 当前的advantage只考虑攻防单位之间的关系。还不涉及地形因素。
         * 攻防单位关系只有在side（进攻方攻击防守方侧面）和back（进攻方攻击防守方背面）时才会获得奖励。
         * 通常情况下，从侧翼进攻攻击力+1，从背面进攻攻击力+2
         *
         * 返回值是String。
         */
        var output = "";
        if (status === armyTemplate.status.ATTACK && driveUnit.status.indexOf(armyTemplate.status.ATTACK) >= 0 && sufferUnit.status.indexOf(armyTemplate.status.DEFENCE) >= 0) {
            if (driveUnit.position === armyTemplate.position.SIDE) {
                output += ("+" + 1);
            } else if (driveUnit.position === armyTemplate.position.BACK ) {
                output += ("+" + 2);
            }
        }
        if (status === armyTemplate.status.ATTACK && driveUnit.status.indexOf(armyTemplate.status.DEFENCE) >= 0 && sufferUnit.status.indexOf(armyTemplate.status.ATTACK) >= 0) {
            if (sufferUnit.position === armyTemplate.position.SIDE) {
                output += ("-" + 1);
            } else if (sufferUnit.position === armyTemplate.position.BACK ) {
                output += ("-" + 2);
            }
        }

        return output;
    },
    getBonus : function(trigger, driveUnit, sufferUnit, FLAG) {
        /*
         * 本函数计算battle的奖励值bonus。
         * bonus分为兵种自带的属性奖励speciality，与因为不同的位置position给进攻方的奖励advantage。
         *
         * 返回值是String。
         */
        return this.getSpeciality(trigger, driveUnit.position, driveUnit, sufferUnit, FLAG) + this.getAdvantage(driveUnit, sufferUnit, FLAG);
    },
    getAttack : function(attackUnit, defenceUnit) {
        var battle = this.getAttackBasis(attackUnit) + this.getBonus(attackUnit.status, attackUnit, defenceUnit, armyTemplate.status.ATTACK);
        return eval(battle);
    },
    getDefence : function(attackUnit, defenceUnit) {
        var battle = this.getDefenceBasis(defenceUnit) + this.getBonus(defenceUnit.status, defenceUnit, attackUnit, armyTemplate.status.DEFENCE);
        return eval(battle);
    },
    calDamage : function(attackBattle, defenceBattle) {
        /*
         * 结算damage的函数。
         * 如果attack>defence，那么damage = attack- defence。
         * 如果attack<defence，那么有(defence + 1 - attack) / defence概率造成1damage。
         */
        if (attackBattle > defenceBattle)
            return attackBattle - defenceBattle;
        else {
            var tmp = Math.random() * (defenceBattle + 1);
            if (tmp > defenceBattle + 1 - attackBattle)
                return 1;
            else
                return 0;
        }
    },
    calLife : function(unit, damage) {
        return unit.life - damage > 0 ? unit.life - damage : 0;
    },
    getDamage : function(attackList, defenceUnit) {
        /*
         * 简单版本的伤害计算器。
         *
         * 最终执行函数，每个进攻方对防守方单独结算伤害。只有正面面对防御方的进攻单位，才会收到反击伤害。
         * 返回结果是一个damageSequence队列。队列中元素是DamagePair.
         * 队列最末尾的是防守方收到的伤害。
         * 通常情况下，damageSequence长度为2。因为只有防守方正面可以造成伤害，并且正面只能与一个单位交锋。
         * 在这里缺乏对engage状态的处理。原则上应该通过engage属性来判断双方是否陷入交战，进而是否考虑处理反击状况。
         */
        function loadDefenceTrigger(attackUnit, defenceUnit) {
            /*
             * 考虑到防御属性是由进攻属性触发的，所以在这里通过attackUnit的status重载defenceUnit的status。
             */
            var trigger = attackUnit.status;
            defenceUnit.status = armyTemplate.status.DEFENCE + trigger.slice(trigger.indexOf(armyTemplate.status.ATTACK) + armyTemplate.status.ATTACK.length, trigger.length);
        }

        var damageSequence = [];
        var attackDamage = 0;
        var counterDamage = 0;

        for (var num in attackList) {
            // 累计进攻方伤害
            var attackUnit = attackList[num];
            loadDefenceTrigger(attackUnit, defenceUnit);
            console.log("attack: " + attackUnit.unit + " battle: " + eval(this.getAttack(attackUnit, defenceUnit)) + "\n" +
                "defence: " + defenceUnit.unit + " battle: " + eval(this.getDefence(attackUnit, defenceUnit)));
            attackDamage += this.calDamage(this.getAttack(attackUnit, defenceUnit), this.getDefence(attackUnit, defenceUnit));
            if (attackUnit.position === armyTemplate.position.FACE && attackUnit.status !== armyTemplate.status.ATTACK_REMOTE) {
                // 处理防守方的反击情况。只有处于正面，并且不是远程攻击的单位，才会遭到反击。
                console.log("counter: " + defenceUnit.unit + " battle: " + eval(this.getAttack(defenceUnit, attackUnit)) + "\n" +
                    "suffer: " + attackUnit.unit + " battle: " + eval(this.getDefence(defenceUnit, attackUnit)));
                counterDamage = this.calDamage(this.getAttack(defenceUnit, attackUnit), this.getDefence(defenceUnit, attackUnit));
                attackUnit.life = this.calLife(attackUnit, counterDamage);
                damageSequence.push(attackUnit);
            }
        }

        // 清除engage标记
        for (var num in attackList) {
            attackList[num].resetEngage();
        }
        defenceUnit.resetEngage();

        if (damageSequence.length === 0)
            damageSequence.push(attackList[0]);
        defenceUnit.life = this.calLife(defenceUnit, attackDamage);
        damageSequence.push(defenceUnit);

        return damageSequence;
    },
    get movedTroops () {
        return this._movedTroops;
    },
    get attackFaction () {
        return this._attackFaction;
    },
    get defenceFaction() {
        return this._defenceFaction;
    },
    get round() {
        return this._round;
    },
    getUnit : function(faction ,serial) {
        return this["_" + faction][serial];
    },
    _getUnitMovedIter : function(faction, serial) {
        var iter = faction === armyTemplate.faction.attackFaction ? serial :
            (faction === armyTemplate.faction.defenceFaction ? this._movedTroops.length - serial - 1 : null);
        if (iter === null) {
            throw new Error("...movedTroops input out of range...");
        } else
            return iter;
    },
    setUnitMoved : function() {
        /*
         * checkUnitLeaveTroop与setUnitMoved一定要结合使用。
         * 本函数只执行将unit从加入movedTroops队列中的任务。
         * 只有先执行setUnitMoved再执行checkUnitLeaveTroop，才能真正确定unit moved.
         */
        // arguments : unit | faction - serial
        var faction, serial;
        if (arguments.length === 1 && arguments[0] instanceof Unit) {
            faction = arguments[0].faction;
            serial = arguments[0].serial;
        } else if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "number") {
            faction = arguments[0];
            serial = arguments[1];
        } else {
            throw new Error("...wrong input with movedTroops...");
        }
        if (this["_" + faction][serial] !== null) {
            console.log("...unit move...");
            this._movedTroops[this._getUnitMovedIter(faction,serial)] = this["_" + faction][serial];
            console.log(this._movedTroops);
        }
    },
    checkUnitMoved : function() {
        // arguments : unit | faction - serial
        var faction, serial;
        if (arguments.length === 1 && arguments[0] instanceof Unit) {
            faction = arguments[0].faction;
            serial = arguments[0].serial;
        } else if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "number") {
            faction = arguments[0];
            serial = arguments[1];
        } else {
            throw new Error("...wrong input with CHECK movedTroops...");
        }
        return this._movedTroops[this._getUnitMovedIter(faction,serial)] != null;

    },
    checkUnitLeaveTroop : function() {
        /*
         * checkUnitLeaveTroop与setUnitMoved一定要结合使用。
         * 本函数首先判断是否已经离队，如果是，则返回true。如果否，则将unit从对应faction troops中剔除，然后返回false。
         * 只有先执行setUnitMoved再执行checkUnitLeaveTroop，才能真正确定unit moved.
         */
        // arguments : unit | faction - serial
        var faction, serial;
        if (arguments.length === 1 && arguments[0] instanceof Unit) {
            faction = arguments[0].faction;
            serial = arguments[0].serial;
        } else if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "number") {
            faction = arguments[0];
            serial = arguments[1];
        } else {
            throw new Error("...wrong input with check unit leave troops...");
        }
        if (this["_" + faction][serial] === null) {
            return true;
        } else {
            this["_" + faction][serial] = null;
            return false;
        }
    },
    checkTroopsMovedAll : function() {
        for (var iter = 0; iter < this._movedTroops.length; iter++) {
            if (this.movedTroops[iter] == null) {
                return false;
            }
        }
        return true;
    },
    resetTroops : function () {
        this._movedTroops = new Array(this._attackFaction.length + this._defenceFaction.length);
        var deadTroops = [],
            self = this;
        this._attackFaction.forEach(function(unit) {
            if (unit.nowLife <= 0) {
                deadTroops.push(unit);
            }
        });
        this._defenceFaction.forEach(function(unit) {
            if (unit.nowLife <= 0) {
                deadTroops.push(unit);
            }
        });
        deadTroops.forEach(function(unit) {
            self.setUnitMoved(unit);
        });
        this._round++;
    },
    loadDamageToNow : function() {
        // 在本函数中处理所有需要结算伤害的单位，然后将unit array返回，用于之后的行为。
        var array = [];
        this._attackFaction.forEach(function(unit) {
            unit.nowLife = unit.life;
            array.push(unit);
        });
        this._defenceFaction.forEach(function(unit) {
            unit.nowLife = unit.life;
            array.push(unit);
        });
        return array;
    }
};