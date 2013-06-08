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
    createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
    preload.installPlugin(createjs.Sound);

    preload.addEventListener("filestart", handleFileStart);
    preload.addEventListener("fileload", handleFileLoad);
    preload.addEventListener("progress", handleOverallProgress);
    preload.addEventListener("fileprogress", handleFileProgress);
    preload.addEventListener("complete", handleFileComplete);
    preload.addEventListener("error", handleFileError);
    preload.setMaxConnections(5);
  }

  function handleFileStart(event) {
    var item = event.item;
    if (item.type !== 'sound') {
      item.src = item.src + queryVersion();
    }
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
    setTimeout(function() {
      loadStyle();
      loadScript();
    }, 1000);
  }

  function handleFileError(event) {

  }

  function loadStyle() {
    resources.styles.forEach(function(v) {
      app.loadStyle(app.config.ASSET_URL + v + queryVersion());
    });
  }

  function loadScript() {
    resources.scripts.forEach(function(v) {
      app.loadScript(app.config.ASSET_URL + v + queryVersion(), preload.callback);
    });
  }

  function loadLocalSound() {
      resources.sounds.forEach(function(v){
         soundManager.addSound(v.id, new Media(v.src));
      });
  }

  function stop() {
    if (preload !== null) {
      preload.close();
    }
  }

  function queryVersion() {
    return "?v=" + app.version;
  }

  init();

  preload.loadResource = function() {
    resources = app.resources;
    seajs.config({
      'map': [
        [/^(.*\.(?:css|js))(.*)$/i, '$1' + queryVersion()]
      ]
    });

    preload.loadManifest(resources.sounds, false, app.config.ASSET_URL);

    preload.load();
  };
  app.preload = preload;
})();