// app.js - modular single-file SPA using localStorage
const STORAGE_KEY = "recipes_v1";

const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

function uid() {
  return "r_" + Math.random().toString(36).slice(2, 9);
}

// Infer Veg / Non-Veg from the title (for new / old recipes)
function inferTypeFromTitle(title = "") {
  const t = title.toLowerCase();
  const nonVegKeywords = [
    "chicken",
    "egg",
    "mutton",
    "fish",
    "prawn",
    "shrimp",
    "beef",
    "meat",
    "lamb",
    "keema",
  ];
  return nonVegKeywords.some((k) => t.includes(k)) ? "Non-Veg" : "Veg";
}

/* --- Initial seed data --- */
const seedRecipes = [
  /* Paneer Tikka */
  {
    id: uid(),
    title: "Paneer Tikka",
    description:
      "A flavorful paneer tikka marinated with Indian spices and grilled to perfection.",
    ingredients: [
      "400g paneer (cubed)",
      "2 tbsp hung curd",
      "1 tsp red chili powder",
      "1 tsp garam masala",
      "1 tbsp ginger-garlic paste",
      "1 tbsp lemon juice",
      "1 tbsp oil",
      "Salt to taste",
    ],
    steps: [
      "Cut paneer into medium-sized cubes.",
      "Mix curd, chili powder, ginger-garlic paste, lemon juice, salt, and oil.",
      "Add paneer and coat well. Marinate for 30 minutes.",
      "Grill or pan-fry until golden and slightly charred.",
      "Serve hot with mint chutney.",
    ],
    prepTime: 20,
    cookTime: 10,
    difficulty: "Medium",
    imageUrl:
      "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg",
    type: "Veg",
  },

  /* Vegetable Fried Rice */
  {
    id: uid(),
    title: "Vegetable Fried Rice",
    description:
      "A delicious Indo-Chinese style fried rice cooked with vegetables and sauces.",
    ingredients: [
      "2 cups cooked rice (cold)",
      "1 medium carrot (chopped)",
      "1/2 cup capsicum (chopped)",
      "1/2 cup cabbage (shredded)",
      "1/4 cup green peas",
      "1/4 cup spring onions",
      "2 cloves garlic (finely chopped)",
      "1 inch ginger (finely chopped)",
      "1 tbsp soy sauce",
      "1 tsp vinegar",
      "1 tsp black pepper",
      "Salt to taste",
      "2 tbsp oil",
      "1 tsp schezwan sauce (optional)",
    ],
    steps: [
      "Heat oil in a wok.",
      "Add garlic and ginger; sauté on high flame.",
      "Add carrots, capsicum, cabbage, and peas; stir-fry for 2 minutes.",
      "Add cooked rice and mix gently.",
      "Add soy sauce, vinegar, black pepper, and salt.",
      "Toss everything on high flame for 1–2 minutes.",
      "Garnish with spring onions and serve hot.",
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Hard",
    imageUrl:
      "https://www.simplyrecipes.com/thmb/g9QkoMz7Aq3oAXnbtZ6H32nsH18=/2000x1335/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2018__07__Veggie-Fried-Rice-LEAD-HORIZONTAL-5f6ac64a24b44f9ebd4b3ef854747f4a.jpg",
    type: "Veg",
  },

  /* Simple Tomato Pasta */
  {
    id: uid(),
    title: "Simple Tomato Pasta",
    description: "A quick, tasty pasta tossed in tangy homemade tomato sauce.",
    ingredients: [
      "200g pasta",
      "3 tomatoes (blended)",
      "3 cloves garlic (chopped)",
      "1 onion (finely chopped)",
      "1 tsp chili flakes",
      "1 tsp oregano",
      "2 tbsp oil",
      "Salt to taste",
    ],
    steps: [
      "Boil pasta until al dente.",
      "Heat oil; sauté garlic and onions.",
      "Add tomato puree and cook until thick.",
      "Add chili flakes, oregano, and salt.",
      "Mix in the cooked pasta and toss well.",
      "Serve hot with grated cheese (optional).",
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Easy",
    imageUrl: "pasta.jpg",
    type: "Veg",
  },

  /* Hearty Lentil Soup */
  {
    id: uid(),
    title: "Hearty Lentil Soup",
    description:
      "A warm and comforting high-protein soup made with red lentils and spices.",
    ingredients: [
      "1 cup red lentils",
      "1 onion (chopped)",
      "2 tomatoes (chopped)",
      "3 cloves garlic",
      "1 tsp cumin",
      "1 tsp turmeric",
      "Salt to taste",
      "4 cups water",
      "1 tbsp oil",
    ],
    steps: [
      "Wash lentils thoroughly.",
      "Heat oil; sauté garlic, onions, and tomatoes.",
      "Add lentils, turmeric, salt, and water.",
      "Cook until lentils turn soft.",
      "Blend lightly for a creamy texture.",
      "Simmer for 5 minutes and serve warm.",
    ],
    prepTime: 10,
    cookTime: 25,
    difficulty: "Easy",
    imageUrl: "lentilsoup.png",
    type: "Veg",
  },

  /* Spicy Chickpea Curry */
  {
    id: uid(),
    title: "Spicy Chickpea Curry",
    description:
      "A protein-rich, spicy chickpea curry cooked with tomatoes and aromatic spices.",
    ingredients: [
      "2 cups boiled chickpeas",
      "2 tomatoes (pureed)",
      "1 onion (finely chopped)",
      "1 tbsp ginger-garlic paste",
      "1 tsp chili powder",
      "1 tsp turmeric",
      "1 tsp garam masala",
      "Salt to taste",
      "2 tbsp oil",
    ],
    steps: [
      "Heat oil; sauté onions and ginger-garlic paste.",
      "Add tomato puree and spices.",
      "Cook until oil separates.",
      "Add chickpeas and mix well.",
      "Add water and simmer for 10 minutes.",
      "Serve hot with rice or roti.",
    ],
    prepTime: 15,
    cookTime: 20,
    difficulty: "Medium",
    imageUrl: "chickpea.jpg",
    type: "Veg",
  },
  /* Spicy Chicken Curry (Non-Veg) */
  {
    id: uid(),
    title: "Spicy Chicken Curry",
    description:
      "A flavorful, spicy Indian chicken curry cooked with onions, tomatoes, and aromatic spices.",
    ingredients: [
      "500g chicken (bone-in or boneless)",
      "2 onions (finely chopped)",
      "2 tomatoes (pureed or chopped)",
      "1 tbsp ginger-garlic paste",
      "2 tbsp oil",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric powder",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1 tsp garam masala",
      "Salt to taste",
      "Fresh coriander leaves for garnish",
    ],
    steps: [
      "Heat oil in a pan and add cumin seeds.",
      "Add chopped onions and sauté until golden brown.",
      "Add ginger-garlic paste and sauté for 30 seconds.",
      "Add tomato puree and cook until oil separates.",
      "Add turmeric, chili powder, coriander powder, and salt. Mix well.",
      "Add the chicken pieces and stir until coated with masala.",
      "Cover and cook on medium heat for 10–12 minutes.",
      "Add 1 cup water, mix, and simmer for 10 more minutes.",
      "Finish with garam masala and fresh coriander leaves.",
      "Serve hot with rice or roti.",
    ],
    prepTime: 15,
    cookTime: 30,
    difficulty: "Medium",
    imageUrl: "chickencurry.jpg",
    type: "Non-Veg",
  },
];

/* --- Storage helpers --- */
function safeParse(raw) {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : null;
  } catch (e) {
    return null;
  }
}

function loadRecipes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!parsed) {
    // fresh seed + ensure type is set
    const seeded = seedRecipes.map((r) => ({
      ...r,
      type: r.type || inferTypeFromTitle(r.title),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded.slice();
  }
  // upgrade old data with missing type
  const upgraded = parsed.map((r) => ({
    ...r,
    type: r.type || inferTypeFromTitle(r.title),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
  return upgraded;
}

function saveRecipes(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* --- App state --- */
let recipes = loadRecipes();
let editingId = null;

/* --- DOM elements --- */
const recipesGrid = qs("#recipesGrid");
const searchInput = qs("#searchInput");
const difficultyFilter = qs("#difficultyFilter");
const maxTimeFilter = qs("#maxTimeFilter");
const addRecipeBtn = qs("#addRecipeBtn");

// Create Veg / Non-Veg filter dropdown dynamically (keeps HTML file unchanged)
const controlsBar = qs(".controls");
const vegFilter = document.createElement("select");
vegFilter.id = "vegFilter";
vegFilter.innerHTML = `
  <option value="All">All</option>
  <option value="Veg">Veg</option>
  <option value="Non-Veg">Non-Veg</option>
`;
if (controlsBar && maxTimeFilter) {
  controlsBar.insertBefore(vegFilter, maxTimeFilter);
} else if (controlsBar) {
  controlsBar.appendChild(vegFilter);
}
vegFilter.addEventListener("change", () => {
  if (vegFilter.value === "Veg") {
    vegFilter.style.color = "green";
  } else if (vegFilter.value === "Non-Veg") {
    vegFilter.style.color = "red";
  } else {
    vegFilter.style.color = "black";
  }
});
vegFilter.style.color = "black";

const homeView = qs("#homeView");
const detailView = qs("#detailView");
const formView = qs("#formView");

const backToListBtn = qs("#backToListBtn");
const recipeDetail = qs("#recipeDetail");

const recipeForm = qs("#recipeForm");
const formTitle = qs("#formTitle");
const deleteBtn = qs("#deleteBtn");
const cancelFormBtn = qs("#cancelFormBtn");

/* --- Rendering --- */
function formatTime(mins) {
  return mins ? mins + " min" : "-";
}

function renderGrid(list) {
  recipesGrid.innerHTML = "";
  if (!list.length) {
    recipesGrid.innerHTML =
      '<p class="card">No recipes found. Try adding one.</p>';
    return;
  }
  list.forEach((r) => {
    const card = document.createElement("div");
    card.className = "card";

    // FIX ADDED BELOW
    card.dataset.id = r.id;

    if (r.imageUrl)
      card.innerHTML = `<img src="${r.imageUrl}" alt="${r.title}">`;
    card.innerHTML += `
      <h3>${r.title}</h3>
      <p>${r.description}</p>

      <div class="recipe-meta">
        <span class="tag">${r.type || "Veg"}</span>
        <span class="tag">${r.difficulty}</span>
        <span class="tag">Prep: ${formatTime(r.prepTime)}</span>
      </div>

      <div class="actions">
        <button class="btn view" data-id="${r.id}">View</button>
        <button class="btn edit" data-id="${r.id}">Edit</button>
      </div>`;
      
    recipesGrid.appendChild(card);
  });
}


/* --- Filters & Search --- */
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const diff = difficultyFilter.value;
  const maxTime = parseInt(maxTimeFilter.value) || Infinity;
  const veg = vegFilter ? vegFilter.value : "All";

  let list = recipes.filter((r) => {
    const matchesQ = r.title.toLowerCase().includes(q);
    const matchesDiff = diff === "All" || r.difficulty === diff;
    const typeValue = r.type || inferTypeFromTitle(r.title);
    const matchesVeg = veg === "All" || typeValue === veg;
    const matchesTime = r.prepTime <= maxTime;
    return matchesQ && matchesDiff && matchesVeg && matchesTime;
  });
  renderGrid(list);
}

/* --- View management --- */
function showView(view) {
  [homeView, detailView, formView].forEach((v) => v.classList.add("hidden"));
  view.classList.remove("hidden");
}

/* --- Handlers --- */
function onGridClick(e) {
  const id =
    e.target.dataset.id ||
    e.target.closest(".card")?.dataset.id;

  if (!id) return;

  if (e.target.classList.contains("edit")) {
    openFormForEdit(id);
  } else if (e.target.classList.contains("view")) {
    openDetail(id);
  } else {
    // Clicking any empty area of the card opens detail
    openDetail(id);
  }
}


function openDetail(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return alert("Recipe not found.");
  recipeDetail.innerHTML = "";
  const detail = document.createElement("div");
  const typeValue = r.type || inferTypeFromTitle(r.title);
  detail.innerHTML = `
    ${r.imageUrl ? `<img src="${r.imageUrl}" alt="${r.title}">` : ""}
    <h2>${r.title}</h2>
    <p>${r.description}</p>
    <div class="meta-row">
      <div class="tag">${typeValue}</div>
      <div class="tag">${r.difficulty}</div>
      <div class="tag">Prep: ${formatTime(r.prepTime)}</div>
      <div class="tag">Cook: ${formatTime(r.cookTime || 0)}</div>
    </div>
    <h4>Ingredients</h4>
    <ul>${r.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <h4>Steps</h4>
    <ol>${r.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <div class="actions">
      <button class="btn edit" data-id="${r.id}">Edit</button>
      <button class="btn delete" data-id="${r.id}">Delete</button>
    </div>`;
  recipeDetail.appendChild(detail);
  showView(detailView);
}

/* --- Form actions --- */
function openFormForAdd() {
  editingId = null;
  formTitle.textContent = "Add Recipe";
  recipeForm.reset();
  deleteBtn.classList.add("hidden");
  clearErrors();
  showView(formView);
}

function openFormForEdit(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return alert("Recipe not found.");
  editingId = id;
  formTitle.textContent = "Edit Recipe";
  qs("#title").value = r.title;
  qs("#description").value = r.description;
  qs("#ingredients").value = r.ingredients.join("\n");
  qs("#steps").value = r.steps.join("\n");
  qs("#prepTime").value = r.prepTime;
  qs("#cookTime").value = r.cookTime || "";
  qs("#difficulty").value = r.difficulty;
  qs("#imageUrl").value = r.imageUrl || "";
  deleteBtn.classList.remove("hidden");
  clearErrors();
  showView(formView);
}

function deleteRecipeById(id) {
  if (!confirm("Delete this recipe?")) return;
  recipes = recipes.filter((r) => r.id !== id);
  saveRecipes(recipes);
  applyFilters();
  showView(homeView);
}

/* --- Validation --- */
function clearErrors() {
  qsa(".error").forEach((el) => (el.textContent = ""));
}

function validateForm(data) {
  const errors = {};
  if (!data.title) errors.title = "Title is required.";
  if (!data.description) errors.description = "Description is required.";
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0)
    errors.ingredients = "Add at least one ingredient.";
  if (!Array.isArray(data.steps) || data.steps.length === 0)
    errors.steps = "Add at least one step.";
  if (
    data.prepTime == null ||
    data.prepTime === "" ||
    isNaN(Number(data.prepTime))
  )
    errors.prepTime = "Prep time is required.";
  if (!data.difficulty) errors.difficulty = "Select difficulty.";
  return errors;
}

/* --- Save handler --- */
recipeForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  clearErrors();
  const titleValue = qs("#title").value.trim();
  const formData = {
    title: titleValue,
    description: qs("#description").value.trim(),
    ingredients: qs("#ingredients")
      .value.trim()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    steps: qs("#steps")
      .value.trim()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    prepTime: parseInt(qs("#prepTime").value) || 0,
    cookTime: parseInt(qs("#cookTime").value) || 0,
    difficulty: qs("#difficulty").value,
    imageUrl: qs("#imageUrl").value.trim(),
    type: inferTypeFromTitle(titleValue),
  };
  const errors = validateForm(formData);
  if (Object.keys(errors).length) {
    Object.entries(errors).forEach(([k, v]) => {
      const el = qs(`.error[data-for="${k}"]`);
      if (el) el.textContent = v;
    });
    return;
  }

  if (editingId) {
    recipes = recipes.map((r) =>
      r.id === editingId ? { ...r, ...formData, id: editingId } : r
    );
  } else {
    recipes.unshift({ ...formData, id: uid() });
  }
  saveRecipes(recipes);
  applyFilters();
  showView(homeView);
});

/* --- Delete from form --- */
deleteBtn.addEventListener("click", () => {
  if (!editingId) return;
  deleteRecipeById(editingId);
});

/* --- Delegated handlers --- */
recipesGrid.addEventListener("click", onGridClick);
recipeDetail.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains("edit")) openFormForEdit(id);
  if (e.target.classList.contains("delete")) deleteRecipeById(id);
});

addRecipeBtn.addEventListener("click", openFormForAdd);
backToListBtn.addEventListener("click", () => showView(homeView));
cancelFormBtn.addEventListener("click", () => showView(homeView));

searchInput.addEventListener("input", applyFilters);
difficultyFilter.addEventListener("change", applyFilters);
maxTimeFilter.addEventListener("input", applyFilters);
vegFilter.addEventListener("change", applyFilters);

/* --- Init --- */
function init() {
  try {
    recipes = loadRecipes();
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    recipes = loadRecipes();
  }
  applyFilters();
}

init();
