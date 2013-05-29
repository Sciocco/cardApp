seajs.config({

  // 插件
  plugins: ['text', 'nocache'],

  // 调试模式
  debug: true,

  // Sea.js 的基础路径
  base: './app',

  // 文件编码
  charset: 'utf-8'
});


seajs.use(['main'], function(main) {
  $(document).ready(function() {
    main.init();
  });
});