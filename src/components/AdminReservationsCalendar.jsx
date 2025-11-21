import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

export default function AdminReservationsCalendar() {
  const [reservations, setReservations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const events = reservations.map((r) => ({
    id: r.id,
    title: `${r.client_prenom} ${r.client_nom} - ${r.service_nom}`,
    start: r.date_reservation,
    end: new Date(new Date(r.date_reservation).getTime() + r.duree * 60000),
    backgroundColor: "#4caf50", // Couleur unique pour tous les événements
    borderColor: "#000",
    extendedProps: { ...r },
  }));

  if (loading) return <p>Chargement du calendrier...</p>;

  return (
    <div className="admin-reservations">
      <h1>📆 Vue Calendrier des Rendez-vous</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale={frLocale}
        events={events}
        eventClick={(info) => setSelectedEvent(info.event.extendedProps)}
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
      />

      {selectedEvent && (
        <div className="event-modal">
          <div className="event-content">
            <button className="close" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
            <h2>
              {selectedEvent.client_prenom} {selectedEvent.client_nom}
            </h2>
            <p>
              <strong>📧 Email :</strong> {selectedEvent.client_email}
            </p>
            {selectedEvent.client_telephone && (
              <p>
                <strong>📞 Téléphone :</strong> {selectedEvent.client_telephone}
              </p>
            )}
            <p>
              <strong>🛎️ Service :</strong> {selectedEvent.service_nom}
            </p>
            <p>
              <strong>💇 Coiffeur :</strong> {selectedEvent.coiffeur_prenom}{" "}
              {selectedEvent.coiffeur_nom}
            </p>
            <p>
              <strong>🕐 Date :</strong>{" "}
              {new Date(selectedEvent.date_reservation).toLocaleString("fr-FR")}
            </p>
            <p>
              <strong>⏱️ Durée :</strong> {selectedEvent.duree} min
            </p>
            {selectedEvent.notes && (
              <p>
                <strong>📝 Notes :</strong> {selectedEvent.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}