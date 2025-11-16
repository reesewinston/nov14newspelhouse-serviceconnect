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

  return (
    <div className="dashboard">

      {/* Top Navigation Bar */}
      <nav className="topnav">
        <div className="logo">
          <span className="sh-blue">Spel</span>
          <span className="sh-maroon">House</span>
          <span className="sh-black"> Service Connect</span>
        </div>

        <div className="nav-links">
          <button
            className={tab === "browse" ? "active" : ""}
            onClick={() => {
              setSelectedService(null);
              setTab("browse");
            }}
          >
            Browse Services
          </button>

          <button
            className={tab === "create" ? "active" : ""}
            onClick={() => {
              setSelectedService(null);
              setTab("create");
            }}
          >
            Create Listing
          </button>

          <button
            className={tab === "my" ? "active" : ""}
            onClick={() => {
              setSelectedService(null);
              setTab("my");
            }}
          >
            My Listings
          </button>

          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => {
              setSelectedService(null);
              setTab("profile");
            }}
          >
            Edit Profile
          </button>

          {/* FIXED LOGOUT BUTTON */}
          <button
            className="logout-btn"
            style={{ color: "black", fontWeight: "600" }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {!selectedService && (
        <header className="hero">
          <h1>Welcome to SpelHouse Service Connect</h1>
          <p>A platform for AUC students to offer and discover services.</p>
        </header>
      )}

      {/* Main Content */}
      <div className="content-container">
        {/* If a service is selected, show details */}
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
    </div>
  );
}

export default Dashboard;
