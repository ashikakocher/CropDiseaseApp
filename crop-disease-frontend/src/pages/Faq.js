import React, { useState } from "react";
import "../components/Faq.css";
import { FaQuestionCircle } from "react-icons/fa";
import Footer from "./Footer";
import Navbar from "./Navbar";

const faqData = [
  {
    question: "How does CropGuard detect plant diseases?",
    answer:
      "CropGuard uses AI and machine learning models to analyze plant images and identify diseases based on patterns and symptoms.",
  },
  {
    question: "Is the disease detection accurate?",
    answer:
      "Yes, our model is trained on a large dataset and provides high accuracy, but we recommend consulting experts for critical cases.",
  },
  {
    question: "Can I use this app offline?",
    answer:
      "Currently, CropGuard requires an internet connection to process and analyze images.",
  },
  {
    question: "What crops are supported?",
    answer:
      "We support a wide range of crops including vegetables, fruits, and ornamental plants.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can use the Contact Us page or email us directly for any queries or issues.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="faq-page">

      {/* HERO */}
      <div className="faq-hero">
        <h1>FAQ / Help</h1>
        <p>Find answers to common questions about CropGuard.</p>
      </div>

      {/* FAQ LIST */}
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-card ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <FaQuestionCircle className="faq-icon" />
              <span>{item.question}</span>
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="faq-footer">
        <p>🌱 Need more help? Visit Contact Us</p>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default FAQ;