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

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  document.head.appendChild(script);

  script.onload = function () {
    emailjs.init("4MNwiebdeUg-k7s-k");
  };

  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const existingMessages = document.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const submitBtn = document.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "SENDING...";
    submitBtn.disabled = true;

    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;

    const templateParams = {
      from_name: `${firstName} ${lastName}`,
      from_email: email,
      subject: subject,
      message: subject,
    };

    emailjs.send("service_dh7vzzn", "template_dg9j9ym", templateParams).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);

        contactForm.reset();

        submitBtn.textContent = "SENT!";
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);

        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.textContent = "MESSAGE SENT SUCCESSFULLY!";
        contactForm.appendChild(successMsg);

        setTimeout(() => {
          successMsg.remove();
        }, 5000);
      },
      function (error) {
        console.log("FAILED...", error);

        submitBtn.textContent = "FAILED!";
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);

        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "FAILED TO SEND MESSAGE. PLEASE TRY AGAIN.";
        contactForm.appendChild(errorMsg);

        setTimeout(() => {
          errorMsg.remove();
        }, 5000);
      }
    );
  });
});
