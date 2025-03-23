const hoverSound = document.getElementById("hoverSound");
const clickSound = document.getElementById("clickSound");

hoverSound.volume = 0.01;
clickSound.volume = 0.01;

let soundEnabled = true;

const ingredientInput = document.getElementById("ingredient-input");
const addIngredientBtn = document.getElementById("add-ingredient");
const selectedIngredientsList = document.getElementById("selected-ingredients");
const findRecipesBtn = document.getElementById("find-recipes");
const clearIngredientsBtn = document.getElementById("clear-ingredients");
const chatMessages = document.getElementById("chat-messages");
const loader = document.getElementById("loader");

let ingredients = [];

const buttons = document.querySelectorAll("button");
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

addIngredientBtn.addEventListener("click", addIngredient);
ingredientInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addIngredient();
  }
});

function addIngredient() {
  const ingredient = ingredientInput.value.trim();
  if (ingredient && !ingredients.includes(ingredient)) {
    ingredients.push(ingredient);
    renderIngredients();
    ingredientInput.value = "";
  }
  ingredientInput.focus();
}

function renderIngredients() {
  selectedIngredientsList.innerHTML = "";
  ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${ingredient}
      <button class="remove-btn" data-ingredient="${ingredient}">✕</button>
    `;
    selectedIngredientsList.appendChild(li);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ingredientToRemove = e.target.getAttribute("data-ingredient");
      ingredients = ingredients.filter((ing) => ing !== ingredientToRemove);
      renderIngredients();

      if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play().catch((error) => {
          console.log("Click sound failed:", error);
        });
      }
    });

    btn.addEventListener("mouseover", () => {
      if (soundEnabled) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch((error) => {
          console.log("Hover sound failed:", error);
        });
      }
    });
  });
}

clearIngredientsBtn.addEventListener("click", () => {
  ingredients = [];
  renderIngredients();
});

findRecipesBtn.addEventListener("click", async () => {
  if (ingredients.length === 0) {
    addMessage("Please add at least one ingredient first.", "ai");
    return;
  }

  loader.classList.add("active");

  const userMessage = `I have these ingredients: ${ingredients.join(", ")}`;
  addMessage(userMessage, "user");

  try {
    setTimeout(() => {
      const aiResponse = generateMockRecipe(ingredients);
      addMessage(aiResponse, "ai");
      loader.classList.remove("active");
    }, 1500);

    const apiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const API_KEY = "AIzaSyDZzswlHZ1-Kbmwis66wBgxbF5KJkb3H9k";

    const response = await fetch(`${apiEndpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Act as a recipe suggestion assistant. I have these ingredients: ${ingredients.join(
                  ", "
                )}. 
                     Suggest 2-3 recipes I can make with these ingredients. Format your response with recipe names 
                     as headings, followed by a brief description, ingredients needed (highlighting what I already have), 
                     and simple instructions. Keep it concise.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      addMessage(aiResponse, "ai");
    } else if (data.error) {
      console.error("API Error:", data.error);
      addMessage(
        "Sorry, I encountered an error while finding recipes. Please try again later.",
        "ai"
      );
    }

    loader.classList.remove("active");
  } catch (error) {
    console.error("Error:", error);
    addMessage(
      "Sorry, I encountered an error while finding recipes. Please try again later.",
      "ai"
    );
    loader.classList.remove("active");
  }
});

function addMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);
  messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateMockRecipe(ingredients) {
  const matchedRecipes = recipes
    .map((recipe) => {
      const matchedIngredients = recipe.ingredients.filter((ing) =>
        ingredients.some(
          (userIng) =>
            userIng.toLowerCase().includes(ing.toLowerCase()) ||
            ing.toLowerCase().includes(userIng.toLowerCase())
        )
      );
      return {
        ...recipe,
        matchCount: matchedIngredients.length,
        matchedIngredients,
      };
    })
    .sort((a, b) => b.matchCount - a.matchCount);

  let response = "Here are some recipes you can make:\n\n";

  for (let i = 0; i < Math.min(2, matchedRecipes.length); i++) {
    const recipe = matchedRecipes[i];
    if (recipe.matchCount > 0) {
      response += `**${recipe.name}**\n${recipe.description}\n\n`;

      response += "Ingredients:\n";
      recipe.ingredients.forEach((ing) => {
        const hasIngredient = recipe.matchedIngredients.includes(ing);
        response += hasIngredient ? `✓ ${ing}\n` : `- ${ing}\n`;
      });

      response += `\nInstructions:\n${recipe.instructions}\n\n`;
    }
  }

  if (matchedRecipes[0].matchCount === 0) {
    response =
      "I don't have enough matching recipes for your ingredients. Try adding more common ingredients like oil, salt, flour, eggs, etc.";
  }

  return response;
}

renderIngredients();
