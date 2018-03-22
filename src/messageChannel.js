const messageCode = {
    COMMUNICATION_ADDRESS : "ws://127.0.0.1:3000",
    CONFIG_FILE : "config.json",
    //COMMUNICATION_ADDRESS :  "ws://45.76.68.20:3000",
    TROOP_CONFIG_READY : "runButton",
    LOAD_TROOPS : "loadTroops",
    CHECK_FACTION : "faction",
    DELETE_TROOPS : "deleteTroops",
    WAR_BEGIN : "warBegin",
    LOAD_UNIT_TEMPLATE : "loadUnitTemplate",
    CHECK_PLAYER : "checkPlayer"
};

const TYPE_CLASS = {
    STRING : "STRING",
    DATA_RECORD : "DATA_RECORD"
};

var checkInput = function(msgType) {
    return (msgType in TYPE_CLASS)
};

var WebMsgMaker = function(msgType, msgValue) {
    this._type = null;
    this._value = null;
    if (msgType != null && msgValue != null) {
        if (checkInput(msgType)) {
            this._type = msgType;
            this._value = msgValue;
        } else {
            throw "msg WRONG TYPE!!!"
        }
    } else {
        throw "msg FORMAT ERROR!!!"
    }
};
WebMsgMaker.TYPE_CLASS = TYPE_CLASS;
WebMsgMaker.prototype.toJSON = function() {
    var msg = this;
    return JSON.stringify({
        type : msg._type,
        value : msg._value
    });
};

var WebMsgParser = function(msg) {
    this._type = null;
    this._value = null;
    var rawData = JSON.parse(msg.data);
    if (rawData.type != null && rawData.value != null) {
        if (checkInput(rawData.type, rawData.value)) {
            this._type = rawData.type;
            this._value = rawData.value;
        } else {
            throw "msg WRONG TYPE!!!"
        }
    } else {
        throw "msg FORMAT ERROR!!!"
    }
};
WebMsgParser.prototype = {
    get type () {
        if (this._type != null) {
            return this._type;
        }
    },
    get value() {
        if (this._value != null) {
            return this._value;
        }
    }
};
WebMsgParser.TYPE_CLASS = TYPE_CLASS;