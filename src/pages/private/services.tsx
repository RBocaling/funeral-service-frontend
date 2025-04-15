import { useState } from "react";
import {
  Eye,
  Plus,
  Search,
  Lock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TitlePage from "@/components/ui/title-page";
import CreateService from "@/components/services/CreateService";
import ViewService from "@/components/services/ViewService";

const data = [
  {
    id: "1",
    title: "Final Resting Cradle of Peace",
    description: "Crafted with elegance to honor a life well lived.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: 10,
    type: "caskets",
  },
  {
    id: "2",
    title: "Floral Tribute for Juan Dela Cruz",
    description:
      "A graceful arrangement of blooms to symbolize love, remembrance, and peace.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: 10,
    type: "flowers",
  },
  {
    id: "3",
    title: "Memorial Setup for Juan Dela Cruz",
    description:
      "A heartfelt tribute space designed to reflect his legacy, love, and the memories he leaves behind.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: 10,
    type: "memorials",
  },
];

const Services = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentStream, setCurrentStream] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    isPrivate: false,
    password: "",
    scheduledDate: new Date().toISOString(),
  });

  const handleCreateStream = () => {
    setNewStream({
      title: "",
      description: "",
      isPrivate: false,
      password: "",
      scheduledDate: new Date().toISOString(),
    });
    setActiveStep(1);
    setCreateModalOpen(true);
  };

  const handleViewStream = (stream: any) => {
    setCurrentStream(stream);
    setViewModalOpen(true);
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStartLive = () => {
    setIsRecording(true);
  };

  return (
    <div className="space-y-6 container mx-auto px-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 ">
        <TitlePage
          label="My Services"
          description="Create and manage funeral services for distant family members"
        />
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <div className="relative w-1/2 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreateStream}
            size="sm"
            className="rounded-full bg-primary/90 hover:bg-primary w-1/2 md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data
          ?.filter(
            (stream) =>
              stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              stream.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
          .map((stream: any) => (
            <Card
              key={stream.id}
              className="overflow-hidden hover:shadow-md transition-shadow rounded-xl pt-0 relative"
            >
              <div className="relative h-48  flex items-center justify-center">
                {stream.isPrivate && (
                  <Badge className="absolute top-3 right-3 bg-gray-800/70 text-white dark:bg-gray-700 flex items-center gap-1 px-2 py-1">
                    <Lock className="h-3 w-3" /> Private
                  </Badge>
                )}

                <Badge className="absolute bottom-3 left-3 bg-gray-800 text-white flex items-center gap-1 whitespace-nowrap z-10 uppercase">
                  {stream.type}
                </Badge>

                {/* price */}
                <div className="absolute top-3 right-3 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-semibold shadow-lg z-10">
                  <span className="flex items-center">{stream.list} pcs</span>
                </div>
                {/* bg */}
                <img
                  src={
                    stream?.type === "caskets"
                      ? "/casket1.jpg"
                      : stream?.type === "flowers"
                      ? "/flower2.webp"
                      : stream?.type === "memorials"
                      ? "/memorial.jpg"
                      : ""
                  }
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700 absolute top-0 left-0"
                />
              </div>
              <CardContent className="px-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {stream.description}
                </p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs flex gap-1 cursor-pointer"
                    onClick={() => handleViewStream(stream)}
                  >
                    <Eye className="h-3.5 w-3.5" /> View List
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-red-600/10 hover:bg-red-600/30  text-xs text-red-500 cursor-pointer"
                    onClick={() => handleViewStream(stream)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Create New Card */}
        <Card
          className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors bg-transparent hover:bg-muted/30 rounded-xl cursor-pointer flex items-center justify-center"
          onClick={handleCreateStream}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Create New Service</h3>
            <p className="text-sm text-muted-foreground">
              Offer meaningful services—from elegant caskets to floral tributes
              and memorials—that honor the lives of loved ones with grace.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create service Modal */}
      <CreateService
        activeStep={activeStep}
        createModalOpen={createModalOpen}
        handlePrevStep={handlePrevStep}
        handleStartLive={handleStartLive}
        isRecording={isRecording}
        newStream={newStream}
        setCreateModalOpen={setCreateModalOpen}
        setNewStream={setNewStream}
      />

      {/* View Stream Modal */}
      <ViewService
        currentStream={currentStream}
        isRecording={isRecording}
        setViewModalOpen={setViewModalOpen}
        viewModalOpen={viewModalOpen}
      />
    </div>
  );
};
export default Services;
