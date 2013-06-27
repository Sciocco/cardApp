define("app/battle/effect-debug", [], function(require, exports, module) {
    var preload = window.APP.preload;
    var fighterBgEffect = new createjs.Bitmap(preload.getResult("fighterBg"));
    fighterBgEffect.visible = false;
    fighterBgEffect.appendToFighter = function(fighter) {
        fighterBgEffect.set({
            x: -15,
            y: -15
        });
        fighterBgEffect.visible = true;
        fighter.addChildAt(fighterBgEffect);
    };
    fighterBgEffect.removeFromFighter = function(fighter) {
        fighter.removeChild(fighterBgEffect);
        fighterBgEffect.visible = false;
    };
    function FighterReadyEffect() {
        var fighterBgEffect = new createjs.Bitmap(preload.getResult("fighterBg"));
        return fighterBgEffect;
    }
    exports.fighterBgEffect = fighterBgEffect;
    exports.FighterReadyEffect = FighterReadyEffect;
});