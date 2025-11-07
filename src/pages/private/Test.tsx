// import React, { useCallback, useRef, useState } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Autocomplete,
// } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "500px",
// };

// // Cavite center
// const center = {
//   lat: 14.274,
//   lng: 120.8828,
// };

// const MapWithAddress = () => {
//   const [barangay, setBarangay] = useState("");
//   const [province, setProvince] = useState("");
//   const [country, setCountry] = useState("");

//   const mapRef = useRef(null);
//   const autocompleteRef = useRef(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyB8FyY706tMPxgbhiC3dtbzGM5_fKKod94", // 🔐 Replace safely
//     libraries: ["places"],
//   });

//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   const getAddressFromCoords = (latLng) => {
//     const geocoder = new window.google.maps.Geocoder();

//     geocoder.geocode({ location: latLng }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const components = results[0].address_components;

//         const get = (type) =>
//           components.find((comp) => comp.types.includes(type))?.long_name || "";

//         const brgy =
//           get("sublocality_level_1") || get("neighborhood") || get("political");
//         const prov = get("administrative_area_level_2");
//         const ctry = get("country");

//         if (prov.toLowerCase() !== "cavite") {
//           alert("Only locations within Cavite are allowed.");
//           return;
//         }

//         setBarangay(brgy);
//         setProvince(prov);
//         setCountry(ctry);
//       } else {
//         alert("Geocoder failed: " + status);
//       }
//     });
//   };

//   const handleMapClick = (e) => {
//     const latLng = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     getAddressFromCoords(latLng);
//   };

//   const onPlaceChanged = () => {
//     if (autocompleteRef.current !== null) {
//       const place = autocompleteRef.current.getPlace();
//       const lat = place.geometry.location.lat();
//       const lng = place.geometry.location.lng();

//       const latLng = { lat, lng };

//       // Move map
//       mapRef.current.panTo(latLng);
//       getAddressFromCoords(latLng);
//     }
//   };

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>Search or click inside Cavite</h2>

//       {/* 🔍 Search Box */}
//       <Autocomplete
//         onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
//         onPlaceChanged={onPlaceChanged}
//       >
//         <input
//           type="text"
//           placeholder="Search for a place in Cavite"
//           style={{
//             width: "100%",
//             height: "40px",
//             marginBottom: "10px",
//             fontSize: "16px",
//             padding: "10px",
//             boxSizing: "border-box",
//           }}
//         />
//       </Autocomplete>

//       {/* 🗺️ Google Map */}
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={11}
//         onLoad={onMapLoad}
//         onClick={handleMapClick}
//       />

//       {/* 📋 Address Info */}
//       <div style={{ marginTop: "20px" }}>
//         <p>
//           <strong>Barangay:</strong> {barangay || "-"}
//         </p>
//         <p>
//           <strong>Province:</strong> {province || "-"}
//         </p>
//         <p>
//           <strong>Country:</strong> {country || "-"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MapWithAddress;
