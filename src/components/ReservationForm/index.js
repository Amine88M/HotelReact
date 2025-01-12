import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/api';
import Swal from 'sweetalert2';

function ReservationForm() {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateCheckIn: '',
    dateCheckOut: '',
    id_Type_Chambre: '',
  });

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const loadRoomTypes = async () => {
    try {
      const response = await reservationService.getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les types de chambres', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.createReservation(formData);
      Swal.fire('Succès', 'Réservation créée avec succès', 'success');
      navigate('/reception');
    } catch (error) {
      Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Nouvelle Réservation</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block mb-2">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Type de Chambre</label>
          <select
            name="id_Type_Chambre"
            value={formData.id_Type_Chambre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Sélectionnez un type</option>
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.text}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date d'arrivée</label>
          <input
            type="date"
            name="dateCheckIn"
            value={formData.dateCheckIn}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date de départ</label>
          <input
            type="date"
            name="dateCheckOut"
            value={formData.dateCheckOut}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/reception')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Créer la réservation
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;