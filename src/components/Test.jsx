import React, { useState, useEffect } from "react";
import axios from "axios";

const AssociateServiceToRoom = () => {
  const [rooms, setRooms] = useState([]); // List of available rooms
  const [services, setServices] = useState([]); // List of available services
  const [formData, setFormData] = useState({
    numChambre: "",
    serviceId: "",
    dateService: "",
    heure: "",
    quantite: 1,
  });
  const [message, setMessage] = useState("");

  // Fetch available rooms and services on component mount
  useEffect(() => {
    fetchRooms();
    fetchServices();
  }, []);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const response = await axios.get("https://localhost:7141/api/Sejour/rooms"); // Replace with your API endpoint to fetch rooms
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Fetch available services
  const fetchServices = async () => {
    try {
      const response = await axios.get("https://localhost:7141/api/Service"); // Replace with your API endpoint to fetch services
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7141/api/ConsommationService/AssociateServiceToRoom", {
        numChambre: parseInt(formData.numChambre),
        serviceId: parseInt(formData.serviceId),
        dateService: formData.dateService,
        heure: formData.heure,
        quantite: parseInt(formData.quantite),
      });

      if (response.status === 200) {
        setMessage("Service successfully associated to the room!");
        // Reset form after successful submission
        setFormData({
          numChambre: "",
          serviceId: "",
          dateService: "",
          heure: "",
          quantite: 1,
        });
      }
    } catch (error) {
      console.error("Error associating service to room:", error);
      setMessage("Failed to associate service. Please try again.");
    }
  };

  return (
    <div>
      <h2>Associate Service to Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Number:</label>
          <select
            name="numChambre"
            value={formData.numChambre}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.numChambre} value={room.numChambre}>
                {room.numChambre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Service:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.Id_Service} value={service.Id_Service}>
                {service.Nom_Service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date of Service:</label>
          <input
            type="date"
            name="dateService"
            value={formData.dateService}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Time of Service:</label>
          <input
            type="time"
            name="heure"
            value={formData.heure}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <button type="submit">Associate Service</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AssociateServiceToRoom;