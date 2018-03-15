var res = {
    ATK_FACTION : "res/ATK_FACTION.png",
    DFC_FACTION : "res/DFC_FACTION.png",

    RETURN_BUTTON : "res/RETURN_BUTTON.png",
    RETURN_BUTTON_ON : "res/RETURN_ON_BUTTON.png",
    RESET_BUTTON : "res/RESET_BUTTON.png",
    RESET_BUTTON_ON : "res/RESET_ON_BUTTON.png",

    ATK_CONFIG_BUTTON : "res/ATK_CONFIG_BUTTON.png",
    DFC_CONFIG_BUTTON : "res/DFC_CONFIG_BUTTON.png",
    LIFE_CONFIG_BUTTON : "res/LIFE_CONFIG_BUTTON.png",
    ATK_CONFIG_BAR : "res/ATK_CONFIG_BAR.png",
    DFC_CONFIG_BAR : "res/DFC_CONFIG_BAR.png",
    LIFE_CONFIG_BAR :"res/LIFE_CONFIG_BAR.png",

    ATK_SHOW_BAR : "res/ATTACK_SHOW.png",
    ATK_CHARGE_SHOW_BAR : "res/ATTACK_CHARGE_SHOW.png",
    ATK_REMOTE_SHOW_BAR : "res/ATTACK_SHOW.png",
    DFC_SHOW_BAR : "res/DEFENCE_POSITION_SHOW.png",
    ATK_SHOW_UNIT : "res/showAttackUnit.png",
    DFC_SHOW_UNIT : "res/showDefenceUnit.png",

    UNIT_ON : "res/UNIT_ON.bmp",
    UNIT_OFF : "res/UNIT_OFF.bmp",
    UNIT_DONE : "res/UNIT_DONE.bmp",

    SEQ_HEAVY_CAVALVY : "res/SEQ_HEAVY_CAVALVY.bmp",
    SEQ_HEAVY_CAVALVY_ON : "res/SEQ_HEAVY_CAVALVY_ON.bmp",
    SEQ_HEAVY_INFANTRY : "res/SEQ_HEAVY_INFANTRY.bmp",
    SEQ_HEAVY_INFANTRY_ON : "res/SEQ_HEAVY_INFANTRY_ON.bmp",
    SEQ_LIGHT_CAVALVY : "res/SEQ_LIGHT_CAVALVY.bmp",
    SEQ_LIGHT_CAVALVY_ON : "res/SEQ_LIGHT_CAVALVY_ON.bmp",
    SEQ_LIGHT_INFANTRY : "res/SEQ_LIGHT_INFANTRY.bmp",
    SEQ_LIGHT_INFANTRY_ON : "res/SEQ_LIGHT_INFANTRY_ON.bmp",

    /*
     * 下列UNIT_后加驼峰写法，是为了在之后通过["UNIT_" + unitName]来访问。
     */
    UNIT_axeMan : "res/UNIT_AXEMAN.bmp",
    UNIT_bowMan : "res/UNIT_BOWMAN.bmp",
    UNIT_huntHorse : "res/UNIT_HUNTHORSE.bmp",
    UNIT_impactHorse : "res/UNIT_IMPACTHORSE.bmp",
    UNIT_pikeMan : "res/UNIT_PIKEMAN.bmp",
    UNIT_shieldMan : "res/UNIT_SHIELDMAN.bmp",
    UNIT_axeMan_ON : "res/UNIT_AXEMAN_ON.bmp",
    UNIT_bowMan_ON : "res/UNIT_BOWMAN_ON.bmp",
    UNIT_huntHorse_ON : "res/UNIT_HUNTHORSE_ON.bmp",
    UNIT_impactHorse_ON : "res/UNIT_IMPACTHORSE_ON.bmp",
    UNIT_pikeMan_ON : "res/UNIT_PIKEMAN_ON.bmp",
    UNIT_shieldMan_ON : "res/UNIT_SHIELDMAN_ON.bmp" ,
    UNIT_axeMan_OFF : "res/UNIT_AXEMAN_OFF.bmp",
    UNIT_bowMan_OFF : "res/UNIT_BOWMAN_OFF.bmp",
    UNIT_huntHorse_OFF : "res/UNIT_HUNTHORSE_OFF.bmp",
    UNIT_impactHorse_OFF : "res/UNIT_IMPACTHORSE_OFF.bmp",
    UNIT_pikeMan_OFF : "res/UNIT_PIKEMAN_OFF.bmp",
    UNIT_shieldMan_OFF : "res/UNIT_SHIELDMAN_OFF.bmp",
    UNIT_ATTACK_axeMan : "res/UNIT_ATTACK_AXEMAN.bmp",
    UNIT_ATTACK_bowMan : "res/UNIT_ATTACK_BOWMAN.bmp",
    UNIT_ATTACK_huntHorse : "res/UNIT_ATTACK_HUNTHORSE.bmp",
    UNIT_ATTACK_impactHorse : "res/UNIT_ATTACK_IMPACTHORSE.bmp",
    UNIT_ATTACK_pikeMan : "res/UNIT_ATTACK_PIKEMAN.bmp",
    UNIT_ATTACK_shieldMan : "res/UNIT_ATTACK_SHIELDMAN.bmp",

    TITLE_1 : "res/title_1.png",
    TITLE_2 : "res/title_2.png",
    TITLE_3 : "res/title_3.png",
    TITLE_4 : "res/title_4.png",
    TITLE_5 : "res/title_5.png",
    TITLE_6 : "res/title_6.png",
    TITLE_ON_1 : "res/title_ON_1.png",
    TITLE_ON_2 : "res/title_ON_2.png",
    TITLE_ON_3 : "res/title_ON_3.png",
    TITLE_ON_4 : "res/title_ON_4.png",
    TITLE_ON_5 : "res/title_ON_5.png",
    TITLE_ON_6 : "res/title_ON_6.png",

    BUTTON_RUN : "res/BUTTON_RUN.bmp",
    BUTTON_RUN_GO : "res/BUTTON_RUN_GO.bmp"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
