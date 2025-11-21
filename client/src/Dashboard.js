import React, { useState } from "react";
import BrowseServices from "./BrowseServices";
import CreateService from "./CreateService";
import MyServices from "./MyServices";
import EditProfile from "./EditProfile";
import ServiceDetails from "./ServiceDetails";
import "./Dashboard.css";

function Dashboard({ name, email, onLogout, user }) {
  const [tab, setTab] = useState("browse");
  const [selectedService, setSelectedService] = useState(null);

  const goToTab = (nextTab) => {
    setSelectedService(null);
    setTab(nextTab);
  };

  return (
    <div className="app-shell">
      {/* top nav */}
      <nav className="topnav">
        <div className="logo">
          <span className="sh-blue">Spel</span>
          <span className="sh-maroon">House</span>
          <span className="sh-black"> Service Connect</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${tab === "browse" ? "active" : ""}`}
            onClick={() => goToTab("browse")}
          >
            browse services
          </button>

          <button
            className={`nav-link ${tab === "create" ? "active" : ""}`}
            onClick={() => goToTab("create")}
          >
            create listing
          </button>

          <button
            className={`nav-link ${tab === "my" ? "active" : ""}`}
            onClick={() => goToTab("my")}
          >
            my listings
          </button>

          <button
            className={`nav-link ${tab === "profile" ? "active" : ""}`}
            onClick={() => goToTab("profile")}
          >
            edit profile
          </button>

          <button className="logout-btn" onClick={onLogout}>
            logout
          </button>
        </div>
      </nav>

      {/* page content */}
      <main className="page-main">
        {/* hero only when browsing list, not inside details */}
        {!selectedService && (
          <header className="hero">
            <h1>SpelHouse Service Connect</h1>
            <p>a platform for auc students to offer and discover services.</p>
          </header>
        )}

        <div className="content-container">
          {selectedService ? (
            <ServiceDetails
              service={selectedService}
              onBack={() => setSelectedService(null)}
            />
          ) : (
            <>
              {tab === "browse" && (
                <BrowseServices onSelectService={setSelectedService} />
              )}

              {tab === "create" && <CreateService user={user} />}

              {tab === "my" && <MyServices user={user} />}

              {tab === "profile" && <EditProfile user={user} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
