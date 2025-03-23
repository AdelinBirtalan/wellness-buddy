document.addEventListener("DOMContentLoaded", function () {
  const hoverSound = new Audio();
  hoverSound.src = "../assets/hover-sound.mp3";
  hoverSound.volume = 0.01;

  const clickSound = new Audio();
  clickSound.src = "../assets/click-sound.mp3";
  clickSound.volume = 0.01;

  const interactiveElements = document.querySelectorAll("button, .back-btn");
  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });

    element.addEventListener("click", () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
});
