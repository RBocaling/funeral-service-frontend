import { useEffect, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/controllers/useUser";
import { useUpdatePersonalInfo } from "@/hooks/controllers/useAddPersonalInfo";
import { useAlertStore } from "@/store/alertStore";

type PersonalInfoProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const UpdatePersonalInfo = ({ open, setOpen }: PersonalInfoProps) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    location: "",
    funeralName: "",
  });

  const updatePersonalInfo = useUpdatePersonalInfo();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  console.log("user",user);
  const { showAlert } = useAlertStore();

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        contact: user.phone || "",
        location: user.location || "",
        funeralName: user.funeralName || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      phone: formData.contact,
    };

    updatePersonalInfo.mutate(payload, {
      onSuccess: async() => {
        await showAlert('success', {
          title: 'Success Updated!',
          message: 'Your action was completed successfully.',
          autoClose: true,
        });
        queryClient.invalidateQueries({ queryKey: ["getProfileProgress"] });
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
        setOpen(false); // Close modal after success
      },
      onError: async() => {
        await showAlert('error', {
          title: 'Error Add',
          message: 'Something went wrong. Please try again.',
          autoClose: true,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Update Personal Info</DialogTitle>
          <DialogDescription>
            Update your personal information here.
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
                value={formData.firstname}
                onChange={handleChange}
              />
              <Input
                id="lastname"
                placeholder="Last Name"
                className="py-4 w-full"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contact No */}
          <div className="space-y-2">
            <Label>Contact No</Label>
            <Input
              id="contact"
              placeholder="Enter Contact No."
              className="py-4 w-full"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              id="location"
              placeholder="Enter Contact No."
              className="py-4 w-full"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Funeral Name</Label>
            <Input
              id="funeralName"
              placeholder="Enter Contact No."
              className="py-4 w-full"
              value={formData.funeralName}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePersonalInfo;
