 $(function() {


                    /**************************************************

                        クリックした座標を取得する

                    **************************************************/

                    var borderWidth = 1;
                    var text1 = $("#text");
                    var X=$("#x");
                    var Y=$("#y");
                  
                    var searchC = document.getElementById("search-color");
                    var checkerboardBg = [
                        "linear-gradient(45deg, #d9d9d9 25%, transparent 25%)",
                        "linear-gradient(-45deg, #d9d9d9 25%, transparent 25%)",
                        "linear-gradient(45deg, transparent 75%, #d9d9d9 75%)",
                        "linear-gradient(-45deg, transparent 75%, #d9d9d9 75%)"
                    ].join(",");

                    function applyCheckerboard(elm) {
                        if (!elm) return;
                        elm.style.backgroundImage = checkerboardBg;
                        elm.style.backgroundSize = "12px 12px";
                        elm.style.backgroundPosition = "0 0, 0 6px, 6px -6px, -6px 0";
                    }
                    $("canvas").mousemove(function(e) {
                        var pos = getCanvasPoint(this, e);
                        startX = pos.x;
                        startY = pos.y;
                        X.text(startX);
                        Y.text(startY);


                        //関数を実行する
                        var color = syncer_pickUpColor(this, startX, startY);

                        //色がなければ終了
                        if (4 > color.length) return false;
                        if (color[3] === 0) {

                            text1.text('透明');
                            applyCheckerboard(searchC);
                          $("#rgb,#hex,#cmyk,#hsv").text('');
                      

                        } else {
                            //色コード記入
                            value = $("input[name=iro]:checked").val();

                            switch (value) {
                                case "rgb":
                                    $("#text").text('rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')');
                                    break;
                                case "cmyk":
                                    $("#text").text(rgb2cmyk(color));
                                    break;
                                case "hex":
                                    $("#text").text(rgb2s16(color));
                                    break;
                                case "hsv":
                                    $("#text").text(rgb2hsv(color));
                                    break;
                            }

                            $("#rgb").text('rgb(' + color[0] + ',' + color[1] + ',' + color[2] +')');
                            $("#hex").text(rgb2s16(color));
                            $("#cmyk").text(rgb2cmyk(color));
                            $("#hsv").text(rgb2hsv(color));
                            //色を変更
                            searchC.style.background = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';

                        }
                    });

    
            /******************************
              指定した座標の色を取得する関数
             ******************************/
            function syncer_pickUpColor(elm, x, y) {

                //canvasのコンテキスト
                var context = elm.getContext("2d", { willReadFrequently: true });

                //座標の画像を[1px x 1px]だけ取得する
                var image = context.getImageData(x, y, 1, 1);

                //[image]から色情報を取得する
                var color = image.data;

                //結果を返却する
                return color;
            }

            function getCanvasPoint(elm, e) {
                var rect = elm.getBoundingClientRect();
                var scaleX = elm.width / rect.width;
                var scaleY = elm.height / rect.height;
                var x = Math.floor((e.clientX - rect.left) * scaleX);
                var y = Math.floor((e.clientY - rect.top) * scaleY);
                return { x: x, y: y };
            }
            //RGBからHSVへ
            function rgb2hsv(rgb) {
                var r = rgb[0],
                    g = rgb[1],
                    b = rgb[2],
                    min = Math.min(r, g, b),
                    max = Math.max(r, g, b),
                    delta = max - min,
                    h, s, v;

                if (max === 0)
                    s = 0;
                else
                    s = Math.round((delta / max * 1000) / 10);

                if (max == min)
                    h = 0;
                else if (r == max)
                    h = (g - b) / delta;
                else if (g == max)
                    h = 2 + (b - r) / delta;
                else if (b == max)
                    h = 4 + (r - g) / delta;

                h = Math.round(Math.min(h * 60, 360));

                if (h < 0)
                    h += 360;

                v = Math.round(((max / 255) * 1000) / 10);

                return [h, s, v];
            }

            //RGBからCMYKへ

            function rgb2cmyk(rgb) {
                var r = rgb[0] / 255,
                    g = rgb[1] / 255,
                    b = rgb[2] / 255,
                    c, m, y, k;

                k = Math.min(1 - r, 1 - g, 1 - b);
                c = (1 - r - k) / (1 - k) || 0;
                m = (1 - g - k) / (1 - k) || 0;
                y = (1 - b - k) / (1 - k) || 0;
                return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
            }

// r
function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
// g
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
// b
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
// # hazusu
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}

var displayZoom = 2;
var displayFit = { width: 0, height: 0 };

function getFitDisplaySize(img) {
    var maxW = $("#canvas-zone").width() || 800;
    maxW = Math.min(800, maxW);
    var maxH = 500;
    var scale = Math.min(1, maxW / img.width, maxH / img.height);
    var w = Math.max(1, Math.round(img.width * scale));
    var h = Math.max(1, Math.round(img.height * scale));
    return { width: w, height: h };
}

function applyDisplaySize() {
    var scale = displayZoom / 2;
    var w = Math.max(1, Math.round(displayFit.width * scale));
    var h = Math.max(1, Math.round(displayFit.height * scale));
    $("#mycanvas,#mycanvas2").css({ width: w + "px", height: h + "px" });
}

function setDisplayZoom(zoom) {
    var next = Math.max(1, Math.min(20, Number(zoom) || 2));
    displayZoom = next;
    applyDisplaySize();
}

function drawImageToCanvas(img, x, y, withImageData) {
    canvasR.width = canvas.width = img.width;
    canvasR.height = canvas.height = img.height;
    ctx.drawImage(img, x || 0, y || 0, img.width, img.height);
    displayFit = getFitDisplaySize(img);
    applyDisplaySize();
    if (withImageData) {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}


            //RGBからHEXへ
            function rgb2s16(rgb) {

                var r = parseInt(rgb[0], 10).toString(16);
                var g = parseInt(rgb[1], 10).toString(16);
                var b = parseInt(rgb[2], 10).toString(16);
                var code = "#" + r + g + b;

                return code;
            }


 //変数の定義
 var canvas = document.getElementById('mycanvas');
 var canvasR = document.getElementById('mycanvas2');
 var Canvas = $("canvas");
 var CanvasR = $("#mycanvas2");
 var MYcanvas = $("#mycanvas,#mycanvas2");
 var colorp = document.getElementById('color');
 var ctx = canvas.getContext('2d', { willReadFrequently: true });
 var ctxR = canvasR.getContext('2d', { willReadFrequently: true });
 var X = $("#x");
 var Y = $("#y");
 var imageData;
 var ctxX;
 var h;
 $('#modoru,#susumu').attr('disabled', true);
 var canvas2 = document.getElementById('kk');
 var copyctx = canvas2.getContext('2d', { willReadFrequently: true });
 /* Imageオブジェクトを生成 */
 var img2 = new Image();
 var img = new Image();
 var imageMemory = []; // キャンバスのイメージの保存用配列
 var flag = 0;
 //penの設定
 var startX2, startY2, x2, y2, isDrawing = false;
 var X1 = [];
 var Y1 = [];
 var _x;
 var _y;
 var filename;


 $('#radiosampleid1').prop('checked', true);


 MYcanvas.mousedown(function(e) {
     var cw = canvas.width;
     var ch = canvas.height;
     imageData = ctx.getImageData(0, 0, cw, ch);

     if (flag === 0) {
         imageMemory[flag] = ctx.getImageData(0, 0, cw, ch);
         ++flag;
     }
     //色モード
     if ($('input[name=radiosample]:checked').val() == 1) {
         distance = $("#distance").val();
         //色の抜き出し
         color = [];
         color = syncer_pickUpColor(canvas, X.text(), Y.text());
         // 透明色　隣接 シングル 
         if (color[3] === 0) {
             return;
         } else if ($("#rinsetu:checked").val()) {
             imageData = fillColor(X.text(), Y.text(), imageData, canvas, color);
             imageMemory[flag] = ctx.getImageData(0, 0, cw, ch);
             ++flag;
             ctx.putImageData(imageData, 0, 0);
         } else {
             touka_single();
             imageMemory[flag] = ctx.getImageData(0, 0, cw, ch);
             ++flag;
         }
         img_src = canvas.toDataURL("image/png");
         img2.src = img_src;
     } else if ($('input[name=radiosample]:checked').val() == 2) {
         //penmode
         if ($('input[name=iro2]:checked').val() == "source-over") {
             ctxX = ctxR;
             ctxR.globalCompositeOperation = "source-over";
             var HEX = $("#penColor").val();
             rgb = [];
             rgb[0] = HexToR(HEX);
             rgb[1] = HexToG(HEX);
             rgb[2] = HexToB(HEX);
         } else {
             ctxX = ctx;
             ctx.globalCompositeOperation = "destination-out";
         }
         var cap;
         var join;
         if ($("input[name=katati]:checked").val() === "pen") {
             cap = "round";
             join = "round";
         } else {
             cap = "butt";
             join = "miter";
         }
         ctxX.lineCap = cap;
         ctxX.lineJoin = join;
         isDrawing = true;
        var penStart = getCanvasPoint(this, e);
        startX2 = penStart.x;
        startY2 = penStart.y;

         if ($('input[name=katati]:checked').val() == "sikaku" && $('input[name=iro2]:checked').val() == "destination-out") {
             ctxR.lineWidth = 1;
             ctxR.strokeStyle = "#ccc";
         } else {
             ctxX.lineWidth = penmaru;
             ctxX.strokeStyle = $("#penColor").val();
         }
         Canvas.mousemove(function(e) {
                 if (!isDrawing) return;
                 var penMove = getCanvasPoint(this, e);
                 x2 = penMove.x;
                 y2 = penMove.y;
                 ctxX.beginPath();
                 if ($("input[name=katati]:checked").val() == "pen") {
                     ctxX.moveTo(startX2, startY2);
                     ctxX.lineTo(x2, y2);
                     ctxX.stroke();
                     startX2 = x2;
                     startY2 = y2;
                 } else if ($("input[name=katati]:checked").val() == "sikaku") {
                     ctxR.clearRect(0, 0, canvas.width, canvas.height);
                     if ($('[name=iro2]:checked').val() == "source-over") {
                         ctxX.strokeRect(startX2, startY2, x2 - startX2, y2 - startY2);
                     } else {
                         ctxR.strokeRect(startX2, startY2, x2 - startX2, y2 - startY2);
                     }
                 }

             })
             .mouseup(function() {

                 if (!isDrawing) return;

                 ctxX.closePath();
                 if ($('[name=iro2]:checked').val() == "destination-out") {
                     ctxR.clearRect(0, 0, canvas.width, canvas.height);
                     ctxX.fillRect(startX2, startY2, x2 - startX2, y2 - startY2);
                 }

                 if ($('[name=iro2]:checked').val() == "source-over") {
                     DataPEN = ctxX.getImageData(0, 0, canvasR.width, canvasR.height);
                     // var R = HexToR(h);
                     // var G = HexToG(h);
                     // var B = HexToB(h);
                     // ImageDataの操作
                     var imgd2 = DataPEN.data;
                     var len = imgd2.length / 4;
                     for (var i = 0; i < len; ++i) {
                         if (imgd2[i * 4 + 3] > 0.1) {
                             imgd2[i * 4 + 0] = rgb[0];
                             imgd2[i * 4 + 1] = rgb[1];
                             imgd2[i * 4 + 2] = rgb[2];
                             imgd2[i * 4 + 3] = 255;
                         }
                     }
                     ctxX.putImageData(DataPEN, 0, 0);
                     ctx.drawImage(canvasR, 0, 0, canvas.width, canvas.height);
                     ctxR.clearRect(0, 0, canvasR.width, canvasR.height);
                 }

                 imageMemory[flag] = ctx
                     .getImageData(0, 0, canvas.width, canvas.height);
                 ++flag;

                 isDrawing = false;



             })
             .mouseleave(function() {
                 isDrawing = false;

             });
     }
     if (flag > 0) {
         $('#modoru').attr('disabled', false);
     }

     return false;

 });

 // penmode
 $('input[name=iro2]').click(function() {

     if ($('input[name=katati]:checked').val() == "sikaku") {
         $("#mycanvas").css({
             'z-index': '1'
         });
     } else if ($('input[name=iro2]:checked').val() == "destination-out") {
         $("#mycanvas").css({
             'z-index': '999'
         });
     } else if ($('input[name=iro2]:checked').val() == "source-over") {
         $("#mycanvas").css({
             'z-index': '1'
         });

     }

     ctxR.globalCompositeOperation = "source-over";
     ctx.globalCompositeOperation = "source-over";

 });

 //katati

 $('input[name=katati]').click(function() {

     if ($('input[name=katati]:checked').val() == "sikaku") {
         $("#mycanvas").css({
             'z-index': '1'
         });
     } else if ($('input[name=katati]:checked').val() == "pen" && $('input[name=iro2]:checked').val() == "destination-out") {
         $("#mycanvas").css({
             'z-index': '1'
         });

     }
     ctxR.globalCompositeOperation = "source-over";
     ctx.globalCompositeOperation = "source-over";
 });

 //モード切替
 $("input[name=radiosample]").click(function() {
     if (this.value == 1) {
         $("#mode2").hide();
         $("#mode1").show("fast");
         ctx.globalCompositeOperation = "source-over"
         $("#mycanvas").css({
             'z-index': '999'
         });


     } else if (this.value == 2) {
         $("#mode1").hide();
         $("#mode2").show("fast");
         if ($('input[name=iro2]:checked').val() == "source-over") {
             $("#mycanvas").css({
                 'z-index': '1'
             });
         }
         if ($('input[name=katati]:checked').val() == "sikaku") {
             $("#mycanvas").css({
                 'z-index': '1'
             });
         }
     }

 });

 $("#penColor").change(function() {
     ctxR.strokeStyle = $(this).val();
 });



 function touka_single() {
     //単色塗りつぶしか許容値の範囲で塗りつぶし
     var imgd = imageData.data;
     var len = imgd.length / 4;

     var color = [];
     color = syncer_pickUpColor(canvas, X.text(), Y.text());
     var r;
     var g;
     var b;
     var d;

     //透明色のストップと許容値が０だけの処理
     if (0 === distance) {
         for (var i = 0; i < len; i++) {
             if (imgd[i * 4 + 0] == color[1] && imgd[i * 4 + 1] == color[2] && imgd[i * 4 + 2] == color[3]) {
                 imgd[i * 4 + 3] = 0;
             }
         }
     } else {
         for (var i = 0; i < len; i++) {
             r = imgd[i * 4] - color[0]; // R値の差
             g = imgd[i * 4 + 1] - color[1]; // G値の差
             b = imgd[i * 4 + 2] - color[2]; // B値の差
             d = Math.sqrt(r * r + g * g + b * b) / 1.7320508075688774;
             if (d <= distance) {
                 imgd[i * 4 + 3] = 0;
             }
         }
     }

     ctx.putImageData(imageData, 0, 0);
 }





 // クリックイベント

 //便利ボタン
 $("#gazouka").click(function() {

     var img_src = canvas.toDataURL("image/png");

     $("#omoti-img").attr("src", img_src);
     $("#img-zone").show("slow");
     // リサイズ処理
 });
 $("#tojiru").click(function() {

     $("#img-zone").hide("slow");
 });
$("#hozon").click(function() {
        var img_src = canvas.toDataURL("image/png");
        // リサイズ処理
        filename = (filename || 'touka.png');
        this.download = filename;
        this.href = img_src;
    });



$("#resize").click(function() {
     var imgC = new Image();
     imgC.src = canvas.toDataURL("image/png");


     imgC.onload = function() {
         //好きなサイズにする　ここでは初期値に

         drawImageToCanvas(imgC, 0, 0, false);
         $("#img-zone").show("slow");
         img_canvas = canvas.toDataURL("image/png");
         $("#omoti-img").attr("src", img_canvas);
     };

 });



 // 戻る進む
 $("#modoru").click(function() {
     if (flag > 0) {
         flag--;
         ctx.putImageData(imageMemory[flag - 1], 0, 0);
         $('#susumu').attr('disabled', false);
         imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     }
     if (flag - 1 == 0) {
         $('#modoru').attr('disabled', true);
     }
     img_src = canvas.toDataURL("image/png");
     img2.src = img_src;
 });
 $("#susumu").click(function() {
     if (flag < imageMemory.length) {
         flag++;
         ctx.putImageData(imageMemory[flag - 1], 0, 0);

         $('#modoru').attr('disabled', false);
         imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

     }
     if (flag == imageMemory.length) {
         $('#susumu').attr('disabled', true);
     }
     img_src = canvas.toDataURL("image/png");
     img2.src = img_src;
 });
 $("#drop").click(function() {
     $("#drop-zone").toggle();
 });
$("#reset").click(function() {
     applyCheckerboard(canvas2);
     applyCheckerboard(canvas);
     $("#reset").hide();
     $("#color").hide();
     $("#imageb").show();
 });

 $("#toumeiL").click(function() {
     $("#color").show();
     $("#imageb").hide();
     canvas.style.background = colorp.style.backgroundColor;
     canvas2.style.background = colorp.style.backgroundColor;

    $("#reset").show();

 });
 //画像拡大縮小
 $("#syokika").click(function() {
     $('#modoru,#susumu').attr('disabled', true);
     imageMemory = []; // キャンバスのイメージの保存用配列
     flag = 0;
     count = 1;
     drawImageToCanvas(img, 0, 0, true);
     img_src = canvas.toDataURL("image/png");
     img2.src = img_src;
 });

 var count = 1;
 var Bairitu = $("#bairitu");
 $("#dai").click(function() {

     var cw = img.width;
     var ch = img.height;
     count *= Bairitu.val();
     //var imageData = ctx.getImageData(0, 0, cw, ch);
     canvas.width = cw * count;
     canvas.height = ch * count;
     //読み込んだ画像イメージを指定のサイズで表示する
     ctx.drawImage(img, 0, 0, cw * count, ch * count);
     imageData = ctx.getImageData(0, 0, cw * count, ch * count);
 });


 $("#syou").click(function() {

     var cw = img.width;
     var ch = img.height;
     count /= Bairitu.val();
     //var imageData = ctx.getImageData(0, 0, cw, ch);
     canvas.width = cw * count;
     canvas.height = ch * count;
     //読み込んだ画像イメージを指定のサイズで表示する
     ctx.drawImage(img, 0, 0, cw * count, ch * count);
     imageData = ctx.getImageData(0, 0, cw * count, ch * count);

 });

 //sample画像の読み込み
 $("#samp-ga1").click(function() {

     img.src = "./imgs/touka/syoki.png?" + new Date().getTime();
     /* 画像が読み込まれるのを待ってから処理を続行 */
     img.onload = function() {
         drawImageToCanvas(img, 0, 0, true);
         $("#size").text("横幅：" + img.width + "/高さ:" + img.height);
         imageMemory = []; // キャンバスのイメージの保存用配列
         flag = 0;
         count = 1;
     };
 });

 $("#samp-ga2").click(function() {

     img.src = "./imgs/touka/222.png?" + new Date().getTime();
     /* 画像が読み込まれるのを待ってから処理を続行 */
     img.onload = function() {
         drawImageToCanvas(img, 0, 0, true);
         $("#size").text("横幅：" + img.width + "/高さ:" + img.height);
         imageMemory = []; // キャンバスのイメージの保存用配列
         flag = 0;
         count = 1;
     }
 });
 // 画像の操作全般


 //初めの読み込む画像
function draw() {
    if (!canvas || !canvas.getContext) {
        return false;
    }
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     applyCheckerboard(canvas);
     applyCheckerboard(canvas2);
     $("#size").text("横幅：" + canvas.width + "　高さ：" + canvas.height);
     imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

 draw();

 //ドラッグドロップでcanvasに画像読み込み
 var print_img_id = 'print_img';
 var print_DataURL_id = 'print_DataURL';

 if (checkFileApi() && checkCanvas(canvas)) {
     //ファイル選択

     var file_image = document.getElementById('file-image');
     file_image.addEventListener('change', selectReadfile, false);
     //ドラッグオンドロップ
     var dropZone = document.getElementById('drop-zone');
     dropZone.addEventListener('dragover', handleDragOver, false);
     dropZone.addEventListener('drop', handleDragDropFile, false);

 }

 //canvas に対応しているか
 function checkCanvas(canvas) {
     if (!canvas || !canvas.getContext) {
         return false;
     }
     return true;
 }

 // FileAPIに対応しているか
 function checkFileApi() {
     // Check for the various File API support.
     if (window.File && window.FileReader && window.FileList && window.Blob) {
         // Great success! All the File APIs are supported.
         return true;
     }
     alert('このブラウザーはファイルＡＰＩに対応');
     return false;
 }

 //ファイルが選択されたら読み込む
 function selectReadfile(e) {
     var file = e.target.files;
     var reader = new FileReader();
     //dataURL形式でファイルを読み込む
     reader.readAsDataURL(file[0]);
     filename=file[0].name
     //ファイルの読込が終了した時の処理
     reader.onload = function() {
         readDrawImg(reader, canvas, 0, 0);
     }
 }

 //ドラッグオンドロップ
 function handleDragOver(e) {
     e.stopPropagation();
     e.preventDefault();
     e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
 }

 function handleDragDropFile(e) {
     e.stopPropagation();
     e.preventDefault();
     var files = e.dataTransfer.files; // FileList object.
     var file = files[0];
     filenamme=file.name;
     var reader = new FileReader();
     //dataURL形式でファイルを読み込む
     reader.readAsDataURL(file);

     //ファイルの読込が終了した時の処理
     reader.onload = function() {
         readDrawImg(reader, canvas, 0, 0);
     }

 }

 function readDrawImg(reader, canvas, x, y) {
     img = readImg(reader);
     drawImgOnCav(canvas, img, x, y);
 }

 //ファイルの読込が終了した時の処理
 function readImg(reader) {
     //ファイル読み取り後の処理
     var result_dataURL = reader.result;
     var img = new Image();
     img.src = result_dataURL;
     return img;
 }

 //キャンバスにImageを表示
 function drawImgOnCav(canvas, img, x, y) {
     img.onload = function() {
         drawImageToCanvas(img, x, y, true);
         $("#size").text("横幅：" + img.width + "/高さ:" + img.height);
     }

     $("#drop-zone").hide();
     flag = 0;
     imageMemory = [];
 }



var img_src;
var loop;
var karitu = $("#ka-ritu"); //拡大鏡の倍率
var z; //倍率
var min = Math.min(canvas.width, canvas.height)
setDisplayZoom(karitu.val());
$("#kakudai").click(function() {

     if ($("#kakudai:checked").val()) {
         loop = 1;
         $("#kk").show();
         img_src = canvas.toDataURL("image/png");
         img2.src = img_src;
         karituV = karitu.val();
         kCanvas = canvas2.width;
         min = Math.min(canvas.width, canvas.height)
         if (200 > min) {
             z = min / 2
         } else {
             z = (kCanvas / karituV) / 2; //切り取り範囲　2倍　貼り付け先２００ｐｘ
         }
         var Xz, Yz, flagx, flagy;
         /* 画像が読み込まれるのを待ってから処理を続行 */

         img2.onload = function() {
             $("#mycanvas").mousemove(function() {
                 if (loop == 1) {
                     copyctx.clearRect(0, 0, 200, 200);

                     Xz = X.text();
                     Yz = Y.text();
                     flagx = 0;
                     flagy = 0;
                     if (Xz > canvas.width - z) {
                         sxz = Xz - (canvas.width - z * 2);
                         Xz = canvas.width - z * 2;
                         flagx = 2;
                     } else if (Xz < z) {
                         sxz = Xz;
                         Xz = 0;
                         flagx = 2;
                     } else {
                         Xz -= z;
                         flagx = 1;
                     }
                     if (Yz > canvas.height - z) {
                         syz = Yz - (canvas.height - z * 2);
                         Yz = canvas.height - z * 2;

                     } else if (Yz < z) {
                         syz = Yz;
                         Yz = 0;

                     } else {
                         Yz -= z;
                         flagy = 1;

                     }
                     copyctx.drawImage(img2, Xz, Yz, z * 2, z * 2, 0, 0, canvas2.width, canvas2.height);

                     copyctx.beginPath(); // 1.Pathで描画を開始する

                     if (flagx == 1) {
                         copyctx.moveTo(100, 0); // 2.描画する位置を指定する
                         copyctx.lineTo(100, 200); // 3.指定座標まで線を引く
                         copyctx.stroke(); // 4.Canvas上に描画する
                     } else {
                         copyctx.moveTo(sxz * karituV, 0); // 2.描画する位置を指定する
                         copyctx.lineTo(sxz * karituV, 200); // 3.指定座標まで線を引く
                         copyctx.stroke(); // 4.Canvas上に描画する
                     }
                     if (flagy == 1) {
                         copyctx.moveTo(0, 100); // 2.描画する位置を指定する
                         copyctx.lineTo(200, 100); // 3.指定座標まで線を引く
                         copyctx.stroke(); // 4.Canvas上に描画する
                     } else {
                         copyctx.moveTo(0, syz * karituV); // 2.描画する位置を指定する
                         copyctx.lineTo(200, syz * karituV); // 3.指定座標まで線を引く
                         copyctx.stroke(); // 4.Canvas上に描画する
                     }
                 }
             });
         };
     } else {
         $("#kk").hide();
     }
 });

 // スライダー
$('#ka-ritu2').slider({
     range: 'min',
     min: 1,
     max: 20,
     value: 2,
     orientation: 'horizontal',
     animate: 'normal',
    slide: function(event, ui) {
        var SV = ui.value;
        karitu.val(SV);
        karituV = karitu.val();
        setDisplayZoom(karituV);
        kCanvas = canvas2.width;
        if (200 > min) {
            z = min / 2;
        } else {
            z = (kCanvas / karituV) / 2;
        }
        

    }

});

karitu.on('change input', function() {
    setDisplayZoom($(this).val());
});

 //penwidth
 var canvasWidth = document.getElementById("canvasWidth");
 var contextWidth = canvasWidth.getContext("2d");
 contextWidth.arc(25, 25, 10 / 2, 0, 2 * Math.PI, false);
 contextWidth.fill();
 var penmaru = 10;

 $('#slider2').slider({
     range: 'min',
     min: 1,
     max: 50,
     value: 10,
     orientation: 'horizontal',
     animate: 'normal',
     slide: function(event, ui) {
         var SV = ui.value
         penmaru = SV;
         ctxR.lineWidth = SV;
         ctx.lineWidth = SV;
         contextWidth.clearRect(0, 0, 100, 100);
         contextWidth.beginPath();
         contextWidth.fillStyle = "black";
         contextWidth.arc(25, 25, SV / 2, 0, 2 * Math.PI, false);
         contextWidth.closePath();
         contextWidth.fill();
         contextWidth.beginPath();
         contextWidth.font = "14px Arial";
         contextWidth.fillStyle = 'red';
         contextWidth.fillText(SV, 20, 20);
         contextWidth.fill();
     }
 });




 $('.slider').slider({
     range: 'min',
     min: 0,
     max: 255,
     value: 0,
     orientation: 'horizontal',
     animate: 'normal',
     slide: function(event, ui) {


         $("input[name=distance]").val(ui.value);

     }
 });



 $("#load").click(function() {

     $.ajax({
         url: 'http://www.webtoolss.com/ajax/base64.php',
         async: true,
         dataType: 'json',
         data: {
             'url': $('#image_url2').val()
         },
         success: function(data) {
             $("#result").val(data.base64);
             $("#gazou").attr("src", 'data:image/' + data.dotto + ';base64,' + data.base64);
             img.src = 'data:image/' + data.dotto + ';base64,' + data.base64;
             img.onload = function() {
                 canvasR.width = canvas.width = img.width;
                 canvasR.height = canvas.height = img.height;
                 ctx.drawImage(img, 0, 0, img.width, img.height); // 画像が読み込めたらcanvasに描画
                 imageData = ctx.getImageData(0, 0, img.width, img.height);
                 $("#drop-zone").hide();
                 flag = 0;
                 imageMemory = [];
             };

         },//success
         error: function(data) {
            
           //  $("#image_url2").val("jpg,gif,pngファイルではない可能性があります。");
         }//error
     });

 });



 });







