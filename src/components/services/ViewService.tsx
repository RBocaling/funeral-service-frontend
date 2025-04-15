import { PencilLine, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

const ViewService = ({
  viewModalOpen,
  isRecording,
  setViewModalOpen,
  currentStream,
}: {
  viewModalOpen: any;
  isRecording: any;
  setViewModalOpen: any;
  currentStream: any;
}) => {
  return (
    <Dialog
      open={viewModalOpen}
      onOpenChange={(open) => !isRecording && setViewModalOpen(open)}
    >
      <DialogContent className="sm:max-w-[800px] p-0 rounded-2xl overflow-hidden">
        {currentStream && (
          <>
            <div className="relative bg-transparent bg-gray-100 dark:bg-gray-800 ">
              <h2 className="text-xl font-semibold mb-2 p-3">Casket List</h2>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                onClick={() => !isRecording && setViewModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-50">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-2xl z-20"
                >
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3 shadow-2xl shadow-violet-500/20"
                      >
                        <div className=" ">
                          <Card className="overflow-hidden flex flex-col h-full rounded-2xl border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-300 pt-0">
                            <div className="relative h-32">
                              <img
                                src={
                                  index === 0
                                    ? "https://www.ruebelfuneralhome.com/images/merchandise/metal/HP09-Mother.jpg"
                                    : index === 1
                                    ? "https://kingsfunerals.com.au/wp-content/uploads/2023/06/Aurelia_O.jpg"
                                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLFJSnQ7ENbpP5ugIgpuwp7pSSeRj6qUnXoOt4YnAYae1ZD7KnUelZi1T6F-DiWX5X0VI&usqp=CAU"
                                }
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                              />

                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            <CardContent className="px-2 flex-grow py-0">
                              <div className="flex items-center  justify-between gap-7 px-2">
                                <div className="top-3 right-3   text-sm font-semibold shadow-lg">
                                  <span className="flex items-center text-xs">
                                    Premium
                                  </span>
                                </div>
                                <div className="flex items-center justify-start gap-4">
                                  <button className="rounded-full   text-xs text-red-500 cursor-pointer">
                                    <Trash2 size={20} />{" "}
                                  </button>
                                  <button className="rounded-full   text-xs text-green-500 cursor-pointer">
                                    <PencilLine size={20} />{" "}
                                  </button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <img
                src="/transparent-hive.png"
                className="absolute top-0 left-0 opacity-20 w-full h-full"
                alt=""
              />
            </div>

            <div className="p-6 flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold mb-2">
                  {currentStream.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {currentStream.description}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <Button
                  size="sm"
                  className="rounded-full bg-red-600/10 hover:bg-red-600/30  text-xs text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete All
                </Button>
                <Button className="rounded-full font-medium ">
                  Add Casket
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewService;
