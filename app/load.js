seajs.config({
  // 插件
  plugins: ['nocache'],

  // 调试模式
  debug: true,

  // 文件编码
  charset: 'utf-8'
});
(function() {
  var app = window.APP;
  var preload = app.preload;

  function run() {
    seajs.use(['app/ui/loadUi', 'app/utils/clientManager'], function(loadUi, clientManager) {
      $("#loadPage").removeClass("show");
      clientManager.run();
    });
  }
  preload.callback = run;
  app.checkVersion(preload.loadResource);
})();