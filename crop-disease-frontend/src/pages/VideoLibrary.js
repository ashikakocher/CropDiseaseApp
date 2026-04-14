import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaPlayCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../components/VideoLibrary.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


function VideoLibrary() {
  const navigate = useNavigate();

  const videos = [
    {
      id: 1,
      title: "Fungal Disease Treatment Methods",
      category: "Treatment",
      duration: "16:45",
      views: 92000,
      instructor: "Dr. Rajiv Sharma",
      description:
        "Effective treatment methods for common fungal infections in crops. Step-by-step guidance for better field management.",
      thumbnail:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/RQ7h5JPrBzE?si=GzyG-g-MkmdPR992",
    },
    {
      id: 2,
      title: "Plant Disease Identification Guide",
      category: "Disease",
      duration: "12:45",
      views: 78000,
      instructor: "James Anderson",
      description:
        "Learn how to identify common plant diseases affecting crops. Covers visible symptoms, leaf damage, and fungal spots.",
      thumbnail:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/o48CYz5FMO0?si=mldVQSvhkTpH3BQC",
    },
    {
      id: 3,
      title: "Integrated Pest Management Basics",
      category: "Prevention",
      duration: "22:18",
      views: 64000,
      instructor: "Dr. Neha Kapoor",
      description:
        "A practical introduction to integrated pest management combining cultural, biological, and preventive methods.",
      thumbnail:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/Uo05345F1C8?si=axdYaCFiFjGzWidO",
    },
    {
      id: 4,
      title: "Organic Pest Control Methods",
      category: "Prevention",
      duration: "18:30",
      views: 56000,
      instructor: "Maria Rodriguez",
      description:
        "Sustainable and organic approaches to pest management. Learn natural methods to protect crops safely.",
      thumbnail:
        "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/GkteUqsxAWw?si=FQ9P0LyjD7h1VZFI",
    },
    {
      id: 5,
      title: "Crop Rotation and Disease Prevention",
      category: "Prevention",
      duration: "14:56",
      views: 78000,
      instructor: "James Anderson",
      description:
        "How proper crop rotation can prevent soil-borne diseases and improve overall farm productivity.",
      thumbnail:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/XeNA6XdMoF8?si=-bdkRm4g-DZF2ypQ",
    },
    {
      id: 6,
      title: "Soil Health and Crop Nutrition",
      category: "Techniques",
      duration: "25:12",
      views: 67000,
      instructor: "Dr. Emily Chen",
      description:
        "Understanding soil composition, pH levels, and nutrient management for optimal crop growth and disease resistance.",
      thumbnail:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/I0VguIIhQ_g?si=a2lT6W14-kVq185Y",
    },
    {
      id: 7,
      title: "Companion Planting for Disease Control",
      category: "Techniques",
      duration: "17:09",
      views: 62000,
      instructor: "Robert Taylor",
      description:
        "Using companion plants to naturally reduce disease pressure and improve crop health in gardens and farms.",
      thumbnail:
        "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/EmsaVi1Kt6k?si=OJzX3IjYUfKvQGy-",
    },
    {
      id: 8,
      title: "Water Management for Healthy Crops",
      category: "Techniques",
      duration: "19:32",
      views: 56000,
      instructor: "Maria Rodriguez",
      description:
        "Proper irrigation techniques and water management strategies to prevent disease and improve plant performance.",
      thumbnail:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/c_EHEsnBm2o?si=UyVmv-WKQPFgaO7a",
    },
    {
      id: 9,
      title: "Greenhouse Disease Management",
      category: "Treatment",
      duration: "21:43",
      views: 45000,
      instructor: "Susan Park",
      description:
        "Special considerations for disease prevention and treatment in controlled greenhouse environments.",
      thumbnail:
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/L-2P1X3-aDY?si=bTMsf6kJGqe8dEt5",
    },
    {
      id: 10,
      title: "Bacterial Disease Recognition",
      category: "Disease",
      duration: "13:27",
      views: 34000,
      instructor: "Dr. Ahmed Hassan",
      description:
        "Identifying and treating bacterial infections in plants. Learn the key symptoms and effective field practices.",
      thumbnail:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/uh1VNnw4cAc?si=JYHcI9dzPs_0U4Mm",
    },
  ];

  const tabs = ["All Videos", "Disease", "Prevention", "Treatment", "Techniques"];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Videos");
  const [sortBy, setSortBy] = useState("Most Viewed");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const formatViews = (views) => {
    if (views >= 1000) return `${Math.floor(views / 1000)}k views`;
    return `${views} views`;
  };

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (activeTab !== "All Videos") {
      result = result.filter((video) => video.category === activeTab);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          video.description.toLowerCase().includes(term) ||
          video.category.toLowerCase().includes(term) ||
          video.instructor.toLowerCase().includes(term)
      );
    }

    if (sortBy === "Most Viewed") {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Duration") {
      result.sort((a, b) => {
        const [amin, asec] = a.duration.split(":").map(Number);
        const [bmin, bsec] = b.duration.split(":").map(Number);
        return bmin * 60 + bsec - (amin * 60 + asec);
      });
    }

    return result;
  }, [videos, activeTab, searchTerm, sortBy]);

  const categoryCount = (category) => {
    if (category === "All Videos") return videos.length;
    return videos.filter((video) => video.category === category).length;
  };

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const uniqueInstructors = new Set(videos.map((video) => video.instructor)).size;
  const uniqueCategories = new Set(videos.map((video) => video.category)).size;

  return (
    <>
    <Navbar />
    <div className="video-library-page">
      <div className="video-library-container">
        <button className="back-home-btn" onClick={() => navigate("/learn")}>
          <FaArrowLeft />
          Back to Home
        </button>

        <div className="video-library-header">
          <div className="video-title-row">
            <FaPlayCircle className="video-main-icon" />
            <h1>Video Learning Center</h1>
          </div>

          <p>
            Master agricultural techniques with expert-led video tutorials
            covering disease management, prevention strategies, and modern
            farming methods.
          </p>
        </div>

        <div className="video-stats-grid">
          <div className="video-stat-card">
            <h2>{videos.length}</h2>
            <p>Total Videos</p>
          </div>

          <div className="video-stat-card green">
            <h2>{Math.floor(totalViews / 1000)}k+</h2>
            <p>Total Views</p>
          </div>

          <div className="video-stat-card blue">
            <h2>{uniqueInstructors}+</h2>
            <p>Expert Instructors</p>
          </div>

          <div className="video-stat-card purple">
            <h2>{uniqueCategories}</h2>
            <p>Categories</p>
          </div>
        </div>

        <div className="video-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="video-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="video-chip-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "video-chip active" : "video-chip"}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({categoryCount(tab)})
            </button>
          ))}
        </div>

        <div className="video-sort-row">
          <div></div>
          <div className="video-sort-box">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Most Viewed</option>
              <option>A-Z</option>
              <option>Duration</option>
            </select>
          </div>
        </div>

        <div className="video-grid">
          {filteredVideos.map((video) => (
            <div
              className="video-card"
              key={video.id}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="video-thumb-wrap">
                <img src={video.thumbnail} alt={video.title} />
                <span className="duration-badge">{video.duration}</span>
                <span className="video-category-badge">{video.category}</span>

                <div className="video-overlay">
                  <FaPlayCircle />
                </div>
              </div>

              <div className="video-card-body">
                <h3>{video.title}</h3>
                <p>{video.description}</p>

                <div className="video-meta">
                  <div className="instructor-wrap">
                    <span className="instructor-avatar"></span>
                    <span>{video.instructor}</span>
                  </div>
                  <span className="views-text">{formatViews(video.views)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="no-videos-box">
            <h3>No videos found</h3>
            <p>Try searching with a different keyword or choose another category.</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div
            className="video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setSelectedVideo(null)}
            >
              <FaTimes />
            </button>

            <div className="video-modal-player">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-modal-content">
              <span className="modal-category">{selectedVideo.category}</span>
              <h2>{selectedVideo.title}</h2>
              <p>{selectedVideo.description}</p>

              <div className="video-modal-meta">
                <span>{selectedVideo.instructor}</span>
                <span>{selectedVideo.duration}</span>
                <span>{formatViews(selectedVideo.views)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default VideoLibrary;