   // scanlineseedfill.js


    var fillColor = function(startX, startY, imgData, canvas,color) {
     
        var cWidth = canvas.width;
        var cHeight = canvas.height;
        var toImageDataPixelPos = function(x, y) {
            return ((cWidth * y) + x) * 4;
        };

        var startPixelPos = toImageDataPixelPos(startX, startY);
        var baseColor = {
            red: imgData.data[startPixelPos],
            green: imgData.data[startPixelPos + 1],
            blue: imgData.data[startPixelPos + 2],
            alpha: imgData.data[startPixelPos + 3]
        };
    
      var paintHorizontal = function(leftX, rightX, y, imgD) {
            for (var x = leftX; x <= rightX; x++) {
                var pp = toImageDataPixelPos(x, y);
                imgD = setImageDataPixelPos(pp, imgD);

            }
            return imgD;
        };

    var setImageDataPixelPos = function(pp, imgD) {
      //  if(penColor.alpha==0){
imgD.data[pp+3] = 0;
        // }else{
        // imgD.data[pp] = penColor.red;
        // imgD.data[pp+1] = penColor.green;
        // imgD.data[pp+2] = penColor.blue;
        // imgD.data[pp+3] = penColor.alpha;}
        return imgD;
    };
        var isMatchColor2 = function(x, y, imgD) {

            var pp = toImageDataPixelPos(x, y);
            var r = imgD.data[pp] - color[0]; // R値の差

            var g = imgD.data[pp + 1] - color[1]; // G値の差
            var b = imgD.data[pp + 2] - color[2]; // B値の差
            var d = Math.sqrt(r * r + g * g + b * b) / 1.7320508075688774;

            if (d <= distance ) {
                return true;
            } else {
                return false;
            }


        };

        var scanLine = function(leftX, rightX, y, imgD, buffer) {

            while (leftX <= rightX) {
                for (; leftX <= rightX; leftX++) {
                    if (isMatchColor2(leftX, y, imgD)) {
                        break;
                    }
                }
                if (rightX < leftX) {
                    break;
                }
                for (; leftX <= rightX; leftX++) {
                    if (!isMatchColor2(leftX, y, imgD)) {
                        break;
                    }
                }
                buffer.push({
                    x: leftX - 1,
                    y: y
                });
            }
        };

        var paint = function(x, y, imgD) {

          
  // 領域色と描画色が等しければ処理不要
    
var image2=[];
            var buffer = [];
            buffer.push({
                x: x,
                y: y
            });
            while (buffer.length > 0) {
                var point = buffer.pop();
                var leftX = point.x;
                var rightX = point.x;
                /* skip already painted */
             if(image2[point.x]=== undefined ){
        image2[point.x]=[];
       }

         if (image2[point.x][point.y] != -1) {


             // マーカを付ける

             image2[point.x][point.y] = -1;
                /* search left point */
                for (; 0 < leftX; leftX--) {
                    if (!isMatchColor2(leftX - 1, point.y, imgD)) {
                        break;
                    }
                }
                /* search right point */
                for (; rightX < cWidth - 1; rightX++) {
                    if (!isMatchColor2(rightX + 1, point.y, imgD)) {
                        break;
                    }
                }
                /* paint from leftX to rightX */
                imgD = paintHorizontal(leftX, rightX, point.y, imgD);
                /* search next lines */
                if (point.y + 1 < cHeight) {
                    scanLine(leftX, rightX, point.y + 1, imgD, buffer);
                }
               
                if (point.y - 1 >= 0) {
                    scanLine(leftX, rightX, point.y - 1, imgD, buffer);
                }
                
            }
        }
            return imgD;
        
        };

        return paint(startX, startY, imgData);
    };