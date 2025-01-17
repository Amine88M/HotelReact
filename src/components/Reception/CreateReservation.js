import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CreateReservation = () => {
  const [formData, setFormData] = useState({
    dateCheckIn: "",
    dateCheckOut: "",
    typeChambre: "",
    nombreAdults: 0,
    nombreEnfants: 0,
    telephone: "",
    prixTotal: 0,
    nom: "",
    prenom: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Données envoyées :", JSON.stringify(formData, null, 2)); // Affiche les données sous forme JSON
    try {
      const response = await axios.post("https://localhost:7141/api/reservations", formData);
      Swal.fire("Succès", "Réservation créée avec succès.", "success");
      navigate("/"); // Redirige vers la page des réservations
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire("Erreur", error.response.data.message, "error");
      } else {
        Swal.fire("Erreur", "Une erreur inattendue s'est produite.", "error");
      }
    }
  };
  
  

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Créer une Réservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="row border p-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Date d'Arrivée (Check-In)</label>
              <input
                type="date"
                name="dateCheckIn"
                className="form-control"
                value={formData.dateCheckIn}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Date de Départ (Check-Out)</label>
              <input
                type="date"
                name="dateCheckOut"
                className="form-control"
                value={formData.dateCheckOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Type de Chambre</label>
              <select
                name="typeChambre"
                className="form-control"
                value={formData.typeChambre}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionnez un Type de Chambre --</option>
                <option value="simple">Simple</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Nombre d'Adults</label>
              <input
                type="number"
                name="nombreAdults"
                className="form-control text-center"
                value={formData.nombreAdults}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Nombre d'Enfants</label>
              <input
                type="number"
                name="nombreEnfants"
                className="form-control text-center"
                value={formData.nombreEnfants}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Numéro de Téléphone</label>
              <input
                type="tel"
                name="telephone"
                className="form-control"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Prix Total</label>
              <input
                type="number"
                name="prixTotal"
                className="form-control"
                value={formData.prixTotal}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="nom"
                className="form-control"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                name="prenom"
                className="form-control"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-success me-2">
              Créer Réservation
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/")}
            >
              Retour à la Liste
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReservation;
