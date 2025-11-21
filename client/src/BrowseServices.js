import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Dashboard.css";

function BrowseServices({ onSelectService }) {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/services");
        setServices(res.data.services || []);
      } catch (err) {
        console.error("error loading services:", err);
      }
    };
    load();
  }, []);

  const filteredServices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return services.filter((s) => {
      const matchesSearch =
        !term ||
        (s.title && s.title.toLowerCase().includes(term)) ||
        (s.description && s.description.toLowerCase().includes(term)) ||
        (s.category && s.category.toLowerCase().includes(term));

      const matchesCategory =
        categoryFilter === "all" ||
        (s.category &&
          s.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, categoryFilter]);

  // group services by category so they show like "hair", "tutoring", etc.
  const groupedByCategory = useMemo(() => {
    const groups = {};
    filteredServices.forEach((s) => {
      const key = (s.category || "other").toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return groups;
  }, [filteredServices]);

  const categoryKeys = Object.keys(groupedByCategory).sort();

  return (
    <section className="browse-section">
      {/* search + filter bar */}
      <div className="search-bar-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="search hair, nails, tutoring, and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-wrapper">
          <label className="filter-label" htmlFor="category-filter">
            category
          </label>
          <select
            id="category-filter"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">all</option>
            <option value="hair">hair</option>
            <option value="nails">nails</option>
            <option value="tutoring">tutoring</option>
            <option value="other">other</option>
          </select>
        </div>
      </div>

      {services.length === 0 && (
        <p className="empty-message">no services posted yet.</p>
      )}

      {services.length > 0 && categoryKeys.length === 0 && (
        <p className="empty-message">
          no matches found. try a different search or category.
        </p>
      )}

      {/* category sections */}
      {categoryKeys.map((category) => (
        <div className="category-section" key={category}>
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>

          <div className="services-grid">
            {groupedByCategory[category].map((s) => (
              <article
                className="service-card"
                key={s.id}
                onClick={() => onSelectService(s)}
              >
                <div className="service-image-wrapper">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.title}
                      className="service-image-thumb"
                    />
                  ) : (
                    <div className="service-image-placeholder">
                      {s.category && s.category.toLowerCase() === "hair" && "💇🏾‍♀️"}
                      {s.category && s.category.toLowerCase() === "nails" && "💅🏾"}
                      {s.category &&
                        s.category.toLowerCase() === "tutoring" &&
                        "📚"}
                      {!s.category && "✨"}
                    </div>
                  )}
                </div>

                <div className="service-card-content">
                  <div>
                    <h3 className="service-title">{s.title}</h3>
                    <p className="service-category">
                      {s.category || "other service"}
                    </p>
                    {s.description && (
                      <p className="service-description">{s.description}</p>
                    )}
                  </div>

                  <div className="service-meta">
                    {s.price && (
                      <span className="service-price">${s.price}</span>
                    )}
                    {s.provider_name && (
                      <span className="service-provider">
                        by {s.provider_name}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default BrowseServices;
