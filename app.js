import DINOS_DATA from "./dino.js";

/**
 * Represents a prehistoric creature.
 * @class
 */
class PrehistoricCreature {
  /**
   * Initialize a PrehistoricCreature instance.
   * @param {Object} data - Data for the creature.
   * @param {string} data.species - The species name.
   * @param {number} data.weight - Weight in pounds.
   * @param {number} data.height - Height in inches.
   * @param {string} data.diet - Dietary classification.
   * @param {string} data.habitat - Habitat location.
   * @param {string} data.era - Geological time period.
   * @param {string} data.trivia - Interesting fact.
   */
  constructor({ species, weight, height, diet, habitat, era, trivia }) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.habitat = habitat;
    this.era = era;
    this.trivia = trivia;
  }

  /**
   * Compare the creature's weight to a human's weight.
   * @param {number} humanWeight - Human's weight in pounds.
   * @returns {string} - Comparison statement.
   */
  weightComparison(humanWeight) {
    if (humanWeight === 0) return `Weight cannot be zero.`;

    const ratio = this.weight / humanWeight;
    if (Math.abs(ratio - 1) < 0.01)
      return `You and ${this.species} weigh the same!`;
    if (ratio < 0.01)
      return `You weigh nearly the same as ${this.species}!`;
    return ratio > 1
      ? `${this.species} weighed ${ratio.toFixed(1)} times more than you!`
      : `You weigh ${(1 / ratio).toFixed(1)} times more than ${this.species}!`;
  }

  /**
   * Compare the creature's height to a human's height.
   * @param {number} humanHeight - Human's height in inches.
   * @returns {string} - Comparison statement.
   */
  heightComparison(humanHeight) {
    if (humanHeight === 0) return `Height cannot be zero.`;

    const ratio = this.height / humanHeight;
    if (Math.abs(ratio - 1) < 0.01)
      return `You and ${this.species} are the same height!`;
    if (ratio < 0.01)
      return `You are nearly the same height as ${this.species}!`;
    return ratio > 1
      ? `${this.species} was ${ratio.toFixed(1)} times taller than you!`
      : `You are ${(1 / ratio).toFixed(1)} times taller than ${this.species}!`;
  }

  /**
   * Compare the creature's diet to a human's diet.
   * @param {string} humanDiet - Human's dietary preference.
   * @returns {string} - Comparison statement.
   */
  dietComparison(humanDiet) {
    const article = ["a", "e", "i", "o", "u"].includes(humanDiet[0].toLowerCase()) ? "an" : "a";
    return humanDiet === this.diet
      ? `You are ${article} ${humanDiet} and ${this.species} was too!`
      : `You are ${article} ${humanDiet}, but ${this.species} was a ${this.diet}.`;
  }

  /**
   * Retrieve a random fact about the creature.
   * @param {Object} humanInfo - Information about the human.
   * @param {number} humanInfo.weight - Human's weight in pounds.
   * @param {number} humanInfo.height - Human's height in inches.
   * @param {string} humanInfo.diet - Human's dietary preference.
   * @returns {string} - A random fact.
   */
  fetchRandomFact(humanInfo) {
    const factOptions = [
      `The ${this.species} inhabited ${this.habitat}.`,
      `The ${this.species} existed during the ${this.era} era.`,
      this.trivia,
      this.weightComparison(humanInfo.weight),
      this.heightComparison(humanInfo.height),
      this.dietComparison(humanInfo.diet),
    ];

    return this.species === "Human"
      ? "You are a human, so no dinosaur facts available!"
      : factOptions[Math.floor(Math.random() * factOptions.length)];
  }
}

/**
 * Assemble an array of PrehistoricCreature instances, including the human.
 * @param {Object} humanInfo - Information about the human.
 * @param {number} humanInfo.weight - Human's weight in pounds.
 * @param {number} humanInfo.height - Human's height in inches.
 * @param {string} humanInfo.diet - Human's dietary preference.
 * @returns {PrehistoricCreature[]} - Array of creatures.
 */
const assembleCreatures = (humanInfo) => {
  const creatures = DINOS_DATA.Dinos.map((creatureData) => new PrehistoricCreature(creatureData));
  creatures.splice(
    4,
    0,
    new PrehistoricCreature({
      species: "Human",
      weight: humanInfo.weight,
      height: humanInfo.height,
      diet: humanInfo.diet,
      habitat: "",
      era: "",
      trivia: "",
    })
  );
  return creatures;
};

/**
 * Extract human data from the input form.
 * @returns {Object} - Human information.
 */
const retrieveHumanInfo = () => ({
  name: document.getElementById("name").value.trim(),
  height:
    parseInt(document.getElementById("feet").value, 10) * 12 +
    parseInt(document.getElementById("inches").value, 10),
  weight: parseFloat(document.getElementById("weight").value),
  diet: document.getElementById("diet").value.toLowerCase(),
});

/**
 * Validate the human input data.
 * @param {Object} humanInfo - Information about the human.
 * @param {string} humanInfo.name - Human's name.
 * @param {number} humanInfo.height - Human's height in inches.
 * @param {number} humanInfo.weight - Human's weight in pounds.
 * @returns {boolean} - Validity of the form data.
 */
const validateForm = ({ name, height, weight }) => {
  const errorContainer = document.querySelector("#error");
  if (!name) {
    errorContainer.innerHTML = `<p>Please enter your name.</p>`;
    return false;
  }
  if (isNaN(height) || height <= 0) {
    errorContainer.innerHTML = `<p>Height must be a positive number.</p>`;
    return false;
  }
  if (isNaN(weight) || weight <= 0) {
    errorContainer.innerHTML = `<p>Weight must be a positive number.</p>`;
    return false;
  }
  errorContainer.innerHTML = "";
  return true;
};

/**
 * Create and display tiles for each creature and the human.
 * @param {PrehistoricCreature[]} creatures - Array of creatures.
 * @param {Object} humanInfo - Information about the human.
 */
const renderTiles = (creatures, humanInfo) => {
  const gridContainer = document.querySelector("#grid");
  gridContainer.innerHTML = creatures
    .map((creature) => {
      const imageName = creature.species
        ? creature.species.toLowerCase()
        : "human";
      const fact =
        creature.species === "Pigeon"
          ? "All birds are living dinosaurs."
          : creature.fetchRandomFact(humanInfo);
      return `
        <div class="grid-item">
          <h3>${creature.species || humanInfo.name}</h3>
          <img src="./images/${imageName}.png" alt="${creature.species}">
          <p>${fact}</p>
        </div>
      `;
    })
    .join("");
};

/**
 * Hide the input form from the display.
 */
const hideInputForm = () => {
  document.querySelector("#dino-compare").style.display = "none";
};

/**
 * Display a button to restart the comparison process.
 */
const showRestartButton = () => {
  const headerSection = document.querySelector("header");
  const restartBtn = document.createElement("div");
  restartBtn.innerHTML = `<h1>Start Again</h1>`;
  restartBtn.classList.add("restart-button", "btn");
  headerSection.appendChild(restartBtn);

  restartBtn.addEventListener("click", () => {
    document.querySelector("#grid").innerHTML = "";
    restartBtn.style.display = "none";
    document.querySelector("#dino-compare").style.display = "block";
    resetFormFields();
  });
};

/**
 * Clear all input fields and error messages in the form.
 */
const resetFormFields = () => {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  document.querySelector("#error").innerHTML = "";
};

// Immediately Invoked Function Expression to handle form submission and display
(() => {
  const submitButton = document.querySelector("#btn");
  resetFormFields();

  submitButton.addEventListener("click", () => {
    const humanInfo = retrieveHumanInfo();

    if (validateForm(humanInfo)) {
      const creatureList = assembleCreatures(humanInfo);
      hideInputForm();
      renderTiles(creatureList, humanInfo);
      showRestartButton();
    }
  });
})();
