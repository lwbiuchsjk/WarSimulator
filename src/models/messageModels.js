var messageCode = {
    COMMUNICATION_ADDRESS : "ws://127.0.0.1:3000",
    CONFIG_FILE : "config.json",
    //COMMUNICATION_ADDRESS :  "ws://45.76.68.20:3000",
    CLOSE_TO_WAR : "runButton",
    LOAD_TROOPS_TO_CLIENT : "loadTroopsClient",
    LOAD_TROOPS_TO_SERVER : "loadTroopsServer",
    CHECK_FACTION : "faction",
    DELETE_TROOPS : "deleteTroops",
    WAR_BEGIN : "warBegin",
    LOAD_UNIT_TEMPLATE : "loadUnitTemplate",
    CHECK_PLAYER : "checkPlayer",
    SET_SINGLE_BATTLE : "setSingleBattle",
    SET_MULTI_BATTLE : "setMuLtiBattle"
};

var TYPE_CLASS = {
    MSG : "MSG",
    CODE_DATA : "CODE_DATA",
    UNIT_DATA : "UNIT_DATA",
    BATTLE_DATA : "BATTLE_DATA",
    PLAYER_DATA : "PLAYER_DATA",
};

var PlayerMsg = function() {
    /*
     * arguments : battleID | playerInfo | battleID - faction | battleID - faction - playerID - troops
     */
    this._battleID = 0;
    this._playerID = 0;
    this._faction = "";
    this._otherFaction = "";
    this._troops = null;
    this._seprateMark = ";";
    switch (arguments.length) {
        case 1 : {
            if (typeof arguments[0] === "number") {
                this._battleID = arguments[0];
            } else if (typeof arguments[0] === "object" &&
                "battleID" in arguments[0] && "playerID" in arguments[0] && "faction" in arguments[0] && "troops" in arguments[0]) {
                this._battleID = arguments[0]["battleID"];
                this._playerID = arguments[0]["playerID"];
                this._faction = arguments[0]["faction"];
                this._troops = arguments[0]["troops"];
                this._getOtherFaction();
            } else {
                throw new Error("WRONG play msg format");
            }
            break;
        }
        case 2 : {
            if (typeof arguments[0] === "number" && typeof arguments[1] === "string") {
                this._battleID = arguments[0];
                this._faction = arguments[1];
                this._getOtherFaction();
            } else {
                throw new Error("WRONG play msg format");
            }
            break;
        }
        case 4 : {
            if (typeof arguments[0] === "number" && typeof arguments[1] === "string" &&
            typeof arguments[2] === "number" && arguments[3] instanceof Array) {
                this._battleID = arguments[0];
                this._faction = arguments[1];
                this._playerID = arguments[2];
                this._troops = arguments[3];
                this._getOtherFaction();
            } else {
                throw new Error("WRONG play msg format");
            }
            break;
        }
        default : {
            throw new Error("WRONG play msg format");
        }
    }
};
PlayerMsg.prototype = {
    get battleID () {
        return this._battleID;
    },

    set troops(value) {
        this._troops = value;
    },
    get troops () {
        return this._troops;
    },

    set playerID(value) {
        this._playerID = value;
    },
    get playerID () {
        return this._playerID;
    },

    set faction (value) {
        this._faction = value;
        this._getOtherFaction();
    },
    get faction () {
        return this._faction;
    },
    get otherFaction () {
        console.log(this._otherFaction);
        return this._otherFaction;
    },

    getMsg : function() {
        var wrapMsg  = this;
        return {
            battleID : wrapMsg._battleID,
            faction : wrapMsg._faction,
            playerID : wrapMsg._playerID,
            troops : wrapMsg._troops
        };
    },
    checkConfigReady : function() {
        return this._playerID != 0 && this._faction != "";
    },
    noFaction : function() {
        return this._faction === "";
    },
    troops2Array : function() {
        if (typeof this._troops === "string") {
            return this._troops.split(this._seprateMark);
        } else {
            throw new Error("troops is not String...")
        }
    },
    troops2String : function() {
        if (this._troops instanceof Array) {
            return this._troops.join(this._seprateMark);
        } else {
            throw new Error("troops is not Array...");
        }
    },
    _getOtherFaction : function() {
        if (this._faction !== "") {
            this._otherFaction = this._faction === armyTemplate.faction.attackFaction ? armyTemplate.faction.defenceFaction : armyTemplate.faction.attackFaction;
        } else {
            throw new Error("wrong faction format!!!");
        }
    }
};

var BattleMsg = function() {
    /*
     * arguments : battleInfo | battleID | battleID - battleProp
     */
    this._battleID = 0;
    this._battleProp = "";
    switch(arguments.length) {
        case 1 : {
            if (typeof arguments[0] === "object" && "battleID" in arguments[0] && "battleProp" in arguments[0]) {
                this._battleID = arguments[0]["battleID"];
                this._battleProp = arguments[0]["battleProp"];
            } else if (typeof arguments[0] === "number") {
                this._battleID = arguments[0];
            } else {
                throw new Error("battle config WRONG!!!");
            }
            break;
        }
        case 2 : {
            if (typeof arguments[0] === "number" && typeof  arguments[1] === "string" ) {
                this._battleID = arguments[0];
                this._battleProp = arguments[1];
            } else {
                throw new Error("battle config WRONG!!!");
            }
            break;
        }
        default : {
            throw new Error("battle config WRONG!!!");
        }
    }
};
BattleMsg.prototype = {
    get battleID() {
        return this._battleID;
    },

    set battleProp(value) {
        this._battleProp = value;
    },
    get battleProp() {
        return this._battleProp;
    },
    getMsg : function() {
        var wrapMsg = this;
        return {
            battleID : wrapMsg._battleID,
            battleProp : wrapMsg._battleProp
        };
    }
};

var checkInput = function(msgType) {
    return (msgType in TYPE_CLASS)
};

var WebMsg = function() {
    this._type = null;
    this._value = null;
    switch (arguments.length) {
        case 1 : {
            var parsedData = JSON.parse(arguments[0]);
            if (typeof parsedData === "object" &&
            "type" in parsedData && "value" in parsedData) {
                this._type = parsedData["type"];
                this._value = parsedData["value"];
            } else {
                throw new Error("WRONG msg format");
            }
            break;
        }
        case 2 : {
            if (typeof arguments[0] === "string") {
                this._type = arguments[0];
                this._value = arguments[1];
            } else {
                throw new Error("WRONG msg format");
            }
            break;
        }
        default : {
            throw new Error("WRONG msg format");
        }
    }
};
WebMsg.TYPE_CLASS = TYPE_CLASS;
WebMsg.prototype = {
    get type () {
        if (this._type != null) {
            return this._type;
        }
    },
    get value() {
        if (this._value != null) {
            return this._value;
        }
    },
    toJSON : function () {
        var msg = this;
        return JSON.stringify({
            type : msg._type,
            value : msg._value
        });
    }
};
