import { CalendarDays, LogOut, PanelBottomClose, Pencil, UserPen } from "lucide-react";
import TitlePage from "@/components/ui/title-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GridCard from "@/components/profile/GridCard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import useUser from "@/hooks/controllers/useUser";
import { useProfileProgress } from "@/store/completeProfileStore";
import useProgressProfile from "@/hooks/controllers/useUserProgress";
import { useState } from "react";
import UpdateProfilePicture from "@/components/profile/UpdateProfilePicture";
import useUserAuth from "@/hooks/controllers/useUserAuth";
import UpdateDocumentId from "@/components/profile/UpdateDocumentId";
import UpdatePersonalInfo from "@/components/profile/UpdatePersonalInfo";
import Services from "./services";

const Profile = () => {
  const { setCompleteProfileModal } = useProfileProgress();
  const { data:userAuth } = useUserAuth();
  const logout = useAuthStore((state) => state.clearTokens);
  const [isOpenUpdateProfile, setIsOpenUpdateProfile] = useState<boolean>(false)
  const navigate = useNavigate();
  const [isOpenUpdatePersonal, setIsOpenUpdatePersonal] = useState<boolean>(false)
  const [isOpenUpdateDocument, setIsOpenUpdateDocument] = useState<boolean>(false)

  const { data: userInfo } = useUser();
  const {
    progress,
  } = useProgressProfile();

  console.log(userInfo);

  const totalCount = [
    {
      label: "Total Transactions",
      value: userInfo?.bookings?.length || 0,
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Flowers",
      value:
        userInfo?.services?.filter(
          (item: any) => item?.serviceType === "FLOWERS"
        )?.length ?? 0,
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Casket",
      value:
        userInfo?.services?.filter(
          (item: any) => item?.serviceType === "CASKET"
        )?.length ?? 0,
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
    {
      label: "Total Services",
      value: userInfo?.services?.length || 0,
      Icon: <CalendarDays className="w-5 h-5 mb-1" />,
    },
  ];



  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
         
          <Button
            onClick={()=> setIsOpenUpdateDocument(true)}
            className="bg-sky-500 hover:bg-sky-600 dark:text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-xl shadow-sky-500/20"
          >
            <PanelBottomClose className="w-4 h-4" />
            Document Images
          </Button>
          <Button
            onClick={()=>setIsOpenUpdatePersonal(true)}
            className="bg-sky-500 hover:bg-sky-600 dark:text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-xl shadow-sky-500/20"
          >
            <UserPen className="w-4 h-4" />
           Personal Information
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 dark:text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-xl shadow-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>

    

      <div className="w-full flex items-center gap-5">
        <div className="md:w-1/2 w-full">
          {" "}
          {/* User Info */}
          <div className="flex items-center gap-6 mb-5">
            <div className="relative">
            <Avatar className="h-32 w-32 relative">
                <AvatarImage src={userAuth?.data?.profileUrl || "empty.webp"} />
              <AvatarFallback>Image</AvatarFallback>
              </Avatar>
              <button onClick={()=> setIsOpenUpdateProfile(true)} className="absolute -bottom-1  -right-1 cursor-pointer animate-bounce"> <Pencil className="text-2xl text-sky-500" /></button>

          </div>
            <div className="space-y-1">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{`${
                  userInfo?.firstName || "None"
                } ${userInfo?.lastName || "None"}`}</h3>
                <div className="h-1 w-14 rounded-full bg-sky-500 shadow-2xl shadow-sky-500">
                  {""}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-12 my-5">
                {/* <GridCard key={1} title={userInfo?.user?.role} label="Role" /> */}
                <GridCard
                  key={1}
                  title={userInfo?.phone}
                  label="Phone Number"
                />
                <GridCard key={1} title={userInfo?.user?.email} label="Email" />
              </div>
            </div>
          </div>
          {/* profile complete */}
          <div className="max-w-sm mb-5">
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">
                  Profile completion
                </span>
                <span
                  className={`${
                    progress >= 100
                      ? "text-green-500"
                      : "text-sky-400"
                  } text-xs font-medium `}
                >
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700">
                <div
                  className={`h-1.5 rounded-full   ${
                    progress >= 100
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-sky-500 to-sky-400"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setCompleteProfileModal(true)}
              className={`mt-4 w-full px-4 py-2  text-dark font-medium rounded-full  transition-colors ${
                progress >= 100
                  ? "cursor-not-allowed bg-green-500"
                  : "cursor-pointer bg-sky-500 hover:bg-sky-400"
              }`}
            >
              {progress >= 100 ? " Completed" : " Complete Profile"}
            </button>
          </div>
          {/* profile complete end */}
        </div>
        <div className="md:w-1/2 w-full">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {totalCount?.map(({ Icon, label, value }, index) => (
              <div
                key={index}
                className="dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl  overflow-hidden pb-6 border border-gray-700/30 shadow-xl shadow-gray-800/10 p-5 flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  {Icon}
                </div>
                <div className="flex flex-col">
                  <p className=" font-semibold  text-black dark:text-white text-xl">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* totla services */}
      <h1 className="text-xl font-medium dark:text-white mt-5 mb-3">Our Services</h1>
     <Services isProfile={true}/>


      {
        isOpenUpdateProfile && <UpdateProfilePicture isOpen={isOpenUpdateProfile}  setIsOpen={setIsOpenUpdateProfile}/>
      }

{
        isOpenUpdatePersonal && <UpdatePersonalInfo open={isOpenUpdatePersonal}  setOpen={setIsOpenUpdatePersonal}/>
      }
      {
        isOpenUpdateDocument && <UpdateDocumentId isOpen={isOpenUpdateDocument}  setIsOpen={setIsOpenUpdateDocument}/>
      }
      
    </div>
  );
};

export default Profile;
