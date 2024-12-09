// src/components/SearchBar/SearchBar.js
import React, { useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({
  origen,
  destino,
  paradasOrigen = [], // Valor predeterminado vacío
  paradasDestino = [], // Valor predeterminado vacío
  handleOrigenChange,
  handleDestinoChange,
  buscarRuta,
  fechaRef,
  horaRef,
  setOrigen,
  setDestino,
  handleLimpiar,
}) => {
  const formatHora = (date) => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  useEffect(() => {
    const now = new Date();
    if (fechaRef.current) {
      fechaRef.current.value = now.toISOString().split("T")[0]; // Formato ISO para input de tipo date
    }
    if (horaRef.current) {
      horaRef.current.value = formatHora(now); // Usar la función personalizada para formatear la hora
    }

    const interval = setInterval(() => {
      const now = new Date();
      if (horaRef.current) {
        horaRef.current.value = formatHora(now); // Usar la función personalizada para formatear la hora
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fechaRef, horaRef]);

  const handleLimpiarClick = () => {
    setOrigen("");
    setDestino("");
    if (fechaRef.current) {
      fechaRef.current.value = "";
    }
    if (horaRef.current) {
      horaRef.current.value = "";
    }
    handleLimpiar();
  };

  return (
    <div className="search-bar">
      <div className="inputs">
        <input
          type="text"
          placeholder="Desde"
          list="origenes"
          value={origen}
          onChange={handleOrigenChange}
          onFocus={(e) => e.target.select()} // Seleccionar el texto al recibir el foco
          onClick={(e) => e.target.setSelectionRange(0, e.target.value.length)} // Forzar el despliegue de la lista
          className="rounded-input"
        />
        <datalist id="origenes">
          {paradasOrigen.map((parada, index) => (
            <option key={index} value={parada} />
          ))}
        </datalist>
        <input
          type="text"
          placeholder="Hasta"
          list="destinos"
          value={destino}
          onChange={handleDestinoChange}
          onFocus={(e) => e.target.select()} // Seleccionar el texto al recibir el foco
          onClick={(e) => e.target.setSelectionRange(0, e.target.value.length)} // Forzar el despliegue de la lista
          className="rounded-input"
        />
        <datalist id="destinos">
          {paradasDestino.map((parada, index) => (
            <option key={index} value={parada} />
          ))}
        </datalist>
      </div>
      <div className="options">
        <input type="date" ref={fechaRef} className="rounded-input" />
        <input type="time" ref={horaRef} className="rounded-input" />
        <button onClick={buscarRuta}>Buscar</button>
        <button onClick={handleLimpiarClick}>Limpiar</button>
      </div>
    </div>
  );
};

export default SearchBar;
