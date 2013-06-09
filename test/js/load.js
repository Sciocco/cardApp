 var preload;
 var stage;

 function load() {

     document.addEventListener(
         "touchstart", function() {
         return false;
     },
         false);

     var manifest = [{
             id: "img0",
             src: "image0.jpg"
         }, {
             id: "img1",
             src: "image1.jpg"
         }, {
             id: "img2",
             src: "image2.jpg"
         }, {
             id: "img3",
             src: "image3.jpg"
         }, {
             id: "card-yzss",
             src: "yzss.png"
         }, {
             id: "skill-19",
             src: "skill/19.png"
         }, {
             id: "skill-sprite-19",
             src: "skill/19.json"
         }, {
             id: "skill-20",
             src: "skill/20.png"
         }, {
             id: "skill-sprite-20",
             src: "skill/20.json"
         }
     ];
     preload = new createjs.LoadQueue(true, "assets/");

     preload.addEventListener("fileload", handleFileLoad);
     preload.addEventListener("progress", handleOverallProgress);
     preload.addEventListener("fileprogress", handleFileProgress);
     preload.addEventListener("error", handleFileError);
     preload.addEventListener("complete", handleFileComplete);

     preload.setMaxConnections(5);

     preload.loadManifest(manifest);
 }


 function stop() {
     if (preload !== null) {
         preload.close();
     }
 }

 function handleFileLoad(event) {}

 function handleFileProgress(event) {}

 function handleOverallProgress(event) {}

 function handleFileError(event) {}

 function handleFileComplete(event) {
     init();
 }


 function init() {
     var canvas = document.createElement('canvas');
     var gdoc = document.getElementById("g-doc");
     gdoc.appendChild(canvas);



     canvas.width = 1000;
     canvas.height = 3500;


     stage = new createjs.Stage(canvas);

     createjs.Touch.enable(stage);
     stage.enableMouseOver(10);
     stage.mouseMoveOutside = true;


     createjs.Ticker.addEventListener("tick", tick);

     var img = new createjs.Bitmap(preload.getResult("card-yzss"));

     var fightRect = new createjs.Rectangle(0, 0, 110, 180);
     var readyRect = new createjs.Rectangle(120, 0, 110, 110);
     var dieRect = new createjs.Rectangle(240, 0, 110, 110);

     var fightCard = img.clone();
     fightCard.sourceRect = fightRect;

     var readyCard = img.clone().set({
         x: 200,
         y: 400
     });
     readyCard.sourceRect = readyRect;

     var dieCard = img.clone().set({
         x: 400,
         y: 500
     });
     dieCard.sourceRect = dieRect;


     var data = preload.getResult("skill-sprite-20");
     data.images = [preload.getResult("skill-20")];
     var spriteSheet = new createjs.SpriteSheet(data);
     var animation = new createjs.BitmapAnimation(spriteSheet).set({
         x: 7,
         y: 70
     });
     animation.gotoAndPlay("all");
     var fightContainer = new createjs.Container();
     fightContainer.addChild(fightCard, animation);

     var fightContainer2 = new createjs.Container().set({
         y: 200
     });

     var fightCard2 = fightCard.clone();

     fightContainer2.addChild(fightCard2);

     fightCard2.onPress = function(evt) {
         var i = 0;
         var animation2 = animation.clone();

         animation2.addEventListener('animationend', function(a) {
             console.log(a);
             if (i == 2) {
                 fightContainer2.removeChild(animation2);
             }
             i++;

         });

         fightContainer2.addChild(animation2);
     };

     var isready = 0;
     var fightCard3 = fightCard.clone().set({
         x: 200,
         y: 200
     });

     readyCard.clickTime = 0;

     readyCard.onPress = function(evt) {
         console.log(evt);

         var currTime = Date.now();
         if (currTime - readyCard.clickTime < 500) {
             return;
         }

         readyCard.clickTime = currTime;

         if (isready === 0) {
             readyCard.sourceRect = dieRect;
             stage.addChild(fightCard3);
             isready = 1;
         } else if (isready === 1) {
             readyCard.sourceRect = readyRect;
             stage.removeChild(fightCard3);
             isready = 0;
         }
     };

     stage.addChild(fightContainer, fightContainer2, readyCard, dieCard);
 }



 function tick(event) {
     stage.update(event);
 }