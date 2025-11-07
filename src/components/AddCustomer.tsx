import { addCustomer } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState, FormEvent } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addCustomer as any,
    onSuccess: () => {
      alert("✅ Success! User added.");
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      console.error(err);
      alert("❌ Failed to add user. Please check your input.");
    },
  });

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      phone: "",
      location: "",
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(formData as any); // ✅ Send form data to backend API
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* INPUT FIELDS */}
          <div className="space-y-3">
            <InputField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="user@example.com"
            />

            <InputField
              label="Username"
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="johndoe"
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First Name"
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
              />
              <InputField
                label="Last Name"
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
              />
            </div>

            <InputField
              label="Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+63 999999999"
            />

            <InputField
              label="Location"
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Cavite City"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-colors shadow-sm ${
                isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Small reusable InputField component */
function InputField({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}
