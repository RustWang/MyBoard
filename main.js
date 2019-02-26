var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


autoSetCanvasSize(canvas);

var isUsingBoard = false;
var isUsingEraser = false;
listenToUser(canvas);


var eraser = document.getElementById('eraser');
var brush = document.getElementById("brush");
var actions = document.getElementById('actions');
var clearcanvas = document.getElementById("clearcanvas");
var body = document.getElementsByTagName("body")[0];
var choosedColor = 'black';

var download = document.getElementById("download");

window.onload = function () { 
    context.fillStyle = 'white';
    
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'black';
}


if (document.body.ontouchstart === undefined) {
    eraser.onclick = beginUsingEraser;
    brush.onclick = beginUsingBrush;
    clearcanvas.onclick = beginUsingClearCanvas;
    download.onclick = beginUsingDownload;
} else {
    eraser.ontouchstart = beginUsingEraser;
    brush.ontouchstart = beginUsingBrush;
    clearcanvas.ontouchstart = beginUsingClearCanvas;
    download.ontouchstart = beginUsingDownload;
}

var color = document.getElementsByClassName("colors")[0];
var colorLiArr = color.getElementsByTagName('li');
var sizes = document.getElementById("sizes");
var sizeArr = sizes.getElementsByTagName('li');
var brushWidth = 2;


for (let i = 0; i < sizeArr.length; i++) {
    sizeArr[i].linew = (i + 1) * 2; 
}
if (document.body.ontouchstart === undefined) {
    addLineWidthClick();
    addColorClickEvent();
} else {
    addLineWidthTouch();
    addColorTouchEvent();
}




function drawLine(beginx, beginy, endx, endy, lineWidth, color) {
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = color;  
    context.moveTo(beginx, beginy);
    context.lineTo(endx, endy);
    context.stroke();
    context.closePath();
}


function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
}

function autoSetCanvasSize(canvas) {
    
    setCanvasSize();
    
    window.onresize = function (e) {
        setCanvasSize();
    };

    
    function setCanvasSize() {

        var pagex = document.documentElement.clientWidth;
        var pagey = document.documentElement.clientHeight;
        canvas.width = pagex;
        canvas.height = pagey;
    }
}

function listenToUser(canvas) {

    
    if (document.body.ontouchstart === undefined) {
        
        canvas.onmousedown = function (e) {
            var x = e.clientX;
            var y = e.clientY;
            isUsingBoard = true;

            lastPoint = {
                'x': x,
                'y': y
            };

            if (isUsingEraser) {
                drawCircle(x, y, brushWidth / 2, 'white');
            } else {
                drawCircle(x, y, brushWidth / 2);
            }
        };

        canvas.onmousemove = function (e) {
            var x = e.clientX;
            var y = e.clientY;
            if (isUsingBoard) {

                newPoint = {
                    'x': x,
                    'y': y
                };
                if (isUsingEraser) {
                    drawCircle(x, y, brushWidth / 2, 'white');
                    drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, brushWidth, 'white');
                } else {
                    drawCircle(x, y, brushWidth / 2);
                    drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, brushWidth);
                }
                lastPoint = newPoint;

            }
        };

        canvas.onmouseup = function () {
            isUsingBoard = false;
        };
    } else {
        canvas.ontouchstart = function (e) {
            var x = e.touches[0].clientX;
            var y = e.touches[0].clientY;
            isUsingBoard = true;


            lastPoint = {
                'x': x,
                'y': y
            };

            if (isUsingEraser) {
                drawCircle(x, y, brushWidth / 2, 'white');
            } else {
                drawCircle(x, y, brushWidth / 2);
            }
        }
        canvas.ontouchmove = function (e) {
            
            var x = e.touches[0].clientX;
            var y = e.touches[0].clientY;
            if (isUsingBoard) {

                newPoint = {
                    'x': x,
                    'y': y
                };
                if (isUsingEraser) {
                    drawCircle(x, y, brushWidth / 2, 'white');
                    drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, brushWidth, 'white');
                } else {
                    drawCircle(x, y, brushWidth / 2);
                    drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, brushWidth);
                }
                lastPoint = newPoint;

            }
        }
        canvas.ontouchend = function (e) {
            isUsingBoard = false;
        }
    }
}

function beginUsingBrush() { 
    isUsingEraser = false;
    context.fillStyle = choosedColor;
    context.strokeStyle = choosedColor;

    eraser.classList.remove("active");
    eraser.classList.remove("eraseractive");
    brush.classList.add("active");
}

function beginUsingEraser() { 
    isUsingEraser = true;
    eraser.classList.add("active");
    eraser.classList.add("eraseractive");
    brush.classList.remove("active");
}

function beginUsingClearCanvas() { 
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = choosedColor;
    clearcanvas.classList.add('shakeClass');
    setTimeout(function () {
        clearcanvas.classList.remove('shakeClass');
    }, 820)

}

function beginUsingDownload() {
    download.classList.add('moveToBottomClass');
    setTimeout(function () {
        download.classList.remove('moveToBottomClass');
    }, 820)

    var url = canvas.toDataURL();
    console.log(url)
    var a = document.createElement("a")
    a.href = url
    a.download = "我的画儿"
    document.body.appendChild(a)
    a.click()
}

function cleanChildActive(parentArr) {
    for (let i = 0; i < parentArr.length; i++) {
        parentArr[i].classList.remove("active");
    }
}

function addColorClickEvent() {
    for (let i = 0; i < colorLiArr.length; i++) {
        colorLiArr[i].onclick = function () {
            context.strokeStyle = this.id;
            context.fillStyle = this.id;
            choosedColor = this.id;
            cleanChildActive(colorLiArr);
            this.classList.add("active");
            brush.style.fill = this.id;
            beginUsingBrush();

        }
    }
}

function addColorTouchEvent() {
    for (let i = 0; i < colorLiArr.length; i++) {
        colorLiArr[i].ontouchstart = function () {
            context.strokeStyle = this.id;
            context.fillStyle = this.id;
            choosedColor = this.id;
            cleanChildActive(colorLiArr);
            this.classList.add("active");
            brush.style.fill = this.id;
            beginUsingBrush();

        }
    }
}

function addLineWidthClick() {
    for (let i = 0; i < sizeArr.length; i++) {
        sizeArr[i].onclick = function () {
            cleanChildActive(sizeArr);
            this.classList.add('active');
            brushWidth = this.linew;
        }
    }
}

function addLineWidthTouch() {
    for (let i = 0; i < sizeArr.length; i++) {
        sizeArr[i].ontouchstart = function () {
            cleanChildActive(sizeArr);
            this.classList.add('active');
            brushWidth = this.linew;
        }
    }
}

