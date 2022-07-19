var canvas, board;
canvas = document.getElementById("myCanvas");
canvas.height = window.outerHeight * 0.5;
canvas.width = window.outerWidth * 0.5;

board = canvas.getContext("2d");
board.lineWidth = 10; //设置画笔粗细
board.strokeStyle = "#000";
board.lineJoin = "round"; //设置画笔轨迹基于圆点拼接"bevel"round  miter;
board.lineCap = "round"; //线末端的类型butt, round and square。默认值是 butt。
board.miterLimit = 22; //斜接面限制比例
// board.setLineDash([1, 2]);

var mousePress = false;
var last = null;
var fillFlag = false;

function beginDraw(event) {
  mousePress = true;
}
function endDraw(event) {
  mousePress = false;
  event.preventDefault();
  last = null;
}
function drawing(event) {
  event.preventDefault();
  if (!mousePress) return;
  var xy = GetPos(event);
  if (last != null) {
    board.beginPath();
    board.moveTo(last.x, last.y);
    board.lineTo(xy.x, xy.y);
    board.stroke();
  }
  last = xy;
}

function GetPos(event) {
  var isTouch = event.type.indexOf("touch") >= 0 ? true : false;
  var x = isTouch
    ? event.touches[0].pageX
    : event.offsetX + event.target.offsetLeft;
  var y = isTouch
    ? event.touches[0].pageY
    : event.offsetY + event.target.offsetTop;
  return { x: x, y: y };
}

function clean() {
  board.clearRect(0, 0, canvas.width, canvas.height);
  fillFlag = false;
}
function flag(value) {
  fillFlag = value;
}
function fill(e) {
  if (fillFlag) {
    var left = Math.floor(e.pageX - this.offsetLeft);
    var top = Math.floor(e.pageY - this.offsetTop);
    var imgData = board.getImageData(left, top, 1, 1);
    var colorArr = imgData.data;
    var fillColor = [0, 0, 0, 255];
    floodFillLinear(canvas, left, top, fillColor, 250);
  }
}
canvas.onmousedown = beginDraw;
canvas.onmousemove = drawing;
canvas.onmouseup = endDraw;
canvas.click = fill;
canvas.addEventListener("touchstart", beginDraw, false);
canvas.addEventListener("touchmove", drawing, false);
canvas.addEventListener("touchend", endDraw, false);
canvas.addEventListener("click", fill, false);
