import Service from "../components/Service";
import Coiffeur from "../components/Coiffeurs";
import Reservations from "../components/Reservation";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Redéfinissez votre style</h1>
          <p className="hero-subtitle">
            Découvrez l’élégance et la précision du soin capillaire, dans une
            ambiance inspirée du design et de la simplicité Apple.
          </p>
          <Link to="/reservations">
            <button className="hero-btn">Réserver maintenant</button>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <Service />
      </section>

      {/* Reservations */}
      <section className="reservations-section">
        <Reservations />
      </section>

     
    </main>
  );
}

export default Home;
