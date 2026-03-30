import React from "react";
import "../components/Learn.css";
import Navbar from "./Navbar";
import { FaLeaf, FaShieldAlt, FaChartBar } from "react-icons/fa";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import { useEffect } from "react";


function Learn() {
  useEffect(() => {
  const elements = document.querySelectorAll(".animate");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);
  return (
    <>
      <Navbar />

      <div className="learn-page">

        {/* HERO SECTION */}
        <section className="hero">

          {/* LEFT */}
          <div className="hero-left animate animate-left">
            <div className="badge">
              🌸 Advanced AI Plant Health Analysis
            </div>

            <h1>
              AI-Powered <span>Disease Detection</span> <br />
              For Your Crops 🌿
            </h1>

            <p>
              Our machine learning technology diagnoses plant diseases with up to
              95% accuracy. Upload a photo and get expert treatment recommendations
              in seconds!
            </p>

            <div className="hero-buttons">
              <a href="/dashboard"><button className="btn-primary" >
                Try AI Diagnosis →
              </button></a>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-right animate animate-right">
            <div className="image-card">
              <img
                src="https://cipotato.org/wp-content/uploads/2020/03/Phone-App-2-PUT-1024x685.jpg"
                alt="Plant Disease Detection"
              />

              <div className="image-overlay">
                <h4>🧠 AI-Powered Analysis</h4>
                <p>
                  Our deep learning model identifies 40+ plant diseases with high accuracy
                </p>
              </div>
            </div>
          </div>

        </section>
        <section className="features">

      {/* TOP TEXT */}
      <div className="features-header animate">
        <div className="badge">🤖 AI TECHNOLOGY</div>

        <h2>
          How Our AI Protects Your Crops 🌿
        </h2>

        <p>
          Crop Doctor uses advanced machine learning algorithms trained on over
          50,000 images to diagnose plant diseases with up to 95% accuracy.
        </p>
      </div>

      {/* CARDS */}
      <div className="features-grid">

        {/* CARD 1 */}
        <div className="feature-card animate">
          <div className="icon">
            <FaLeaf />
          </div>
          <h3>🧠 Deep Learning Model</h3>
          <p>
            Our convolutional neural network is trained on thousands of plant
            disease images to recognize visual patterns with high accuracy.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="feature-card">
          <div className="icon">
            <FaShieldAlt />
          </div>
          <h3>💊 AI Treatment Plans</h3>
          <p>
            After diagnosis, our AI generates tailored treatment
            recommendations developed with agricultural scientists.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="feature-card">
          <div className="icon">
            <FaChartBar />
          </div>
          <h3>📊 ML-Powered Analytics</h3>
          <p>
            Our machine learning algorithms analyze your scan history to
            identify patterns and improve future recommendations.
          </p>
        </div>

      </div>
    </section>
    <section className="benefits">

      {/* LEFT CONTENT */}
      <div className="benefits-left animate animate-left">
        <div className="badge">🌟 BENEFITS</div>

        <h2>
          Grow Healthier Plants & Increase Yields 🌱
        </h2>

        <p className="subtitle">
          Join thousands of farmers and gardeners who are using Crop Doctor to
          protect their plants and maximize productivity.
        </p>

        <ul className="benefits-list">
          <li>
            ✔ <strong>Early Detection 🔍</strong> – Identify problems before they spread
          </li>

          <li>
            ✔ <strong>Save Money 💰</strong> – Reduce pesticide use and prevent crop loss
          </li>

          <li>
            ✔ <strong>Expert Knowledge 🧠</strong> – AI-powered agricultural insights
          </li>

          <li>
            ✔ <strong>Easy to Use 📱</strong> – No technical skills required
          </li>
        </ul>
      </div>

      {/* RIGHT IMAGE */}
      <div className="benefits-right animate animate-right">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQDxAPDxAQEA8PEBAPEA8PDw8PFRUWFhURFRUYHSggGBolGxUVITEhJjUuLi46Fx81ODMsNygtLisBCgoKDg0OGhAQGy0lHyUtLy0tLS0tLS0tLS0tLS0vLS0vLS0tLy0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALkBEQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAADBAIFAAEGB//EAEgQAAICAQIDBAYGBgYIBwAAAAECAAMREiEEMUEFEyJRBjJhcYGxIzNCUpGhcnOywdHwFDRig5KzBxV0gsLD4fEWJENEU2Oi/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDBAAFBv/EACkRAAICAQMDAwQDAQAAAAAAAAABAhEDEiExBEFRFCJhBRMycYGxwUL/2gAMAwEAAhEDEQA/ALJGxIWWwTWReyyfOSZmciT2zaNFNcMjyDJt2OVwoMArSWqcFBS8JW0WUwtZi2FD9VkeoeVdRj1LSkEWiy2paOIZVi5UAZyFB5FiB/PKHp7RpJAFteTyBYKT7s85ri0iqaLJDDoYssPWZoiOhpDCiBSFBmqJzJEzAYN2Aznyx8W2H75W9kdrLaTUxAsQsB5WKDjUv8/9FlljGSi3zwLqV0Ws0YPiOIStdVjKijmzEAe6B4Pjq7gWqbUAcHmD78HpGc43V7htXQZoCyHaAsk5DCtkXsjNkWsmHIBi7wDwzwLmY8goB4FjCuYBzMcxWaLTWqQaRJkgDVdkYFkrA8MtstjnQUxxmgXMj3kG7R2zmbmQeubiinMG2AttgTZAmyb2ZLGQ8NVZK82QtTxNJxaq8nqidTxisyctjmNJDJBJD1yaHQaqOVRWuN1TRAtEre3OKbPdscqNWj+yCc+WcYnP3ksmD63Tnk4zj90s/SC7NxHkFA9hwP8ArKlWGdyR7cE4Pnjnj2e3byK07MLT1Nl72J6QWVhfFqXkyMdvgehne9ncYlyh6zkdR1U+RE8pVCu/XJJHPOQOR65z+ctOxe1G4e1XXJQ5DqPtL/PKUxZnjl8FsWdwdPg9TQwgMT4Di0urFlZ1Kw2PUeYPkRGWcAEk4ABJPkBuTPYi1Vo9DlWcz6VekQqcUJu2tGs/sgY2nJ8V2l3arxFRy1TCzGcHIOSD7Dy+M56ztJrrnvbObrWs9wZshfgMD4ROyxipHTG88fPCWXLrb4PIlmlLI/HY9Q45rbrfHvv9GOSqueaj3cyfKSt4z+jWLjOUA1f21PQyx9H3NlFRfcrRUWOebaBn3HoROQ7Z4gvc3PmRg9AOQ+c7LH7dSu23dmictC1d2ekV2h1DKcqwDA+YIyJB5TeiPF95QVzk1WMnPJwQHH5sR8JbvPU1ao2boy1JMBZFrIxYYrYZkyBYB4u8NYYu5mKYoKwxdzC2GK2PMkkKzGMGzQb2QZsiULYXVJK8WLyPeTkhbHRZMNkT7yTVo1hsY1TIHMydqR1nGs81qkhXNmuekZAWYzVApXvGUSc2EPWY1VFUEarmeYBxDGKzFUMOhiIeI3UY7TEKTH6ZeBaJR+klP0gb7yA+XLwn5CUhUe3b3fx/nedvx3BC5NJ2I3VvI+R9k5Hj+GeklWGMD4YPX28oZRaZmyQalfYH3uRp1YxnQSPVY74O/qn8uY65ClhGQ2VbOCPLGcj28xIVgncn8hGHpLqNI8aAkYA8a7eD2ny/DywjpbMQuOwO3H4R87vS5xYgxz++vk3z69CO39I+MB7O4i2pshuFuKMPJkIB/OeUd7nA5j+f3YnV9g8QbuB4vgyf/b3PV5jKnI/xaT8TNfT5HH2PhlsGRr2HAVW408ua/OAa/wAJ36H5QOvkfaPnB1uDt8JTQTWPaz3Dg7lq4JnG2WKAZ22IT8iDOMtt1NqJzv1+Z906PtS8DglTO5tBHmF0DX/+2b8TOYsA+f8A0z/HyzMGeVuK8ITJK2l4R0/+j1yf6T5CykfHQc/unWWNgZOwG5J2AE4v0S7QThuCe60728RaUUY1OqBawB7AUO8ou2u3ruIJ1MQnStchR8Op9pmz7yhFRW7NsMqhBLudn2j6S8JVnNocjpUNf5jb85zfF+nK5+jp26F35/AD985zs7gLOKs7qoZ6sxyEQfeYj5To09B6x9bfYx/+sLWPzyYluW8ga8k+BL/xyR69Ckf2XZD+YMuOy+3qOK+rYhwMmtxhwPMdCPd+UjT6OcHVuKVY+dmbPyO35Rg1IDkIgI5EKoI90lk0VsUjrX5Mna8UsaTseK2PMbRzZF2gmaadoJmi0TbJl5rVBlpoNDQowGhqzE1aMVtFaChiZI6pkShigFU0ao73cwVT0dRkQolEIKo2K5plithFgkKok9MwCSbOCJDpAqIZJyKRGqI9UYjTHKzLQLRHKzIcbwdd6GuwZB5EbMp8wZFGh0M1RKVapnFcd2LxHD7le8QHZ61J8O+CwG6/L2xWuzP/AH2/7z0mowPFdhcNdu1YVjvrr8DZ8zjY/GLPp9XBnn01/ieccam/eLjxEK45BLOnuDYz79Xslz6DcSBxig+q/eoQeoKkgfiBM7W7Mfg7AbFW2ljgNp8LjnpIPJgQDj2Sv4EdxxCWKSUW2ts+W4Iz7Cud+vLoRIwbi6l2M+6lb5T3OV7a4RuHusobOabHrGeZUHwt8Rg/GC7Mq7y9K/v3LX/icCdf/pc7P0cSt68rqwrnp3iZAP8AhA/wznfRdM8fWeiWd6SegXxZ+U9CUkoN+LNLjVo9G7fu1AEdWtbPTQzsB+QEp6aNWWOQi4Lkcz0wPInHPyz7iW3W4rXBJKVqi56HGB+Lc5naN4Cjh6cuEJLlFLNZZyLYG5HQe4Tx97Zkj722VnF3g8vCijlnZVznb8fiT5mD7J7Mu4x9NY0ICNbnYAe0/uEtexPRe3imD3A1Ug539Y+ex6+3pO4q4aqkCukaUXpnO/Uk9TNUIUrNOPE2D7L7Oq4aoVVDA5s32nb7xmXtDM0WulHwa0klSFLmithh7YrZM0hWL2mK2GHtMVsMi0IwbtBMZJpAxRWa1TMyDGbVp1ACLD1mBSGUxWcGzNSOZkSg2a0SSpC6ZLTNVmagBWQKxgiRIhCL6ZmmFImsRWjiCiFWRmwYEOhisxpGiSNDo0tAqh1GjFbRbgWTWO9zo3zjnnBx+eI+KKyfo3HsDdPiM5l9cY8sqglTR2poiKmU4bSPI6hhvYOpgu0e0GQLYuCB9HYCNgw5Z6qcfKO88IR1f0NwrLXiaUtQ12KGRuYP5EeRnBdocEvDWtTaC1TKSjYyxq57e1Tk4/Sx6wB6ngu2VsGyWf7oLD8dsSPaqLcoFtL4Vg6t9pGHUFcgfE/CT6jJjnDX4+GSyQU1aK/0s7KbjuBUVlWsUVur5C18gGYseQPx59Zz3Y/ozVwrtZZebbGrNeKV01pqTS2Gbdt+RwOQlt2xeaqqxWNFCWAFFzhVOcH8T+cgWJHmJhyddKUfbsmBtJjL8Wm2msDQuhSdyBjHu5SXBKSfuj7q+EH2kDmIrTUXYKu3UnyHUy5RVRdsAAZJO2w6k/jJQTlu2dHcZ75saeSjkOp9p/h/IkjSi47tSxRlECqd1ZwcsPd093yinDelWltN6DH36untKk/vmuLbdCrqcerTZ1wMHYJHhOISxA9bB0YZVh1/h7oRxNCexpEbliVollaIncsjMRlZaIrZH7VidiyDYjFmgmhnWCYRRQRmpMiRMYBNWhkeKZk1sgaAxzVMi3eTINIC3AmNJqJB5QkDM0ZhmiYQGiJozCZkISDTAZthIwUMgimFVosphVMtAshpWjFLxJTD1mVST2Y6Lnh+K20uAynmDv8AOH4nh9SZqOpQBnYNbWF5bHZ1GeR3357yqqaPUXlTlTgid6eL42HC0O2kagPYyZ0H3A7qfYfgW5yZsm0uUtqAwSPEg9VvaPL3SHEgEFkPL116r7fdKxm+JchAX1LapVlDZG48x5fjj8fw53iFFbGvOdONOdiyndT+GJe8Pd9IvtZV+BOP3xDjuH1WiwgAUgVgddblmH4AfKeX1ONSyr5/wWcFKNkuCTQu/M7n2eyGuGrAZgiDD2MeQUHYfEg/4cdYurzn/SHtHvM1IxWpDm5xvqbkqKOpwvLzznABIthgr/Rnyz0xoX7a7X76wrSDoGQuB4nG+WOPxlPqy2Nix8vF7MeRk+6tt8Koa028I31f2nP2jnry8gOU7D0c9H1pxZYM2fZB+x7T7ZduMDJjxub2Lb0Z4J6OHCWesSXI+7nHh9+2/vlsYOswsRM9SKpUAsEUtWPOItYJObCyutSKWVyzsWAeuZmxGiqeuBeuWj1xayuLqEZWssG0ctrizrKJi2AaRLSTiAYyqQLCa5kDmZDQDqNUizxfvJovEIWTdpAtBs0jmUSBYXM2GgsyQMZIYmTBMZtjIZnUMiawqQIk8x0ViHUw6GKK0YrlEVQ7UYypilUYUyqY6YUvCVW6mXzyFblhkOx+cp+2O1q+GUNZqOokKqjLMRz9gnO2emi76KW1jdVNgyw6gYX1vIdffgE6HLgV5Ip1Z1fDP9NWD/8ALWD/AIhN8fbgOoAA/pJOepwigfOU/ZnbtXECniQrDN1YuVcN3bhlJPTIOc58j7DhztK8MXKnb+kWfkqiYMqf3FfyUT9j/gDfY2k6NmPhDHkmQcufcAT8AOspuB7NsvOKKyyLnxnYeZZjy32/LoJdV8IbQtecBsNaxIGlMghc+RwCf93yl2/GpXX3HDKFX7TjbV7v4x41GNswTx/dlXZFV2fwGk5cKSuwGBgHzlukWqjNczXuacWNQVIZrhxA1wwl4ssRYQDrGDBOIk2AVdYFljLiCYTLJisWdIu6R1hAusnYjK+2uKWpLOxYncspFk5IrrViVglhcsRtE0wEsFMm8TI5xbkyOqaYweYhnCEzWZHVNapWKCFBma4LVIl44bCM82pgC0JWYaGQebzITazi0QtcarMVSMVmGyljlZhdcWVpsvH1D2D7U4VL6zXYMg8j9pW6MPbPMu2uxLKGwSSM5R1yMgb5HXI2/PynpjPFuLpWxSrgMp5g/u8o8MzgyU43uuTi/RO5kvRudXFunB3ryKXE+GzbkRkOPfYJ2nD8MUJqckqt76mxnmFA+Ur+xOxu74nQDrq4jAOR4q7lOqp/eDkfH4S37WoI4q5uisBp6arFI1Y9gDD/AHpl6jJqzWvBXFJvHKwatknc4ycAnJxnr5mNUiJ1GOVGZpcipDtUZrEWqMZQxEUQzXDCArMKDLphNmDaSJkTEmzgTCBYQ7QbCZpCsAwgmEO0C8QVi1gitqxyyK2Rok2V/ECIWCWXECJOs0wZJi2JuF0TJSwWMNBM0m5i1jTkRJF5muA1TeqVQUguqa1QeqZqj0EJmFQxYND1mEZDKyaQStJo0DKxGUEOgga4cQWUJapBnmGCaK5HGy0jqkCZsTrOsNwt2h1f7rK3wB3j3pHX/wCZtP6rPt2P8YhdxFFCI162OLdQGhgmgA4zuDnf+TGuN4lb9fEVkmsipCGxrRx542ORnB9/KCUeGXgqg7Eq41SYqkZqmeRIdpMarMTqjdRkx0N1wggq4USqYxhkTJSBiSZxFoNpNoNjISFYNoF4RjAuYojBPFbYw5i9kZCMTuijDeOWiLssvFk2DxMhNMyNYtCjWQDmbBgnMukSRjGR1SJaDZo6Q4U2TXeRZ3mleVSOHkaMI0RraGDwMI4HhqzE6gSC2PCuNTHZVzyyTsOv4QHE9pqq4qsrNhUt9t1C7FRlOWpQ+CN9h0zkwxSm6RoxY5Sexe1tDqZS1ds192pexTey/V4ZSxBxqJK45DJPLY9I3/rEh6hpXD993lesagEDBW3GQAVJyPLyIy/pp2WXTzZYyDiUv+u2W2zWM1Ukj6EZDYTU6q32ipzufbFOL9JXDkJpVc6O7dfETkjWHAORkYBAxk78jg+jndB9NI6Er16cs9Ac4wT7yPxmAdDsegOxPuHWcZa7WeO1rC1aa3RHZTh87W2E4JIyMkZ6dMGs43t6wqaLW0U5DIalwAG04QE4Y+E4K7cmyCcYsuhvuO+nS7nfdpILae7LJkHXVl1HiOxUb/awPiB5yXYdirwloLADvA2/QIyj52/lPM6eKsRbNXeIdFPd1sGV3JOzgnmAV5jnnHU4f4XtiziKbeHd82XKnjJ0CthZVY5YkbbV6M+eNz1MujapJ7XuFQVUdwva3DggNdWCdexI1DRktqA9UjSdjjfbnN1ekXDlCypeSoBKr3b6id/AcgkYK9OueU84bhEdXNtmllZMlAzUhQNLY22ORgb74b3y34HtNUIQlmZQjN4QS4YKdIAYBGxpGNhsBD6HEvkeOKHc72vt3hwneWO1SnSB3tdiliQSFGActsfCN9uUu+GsDKGU5VlVlPmpGQfwM8r/AKbRdqFjsLSVDqGsTcaVx4cjYbg8hhSc7y7p9KnKBVuVBZ3CLnXisEE4GDvnBXJzuR9obZ8n06L/AB2Olgj/AMs9ErMKDOA4H0j4lVOl6OIVCQENiiw4dg2XO7DwnHLGNziWPZXplr+vpFW3OtzZvv4cEAk7dMjY7mZ59DkjxuI8Mux1xMixlbT29wrv3aX1O+ooVU5KsOh8v58jHiwyR1GCR1GeWR05H8JiyQlH8kTaa5MYwLGTYwLmQZNsg5gHaEcxewwIRsizQNjTHaAdo6QCFhgSZljQWqVSEYXMyD1TIaAVmqCdppmg2M1pEEaZ5B2kWkWlKHIO0ys5OBknyG5k24Y4ywYZKgDT5nTqOSMDO3n5A4i3a/aFFR7ql0bIVbWLWk6w5yvhHhGw35HG4xNOPDKZox9PKW72RcVcIV3uYUrjm2CxJBIGkHOTjl7oJuMq1YqHeYdMd4yoHrwdTeSnOgAE/a3InKcbxVllulNjkUi2zGysGQnw7gdQR90DGCFFzRXwlVLLpUAI9Sm1AxdgSrXOdWdAOccgCDj7w0LpoR53NsMGNdr/AGXVvaDBe4sArW2xLErD8PkBgurOk7vgAhTgeRMoSVz9EgrsSx9L2PkMwOktXzJ2BAPv5GA4Ti0dnatiFAZzYSS4AVhkAkHSNSAdBpxvmVg44gMtXgBCINDaO8zks5yORON9ttvdeMK4LOSSLLs48T9IVTh0OCSS9mdWAxKKupjzXl94Y5YE37UsrqsVLqhc+amvCMXWtimussM6fI4wD4tjtEOF7SYuBWpLqgq7/USKycgEsFHg1YODnl166uXvXRcUrpax3IqVlJUYIdiMkkjm22TtnAj1vuLq22ZHheGIr1vc4TTjwhiMYB0FjgYzvpGRgA9QYWqkYVlsYkIWB+j1uwY8w4xXhkU4OchgT5zOH4FQMXWFSXBREQAsGVT4WYjmCw0nSDgbnAwzxddaNUCqM1bG5tdtaKNR7xUAOnJzkH1gNuWZzYUmD4Xtd2fS1R8TsNG4GdP0jsBgaubbg7g77QPbPELqFiKgALV12aS2VXxLkEkajnBP6XwO7hmfwrU1bV926glcHBBDAZ07cznnkAjII+MagBjqrw2e7rwCEQk5AJU5AzsOfq79ZyA74srH7YuZAAdGnvd18PrhcnbrqUtnzPsEDwnEqRhgNg7cjmw+tgkYPMRg9nVWZKO6nU+VK5BGThUHMjHU8vKTHA1JYaH1A8gSCthszsBuQFxg5x135RthKYO3tNmwETFeGLrksLXJbDEjfbKgDf1QesCRarqWNyWKAQpUo4RcYO/Lrg4PKXqcQlNmqtHxZpU2M+AoXGMBlJXIzjqNQ90T/wBaYbUyqcKBWLMjS2BnChWLIQSB7PyCfhDOPlhrS1upnRs1mo2I6d4uX1A2IV3RCyj1TjU3TIEEOJu71lSwrXbk7uW06h4iQd1O53Pyhb+3O80V2LW6AeLRZYgyxy2U8w2T4gefKKW1KLQ9RUF8d1rcE7gHxDfJ3Yb75wOc79nbdi0wFOLbWCZVgzppcFgoIV06AhW8BGcnnyLPA8UoGtL21sxCo5IrVEH0Y1AY3A06XIJGCDvmLdiOjDVZaAucWVGtnyCCBgl1K7k7+Z6St4js62lyFU2rsV8LO1agk+HYjpsfcSBkgIt3THft3Req1jM4NIdlLKWQg3KMHUCrjLczlQPvbcjLTsft5+HKuytxNbltIYim5CoYBly2NJ8fgJ07jTpJIPO0m0aOI0W6SalIqLlsKQfFpByB4lyN98HfJGV1kXd6hswAFVmVHTw7aXAAGAqgY8l6iFxTVMWz0zsf0np4hVD/AENpChq3yB3mwKqTz35DnH6uOqclUsrdgNRCsGIGcZ29s8gTtgO/eOKhYCVqYC1RWNxg1hipBGBhcY67RjhuMsW0h+8YaWsS6tkr7vSChZdIBGGATnsffv5mT6Vjk24uiLxRfB6y/wDD8+UA84j0U7crDWZWxrHesXMzKzBtJ8WThmXYjffbc8s9rqB3BBB3BUhgR5gj3TzOp6SWCVPjyZ8kHH9AngHEYYQTCZ0SsUdYu0ccRexZWLEbA5mSWmZHAUmqbghCTYSJV06uoUBXfJzuqDU2PcN/5Gaq3j2BwhZAQNBCgXGwq2CN9kxqJzg+DnzBv+I+sr99nzSU931o/WcR865vwYopW+T1sPTRilLuGrtqFZVyGZAEQkIQQwLAMGXc+ruAoHsySKocUg7xr0SwL3hrZ2cZcYGD4jkFtAyOXuwRV9p/Xf3q/wCa83X9WP13DTXGOxeTpjXZPGVare8yxCixK2XV3rLksGc8lALYJ8wBk4xCrx1IeIVBW7NZnLo/hJ3YkYwcqPB0GdyJKz/1f7j9pJVdr86v1PDf5aR6EvYvbeJqFK8OpwWH1gbTXgAMpKgchksSTkauuJz4dRlbHL6NeFB8DOCMeLngkE9PeIXtn1P714jbz/u/+GGKFlI6TslmFbak0qyE0ZKjUTzKpuc5xlugxk4xBcRahy7ajWwCBdKgDD6iFYKARq5geWNhgxvt7+sL+rr/AMpZRdres3vX5GJHfcpL27DLdo2eE66VK4woRdSYORglDpGQPCvRcGK2drWaSnhGr1mGrJzzYZOFztyAzpGfaqPq1/WWfs1yCcv59spSJOTGRqb12bwjB1PzUcl9w3krqGKqVGc5wq5bru3LfO0yrl/PnHOG+uP6J/zBAOlZNTVWyWXszW6dTd2VJySeeRjODpPkQfZNNx1jO1ldPdlzqFhax3Od85J07+wDlEb+n6Q+ZjnZP1y+5v2Gi9rGXNEuJvuG1hIXDDUwW4Fj6xK58PT3bRPvQToOkqOodgoYE+NV6HfkNpZtzt/2tP2bpV1/V2e6r/mQx4FlzRsXVjZRp05C6lFitgk4O24YHG3vMWfimZdHJeW2eQ5Z84a/7HuX9poBOf4/OMIx+upRw6sLPpX7wd3oyQi/ebyypOP7J9ktbLa1Vc4ZwUUsrlGV1GrIGfcM+zptKrs/62v9JvnN8L6r/rk/bERqykXRYtcXGtyz4GkLl1wARndhvt+eDjOMS4JhcrKii+xQ7tRactZw+NTFGTB14XJUeXPOBEOC+373+TQXo7/XqP8Aaa/2zOS5DJ8BwKrRtUK1sbDJXagbCjUD4gSfWYDzxvnaS4FFQgo7bq+anY5CFR3qEBRkkZA207HOwJCF3Ov4/spAJ9eP06/+GMT+S24TjPG9jLZ3AsXwHLui4fRYSBzXAB6cxjBlv2d2pdrNlHEZ12EhVVNOSqqGsVhkKNWnfPPYYEW7K+rt/wBh/wCVKjgf6s/6N/yrglFNbnX2Ok7P9OuJrbHF1B69TEugYOCfFgNkqRvsNvgBidvwPH18RWLKiWUkrupVlYc1IPIiUPpB/V09w/Y4iWXY3rX/AK5P8mqeT9Q6fGsbyRVMhnxpRssGEC4hmgmnjoxMDiZJzI9in//Z"
          alt="Smart Farming"
        />
      </div>

    </section>
    <section className="library">

      {/* HEADER */}
      <div className="library-header">
        <div className="badge">📘 PLANT DISEASE ENCYCLOPEDIA</div>

        <h2>Comprehensive Disease Library</h2>

        <p>
          Access our extensive database of plant diseases, complete with detailed
          symptoms, causes, and treatment options.
        </p>
      </div>

      {/* CONTENT */}
      <div className="library-content">

        {/* LEFT BOX */}
        <div className="library-left">
          <h3>Disease Encyclopedia Features</h3>

          <ul>
            <li><span>1</span> Searchable database of 100+ common plant diseases</li>
            <li><span>2</span> Detailed symptoms and identification guides</li>
            <li><span>3</span> Evidence-based treatment recommendations</li>
            <li><span>4</span> Categorized by plant type and disease category</li>
            <li><span>5</span> Prevention guides and best practices</li>
          </ul>
        </div>

        {/* RIGHT BOX */}
        <div className="library-right">
          <h3>Browse by Category</h3>

          <div className="category-grid">

            <div className="category card-blue">
              <h4>Fungal Diseases</h4>
              <p>Powdery mildew, black spot, rust, late blight and more</p>
            </div>

            <div className="category card-green">
              <h4>Bacterial Diseases</h4>
              <p>Bacterial leaf spot, fire blight, crown gall and more</p>
            </div>

            <div className="category card-yellow">
              <h4>Viral Diseases</h4>
              <p>Mosaic virus, ringspot, curly top virus and more</p>
            </div>

            <div className="category card-red">
              <h4>Pest Damage</h4>
              <p>Aphids, spider mites, thrips, scale insects and more</p>
            </div>

          </div>
        </div>

      </div>

      {/* BUTTON */}
      <div className="library-btn">
        <button>📖 Explore Disease Library →</button>
        <p>Free access to our comprehensive plant disease reference</p>
      </div>

    </section>
    <section className="cta animate">

      <h2>
        Experience the power of AI in agriculture today! 🌿
      </h2>

      <p>
        Join thousands of farmers already using our AI technology to detect
        diseases early and protect their crops. Get personalized advice from
        real agricultural experts! ✨
      </p>

      <div className="cta-buttons">
        <a href="/dashboard">
          <button className="cta-primary">
          Try Our AI Scanner Now ⚡
        </button>
        </a>

        <button className="cta-secondary">
          Learn More
        </button>
      </div>

    </section>

      </div>
<Testimonials />
      <Footer />
    </>
  );
}

export default Learn;