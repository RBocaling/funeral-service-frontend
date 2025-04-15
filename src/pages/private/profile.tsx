import {
  Download,
  CalendarDays,

} from "lucide-react";
import TitlePage from "@/components/ui/title-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GridCard from "@/components/profile/GridCard";


const Profile = () => {
  const personalInfo = {
    id: 1,
    firstname: "Juan",
    lastname: "Dela Cruz",
    email: "jaun@gmail.com",
    mobile: "09999999999",
    role: "Provider",
    totalTransaction: 10,
    totalPending: 1,
    totalCompleted: 9,  
  };

  const totalCount = [
    {
      label: "Total Transactions",
      value: "10",
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Pendings",
      value: "10",
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Completed",
      value: "10",
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Total Services",
      value: "10",
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
  ];
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
  return (
    <div className="max-w-6xl w-full mx-auto text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 md:justify-between md:items-start mb-6">
        <div>
          <TitlePage
            label="Profile"
            description="Manage your Personal Informations"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-xl shadow-sky-500/20">
            <Download className="w-4 h-4" />
            Download Info
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-6 mb-5">
        <Avatar className="h-32 w-32">
          <AvatarImage src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8" />
          <AvatarFallback>Image</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">{`${personalInfo?.firstname} ${personalInfo?.lastname}`}</h3>
            <div className="h-1 w-14 rounded-full bg-sky-500 shadow-2xl shadow-sky-500">
              {""}
            </div>
          </div>
          <div className=" flex-col md:flex-row items-center gap-12 my-5">
            <GridCard key={1} title="Customer" label="Role" />
            <GridCard
              key={1}
              title={personalInfo?.mobile}
              label="Phone Number"
            />
            <GridCard key={1} title={personalInfo?.email} label="Email" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {totalCount?.map(({ Icon, label, value }, index) => (
          <div
            key={index}
            className="dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl  overflow-hidden pb-6 border border-gray-700/30 shadow-xl shadow-gray-800/10 p-5 flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
              {Icon}
            </div>
            <div className="flex flex-col">
              <p className=" font-semibold text-xl">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

          {/* totla services */}
          <h1 className="text-xl font-medium text-white mt-5 mb-3">Our Services</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data
          ?.map((stream: any) => (
            <Card
              key={stream.id}
              className="overflow-hidden hover:shadow-md transition-shadow rounded-xl pt-0 relative"
            >
            <div className="relative h-48  flex items-center justify-center">
                {stream.isPrivate && (
                  <Badge className="absolute top-3 right-3 bg-gray-800/70 text-white dark:bg-gray-700 flex items-center gap-1 px-2 py-1">
                    Private
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
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700 absolute top-0 left-0 w-full h-full"
                />
              </div>
              <CardContent className="px-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {stream.description}
                </p>
                
              </CardContent>
            </Card>
          ))}

       
      </div>
    </div>
  );
};

export default Profile;
