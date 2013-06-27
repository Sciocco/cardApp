define("app/battle/skill", [ "../utils/dataApi" ], function(require, exports, module) {
    var preload = window.APP.preload;
    var dataApi = require("../utils/dataApi");
    var Skill = function(id) {
        this.initialize(id);
    };
    var p = Skill.prototype = new createjs.BitmapAnimation();
    p.BitmapAnimation_initialize = p.initialize;
    p.initialize = function(id) {
        this.initData(id);
        var data = preload.getResult("skill-sprite-" + id);
        data.images = [ preload.getResult("skill-" + id) ];
        var spriteSheet = new createjs.SpriteSheet(data);
        this.BitmapAnimation_initialize(spriteSheet);
    };
    p.initData = function(id) {
        var data = dataApi.fightskill.findById(id);
        this.type = data.type;
    };
    module.exports = Skill;
});