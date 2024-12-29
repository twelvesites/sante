const steps = [
  {
    title: "Hand Hygiene:",
    description: "Wash your hands regularly with soap and water for at least 20 seconds. Use hand sanitizer if soap and water are not available.",
    imgSrc: "https://twelvesites.github.io/ipc/images/illustration/illus (8).png"
  },
  {
    title: "Use PPE:",
    description: "Use Personal Protective Equipment like masks, gloves, and other protective gear as needed, especially in healthcare settings.",
    imgSrc: "https://twelvesites.github.io/ipc/images/illustration/illus (7).png"
  },
  {
    title: "Vaccination:",
    description: "Stay up-to-date with recommended vaccines to protect yourself and others from infectious diseases.",
    imgSrc: "https://twelvesites.github.io/ipc/images/illustration/illus (6).png"
  },
  {
    title: "Clean and Disinfect:",
    description: "Regularly clean and disinfect frequently touched surfaces and objects.",
    imgSrc: "https://twelvesites.github.io/ipc/images/illustration/illus (5).png"
  }
];

let currentStep = 0;

const contentSteps = document.getElementById("content-steps");
const buttonElement = document.getElementById("next-button");

function updateContent() {
  // Create a new container for the current step
  const currentStepContent = document.createElement("div");
  currentStepContent.className = "step-content visible";
  currentStepContent.innerHTML = `
    <h2>${steps[currentStep].title}</h2>
    <p>${steps[currentStep].description}</p>
    <img src="${steps[currentStep].imgSrc}" alt="">
  `;

  // Append the current step to the container
  contentSteps.appendChild(currentStepContent);

  // Remove the previous step content after animation
  const previousStepContent = document.querySelector(".step-content.visible:not(:last-child)");
  if (previousStepContent) {
    previousStepContent.classList.remove("visible");
    previousStepContent.classList.add("exit");

    previousStepContent.addEventListener("transitionend", () => {
      if (previousStepContent.parentElement) {
        previousStepContent.parentElement.removeChild(previousStepContent);
      }
    });
  }
}

// Initialize the first step immediately on page load
updateContent();

// Handle button click for next step
buttonElement.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
  } else {
    currentStep = 0; // Loop back to the first step
  }
  updateContent();
});
