import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const ViewPayment = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-3">
            <DialogTitle className="text-xl">My Available Payment</DialogTitle>
          </DialogHeader>

          <div className="p-7">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque
            magni voluptatem possimus amet rem quas, dolorem officiis
            consequatur dicta molestiae.
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default ViewPayment;
