import { useServiceTypeStore } from "@/store/serviceStore";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useAddService } from "@/hooks/controllers/useAddService";
import { useState } from "react";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { useAlertStore } from "@/store/alertStore";
import useProgressProfile from "@/hooks/controllers/useUserProgress";
import { useQueryClient } from "@tanstack/react-query";

const CreateService = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onClose: ()=>void
}) => {
  const { serviceType } = useServiceTypeStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const {
    
    progress,
  } = useProgressProfile();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addServiceMutation = useAddService();
  const { showAlert } = useAlertStore();

  const handleAddServices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      throw new Error("NO file selected");
    }
    const fileUrl = await uploadImageToCloudinary(file);

    setLoading(true);

    addServiceMutation.mutate(
      {
        name: formData.name,
        description: formData.description,
        serviceType: serviceType as "CASKET" | "FLOWERS",
        imgUrl: fileUrl,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["my-services"],
          });
           showAlert('success', {
            title: 'Success Added!',
            message: 'Your action was completed successfully.',
            autoClose: true,
          });
          setFormData({ name: '', description: '' });
          setFile(null);
          setIsOpen(false);
          setLoading(false);
          // onClose()
        },
        onError: async () => {
          await showAlert('error', {
            title: 'Error Add',
            message: 'Something went wrong. Please try again.',
            autoClose: true,
          });
          setLoading(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Create Service</DialogTitle>
          <DialogDescription>
            Create a meaningful tribute with our personalized memorial services,
            honoring the unique life and legacy of your loved one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-7">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter the title of your service"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Service Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about the service"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[100px] rounded-2xl"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-end w-full gap-2">
            <Button className="rounded-full py-5 px-5 bg-red-500 shadow-xl shadow-red-500/10 text-white font-medium" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <div className="flex flex-col gap-2">
            <Button onClick={handleAddServices} disabled={progress < 100} className={`rounded-full py-5 px-5 bg-sky-500 shadow-xl shadow-sky-500/10 text-white font-medium ${progress < 100 && 'cursor-not-allowed'}`}>
                {loading || addServiceMutation.isPending ? "Submitting.." : "Add Now"}
            </Button>
            {(progress < 100) && <p className="text-xs font-medium text-red-500">Please Complete profile</p>}
          </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateService;
