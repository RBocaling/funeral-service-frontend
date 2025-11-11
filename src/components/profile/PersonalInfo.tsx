import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MapPin, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { caviteData } from "@/constants";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useAddPersonalInfo } from "@/hooks/controllers/useAddPersonalInfo";
import { useQueryClient } from "@tanstack/react-query";
import { useAlertStore } from "@/store/alertStore";

const libraries: "places"[] = ["places"];

const containerStyle = {
  width: "100%",
  height: "350px",
};

const centerDefault = {
  lat: 14.4849, // Cavite approx center
  lng: 120.925,
};

type AddressComponents = {
  barangay: string;
  city: string;
  province: string;
  country: string;
};

type PersonalInfoProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PersonalInfo = ({ open, setOpen }: PersonalInfoProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB8FyY706tMPxgbhiC3dtbzGM5_fKKod94", // ⚠️ Replace this
    libraries,
  });

  const [showMap, setShowMap] = useState(false);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState(centerDefault);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const addPersonalInfo = useAddPersonalInfo();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    purok: "",
    funeralName: "",
    personalEncharge: "",
  });

  const barangays =
    caviteData.cities.find((c) => c.name === selectedCity)?.barangays || [];

  useEffect(() => {
    if (isLoaded && !geocoder.current) {
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // 🔹 Handles map click
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !geocoder.current) return;
    const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(latLng);
    setMapCenter(latLng);

    reverseGeocode(latLng);
  };

  // 🔹 Reverse Geocode Helper
  const reverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    if (!geocoder.current) return;
    geocoder.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const comps = results[0].address_components;
        const get = (t: string) =>
          comps.find((c) => c.types.includes(t))?.long_name || "";

        const barangay =
          get("sublocality_level_1") ||
          get("neighborhood") ||
          get("political") ||
          "";
        const city =
          get("locality") || get("administrative_area_level_2") || "";
        const province = get("administrative_area_level_1") || "";
        const country = get("country") || "";

        handleSelectAddress({ barangay, city, province, country });
        setShowMap(false);
      } else {
        alert("Geocode failed: " + status);
      }
    });
  };

  // 🔹 Handle place search from autocomplete
  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const latLng = { lat, lng };

    setMarkerPos(latLng);
    setMapCenter(latLng);
    reverseGeocode(latLng);
  };

  // 🔹 Update dropdown values after map or search
  const handleSelectAddress = (address: AddressComponents) => {
    let matchedCity = "";
    let matchedBarangay = address.barangay;

    for (const city of caviteData.cities) {
      if (
        city.barangays.some(
          (brgy) =>
            brgy.toLowerCase().trim() === address.barangay.toLowerCase().trim()
        )
      ) {
        matchedCity = city.name;
        break;
      }
    }

    if (!matchedCity && address.city) matchedCity = address.city;

    setSelectedCity(matchedCity);
    setSelectedBarangay(matchedBarangay);

    setFormData((prev) => ({
      ...prev,
      purok: `${matchedBarangay ? matchedBarangay + ", " : ""}${
        matchedCity || address.city || ""
      }`,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const fullAddress =
      `${selectedCity} ${selectedBarangay} ${formData.purok}`.trim();
    const payload = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      location: fullAddress,
      funeralName: formData.funeralName,
      phone: formData.contact,
      personalEncharge: formData.personalEncharge,
    };

    addPersonalInfo.mutate(payload, {
      onSuccess: async () => {
        await showAlert("success", {
          title: "Success Updated!",
          message: "Your action was completed successfully.",
          autoClose: true,
        });
        queryClient.invalidateQueries({ queryKey: ["getProfileProgress"] });
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
        setOpen(false);
      },
      onError: async () => {
        await showAlert("error", {
          title: "Error Add",
          message: "Something went wrong. Please try again.",
          autoClose: true,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        {!showMap ? (
          <>
            {/* -------- FORM CONTENT -------- */}
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl">
                Complete Your Profile
              </DialogTitle>
              <DialogDescription>
                Help us personalize your experience by providing your basic
                information.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-7">
              {/* Full Name */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    id="firstname"
                    placeholder="First Name"
                    className="py-4 w-full"
                    onChange={handleChange}
                    value={formData.firstname}
                  />
                  <Input
                    id="lastname"
                    placeholder="Last Name"
                    className="py-4 w-full"
                    onChange={handleChange}
                    value={formData.lastname}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label>Contact No</Label>
                <Input
                  id="contact"
                  placeholder="Enter Contact No."
                  className="py-4 w-full"
                  onChange={handleChange}
                  value={formData.contact}
                  type="number"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Address</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMap(true)}
                    className="text-sky-500"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="animate-bounce" /> Use Map
                    </div>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {/* City Select */}
                  <Select
                    value={selectedCity}
                    onValueChange={(val) => {
                      setSelectedCity(val);
                      setSelectedBarangay("");
                    }}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {caviteData.cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}

                      {!caviteData.cities.some(
                        (c) => c.name === selectedCity
                      ) &&
                        selectedCity && (
                          <SelectItem value={selectedCity}>
                            {selectedCity} (Custom)
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>

                  {/* Barangay */}
                  <Select
                    value={selectedBarangay}
                    onValueChange={(val) => setSelectedBarangay(val)}
                    disabled={!selectedCity}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {barangays.map((brgy) => (
                        <SelectItem key={brgy} value={brgy}>
                          {brgy}
                        </SelectItem>
                      ))}

                      {!barangays.includes(selectedBarangay) &&
                        selectedBarangay && (
                          <SelectItem value={selectedBarangay}>
                            {selectedBarangay} (Custom)
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>

                  <Input
                    id="purok"
                    placeholder="Purok / Street"
                    className="py-4"
                    value={formData.purok}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Funeral Name</Label>
                <Input
                  id="funeralName"
                  placeholder="Enter Funeral Name"
                  className="py-4 w-full"
                  onChange={handleChange}
                  value={formData.funeralName}
                />
              </div>

              <div className="space-y-2">
                <Label>Personal Incharge</Label>
                <Input
                  id="personalEncharge"
                  placeholder="Enter Personal Incharge"
                  className="py-4 w-full"
                  onChange={handleChange}
                  value={formData.personalEncharge}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-4 p-6 pt-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* -------- MAP CONTENT -------- */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMap(false)}
                >
                  <ArrowLeft size={18} />
                </Button>
                <h3 className="text-lg font-semibold">
                  Select Location on Map
                </h3>
              </div>
            </div>

            {!isLoaded ? (
              <div className="p-8 text-center">Loading map...</div>
            ) : (
              <div className="relative">
                {/* Search bar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[90%]">
                  <Autocomplete
                    onLoad={(auto) => (autocompleteRef.current = auto)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search a location..."
                      className="w-full p-3 rounded-lg border bg-white border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </Autocomplete>
                </div>

                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={13}
                  onLoad={onMapLoad}
                  onClick={handleMapClick}
                  options={{
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {markerPos && <Marker position={markerPos} />}
                </GoogleMap>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfo;
