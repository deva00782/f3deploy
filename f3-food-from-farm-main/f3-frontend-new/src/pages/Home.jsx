import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import farmer from "../assets/farmer.png";
import tomato from "../assets/tomato.png";
import corn from "../assets/corn.png";
import capsicum from "../assets/capsicum.png";
import leaf from "../assets/leaf.png";
import basket from "../assets/basket.png";

function Home() {

  /* ================= NAVIGATION ================= */

  const navigate = useNavigate();

  /* ================= PARALLAX EFFECT ================= */

  useEffect(() => {

    let ticking = false;

    const handleScroll = () => {

      if (!ticking) {

        window.requestAnimationFrame(() => {

          const section =
            document.querySelector(".harvest-section");

          if (!section) return;

          const rect =
            section.getBoundingClientRect();

          let progress =
            (window.innerHeight - rect.top)
            / window.innerHeight;

          progress =
            Math.max(0, Math.min(progress, 1));

          const vegs =
            document.querySelectorAll(".veg");

          vegs.forEach((veg, i) => {

            const moveY =
              progress * (450 + i * 20);

            const moveX =
              progress * (240 - i * 15);

            veg.style.transform =
              `translate(${-moveX}px, ${moveY}px)`;

            veg.style.opacity =
              1 - progress;

          });

          const fallVeg =
            document.querySelectorAll(".fall");

          fallVeg.forEach((veg, i) => {

            const fallY =
              progress * (200 + i * 30);

            const fallX =
              progress * (120 - i * 15);

            veg.style.transform =
              `translate(${-fallX}px, ${fallY}px)`;

            veg.style.opacity =
              progress;

          });

          ticking = false;

        });

        ticking = true;

      }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  return (

    <>

      {/* ================= HERO SECTION ================= */}

      <div className="hero-section">

        <nav className="navbar">

          <div className="logo">
            🌿 F3-Foodfromfarm
          </div>

         <ul className="nav-links">

  <li
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  >
    Home
  </li>

  <li
    onClick={() =>
      document
        .getElementById("about")
        .scrollIntoView({
          behavior: "smooth"
        })
    }
  >
    About
  </li>

  <li
    onClick={() =>
      document
        .getElementById("get-started")
        .scrollIntoView({
          behavior: "smooth"
        })
    }
  >
    Get Started
  </li>

  <li
    onClick={() =>
      document
        .getElementById("contact")
        .scrollIntoView({
          behavior: "smooth"
        })
    }
  >
    Contact
  </li>

</ul>

          {/* LOGIN BUTTON */}

          <button
            className="order-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

        </nav>

        {/* HERO CONTENT */}

        <div className="hero-container">

          {/* LEFT */}

          <div className="hero-left">

            <p className="hero-tag">
              FARM FRESH • ORGANIC • LOCAL
            </p>

            <h1>
              Food <span>From</span><br />
              🌿 Farm
            </h1>

            <p className="hero-desc">
              Experience the freshest vegetables delivered
              straight from our local farms.
            </p>

            <div className="hero-buttons">

             <button
  className="shop-btn"
  onClick={() => navigate("/login")}
>
  Shop Now
</button>

              <button className="learn-btn">
                Learn More
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="hero-right">

            <img
              src={farmer}
              className="farmer-img"
              alt="farmer"
            />

            {/* FLOATING VEGETABLES */}

            <img src={tomato} className="veg veg1" />
            <img src={tomato} className="veg veg1" />
            <img src={tomato} className="veg veg1" />

            <img src={capsicum} className="veg veg2" />
            <img src={capsicum} className="veg veg2" />

            <img src={corn} className="veg veg3" />
            <img src={corn} className="veg veg3" />
            <img src={corn} className="veg veg3" />

            <img src={leaf} className="veg veg4" />
            <img src={leaf} className="veg veg4" />

          </div>

        </div>

      </div>

      {/* ================= HARVEST SECTION ================= */}

    <section id="about" className="harvest-section">

        <div className="basket-area">

          <img
            src={basket}
            className="basket-img"
            alt="basket"
          />

          {/* FALLING VEGETABLES */}

          <img src={capsicum} className="fall vegA" />
          <img src={corn} className="fall vegB" />
          <img src={leaf} className="fall vegC" />
          <img src={tomato} className="fall vegD" />

        </div>

        <div className="harvest-text">

          <h2>
            Fresh Harvest,<br />
            <span>Straight to You</span>
          </h2>

          <p>
            Experience farm-fresh vegetables delivered directly
            from local farmers using real-time AgMarket prices.
            Every product is carefully selected to ensure quality,
            transparency, and freshness for your family.
          </p>

        </div>

      </section>

      {/* ================= GET STARTED SECTION ================= */}

      <section id="get-started" className="get-started-section">

        <h2 className="get-started-title">
          Get Started with <span>F3 Food</span>
        </h2>

        <p className="get-started-subtitle">
          Three simple steps to bring the farm to your table
        </p>

        <div className="steps-container">

          <div className="step-card">

            <div className="step-icon">
              🌿
            </div>

            <h3>
              Choose Your Produce
            </h3>

            <p>
              Browse our selection of seasonal,
              organic vegetables fresh from local farms.
            </p>

          </div>

          <div className="step-card">

            <div className="step-icon">
              📊
            </div>

            <h3>
              AgMarket Prices
            </h3>

            <p>
              Get real-time vegetable prices directly
              from AgMarket, ensuring fair and transparent
              pricing from farmers.
            </p>

          </div>

          <div className="step-card">

            <div className="step-icon">
              🛡️
            </div>

            <h3>
              Quality Guaranteed
            </h3>

            <p>
              100% organic, pesticide-free produce
              with our freshness guarantee.
            </p>

          </div>

        </div>

       <button
  className="get-started-btn"
  onClick={() => navigate("/login")}
>
  Get Started Today →
</button>

      </section>

      {/* ================= FOOTER ================= */}

     <footer id="contact" className="footer">

        <div className="footer-container">

          <div className="footer-left">
            🌿 <span>F3 Food</span>
          </div>

          <div className="footer-right">
            © 2026 F3 Food — From Farm, For Family, Fresh Forever
          </div>

        </div>

      </footer>

    </>

  );

}

export default Home;