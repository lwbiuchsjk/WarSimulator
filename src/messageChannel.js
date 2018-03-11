var FactionTroopMessage = function() {
    this.faction = null;
    this.troops = null;
};

var messageCode = {
    COMMUNICATION_ADDRESS : "ws://127.0.0.1:3000",
    TROOP_CONFIG_READY : "runButton",
    LOAD_TROOPS : "loadTroops",
    CHECK_FACTION : "faction",
    DELETE_TROOPS : "deleteTroops",
    WAR_BEGIN : "warBegin",
};