import { useState } from "react";
import {
  useMyDocuments,
  useDocumentStatus,
  useAddDocument,
} from "@/hooks/controllers/useFuneralDocuments";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { CloudUpload } from "lucide-react";

export const MyFuneralDocuments = () => {
  const { data: myDocs, isLoading, refetch } = useMyDocuments();
  const { data: statusData } = useDocumentStatus();
  const addMutation = useAddDocument();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [rejectedModalOpen, setRejectedModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({
    bussinessPermit: null,
    sanitaryPermit: null,
    embalmerLicense: null,
    validId: null,
  });
  const [previewUrls, setPreviewUrls] = useState<Record<string, string | null>>(
    {
      bussinessPermit: null,
      sanitaryPermit: null,
      embalmerLicense: null,
      validId: null,
    }
  );
  const [uploading, setUploading] = useState(false);

  const handleViewUpload = (doc: any) => {
    setViewDoc(doc);
    setViewModalOpen(true);
  };

  const handleFileChange = (key: string, file: File | null) => {
    setDocFiles((prev) => ({ ...prev, [key]: file }));
    setPreviewUrls((prev) => ({
      ...prev,
      [key]: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleSubmit = async () => {
    const files = Object.values(docFiles);
    if (files.some((f) => !f)) return;

    setUploading(true);
    try {
      const uploadedUrls: Record<string, string> = {};
      for (const key of Object.keys(docFiles)) {
        const file = docFiles[key]!;
        uploadedUrls[key] = await uploadImageToCloudinary(file);
      }

      await addMutation.mutateAsync(uploadedUrls);
      refetch();
      setAddModalOpen(false);
      setDocFiles({
        bussinessPermit: null,
        sanitaryPermit: null,
        embalmerLicense: null,
        validId: null,
      });
      setPreviewUrls({
        bussinessPermit: null,
        sanitaryPermit: null,
        embalmerLicense: null,
        validId: null,
      });
    } catch (error) {
      console.error("Failed to upload documents", error);
    } finally {
      setUploading(false);
    }
  };

  const approvedDoc = myDocs?.approveDoc || null;
  const hasVerified = !!approvedDoc; // if there's any verified doc, hide add button

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">My Documents</h3>
      </div>

      {/* VERIFIED Document Images as separate cards */}

      <div className="flex justify-center">
        {approvedDoc ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              "bussinessPermit",
              "sanitaryPermit",
              "embalmerLicense",
              "validId",
            ].map((key) => (
              <div
                key={key}
                className="w-full rounded-2xl p-4 shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl bg-white flex flex-col items-center gap-3"
              >
                <img
                  src={approvedDoc[key]}
                  alt={key}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <span className="font-semibold text-gray-700 text-center">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-500 text-white">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 rounded-full bg-gray-300/10 border-dashed border-2 py-12 flex flex-col gap-2 items-center justify-center text-sky-500 font-black hover:bg-gray-200 transition max-w-xl w-full mx-auto"
          >
            <CloudUpload size={72} className="animate-bounce" />
            Add Document
          </button>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-6">History</h3>
      {/* Documents History Table */}
      <table className="w-full border-collapse mt-12">
        <thead>
          <tr className="text-left text-gray-500 text-sm border-b border-gray-300">
            <th className="pb-4">ID</th>
            <th className="pb-4 px-5">Status</th>
            <th className="pb-4 px-5">Submitted At</th>
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : myDocs?.data?.length ? (
            myDocs.data.map((doc: any) => (
              <tr
                key={doc.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4">{doc.id}</td>
                <td
                  className={`py-4 font-semibold ${
                    doc.status === "VERIFIED"
                      ? "text-green-500"
                      : doc.status === "PENDING"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {doc.status}
                  {doc.status === "DECLINED" && doc.declinedMessage && (
                    <button
                      onClick={() => {
                        setRejectedReason(doc.declinedMessage);
                        setRejectedModalOpen(true);
                      }}
                      className="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-400 transition"
                    >
                      View Reason
                    </button>
                  )}
                </td>
                <td className="py-4">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <button
                    onClick={() => handleViewUpload(doc)}
                    className="px-3 py-1 rounded-full bg-sky-500 text-white text-sm hover:bg-sky-400 transition"
                  >
                    View Upload
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center">
                No document history found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Document Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Documents</h2>
              <button onClick={() => setAddModalOpen(false)}>✕</button>
            </div>

            {/* Grid 2 layout for upload cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "bussinessPermit",
                "sanitaryPermit",
                "embalmerLicense",
                "validId",
              ].map((key) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer hover:border-sky-500 transition"
                  onClick={() => document.getElementById(key)?.click()}
                >
                  <CloudUpload size={72} className="text-gray-300" />
                  <span className="text-gray-600 text-center">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>

                  {/* Hidden input */}
                  <input
                    id={key}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(key, e.target.files?.[0] || null)
                    }
                  />

                  {/* Preview */}
                  {previewUrls[key] && (
                    <img
                      src={previewUrls[key]!}
                      alt="Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading || addMutation.isPending}
                className={`flex-1 py-2 rounded-full text-white ${
                  uploading || addMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-400"
                }`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
              <button
                onClick={() => setAddModalOpen(false)}
                className="flex-1 py-2 rounded-full bg-gray-300 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Upload Modal */}
      {viewModalOpen && viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">View Document #{viewDoc.id}</h2>
              <button onClick={() => setViewModalOpen(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                "bussinessPermit",
                "sanitaryPermit",
                "embalmerLicense",
                "validId",
              ].map((key) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <img
                    src={viewDoc[key]}
                    alt={key}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <span className="text-sm text-gray-600 text-center">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rejected Reason Modal */}
      {rejectedModalOpen && rejectedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Rejected Reason</h2>
            <p className="text-gray-700">{rejectedReason}</p>
            <button
              onClick={() => setRejectedModalOpen(false)}
              className="mt-5 w-full rounded-full py-2.5 bg-red-500 text-white hover:bg-red-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
