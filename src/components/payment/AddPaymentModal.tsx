import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { PaymentFormValues } from '@/types/payment';
import PaymentForm from './PaymentForm';
  
  interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (values: PaymentFormValues) => void;
    isSubmitting?: boolean;
  }
  
  export default function AddPaymentModal({
    isOpen,
    onClose,
  }: AddPaymentModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Payment Method</DialogTitle>
            <DialogDescription>
              Enter the details for your new payment method below.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }