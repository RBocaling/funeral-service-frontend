import { useState } from "react";
import {
  Eye,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TitlePage from "@/components/ui/title-page";
import ViewService from "@/components/services/ViewService";
import { useServiceTypeStore } from "@/store/serviceStore";
import { useGetServices } from "@/hooks/controllers/useAddService";



const Services = ({isProfile=false}:{isProfile?:any}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { setServiceType } = useServiceTypeStore();
  const handleViewService = (service: any) => {
    setServiceType(service?.type?.toUpperCase());
    setViewModalOpen(true);
  };
    const {data:allService} = useGetServices()

  
  const filterDataTotal = (type: any) => {
    const total = allService?.filter((item: any) => item?.serviceType === type);
    return total?.length;
  }


 console.log("allService",);
 
  const data = [
  {
    id: "1",
    title: "Serene Final Rest Casket",
    description: "Designed with care and craftsmanship, this casket honors a loved one with simplicity, beauty, and quiet strength.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: filterDataTotal("CASKET"),
    type: "casket",
  },
  {
    id: "2",
    title: "Floral Tribute of Peace",
    description:
      "Carefully selected blooms to convey heartfelt condolences and quiet strength during times of loss.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: filterDataTotal("FLOWERS"),
    type: "flowers",
  },
  {
    id: "3",
    title: "Full Service Memorial Package",
    description:
      "A comprehensive funeral solution that ensures every detail is handled with care, compassion, and dignity",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: filterDataTotal("FULL_PACKAGE"),
    type: "FULL_PACKAGE",
  },
  {
    id: "3",
    title: "Optional Add-Ons & Setup Services",
    description:
      "Enhance the service setup with additional amenities tailored to your needs.",
    scheduledDate: "2025-04-08T15:00:00",
    thumbnail: "",
    isPrivate: false,
    list: filterDataTotal("ADDITIONAL"),
    type: "ADDITIONAL",
  },
];
  

  return (
    <div className="space-y-6 container mx-auto px-5">
      {
        !isProfile && <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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
          {/* <Button
            size="sm"
            className="rounded-full bg-primary/90 hover:bg-primary w-1/2 md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button> */}
        </div>
      </div>
      }

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data
          ?.filter(
            (service) =>
              service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((service: any) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-md transition-shadow rounded-xl pt-0 relative"
            >
              <div className="relative h-48 flex items-center justify-center">
                <Badge className="absolute bottom-3 left-3 bg-gray-800 text-white flex items-center gap-1 whitespace-nowrap z-10 uppercase">
                  {service.type}
                </Badge>

                <div className="absolute top-3 right-3 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-semibold shadow-lg z-10">
                  <span className="flex items-center">{service.list} pcs</span>
                </div>

                <img
                  src={
                    service.type === "casket"
                      ? "/casket1.jpg"
                      : service.type === "flowers"
                      ? "/flower2.webp"
                      : service.type === "FULL_PACKAGE"
                      ? "/memorial.jpg"
                      : service.type === "ADDITIONAL"
                      ? "/additionImg.jpeg"
                      : ""
                  }
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700 absolute top-0 left-0"
                />
              </div>
              <CardContent className="px-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{service.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs flex gap-1 cursor-pointer animate-bounce"
                    onClick={() => handleViewService(service)}
                  >
                    <Eye className="h-3.5 w-3.5" /> View List
                  </Button>
                 
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Create New Card */}
        {/* <Card
          className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors bg-transparent hover:bg-muted/30 rounded-xl cursor-pointer flex items-center justify-center"
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
        </Card> */}
      </div>

      {/* Create Service Modal */}
    

      {/* View Service Modal */}
      <ViewService
        setViewModalOpen={setViewModalOpen}
        viewModalOpen={viewModalOpen}
      />
      
    </div>
  );
};

export default Services;
