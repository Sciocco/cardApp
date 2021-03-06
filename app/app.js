this.APP = this.APP || {};

/**
 * [ app utils ]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;

  app.loadScript = function(url, callback) {
    var script = document.createElement('script');
    if (callback) {
      script.onload = function() {
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  app.loadStyle = function(url, callback) {
    var node = document.createElement('link');
    node.rel = 'stylesheet';

    if (callback) {
      node.onload = function() {
        callback();
      };
    }
    node.href = url;
    document.getElementsByTagName("head")[0].appendChild(node);
  };

  app.ajaxLoading = function() {
    $("#waitPage").show();
  };

  app.ajaxLoadingEnd = function() {
    $("#waitPage").hide();
  };

})();

/**
 * [ app config]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;
  var config = {
    ASSET_URL: 'http://192.168.1.88:88/cardApp/assets/'
  };
  app.config = config;
})();


/**
 * [ app model]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;

  var model = {
    className: "app",
    attributes: {},
    save: function() {
      localStorage[this.className] = JSON.stringify(this.attributes);
      return localStorage[this.className];
    },
    load: function() {
      var result, key;
      result = localStorage[this.className];
      if (result !== undefined) {
        result = JSON.parse(result);
        for (key in result) {
          this.attributes[key] = result[key];
        }
      }
    },
    setValue: function(key, value) {
      this.attributes[key] = value;
      this.save();
    },
    deleteValue: function(key) {
      this.attributes[key] = null;
      this.save();
    },
    getValue: function(key) {
      var value;
      if (key in this.attributes) {
        value = this.attributes[key];
      }
      return value;
    }
  };
  model.load();
  app.model = model;
})();

/**
 * [app version ]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;
  var config = app.config;
  var model = app.model;

  function checkVersion(callback) {
    var url = config.ASSET_URL + "js/version.js?time=" + Date.now();

    app.loadScript(url, function() {
      callback();
    });
  }

  app.checkVersion = checkVersion;
})();

/**
 * [ app soundManager ]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;
  var model = app.model;

  var soundManager, p;

  var ON_SOUND = 1;
  var OFF_SOUND = 2;
  var BG_SOUND = "bgSound";

  function SoundManager() {
    this.bgSoundStatus = model.getValue("bgSoundStatus") || ON_SOUND;
    this.effectSoundStatus = model.getValue("effectSoundStatus") || ON_SOUND;
  }

  SoundManager.sounds = {};

  p = SoundManager.prototype;

  p.addSound = function(key, instance) {
    SoundManager.sounds[key] = instance;
  };

  p.stopSound = function(key) {
    var instance = null;

    if (key in SoundManager.sounds) {
      instance = SoundManager.sounds[key];
      instance.stop();
    }
    return instance;
  };


  p.playEffectSound = function(key) {
    var instance = null;

    if (key in SoundManager.sounds && this.effectSoundStatus === ON_SOUND) {
      instance = SoundManager.sounds[key];
      instance.play();
    }
    return instance;
  };

  p.playBgSound = function() {
    var instance = SoundManager.sounds[BG_SOUND];

    if (this.bgSoundStatus === ON_SOUND && instance) {
      instance.play(createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
    }
    return instance;
  };

  p.toggleBgSound = function() {
    if (this.bgSoundStatus === ON_SOUND) {
      this.bgSoundStatus = OFF_SOUND;
      this.stopSound(BG_SOUND);
    } else {
      this.bgSoundStatus = ON_SOUND;
      this.playBgSound();
    }
    model.setValue("bgSoundStatus", this.bgSoundStatus);
  };

  p.toggleEffectSound = function() {

    if (this.effectSoundStatus === ON_SOUND) {
      this.effectSoundStatus = OFF_SOUND;
    } else {
      this.effectSoundStatus = ON_SOUND;
    }
    model.setValue("effectSoundStatus", this.effectSoundStatus);
  };

  soundManager = new SoundManager();
  app.soundManager = soundManager;
})();

/**
 * [loading 加载系统]
 * @return {[type]} [description]
 */
(function() {
  var app = window.APP;
  var soundManager = app.soundManager;
  var resources;
  var preload;
  var $percent = document.getElementById('id_loadPercent');
  $percent.innerHTML = 0;

  function init() {
    if (preload) {
      preload.close();
    }
    preload = new createjs.LoadQueue(false);
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    preload.installPlugin(createjs.Sound);

    preload.addEventListener("filestart", handleFileStart);
    preload.addEventListener("fileload", handleFileLoad);
    preload.addEventListener("progress", handleOverallProgress);
    preload.addEventListener("fileprogress", handleFileProgress);
    preload.addEventListener("error", handleFileError);
    preload.setMaxConnections(5);
  }

  function handleFileStart(event) {

  }

  function handleFileLoad(event) {
    var item = event.item;
    if (item.type === createjs.LoadQueue.SOUND) {
      soundManager.addSound(item.id, createjs.Sound.createInstance(item.id));
    }
  }

  function handleOverallProgress(event) {
    var n = parseInt(preload.progress * 100, 10);
    $percent.innerHTML = n;
  }

  function handleFileProgress(event) {

  }

  function handleFileComplete(event) {
    soundManager.playBgSound();
    loadStyle();
    loadScript();
  }

  function handleFileError(event) {

  }

  function loadStyle() {
    resources.styles.forEach(function(v) {
      app.loadStyle(resourceUrl(v, 'styles'));
    });
  }

  function loadScript() {
    resources.scripts.forEach(function(v) {
      app.loadScript(resourceUrl(v, 'scripts'), preload.callback);
    });
  }

  function loadLocalSound() {
    resources.sounds.forEach(function(v) {
      soundManager.addSound(v.id, new Media(v.src));
    });
  }

  function stop() {
    if (preload !== null) {
      preload.close();
    }
  }

  function resourceUrl(url, kind) {

    var query = queryVersion(kind);

    url = app.config.ASSET_URL + url + query;

    return url;
  }

  function queryVersion(kind) {
    return "?v=" + app.version[kind];
  }

  init();

  preload.loadCard = function(id, callback) {
    preload.removeAllEventListeners("complete");
    preload.addEventListener("complete", callback);

    var cards = [];

    if (!preload.getResult("card-large-" + id)) {
      cards.push({
        id: "card-large-" + id,
        src: "images/card/large/bA" + id + ".png"
      });
    }

    if (!preload.getResult("card-normal-" + id)) {
      cards.push({
        id: "card-normal-" + id,
        src: "images/card/normal/sA" + id + ".png"
      });
    }

    if (!preload.getResult("card-small-" + id)) {
      cards.push({
        id: "card-small-" + id,
        src: "images/card/small/fA" + id + ".png"
      });
    }

    preload.loadManifest(cards, false, app.config.ASSET_URL);
    preload.load();
  };

  preload.loadResource = function() {
    preload.removeAllEventListeners("complete");
    preload.addEventListener("complete", handleFileComplete);
    app.loadScript(resourceUrl("js/resources.js", 'resources'), preload._loadResource);
  };

  preload._loadResource = function() {
    var config = [];
    resources = app.resources;
    seajs.config({
      'map': [
        [/^(.*\.(?:css|js))(.*)$/i, '$1' + queryVersion('scripts')]
      ]
    });

    resources.config.forEach(function(item) {
      item.src = resourceUrl(item.src, item.id);
      config.push(item);
    });

    preload.loadManifest(resources.sounds, false, app.config.ASSET_URL);
    preload.loadManifest(resources.images, false, app.config.ASSET_URL);
    preload.loadManifest(resources.figureFrame, false, app.config.ASSET_URL);
    preload.loadManifest(resources.skill, false, app.config.ASSET_URL);
    preload.loadManifest(resources.effect, false, app.config.ASSET_URL);
    preload.loadManifest(resources.rune, false, app.config.ASSET_URL);
    preload.loadManifest(resources.buffer, false, app.config.ASSET_URL);
    preload.loadManifest(config, false);

    preload.load();
  };


  app.preload = preload;
})();