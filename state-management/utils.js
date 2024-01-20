export function drawStatusText(context, input) {
  context.font = "10px Helvetica";
  context.fillText("Last input: " + input.lastKey, 10, 20);
}
