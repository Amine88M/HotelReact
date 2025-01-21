import React, { useEffect, useState } from "react";

const ChambreList = () => {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    // Récupérer les données de l'API
    const fetchChambres = async () => {
      try {
        const response = await fetch("https://localhost:7141/api/chambre/disponibles");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setChambres(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    };

    fetchChambres();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Chargement en cours...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {chambres.map((chambre) => (
          <div
            key={chambre.numChambre}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Chambre #{chambre.numChambre}</h2>
            <p className="text-gray-600 mb-2">
              Type de chambre : {typesChambres[chambre.id_Type_Chambre] || "Inconnu"}
            </p>
            <p className="text-gray-600 mb-4">{chambre.description}</p>
            <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
              Disponible
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; // Objet de correspondance des types de chambres
const typesChambres = {
  1: "Simple",
  2: "Double",
  3: "Suite",
  4: "Familiale",
};

export default ChambreList;