import React from "react";
import { Link } from "react-router-dom";

export default function Service() {
  const services = [
    { id: 1, nom: "Barbe" },
    { id: 2, nom: "Coiffure Mixte" },
    { id: 3, nom: "Coupe Femme" },
    { id: 4, nom: "Coupe Homme" },
  ];

  return (
    <section className="services">
      <h2>Services</h2>
      <div className="services-layout">
        <div className="left">
          {services[0] && (
            <div className="service-card large">
              <img src="/barbe.jpg" alt={services[0].nom} />
              <h3>{services[0].nom}</h3>
            </div>
          )}
        </div>

        <div className="right">
          {services[1] && (
            <div className="service-card small">
              <img src="/background.jpg" alt={services[1].nom} />
              <h3>{services[1].nom}</h3>
            </div>
          )}

          <div className="double">
            {services[2] && (
              <div className="service-card small">
                <img src="/femme.jpg" alt={services[2].nom} />
                <h3>{services[2].nom}</h3>
              </div>
            )}

            {services[3] && (
              <div className="service-card small">
                <img src="/homme.jpg" alt={services[3].nom} />
                <h3>{services[3].nom}</h3>
              </div>
            )}
          </div>

          <Link to="/reservations">
            <button className="rdv-btn">Prendre RDV</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
