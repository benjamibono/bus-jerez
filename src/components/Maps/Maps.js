import React from "react";

const Maps = ({ src, width = "640", height = "480", title }) => {
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      title={title}
      style={{
        border: "none",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    ></iframe>
  );
};

export default Maps;
