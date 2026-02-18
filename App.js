import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    calories: "",
    cuisine: "",
    total_time: "",
    rating: "",
  });

  const limit = 6;

  // Function to get image based on recipe title
  const getImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes("chicken")) return "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg";
    if (t.includes("pizza")) return "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg";
    if (t.includes("burger")) return "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg";
    if (t.includes("salad")) return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg";
    if (t.includes("fries") || t.includes("potato")) return "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg";
    if (t.includes("dumpling") || t.includes("apple")) return "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg";
    if (t.includes("cobbler")) return "https://tse1.mm.bing.net/th/id/OIP.BNrRegit0Ot_42zwRx6jSAHaLG?rs=1&pid=ImgDetMain&o=7&rm=3";
    if (t.includes("fish")) return "https://tse2.mm.bing.net/th/id/OIP._9u62Mtwr2drH6koMmid8QHaE8?rs=1&pid=ImgDetMain&o=7&rm=3";
    if (t.includes("peas")) return "https://ww2.kqed.org/bayareabites/wp-content/uploads/sites/24/2016/12/black-eyed-peas-finish-1920x1280.jpg";
    return "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg";
  };

  // Fetch recipes with current filters
  const fetchRecipes = async (appliedFilters = filters) => {
    try {
      let query = `http://localhost:5000/api/recipes?page=${page}&limit=${limit}`;
      const params = [];
      if (appliedFilters.calories) params.push(`calories=${appliedFilters.calories}`);
      if (appliedFilters.cuisine) params.push(`cuisine=${appliedFilters.cuisine}`);
      if (appliedFilters.total_time) params.push(`total_time=${appliedFilters.total_time}`);
      if (appliedFilters.rating) params.push(`rating=${appliedFilters.rating}`);
      if (params.length > 0) query += "&" + params.join("&");

      const res = await fetch(query);
      const data = await res.json();
      setRecipes(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  // Search recipes by title
  const handleSearch = (value) => {
    setSearch(value);

    fetch(`http://localhost:5000/api/recipes/search?title=${value}`)
      .then((res) => res.json())
      .then((data) => setRecipes(data.data));
  };

  // Fetch recipes when page changes
  useEffect(() => {
    fetchRecipes();
  }, [page]);

  // Add/remove items in cart
  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  // Handle filter changes (excluding search)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      ["calories", "total_time", "rating"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

    const newFilters = { ...filters, [name]: parsedValue };
    setFilters(newFilters);
    fetchRecipes(newFilters);
  };

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <h1 className="logo">FoodieHub</h1>
        <p className="tagline">Discover & Order Your Favorite Recipes</p>
        <div className="cart-icon">🛒 {cart.length}</div>
      </header>

      <div className="container">
        {/* LEFT PANEL */}
        <div className="left">
          <h2>Recipes</h2>

          {/* SEARCH BAR */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(search);
              }}
            />
          </div>

          {/* RECIPES GRID */}
          <div className="card-grid">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img src={getImage(recipe.title)} alt={recipe.title} />
                <h3>{recipe.title}</h3>
                <p>
                  <strong>Cuisine:</strong> {recipe.cuisine}
                </p>
                <p className="rating">⭐ {recipe.rating || "N/A"}</p>
                <div className="time-section">
                  <p>⏱ Prep: {recipe.prep_time || "N/A"} mins</p>
                  <p>🔥 Cook: {recipe.cook_time || "N/A"} mins</p>
                  <p>🕒 Total: {recipe.total_time || "N/A"} mins</p>
                </div>
                <button
                  className="order-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(recipe);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          {/* FILTERS */}
          <div className="filters sticky">
            <h3>Filters</h3>
            <input
              type="number"
              name="calories"
              placeholder="Calories ≥"
              value={filters.calories}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="cuisine"
              placeholder="Cuisine"
              value={filters.cuisine}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="total_time"
              placeholder="Total Time ≤"
              value={filters.total_time}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating ≥"
              value={filters.rating}
              onChange={handleFilterChange}
            />
          </div>

          {/* POPULAR RECIPES */}
          {recipes.length > 0 && (
            <div className="popular-recipes">
              <h3>🔥 Popular Recipes</h3>
              {recipes
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((recipe) => (
                  <div
                    key={recipe.id}
                    className="popular-item"
                    onClick={() => addToCart(recipe)}
                  >
                    <img src={getImage(recipe.title)} alt={recipe.title} />
                    <div className="popular-info">
                      <p>{recipe.title}</p>
                      <span>⭐ {recipe.rating || "N/A"}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* CART */}
          <h3>Your Order</h3>
          {cart.length === 0 && <p>No items selected</p>}
          {cart.map((item, index) => (
            <div key={index} className="order-item">
              {item.title}
              <button className="remove-btn" onClick={() => removeFromCart(index)}>
                ❌
              </button>
            </div>
          ))}
          <div className="summary">
            <p>Items: {cart.length}</p>
            <button className="checkout">Checkout</button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecipe.title}</h2>
            <img src={getImage(selectedRecipe.title)} alt={selectedRecipe.title} />
            <p>
              <strong>Description:</strong>
            </p>
            <p>{selectedRecipe.description || "No description available."}</p>
            <h3>Nutrition Values</h3>
            <div className="nutrition">
              {selectedRecipe.nutrients &&
                Object.entries(
                  typeof selectedRecipe.nutrients === "string"
                    ? JSON.parse(selectedRecipe.nutrients)
                    : selectedRecipe.nutrients
                ).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
            </div>
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
