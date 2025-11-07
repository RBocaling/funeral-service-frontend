import { useState } from "react";
import { X, Upload, User } from "lucide-react";
import { useFuneralHelpers, useUpdateHelperPermission } from "@/hooks/controllers/useFuneralHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHelperApi } from "@/api/updatePermissionApi";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { useGetIsHashActive } from "@/hooks/controllers/useSubscribe";
import { useDocumentStatus } from "@/hooks/controllers/useFuneralDocuments";
import useUser from "@/hooks/controllers/useUser";
interface Assistant {
  id: number;
  firstName: string;
  lastName: string;
  user?: {
    email: string;
  };
  isAllowServices: boolean;
  isAllowBookings: boolean;
}

export default function FuneralAssistantsPage() {
   const mutation = useUpdateHelperPermission();
   const queryClient = useQueryClient();
 const { data: helpers, isLoading } = useFuneralHelpers();
 const { data: isHasActive, isLoading: isActiveLoading } =
    useGetIsHashActive();
   const { data: isActiveDoc, isLoading: isActiveDocLoading } =
     useDocumentStatus();
   const { role, isKycVerify } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    profileUrl: "",
  });

  const { mutate: createHelper, isPending } = useMutation({
    mutationFn: createHelperApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funeralHelpers"] });
      setIsOpen(false);
      setPhotoPreview("");
      setFormData({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        location: "",
        profileUrl: "",
      });
    },
  });


  const handleToggle = (helperId: number, field: string, value: boolean) => {
    mutation.mutate({ helperId, [field]: value });
  };

  const handlePhotoChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return alert("Please select a file first.");
    const imgUrl = await uploadImageToCloudinary(file);
    setFormData({
      ...formData,
      profileUrl: imgUrl,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   createHelper(formData);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl p-8 border border-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Funeral Service Assistants
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your team members and their permissions
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              disabled={
                !isHasActive?.hasActive ||
                (role !== "HELPER" && isActiveDoc?.status != "VERIFIED") ||
                (role !== "HELPER" && !isKycVerify)
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              + Add Assistant
            </button>
          </div>

          <div className="space-y-3">
            {helpers?.map((assistant: any) => (
              <div
                key={assistant.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium shadow-md">
                      {assistant.firstName[0]}
                      {assistant.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {assistant.firstName} {assistant.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {assistant.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-sm text-slate-600 font-medium">
                        Services
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={assistant.isAllowServices}
                          onChange={(e) =>
                            handleToggle(
                              assistant.id,
                              "isAllowServices",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 transition-all duration-300 shadow-inner"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5"></div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-sm text-slate-600 font-medium">
                        Bookings
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={assistant.isAllowBookings}
                          onChange={(e) =>
                            handleToggle(
                              assistant.id,
                              "isAllowBookings",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 transition-all duration-300 shadow-inner"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl px-8 py-6 rounded-t-3xl border-b border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold text-slate-900">
                Add New Assistant
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill in the details to create a new team member
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-90"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Upload profile photo
                </p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="johndoe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-98"
                >
                  {isPending ? "Creating.." : " Create Assistant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
