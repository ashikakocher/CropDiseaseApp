import { useEffect, useState } from "react";
import "../components/Navbar.css";

function GoogleTranslate() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,pa,fr",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (lang) => {
    setLanguage(lang);

    const applyLang = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      }
    };

    setTimeout(applyLang, 500);
    setTimeout(applyLang, 1000);
  };

  return (
    <div className="custom-translate-wrap">
      <div id="google_translate_element"></div>

      <select
        className="custom-translate-select"
        value={language}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="pa">Punjabi</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

export default GoogleTranslate;