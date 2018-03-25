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
        UNIQUE_MOVEMENT : "uniqueMovement",
        DEFENCE : "defence",                                  //近距离防御姿态
        DEFENCE_CHARGE_FACE : "defenceCharge_face",          //近距离防御姿态，进攻方正在正面冲锋
        ATTACK : "attack",                                    //近距离进攻姿态
        ATTACK_CHARGE : "attackCharge",                      //近距离进攻_冲锋姿态
        ATTACK_CHARGE_ADVANTAGE : "attackCharge_advantage",  //近距离进攻_冲锋_优势位置姿态
        ATTACK_ENGAGE : "attackEngage",                      //进攻_目标正在交火状态
        ATTACK_REMOTE : "attackRemote",                      //远程攻击姿态
        DEFENCE_REMOTE: "defenceRemote"                      //远程防御姿态
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
        SPEAR_MAN : "spearMan",
        BOW_MAN : "bowMan",

        ATTACKER : "attacker",
        CHARGER : "charger",
        INTERCEPTOR : "interceptor",
        SHOOTER : "shooter",

        IMPACT_HORSE : "impactHorse",
        SHOOT_HORSE : "shootHorse",
        DRAGON_HORSE : "dragonHorse",

        HUNT_MOUNT : "huntMount",
        BOW_MOUNT : "bowMount",
        ATTACK_MOUNT : "attackMount"
    },
    faction : {
        attackFaction : "attackFaction",
        defenceFaction: "defenceFaction"
    },
    troops : null                                             //读入兵种信息后，将数据装载在这里
};

function Unit(rawData) {
    this.unit = null;
    this.life = null;
    this.status = null;
    this.position = null;
    this.engage = null;
    this.title = null;
    this.faction = null;
    this.serialNumber = null;         // 序列号，最后两位为数组下标
    this._serialLength = 0;
    if (rawData) {
        for (var prop in rawData) {
            if (prop in this) {
                this[prop] = rawData[prop];
            }
        }
    } else {
        this._serialGenerator(10);
    }
}

Unit.prototype = {
    _inArray : function(array, ele) {
        for (var i in array) {
            if (array[i] === ele)
                return true;
        }
        return false;
    },

    _serialGenerator : function(serialLength) {
        // 输入参数为初始序列号长度，而实际序列号长度为serialLength + 2。这是因为会将数组下标加在最后两位
        var serialTmp = Math.floor(Math.random() * Math.pow(10, serialLength));
        var serialString = String(serialTmp);
        var serialBlank = "";
        if (serialString.length < serialLength) {
            for (var iter = 0; iter < serialLength - serialString.length; iter++) {
                serialBlank += "0";
            }
        }
        this.serialNumber = serialBlank + serialString;
        this._serialLength = serialLength + 2;
        console.log(this.serialNumber.length);
    },

    set serial(value) {
        var bar = 2;
        var stringValue = value < 10 ? "0" + value : value;
        if (this.serialNumber.length === this._serialLength - bar) {
            this.serialNumber += stringValue;
        } else if (this.serialNumber.length === this._serialLength) {
            this.serialNumber = this.serialNumber.slice(0, this._serialLength - 2) + stringValue;
        } else {
            throw new Error("serial number has wrong index message!!!")
        }
    },

    get serial() {
        var bar = 2;
        if (this.serialNumber.length === this._serialLength - bar) {
            return 0;
        } else if (this.serialNumber.length === this._serialLength){
            return Number(this.serialNumber.slice(this._serialLength - 2, this._serialLength));
        } else {
            throw new Error("Wrong timing to ger serial!!")
        }
    },

    loadUnit : function() {
        /*
         * 因为loadUnit的时机是在display阶段，导致unit没有status信息。因而判断中取消对status的判断。
         */
        var squad = armyTemplate.troops[this.unit];
        this.attackWeapon = squad.attackWeapon;
        this.attackFormation = squad.attackFormation;
        this.defenceWeapon = squad.defenceWeapon;
        this.defenceFormation = squad.defenceFormation;
        this.fleeLife = squad.fleeLife;
        this.maxLife = squad.maxLife;
        this.speciality = squad.speciality;
        if (this.position === undefined || !this._inArray(armyTemplate.position, this.position))
            this.position = armyTemplate.position.FACE;
        this.sequence = squad.sequence;
        this.engage = [];
        this.ability = [];
    },

    checkStatus : function() {
        // 用于输入attackStatus时检测status的合法性
        for (var iter = 0; iter < this.speciality.length; iter++) {
            if (this.speciality[iter].indexOf(this.status) >= 0) {
                console.log(this.speciality[iter]);
                return true;
            }
        }
        return false;
    },

    setEngage : function(unit) {
        this.engage.push(unit.serial);
    },
    resetEngage : function() {
        this.engage = [];
    },

    toString : function() {
        // 本方法返回的只是带有属性的类，属性的类型为number或string。类中没有方法。可以作为数据库记录的输入。
        var tmp = {};
        for (var iter in this) {
            if (this[iter] instanceof Function)
                continue;

            var prop = "";
            if (this[iter] instanceof Array) {
                for (var num in this[iter]) {
                    prop += this[iter][num]
                }
            } else {
                prop = this[iter];
            }
            tmp[iter] = prop;
        }
        return tmp;
    },
    toUnit : function() {
        // 本方法返回的是一个Unit类，将所有Array类型的属性都还原，方便读取。
        // 判断Array类型的属性的依据为观察输入String中是否包含";"字符。
        var tmp = {};
        var mark = ";";
        var string2Array = function(string, array) {
            if (string.length != 0) {
                var firstPart = string.slice(0, string.indexOf(mark));
                var lastPart = string.slice(string.indexOf(mark) + 1, string.length);
                array.push(firstPart);
                string2Array(lastPart, array);
            } else {
                return array;
            }
        };
        for (var iter in this) {
            if (typeof this[iter] === "string" && this[iter].indexOf(mark) > 0) {
                var prop = [];
                string2Array(this[iter], prop);
                this[iter] = prop;
            }
        }
        this.resetEngage();
        return this;
    }
};



