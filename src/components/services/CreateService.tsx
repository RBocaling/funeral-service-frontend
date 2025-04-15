import { Play } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const CreateService = ({
  createModalOpen,
  setCreateModalOpen,
  newStream,
  setNewStream,
  activeStep,
  handlePrevStep,
  isRecording,
  handleStartLive,
}: {
  createModalOpen:any;
  setCreateModalOpen:any;
  newStream:any;
  setNewStream:any;
  activeStep:any;
  handlePrevStep:any;
  isRecording:any;
  handleStartLive:any;
}) => {
  return (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
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
            <Label htmlFor="title"> Service</Label>
            <Select>
              <SelectTrigger className="w-full py-7 rounded-2xl">
                <SelectValue placeholder="Select a Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Services</SelectLabel>
                  <SelectItem value="apple">Casket</SelectItem>
                  <SelectItem value="banana">Flower</SelectItem>
                  <SelectItem value="banana">Memorial</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter the title of your service"
              value={newStream.title}
              onChange={(e) =>
                setNewStream({ ...newStream, title: e.target.value })
              }
              className="w-full py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about the service"
              className="min-h-[100px] rounded-2xl"
              value={newStream.description}
              onChange={(e) =>
                setNewStream({
                  ...newStream,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          {activeStep === 1 ? (
            <div className="flex justify-end w-full gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-full"
              >
                Add Now
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              {!isRecording && (
                <Button
                  onClick={handleStartLive}
                  className="rounded-full bg-primary/90 hover:bg-primary"
                >
                  <Play className="h-4 w-4 mr-2" /> Go Live Now
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateService;
