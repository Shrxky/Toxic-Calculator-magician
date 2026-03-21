let equation = "";
let secretValue = null;
let isTilted = false;

// ── Number & operator buttons ──
for (let i = 0; i <= 13; i++) {
  document.getElementById("button" + i).addEventListener("click", () => {
    let value;
    switch(i){
      case 10: value = "+"; break;
      case 11: value = "-"; break;
      case 12: value = "*"; break;
      case 13: value = "/"; break;
      default: value = String(i);
    }
    if (equation.length < 16) equation += value;
    updateDisplay();
  });
}

// ── Backspace ──
function backspace(){
  equation = equation.length > 1 ? equation.slice(0, -1) : "";
  updateDisplay();
}

// ── Equals ──
function sumValues(){
  try {
    equation = String(eval(equation));
  } catch(e) {
    equation = "";
  }
  updateDisplay();
}

// ── Clear ──
function clearValues(){
  equation = "";
  updateDisplay();
}

// ── Display ──
function updateDisplay(){
  const display = document.getElementById("result");
  const value = equation !== "" ? equation : "0";
  display.textContent = value;

  document.getElementById("secretLength").value = equation.length;

  const len = value.length;
  if      (len <= 6)  display.style.fontSize = "88px";
  else if (len <= 9)  display.style.fontSize = "66px";
  else if (len <= 11) display.style.fontSize = "52px";
  else                display.style.fontSize = "38px";
}

// ── Secret input ──
document.getElementById("secretSubmit").addEventListener("click", async () => {
  const input = document.getElementById("numberinput").value.trim();
  if (input === "") return;

  secretValue = Number(input);
  document.getElementById("secretInput").style.visibility = "hidden";

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    const response = await DeviceMotionEvent.requestPermission();
    alert("Permission response: " + response);
  } else {
    alert("requestPermission not available - not iOS or already granted");
  }
});

// ── Device tilt (using devicemotion for iOS PWA compatibility) ──
window.addEventListener('devicemotion', (event) => {
  const gravity = event.accelerationIncludingGravity;
  const y = gravity.y;
  const container = document.getElementById("buttonContainer");

  if (secretValue === null) return;

  if (y > 8 && !isTilted) {
    isTilted = true;
    container.style.visibility = "hidden";
    const current = parseFloat(equation) || 0;
    equation = String(secretValue - current);
    updateDisplay();
  } else if (y <= 8 && isTilted) {
    isTilted = false;
    container.style.visibility = "visible";
  }
});

window.addEventListener('devicemotion', (event) => {
  alert("motion firing: " + event.accelerationIncludingGravity.y);
});

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
