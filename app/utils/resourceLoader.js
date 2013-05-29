define(function(require, exports, module) {

  var config = require('../config/config');
  var resource = require('../config/resource');

  var queue;
  var loaderOnce = false;

  queue = new createjs.LoadQueue(0, config.ASSET_URL);
  createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
  queue.installPlugin(createjs.Sound);
  queue.setMaxConnections(5);


  queue.loadAreaResource = function(data) {

    if (loaderOnce === false) {
      this.loadManifest(resource.sounds);
      this.loadManifest(resource.npcs);
      loaderOnce = true;
    }
    this.loadMap(data.mapName);
  };


  queue.loadMap = function(name) {
    this.loadFile({
      id: "map",
      src: 'images/map/' + name + ".jpg"
    });
  };

  function stop() {
    if (queue !== null) {
      queue.close();
    }
  }

  module.exports = queue;
  exports.stop = stop;

});