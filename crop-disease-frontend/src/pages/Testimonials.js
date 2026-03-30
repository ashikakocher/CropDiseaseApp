import React from "react";
import "./Learn";

const testimonials = [
  {
    name: "Ann Njeru",
    role: "Small-scale Farmer",
    text: "Crop Doctor has transformed how I manage my farm. Early disease detection saved me from major losses!",
    initial: "J",
  },
  {
    name: "Stephen Ndwiga",
    role: "Urban Gardener",
    text: "I struggled with plant diseases, but this app made it so easy. My garden looks healthier than ever!",
    initial: "S",
  },
  {
    name: "Wilson Omondi",
    role: "Commercial Grower",
    text: "This tool is essential for our operations. Quick detection helps us act fast and protect crops.",
    initial: "R",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">

      <div className="test-header">
        <div className="badge">💬 TESTIMONIALS</div>
        <h2>What Our Users Say 🌟</h2>
        <p>
          Thousands of farmers and gardeners trust Crop Doctor to protect their plants.
        </p>
      </div>

      <div className="test-grid">
        {testimonials.map((item, index) => (
          <div className="test-card animate" key={index}>

            <div className="test-user">
              <div className="avatar">{item.initial}</div>
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>

            <p className="test-text">"{item.text}"</p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Testimonials;