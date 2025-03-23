const buttons = document.querySelectorAll(".explore-btn");
const hoverSound = document.getElementById("hoverSound");
const clickSound = document.getElementById("clickSound");
let soundEnabled = false;

hoverSound.volume = 0.01;
clickSound.volume = 0.02;

const toggleButton = document.createElement("button");
toggleButton.textContent = "Sound: OFF";
toggleButton.className = "explore-btn";
document.querySelector(".text-container").appendChild(toggleButton);

toggleButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleButton.textContent = `Sound: ${soundEnabled ? "ON" : "OFF"}`;
  if (soundEnabled) {
    clickSound.currentTime = 0;
    clickSound.play().catch((error) => {
      console.log("Click sound failed:", error);
    });
  }
});

buttons.forEach((button) => {
  button.addEventListener("mouseover", () => {
    if (soundEnabled) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch((error) => {
        console.log("Hover sound failed:", error);
      });
    }
  });

  button.addEventListener("click", () => {
    if (soundEnabled) {
      clickSound.currentTime = 0;
      clickSound.play().catch((error) => {
        console.log("Click sound failed:", error);
      });
    }
  });
});
