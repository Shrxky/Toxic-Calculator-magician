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

  const len = value.length;
  if      (len <= 6)  display.style.fontSize = "88px";
  else if (len <= 9)  display.style.fontSize = "66px";
  else if (len <= 11) display.style.fontSize = "52px";
  else                display.style.fontSize = "38px";
}

// ── Secret input ──
document.getElementById("secretSubmit").addEventListener("click", () => {
  const input = document.getElementById("numberinput").value.trim();
  if (input === "") return;

  secretValue = Number(input);
  document.getElementById("secretInput").style.visibility = "hidden";
  console.log("Secret value saved:", secretValue);
});

// ── Device tilt ──
window.addEventListener('deviceorientation', (event) => {
  const beta = event.beta; // -180 to 180
  const container = document.getElementById("buttonContainer");

  if (beta > 150 && !isTilted) {
    // Just tilted down — compute difference and hide buttons
    isTilted = true;
    container.style.visibility = "hidden";

    if (secretValue !== null) {
      const current = parseFloat(equation) || 0;
      equation = String(secretValue - current);
      updateDisplay();
      document.getElementById("secretLength").textContent = equation.length;
    }

  } else if (beta <= 150 && isTilted) {
    // Tilted back up — restore buttons
    isTilted = false;
    container.style.visibility = "visible";
  }
});