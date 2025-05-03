import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentFormValues, PaymentMethod } from "@/types/payment";
import UpdatePaymentForm from "./UpdatePaymentForm";

interface UpdatePaymentModalProps {
  isOpen: boolean;
  payment: PaymentMethod | null;
  onClose: () => void;
  onUpdate: (values: PaymentFormValues) => void;
  isSubmitting?: boolean;
}

export default function UpdatePaymentModal({
  isOpen,
  payment,
  onClose,
}: UpdatePaymentModalProps) {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Update the details for {payment.paymentName}.
          </DialogDescription>
        </DialogHeader>
        <UpdatePaymentForm onClose={onClose} paymentInfo={payment} />
      </DialogContent>
    </Dialog>
  );
}
