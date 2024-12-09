// src/components/Results/Results.js
import React from "react";
import "./Results.css";
import Maps from "../Maps/Maps";

const Results = ({ resultado }) => {
  if (!resultado) {
    return null;
  }

  const getMapSrc = (linea) => {
    switch (linea) {
      case "Línea 1 Plaza Esteve - San Telmo":
        return "https://www.google.com/maps/d/embed?mid=1cVe0lNVcBPY5RMtt-wSR3Ltl2hAVXcoo&ehbc=2E312F";
      case "Línea 2 Plaza Esteve - Picadueñas":
        return "https://www.google.com/maps/d/embed?mid=18tZAxIVFY_tVF2exK55pZdONHem_zlmC&ehbc=2E312F";
      default:
        return "";
    }
  };

  return (
    <div className="resultados">
      <h2>Resultado de la Búsqueda</h2>
      <div className="resultados-contenido">
        <div className="resultados-texto">
          <p>Ruta encontrada:</p>
          <p>{resultado.linea}</p>
          <p>Origen: {resultado.origen}</p>
          <p>Destino: {resultado.destino}</p>
          <p>Hora Actual: {resultado.horaActual}</p>
          <p>Próxima Salida: {resultado.proximaSalida}</p>
          <p>Hora de Llegada: {resultado.llegada}</p>
          <p>Número de paradas: {resultado.numeroParadas}</p>
          <p>Duración del viaje: {resultado.duracionViaje} minutos</p>
        </div>
        {getMapSrc(resultado.linea) && (
          <div className="map-container">
            <Maps
              src={getMapSrc(resultado.linea)}
              title={`Mapa de la ${resultado.linea}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
