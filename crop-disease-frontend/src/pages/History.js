import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../components/History.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function History() {

  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {    //gets pred history from backend

    const token = localStorage.getItem("token");  //reads the JWT token stored after login

    try {
      const response = await API.get("/my-history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });   //adds auth token

      setPredictions(response.data);

    } catch (error) {
      console.log(error);
    }
  };
const handleDelete = async (id) => {

if(!window.confirm("Are you sure you want to delete this prediction?")){
return;
}

const token = localStorage.getItem("token");

try{

await API.delete(`/delete-prediction/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

setPredictions(predictions.filter((item)=> item.id !== id));

}catch(error){
console.log(error);
}

};
//useEffect runs when the component loads
  useEffect(() => {
    fetchHistory();
  }, []);   
//page opens->useEffect runs -->fetchHistory() -->API call -->history loads

  const filtered = predictions.filter((item) =>
    item.crop.toLowerCase().includes(search.toLowerCase()) ||
    item.disease.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <>
    <Navbar/>
    <div className="history-container">

      <h1>Prediction History</h1>
      <p className="subtitle">
        All your crop diagnoses in one place
      </p>

      {/* SEARCH */}

      <div className="history-search">

        <input
          type="text"
          placeholder="Search by crop or disease..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>


      {/* EMPTY STATE */}

      {filtered.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">🕒</div>
          <h3>No scans found</h3>
          <p>Upload a crop photo to get started</p>

        </div>

      ) : (

        <div className="history-grid">

          {filtered.map((item) => (  //loops through all filtered predictions.each prediction becomes history card

            <div key={item.id} className="history-card">

              {item.image_path && (   //if img exists --> show it

                <img
                  src={`http://127.0.0.1:8000/${item.image_path}`} //;oads img from backend server
                  alt="leaf"
                />

              )}

              <div className="history-info">

                <h3>{item.disease}</h3>

                <p><b>Crop:</b> {item.crop}</p>

                <p>
                  <b>Confidence:</b> {item.confidence}%
                </p>

                <span className={`severity ${item.severity}`}>
                  {item.severity}
                </span>

                <p className="date">
                  {new Date(item.created_at).toLocaleString()}
                </p>
                <button
className="delete-btn"
onClick={()=>handleDelete(item.id)}
>
Delete
</button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
    <Footer/>
    </>
  );
}

export default History;