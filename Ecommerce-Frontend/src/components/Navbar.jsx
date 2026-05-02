import React, { useEffect, useState } from "react";
import API from "../axios";
import { Link } from "react-router-dom";

const Navbar = ({ onSelectCategory }) => {

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then(res => {
        console.log("Categories:", res.data);
        setCategories(res.data);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = async (value) => {
    setInput(value);

    if (value.length >= 1) {
      setShowSearchResults(true);

      try {
        const response = await API.get(
          `/products/search?keyword=${value}`
        );

        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }

    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">

            <a className="navbar-brand" href="/">
              ShopSphere
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

              <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                <li className="nav-item">
                  <a className="nav-link active" href="/">
                    Home
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    Add Product
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-item">No Categories</li>
                    )}
                  </ul>
                </li>

              </ul>

              {/* 🌙 THEME BUTTON */}
              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              {/* 🛒 CART + SEARCH */}
              <div className="d-flex align-items-center cart">

                <a href="/cart" className="nav-link text-dark">
                  <i className="bi bi-cart me-2">Cart</i>
                </a>

                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />

                {showSearchResults && (
                  <ul className="list-group position-absolute">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item">
                          <a href={`/product/${result.id}`}>
                            {result.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item">No product found</li>
                      )
                    )}
                  </ul>
                )}

              </div>

            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;