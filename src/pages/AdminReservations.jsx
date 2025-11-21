import React, { useState, useEffect } from "react";
import AdminReservationsCalendar from "../components/AdminReservationsCalendar";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterCoiffeur, setFilterCoiffeur] = useState("tous");
  const [coiffeurs, setCoiffeurs] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const fetchReservations = async (date = "") => {
    try {
      setLoading(true);
      const url = date
        ? `http://localhost:9000/api/reservations?date=${date}`
        : "http://localhost:9000/api/reservations";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur de chargement");
      const data = await response.json();
      setReservations(data);
    } catch {
      setError("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoiffeurs = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/coiffeurs");
      if (!response.ok) throw new Error("Erreur coiffeurs");
      const data = await response.json();
      setCoiffeurs(data);
    } catch (err) {
      console.error("Erreur chargement coiffeurs:", err);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchReservations(date);
  };

  const handleCoiffeurChange = (e) => setFilterCoiffeur(e.target.value);

  useEffect(() => {
    fetchReservations();
    fetchCoiffeurs();
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const localToday = `${yyyy}-${mm}-${dd}`;

  const isToday = (date) => date.startsWith(localToday);

  const filteredReservations = reservations
    .filter(
      (r) =>
        (filterCoiffeur === "tous" || r.coiffeur_id == filterCoiffeur) &&
        (r.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.client_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.service_nom.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aToday = isToday(a.date_reservation);
      const bToday = isToday(b.date_reservation);

      // 1️⃣ Les rendez-vous d'aujourd'hui en premier
      if (aToday && !bToday) return -1;
      if (!aToday && bToday) return 1;

      // 2️⃣ Ensuite du plus récent au plus ancien
      return new Date(b.date_reservation) - new Date(a.date_reservation);
    });

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / perPage);
  const paginated = filteredReservations.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const formatDate = (d) =>
    new Date(d).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Statistiques dynamiques
  const total = reservations.length;
  const parCoiffeur = coiffeurs.map((c) => ({
    nom: `${c.prenom} ${c.nom}`,
    total: reservations.filter((r) => r.coiffeur_id === c.id).length,
  }));

  if (loading && !reservations.length) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>📊 Consultation des Rendez-vous</h1>
        <p>Visualisation des réservations clients</p>
      </header>

      {/* Statistiques dynamiques */}
      <div className="stats">
        <h2>📈 Statistiques</h2>
        <p>
          Total des réservations : <strong>{total}</strong>
        </p>
        {parCoiffeur.map((c) => (
          <p key={c.nom}>
            💇 {c.nom} : {c.total}
          </p>
        ))}
      </div>

      {/* Filtres et tris */}
      <div className="filters">
        <div className="filter-group">
          <label>📅 Filtrer par date :</label>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          {selectedDate && (
            <button
              onClick={() => {
                setSelectedDate("");
                fetchReservations();
              }}
              className="clear-filter"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-group">
          <label>💇 Filtrer par coiffeur :</label>
          <select value={filterCoiffeur} onChange={handleCoiffeurChange}>
            <option value="tous">Tous les coiffeurs</option>
            {coiffeurs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom} {c.nom}
              </option>
            ))}
          </select>
        </div>

        

        <div className="filter-group">
          <label>🔎 Recherche :</label>
          <input
            type="text"
            placeholder="Nom, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => fetchReservations(selectedDate)}
          className="refresh-btn"
        >
          🔄 Actualiser
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="calendar-toggle-btn"
        >
          {showCalendar
            ? "📅 Masquer le calendrier"
            : "📅 Afficher le calendrier"}
        </button>
      </div>

      {/* Calendrier */}
      {showCalendar && (
        <AdminReservationsCalendar reservations={reservations} />
      )}

      {/* Liste des réservations */}
      <div className="reservations-section">
        <h2>
          {selectedDate
            ? `Réservations du ${selectedDate}`
            : "Toutes les réservations"}
          <span className="count-badge">{filteredReservations.length}</span>
        </h2>

        {filteredReservations.length === 0 ? (
          <div className="no-reservations">
            <p>📭 Aucune réservation trouvée</p>
            {filterCoiffeur !== "tous" && (
              <button
                onClick={() => setFilterCoiffeur("tous")}
                className="clear-filters-btn"
              >
                Afficher tous les coiffeurs
              </button>
            )}
          </div>
        ) : (
          <div className="reservations-grid">
            {paginated.map((r) => (
              <div
                key={r.id}
                className={`reservation-card ${
                  isToday(r.date_reservation) ? "today" : ""
                }`}
              >
                <div className="reservation-header">
                  <div className="client-info">
                    <h3>
                      {r.client_prenom} {r.client_nom}
                    </h3>
                    <p className="client-contact">
                      📧 {r.client_email}
                      {r.client_telephone && ` • 📞 ${r.client_telephone}`}
                    </p>
                  </div>
                  <div className="reservation-date">
                    {formatDate(r.date_reservation)}
                  </div>
                </div>

                <div className="reservation-details">
                  <div className="detail-item">
                    <span className="label">🛎️ Service :</span>
                    <span className="value">{r.service_nom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">💇 Coiffeur :</span>
                    <span className="value">
                      {r.coiffeur_prenom} {r.coiffeur_nom}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">⏱️ Durée :</span>
                    <span className="value">{r.duree} min</span>
                  </div>
                  {r.notes && (
                    <div className="detail-item">
                      <span className="label">📝 Notes :</span>
                      <span className="value notes">{r.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ⬅️
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ➡️
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
