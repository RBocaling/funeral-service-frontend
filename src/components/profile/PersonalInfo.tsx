import { useState } from "react";
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
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useQueryClient } from "@tanstack/react-query";
import { useAddPersonalInfo } from "@/hooks/controllers/useAddPersonalInfo";
import { useAlertStore } from "@/store/alertStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { caviteData } from "@/constants";

type PersonalInfoProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PersonalInfo = ({ open, setOpen }: PersonalInfoProps) => {
  const [isOpenMap, setIsOpenMap] = useState(false);
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

  const barangays = caviteData.cities.find((c) => c.name === selectedCity)?.barangays || [];
  const manilaCoords = { lat: 14.5995, lng: 120.9842 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const fullAddress = `${selectedCity} ${selectedBarangay} ${formData.purok}`.trim();
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
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Complete Your Profile</DialogTitle>
<DialogDescription>
  Help us personalize your experience by providing your basic information.
</DialogDescription>

        </DialogHeader>

        <div className="space-y-4 p-7">
          {/* Full Name */}
          <div className="space-y-2 ">
            <Label>Full Name</Label>
            <div className="grid grid-cols-2 gap-5">
              <Input id="firstname" placeholder="First Name" className="py-4 w-full" onChange={handleChange} />
              <Input id="lastname" placeholder="Last Name" className="py-4 w-full" onChange={handleChange} />
            </div>
          </div>

          {/* Contact No */}
          <div className="space-y-2">
            <Label>Contact No</Label>
            <Input id="contact" placeholder="Enter Contact No." className="py-4 w-full" onChange={handleChange} />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Address</Label>
              <Button variant="ghost" size="sm" onClick={() => setIsOpenMap(!isOpenMap)} className="text-sky-500">
                {isOpenMap ? "Set Manually" : <div className="flex items-center gap-2"><MapPin size={20} className="animate-bounce" /> Set Using Map</div>}
              </Button>
            </div>

            {isOpenMap ? (
              <div className="rounded-3xl overflow-hidden h-[250px]">
                <MapContainer center={manilaCoords} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={manilaCoords}
                    icon={L.icon({
                      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                      iconSize: [32, 32],
                      iconAnchor: [16, 32],
                    })}
                  >
                    <Popup>Funeral Service Center - Manila</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <Label>City</Label>
                  <Select onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {caviteData.cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Barangay</Label>
                  <Select onValueChange={setSelectedBarangay} disabled={!selectedCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {barangays.map((brgy) => (
                        <SelectItem key={brgy} value={brgy}>
                          {brgy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input id="purok" placeholder="Address Description Ex. House No, purok etc" className="py-4" onChange={handleChange} />
              </div>
            )}
          </div>

          {/* Funeral Name */}
          <div className="space-y-2">
            <Label>Funeral's Name</Label>
            <Input id="funeralName" placeholder="Enter Funeral Name" className="py-4 w-full" onChange={handleChange} />
          </div>
          {/* Funeral Name */}
          <div className="space-y-2">
            <Label>Personal Encharge</Label>
            <Input id="personalEncharge" placeholder="Enter Funeral Name" className="py-4 w-full" onChange={handleChange} />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfo;
