window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.style.display = "none";
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
});
