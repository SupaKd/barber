import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Coiffeur = () => {
  const [coiffeurs, setCoiffeurs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:9000/api/coiffeurs";

  const fetchCoiffeurs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setCoiffeurs(data);
    } catch {
      setError("Impossible de charger les coiffeurs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoiffeurById = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setSelected(data);
    } catch {
      setError("Impossible de charger les détails du coiffeur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoiffeurs();
  }, []);

  if (loading)
    return (
      <div className="coiffeur-container center">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="coiffeur-container center">
        <p>{error}</p>
        <button onClick={fetchCoiffeurs} className="retry-btn">
          Réessayer
        </button>
      </div>
    );

  return (
    <div className="coiffeur-container">
      <header className="coiffeur-header">
        <h1>Notre équipe</h1>
        <p>Des experts passionnés à votre service</p>
      </header>

      {selected ? (
        <div className="coiffeur-detail">
          <button onClick={() => setSelected(null)} className="back-btn">
            ← Retour
          </button>

          <div className="coiffeur-card detailed">
            <div className="avatar">
              {selected.prenom?.[0]}
              {selected.nom?.[0]}
            </div>
            <h2>{`${selected.prenom} ${selected.nom}`}</h2>

            <div className="info-grid">
              {selected.email && (
                <div className="info-item">
                  <span>Email</span>
                  <p>{selected.email}</p>
                </div>
              )}
              {selected.telephone && (
                <div className="info-item">
                  <span>Téléphone</span>
                  <p>{selected.telephone}</p>
                </div>
              )}
              {selected.specialite && (
                <div className="info-item">
                  <span>Spécialité</span>
                  <p>{selected.specialite}</p>
                </div>
              )}
              {selected.annees_experience && (
                <div className="info-item">
                  <span>Expérience</span>
                  <p>{selected.annees_experience} ans</p>
                </div>
              )}
            </div>

            {selected.description && (
              <div className="section">
                <h3>À propos</h3>
                <p>{selected.description}</p>
              </div>
            )}

            {selected.competences && (
              <div className="section">
                <h3>Compétences</h3>
                <div className="tags">
                  {selected.competences.split(",").map((c, i) => (
                    <span key={i}>{c.trim()}</span>
                  ))}
                </div>
              </div>
            )}
<Link to="/reservations">
            <button className="reserve-btn">
              Réserver avec {selected.prenom}
            </button>
</Link>
          </div>
        </div>
      ) : (
        <div className="coiffeurs-grid">
          {coiffeurs.map((c) => (
            <div
              key={c.id}
              className="coiffeur-card"
              onClick={() => fetchCoiffeurById(c.id)}
            >
              <div className="avatar">
                {c.prenom?.[0]}
                {c.nom?.[0]}
              </div>
              <h3>{`${c.prenom} ${c.nom}`}</h3>
              <p className="specialite">{c.specialite}</p>
              <p className="bio">
                {c.description?.length > 100
                  ? c.description.slice(0, 100) + "..."
                  : c.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coiffeur;
