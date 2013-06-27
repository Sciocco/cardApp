define("app/utils/dataApi-debug", [], function(require, exports, module) {
    var preload = window.APP.preload;
    function Data(key) {
        this.key = key;
        this.data = null;
    }
    Data.prototype.set = function(data) {
        this.data = data;
        var self = this;
        setTimeout(function() {
            localStorage.setItem(self.key, JSON.stringify(data));
        }, 300);
    };
    Data.prototype.findById = function(id) {
        var data = this.all();
        return data[id];
    };
    Data.prototype.all = function() {
        if (!this.data) {
            this.data = JSON.parse(localStorage.getItem(this.key)) || {};
        }
        return this.data;
    };
    var character = new Data("character");
    character.set(preload.getResult("characterData"));
    var fightskill = new Data("fightskill");
    fightskill.set(preload.getResult("fightskillData"));
    exports.character = character;
    exports.fightskill = fightskill;
});