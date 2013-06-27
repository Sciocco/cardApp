define("app/config/consts-debug", [], function(require, exports, module) {
    module.exports = {
        entityType: {
            PLAYER: "player",
            FIGHTER: "fighter",
            EQUIPMENT: "equipment",
            ITEM: "item"
        },
        pageSize: {
            WIDTH: 640,
            HEIGHT: 960,
            DPR: 2
        },
        roleSex: {
            MAN: 1,
            WOMAN: 2
        }
    };
});