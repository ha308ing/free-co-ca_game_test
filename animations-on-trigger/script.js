/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(10, 10, 25, 25);
