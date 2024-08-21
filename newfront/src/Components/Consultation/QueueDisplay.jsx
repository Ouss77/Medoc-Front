import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import PatientDetails from "../PatientDetails";

function QueueDisplay({ queue, setQueue }) {
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  const handleDossier = async (nom, prenom) => {
    console.log(`Attempting to view dossier for patient: ${nom} ${prenom}`);
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      // Fetch the patient's ID using nom and prenom
      const response = await axios.get(`${apiUrl}api/users/getPatientId?nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(prenom)}`);

      const patientId = response.data.id; // Get the ID from the response
      console.log("Patient ID retrieved successfully:", patientId);

      // Set the patient ID and show the PatientDetails component
      setSelectedPatientId(patientId);
      setShowPatientDetails(true);
    } catch (error) {
      console.error("Failed to retrieve patient ID", error);
    }
  };

  const handleClosePatientDetails = () => {
    setShowPatientDetails(false);
    setSelectedPatientId(null);
  };

  const handleRemovePatient = async (nom, prenom) => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      // Send a DELETE request to remove the patient visit
      const response = await axios.delete(`${apiUrl}api/removeVisit`, {
        params: { nom, prenom },
      });

      if (response.status === 200) {
        console.log(`Visit for ${nom} ${prenom} removed successfully`);

        setQueue((prevQueue) =>
          prevQueue.filter(
            (patient) => patient.nom !== nom || patient.prenom !== prenom
          )
        );
      }
    } catch (error) {
      console.error("Failed to remove visit", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
        Today's Queue
      </h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Liste d'attente</th>
            <th className="py-2 px-10 text-left">Dossier</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue
            .filter((item) => item.dateVisited?.startsWith(today))
            .map((item, index) => (
              <tr
                key={item._id + index}
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
                className="hover:bg-gray-200"
              >
                <td className="py-2 px-4">
                  {item.nom} {item.prenom}
                </td>
                <td className="py-2 px-20 ordinal">{index + 1}</td>
                <td className="py-2 px-10">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={() => handleDossier(item.nom, item.prenom)}
                  >
                    Verifier
                  </button>
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleRemovePatient(item.nom, item.prenom)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Conditionally render the PatientDetails component */}
      {showPatientDetails && (
        <PatientDetails id={selectedPatientId} onClose={handleClosePatientDetails} />
      )}
    </div>
  );
}

export default QueueDisplay;
