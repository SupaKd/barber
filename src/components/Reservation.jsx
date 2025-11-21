import React, { useState } from "react";
import { Link } from "react-router-dom";

const Reservation = () => {
  // Données locales
  const services = [
    { id: 1, nom: "Barbe", prix: 15, duree: 30 },
    { id: 2, nom: "Coupe mixte", prix: 25, duree: 45 },
    { id: 3, nom: "Coupe femme", prix: 30, duree: 60 },
    { id: 4, nom: "Coupe homme", prix: 20, duree: 30 },
  ];

  const coiffeurs = [
    { id: 1, prenom: "Léo", nom: "Martin", specialite: "Barbier" },
    { id: 2, prenom: "Emma", nom: "Durand", specialite: "Coiffure femme" },
  ];

  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    client_nom: "",
    client_prenom: "",
    client_email: "",
    client_telephone: "",
    service_id: "",
    coiffeur_id: "",
    date_reservation: "",
    duree: 30,
  });

  const TIME_SLOTS = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "14:00","14:30","15:00","15:30","16:00","16:30","17:00",
  ];

  // Ici on supprime la fonction fetchOccupiedSlots,
  // on simule qu'il n’y a jamais de créneaux occupés :
  const fetchOccupiedSlots = async () => {
    return [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setCurrentStep(5);
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleService = (id) => {
    const s = services.find((x) => x.id === id);
    setFormData((p) => ({ ...p, service_id: id, duree: s?.duree || 30 }));
    next();
  };

  const handleCoiffeur = async (id) => {
    setFormData((p) => ({ ...p, coiffeur_id: id }));
    next();
  };

  const handleDate = async (d) => {
    setFormData((p) => ({ ...p, date_reservation: d }));
    setOccupiedSlots([]);
  };

  const handleTime = (t) =>
    setFormData((p) => ({
      ...p,
      date_reservation: `${p.date_reservation}T${t}`,
    }));

  const next = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const getDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1);
      if (d.getDay() === 0) return null;
      return {
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      };
    }).filter(Boolean);
  };

  const isAvailable = () => true;

  const canProceedToNext =
    formData.client_prenom.trim() &&
    formData.client_nom.trim() &&
    formData.client_email.trim();

  return (
    <section className="reservation">
      <h1 className="title">Réserver en 2 minutes</h1>
      <p className="subtitle">Choisissez, cliquez, confirmez</p>

      <div className="steps">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`step ${currentStep >= n ? "active" : ""}`}>
            <div className="circle">{currentStep > n ? "✓" : n}</div>
          </div>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      {success ? (
        <div className="success">
          <h3>Réservation confirmée</h3>
          <p>Un email de confirmation vous sera envoyé.</p>
          <Link to="/">
            <button>Accueil</button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Vos coordonnées</h3>
              <input
                name="client_prenom"
                placeholder="Prénom *"
                value={formData.client_prenom}
                onChange={handleChange}
                required
              />
              <input
                name="client_nom"
                placeholder="Nom *"
                value={formData.client_nom}
                onChange={handleChange}
                required
              />
              <input
                name="client_email"
                type="email"
                placeholder="Email *"
                value={formData.client_email}
                onChange={handleChange}
                required
              />
              <input
                name="client_telephone"
                placeholder="Téléphone"
                value={formData.client_telephone}
                onChange={handleChange}
              />

              <div className="actions">
                <button
                  type="button"
                  onClick={next}
                  disabled={!canProceedToNext}
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>Choisissez votre prestation</h3>
              <div className="grid">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleService(s.id)}
                    className={formData.service_id === s.id ? "selected" : ""}
                  >
                    <h4>{s.nom}</h4>
                    <p>
                      {s.prix}€ — {s.duree}min
                    </p>
                  </button>
                ))}
              </div>
              <div className="actions">
                <button onClick={prev}>← Retour</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>Choisissez votre coiffeur</h3>
              <div className="grid">
                {coiffeurs.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCoiffeur(c.id)}
                    className={
                      formData.coiffeur_id === c.id ? "selected" : ""
                    }
                  >
                    <div className="avatar">
                      {c.prenom[0]}
                      {c.nom[0]}
                    </div>
                    <h4>
                      {c.prenom} {c.nom}
                    </h4>
                    <p>{c.specialite}</p>
                  </button>
                ))}
              </div>
              <div className="actions">
                <button onClick={prev}>← Retour</button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <h3>Choisissez la date et l’heure</h3>
              <div className="dates">
                {getDates().map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    className={
                      formData.date_reservation.startsWith(d.date)
                        ? "selected"
                        : ""
                    }
                    onClick={() => handleDate(d.date)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {formData.date_reservation && (
                <div className="times">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={
                        formData.date_reservation.includes(t)
                          ? "selected"
                          : ""
                      }
                      onClick={() => handleTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <div className="actions">
                <button type="button" onClick={prev}>
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={!formData.date_reservation || !formData.coiffeur_id}
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  );
};

export default Reservation;
