var res = {
    SET_GRAY_BACKGROUND : "res/SET_GRAY_BACKGROUND.bmp",

    UNIT_ON : "res/UNIT_ON.bmp",
    UNIT_OFF : "res/UNIT_OFF.bmp",
    UNIT_DONE : "res/UNIT_DONE.bmp",

    SEQ_HEAVY_CAVALVY : "res/SEQ_HEAVY_CAVALVY_BLACK.bmp",
    SEQ_HEAVY_CAVALVY_ON : "res/SEQ_HEAVY_CAVALVY_ON.bmp",
    SEQ_HEAVY_INFANTRY : "res/SEQ_HEAVY_INFANTRY_BLACK.bmp",
    SEQ_HEAVY_INFANTRY_ON : "res/SEQ_HEAVY_INFANTRY_ON.bmp",
    SEQ_LIGHT_CAVALVY : "res/SEQ_LIGHT_CAVALVY_BLACK.bmp",
    SEQ_LIGHT_CAVALVY_ON : "res/SEQ_LIGHT_CAVALVY_ON.bmp",
    SEQ_LIGHT_INFANTRY : "res/SEQ_LIGHT_INFANTRY_BLACK.bmp",
    SEQ_LIGHT_INFANTRY_ON : "res/SEQ_LIGHT_INFANTRY_ON.bmp",

    /*
     * 下列UNIT_后加驼峰写法，是为了在之后通过["UNIT_" + unitName]来访问。
     */
    UNIT_axeMan : "res/UNIT_AXEMAN_BLACK.bmp",
    UNIT_axeMan_ON : "res/UNIT_AXEMAN_ON.bmp",
    UNIT_bowMan : "res/UNIT_BOWMAN_BLACK.bmp",
    UNIT_bowMan_ON : "res/UNIT_BOWMAN_ON.bmp",
    UNIT_huntHorse : "res/UNIT_HUNTHORSE_BLACK.bmp",
    UNIT_huntHorse_ON : "res/UNIT_HUNTHORSE_ON.bmp",
    UNIT_impactHorse : "res/UNIT_IMPACTHORSE_BLACK.bmp",
    UNIT_impactHorse_ON : "res/UNIT_IMPACTHORSE_ON.bmp",
    UNIT_pikeMan : "res/UNIT_PIKEMAN_BLACK.bmp",
    UNIT_pikeMan_ON : "res/UNIT_PIKEMAN_ON.bmp",
    UNIT_shieldMan : "res/UNIT_SHIELDMAN_BLACK.bmp",
    UNIT_shieldMan_ON : "res/UNIT_SHIELDMAN_ON.bmp" ,
    RANK1 : "res/RANK1.bmp",
    RANK1_ON : "res/RANK1_ON.bmp",
    RANK2 : "res/RANK2.bmp",
    RANK2_ON : "res/RANK2_ON.bmp",
    RANK3 : "res/RANK3.bmp",
    RANK3_ON : "res/RANK3_ON.bmp",

    LIFE0 : "res/LIFE0.bmp",
    LIFE0_ON : "res/LIFE0_ON.bmp",
    LIFE1 : "res/LIFE1.bmp",
    LIFE1_ON : "res/LIFE1_ON.bmp",
    LIFE2 : "res/LIFE2.bmp",
    LIFE2_ON : "res/LIFE2_ON.bmp",
    LIFE3 : "res/LIFE3.bmp",
    LIFE3_ON : "res/LIFE3_ON.bmp",
    LIFE4 : "res/LIFE4.bmp",
    LIFE4_ON : "res/LIFE4_ON.bmp",
    LIFE5 : "res/LIFE5.bmp",
    LIFE5_ON : "res/LIFE5_ON.bmp",

    POSITION_UNIT : "res/POSITION_UNIT.bmp",
    POSITION_UNIT_ON : "res/POSITION_UNIT_ON.bmp",
    POSITION_FACE : "res/POSITION_FACE.bmp",
    POSITION_FACE_ON : "res/POSITION_FACE_ON.bmp",
    POSITION_SIDE : "res/POSITION_SIDE.bmp",
    POSITION_SIDE_ON : "res/POSITION_SIDE_ON.bmp",
    POSITION_BACK : "res/POSITION_BACK.bmp",
    POSITION_BACK_ON : "res/POSITION_BACK_ON.bmp",

    BUTTON_RUN : "res/BUTTON_RUN.bmp",
    BUTTON_RUN_GO : "res/BUTTON_RUN_GO.bmp"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
