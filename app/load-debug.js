seajs.config({
  // 插件
  plugins: ['nocache'],

  // 调试模式
  debug: true,

  // Sea.js 的基础路径
  base: './app',

  // 文件编码
  charset: 'utf-8'
});

(function() {
  var app = window.APP;
  var preload = app.preload;

  function run() {
    seajs.use(['ui/loadUi', 'utils/clientManager'], function(loadUi, clientManager) {
      $("#loadPage").removeClass("show");
      clientManager.run();
    });
  }
  preload.callback = run;
  app.checkVersion(preload.loadResource);
})();