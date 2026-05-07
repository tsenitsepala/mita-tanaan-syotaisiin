console.log("app.js ladattu ");

const result = document.getElementById("result");

// Tallentaa reseptin nimen ja ajan localStorageen
function saveHistory(foodName) {
  const history = JSON.parse(localStorage.getItem("foodHistory")) || [];
  history.push({
    name: foodName,
    date: new Date().toLocaleString("fi-FI")
  });
  localStorage.setItem("foodHistory", JSON.stringify(history));
}
// Näyttää tallennetut arvonnat Historia-näkymässä
function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("foodHistory")) || [];

  if (history.length === 0) {
    list.innerHTML = "<li>Ei vielä historiaa.</li>";
    return;
  }

  history.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.name}</strong><br><small>${item.date}</small>`;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("foodHistory");
  renderHistory();
}


const categories = {
  ihan_sama: ["Beef", "Chicken", "Vegetarian"],
  kevytta: ["Vegetarian"],
  kasviksia: ["Vegetarian"],
  herkkupaiva: ["Beef", "Dessert"],
  yllata: ["Beef", "Chicken", "Vegetarian", "Dessert"]
};

// Hakee listan reseptejä kategorian perusteella
async function getMealsByCategory(category) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await res.json();
  return data.meals;
}

async function getMealById(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  return data.meals[0];
}

//Ehdotus
async function suggestRecipe(categoryArray) {
  const category =
    categoryArray[Math.floor(Math.random() * categoryArray.length)];
  const meals = await getMealsByCategory(category);
  const randomMeal = meals[Math.floor(Math.random() * meals.length)];
  const meal = await getMealById(randomMeal.idMeal);

  result.innerHTML = `
    <h3>${meal.strMeal}</h3>

    <img
      src="${meal.strMealThumb}"
      alt="${meal.strMeal}"
    />

    <h4>Ohje</h4>
    <p>${meal.strInstructions.replace(/\r\n/g, "<br><br>")}</p>

    <p style="margin-top:1rem;">
      <a
        href="${meal.strSource || meal.strYoutube}"
        target="_blank"
        rel="noopener"
      >
        ⬅ Katso alkuperäinen resepti
      </a>
    </p>
  `;

  saveHistory(meal.strMeal);
}

//Napit
document
  .querySelectorAll("#categories button[data-category]")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      suggestRecipe(categories[btn.dataset.category]);
    });
  });

document.getElementById("easyBtn").addEventListener("click", () => {
  window.open("https://wolt.com", "_blank");
});

//Inspiroidu
async function loadTop50() {
  const grid = document.getElementById("topGrid");
  grid.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const meal = (await res.json()).meals[0];

    const card = document.createElement("a");
    card.href = meal.strSource || meal.strYoutube;
    card.target = "_blank";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p>${meal.strMeal}</p>
    `;
    grid.appendChild(card);
  }
}

//Tabit
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab")
      .forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".view")
      .forEach(v => v.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.view).classList.add("active");

    if (tab.dataset.view === "history") renderHistory();
    if (tab.dataset.view === "top") loadTop50();
  });
});
