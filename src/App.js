// src/App.js
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import Results from "./components/Results/Results";

function App() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [resultado, setResultado] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [paradasOrigen, setParadasOrigen] = useState([]);
  const [paradasDestino, setParadasDestino] = useState([]);
  const fechaRef = useRef(null);
  const horaRef = useRef(null);

  useEffect(() => {
    // Cargar datos del archivo rutas.json
    fetch("/rutas.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de rutas cargados:", data); // Verificar los datos cargados
        setRutas(data.lineas);

        // Crear una lista única de paradas de origen
        const paradas = new Set();
        data.lineas.forEach((linea) => {
          linea.paradas.forEach((parada) => {
            paradas.add(parada.nombre);
          });
        });
        setParadasOrigen(Array.from(paradas));
      })
      .catch((error) => console.error("Error al cargar rutas:", error));
  }, []);

  useEffect(() => {
    if (origen) {
      // Encontrar todas las líneas que contienen la parada de origen
      const lineasEncontradas = rutas.filter((linea) => {
        const paradas = linea.paradas.map((parada) => parada.nombre);
        return paradas.includes(origen);
      });

      // Obtener las paradas de destino de todas las líneas encontradas
      const destinos = new Set();
      lineasEncontradas.forEach((linea) => {
        const indiceOrigen = linea.paradas.findIndex(
          (parada) => parada.nombre === origen
        );
        const paradasPosteriores = linea.paradas
          .slice(indiceOrigen + 1)
          .map((parada) => parada.nombre);
        paradasPosteriores.forEach((parada) => destinos.add(parada));
      });
      setParadasDestino(Array.from(destinos));
    } else {
      setParadasDestino([]);
    }
  }, [origen, rutas]);

  const handleOrigenChange = (e) => {
    console.log("Origen cambiado a:", e.target.value); // Verificar el origen
    setOrigen(e.target.value);
  };

  const handleDestinoChange = (e) => {
    console.log("Destino cambiado a:", e.target.value); // Verificar el destino
    setDestino(e.target.value);
  };

  const formatHora = (date) => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const setFechaHoraActual = () => {
    const now = new Date();
    if (fechaRef.current) {
      fechaRef.current.value = now.toISOString().split("T")[0]; // Formato ISO para input de tipo date
    }
    if (horaRef.current) {
      horaRef.current.value = formatHora(now); // Usar la función personalizada para formatear la hora
    }
  };

  const buscarRuta = () => {
    setResultado(null); // Limpiar el estado resultado antes de realizar una nueva búsqueda

    const fechaSeleccionada = fechaRef.current ? fechaRef.current.value : "";
    const horaSeleccionada = horaRef.current ? horaRef.current.value : "";

    let now;
    if (fechaSeleccionada && horaSeleccionada) {
      now = new Date(`${fechaSeleccionada}T${horaSeleccionada}`);
    } else {
      now = new Date();
    }

    const diaSemana = now.getDay();
    const horaActual = now.getHours() * 60 + now.getMinutes(); // Convertir hora actual a minutos

    console.log("Fecha y hora actual:", now); // Verificar la fecha y hora actual

    // Buscar la línea que contiene las paradas seleccionadas
    const lineaEncontrada = rutas.find((linea) => {
      const paradas = linea.paradas.map((parada) => parada.nombre);
      return paradas.includes(origen) && paradas.includes(destino);
    });

    if (lineaEncontrada) {
      const paradaOrigen = lineaEncontrada.paradas.find(
        (parada) => parada.nombre === origen
      );
      const paradaDestino = lineaEncontrada.paradas.find(
        (parada) => parada.nombre === destino
      );

      // Determinar los horarios según el día de la semana
      let horarios;
      if (diaSemana === 0) {
        horarios = paradaOrigen.horarios.domingo_festivo;
      } else if (diaSemana === 6) {
        horarios = paradaOrigen.horarios.sabado;
      } else {
        horarios = paradaOrigen.horarios.laborables;
      }

      console.log("Horarios encontrados:", horarios); // Verificar los horarios

      // Encontrar la próxima hora de salida más cercana
      const proximaSalida = horarios.find((horario) => {
        const [horas, minutos] = horario.split(":").map(Number);
        const tiempoEnMinutos = horas * 60 + minutos;
        return tiempoEnMinutos > horaActual;
      });

      if (proximaSalida) {
        const [horasSalida, minutosSalida] = proximaSalida
          .split(":")
          .map(Number);
        const tiempoSalidaEnMinutos = horasSalida * 60 + minutosSalida;

        // Calcular la hora de llegada a la parada de destino
        const indiceOrigen = lineaEncontrada.paradas.indexOf(paradaOrigen);
        const indiceDestino = lineaEncontrada.paradas.indexOf(paradaDestino);
        const tiempoLlegadaEnMinutos =
          tiempoSalidaEnMinutos + (indiceDestino - indiceOrigen);

        const horasLlegada = Math.floor(tiempoLlegadaEnMinutos / 60);
        const minutosLlegada = tiempoLlegadaEnMinutos % 60;

        // Calcular el número de paradas y la duración del viaje
        const numeroParadas = indiceDestino - indiceOrigen;
        const duracionViaje = tiempoLlegadaEnMinutos - tiempoSalidaEnMinutos;

        setResultado({
          linea: lineaEncontrada.nombre, // Asegúrate de que el nombre de la línea se establezca correctamente
          origen,
          destino,
          horaActual: formatHora(now), // Usar la función personalizada para formatear la hora
          proximaSalida,
          llegada: `${horasLlegada.toString().padStart(2, "0")}:${minutosLlegada
            .toString()
            .padStart(2, "0")}`,
          numeroParadas,
          duracionViaje,
        });
      } else {
        setResultado(null);
        alert("No hay más salidas disponibles para hoy.");
      }
    } else {
      setResultado(null);
      alert("No se encontró una ruta para el origen y destino seleccionados.");
    }
  };

  const handleLimpiar = () => {
    setOrigen("");
    setDestino("");
    setFechaHoraActual(); // Restablecer la fecha y hora a la actual
  };

  return (
    <div className="app">
      <Header />
      <SearchBar
        origen={origen}
        destino={destino}
        paradasOrigen={paradasOrigen}
        paradasDestino={paradasDestino}
        handleOrigenChange={handleOrigenChange}
        handleDestinoChange={handleDestinoChange}
        setFechaHoraActual={setFechaHoraActual}
        buscarRuta={buscarRuta}
        fechaRef={fechaRef}
        horaRef={horaRef}
        setOrigen={setOrigen}
        setDestino={setDestino}
        handleLimpiar={handleLimpiar}
      />
      <Results resultado={resultado} />
    </div>
  );
}

export default App;
