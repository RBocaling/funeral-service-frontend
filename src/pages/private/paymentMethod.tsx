import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { paymentMethods as initialPaymentMethods } from "@/lib/mockdata";
import PaymentCard from "@/components/payment/PaymentCard";
import AddPaymentModal from "@/components/payment/AddPaymentModal";
import { PaymentFormValues, PaymentMethod } from "@/types/payment";
import UpdatePaymentModal from "@/components/payment/UpdatePaymentModal";
import {
  useDeleteAvailablePayment,
  useGetAvailablePayment,
} from "@/hooks/controllers/useAvailablePayment";
import { useQueryClient } from "@tanstack/react-query";

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  );
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useGetAvailablePayment();
  const handleAddPayment = (values: PaymentFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newPayment: PaymentMethod = {
        id: Date.now().toString(),
        ...values,
      };
      setPaymentMethods((prev) => [...prev, newPayment]);
      setIsAddModalOpen(false);
      setIsSubmitting(false);
      alert("Payment method added successfully!");
    }, 800);
  };

  const handleUpdatePayment = (values: PaymentFormValues) => {
    if (!selectedPayment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setPaymentMethods((prev) =>
        prev.map((payment) =>
          payment.id === selectedPayment.id
            ? { ...payment, ...values }
            : payment
        )
      );
      setIsUpdateModalOpen(false);
      setSelectedPayment(null);
      setIsSubmitting(false);
      alert("Payment method updated successfully!");
    }, 800);
  };

  const openUpdateModal = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
    setIsUpdateModalOpen(true);
  };

  const deletePayment = useDeleteAvailablePayment();
  const handleDelete = (id: number) => {
    deletePayment.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-payment"],
        });
      },
      onError: (error: any) => {
        console.error(
          "add message failed:",
          error.response?.data?.message || error.message
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">
              Payment Methods
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your payment methods and accounts securely
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="group relative overflow-hidden rounded-full bg-primary px-6 py-2 transition-all hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Add Payment Method
          </Button>
        </div>

        {data?.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30">
            <div className="mx-auto max-w-md text-center">
              <h3 className="mb-2 text-xl font-semibold">No payment methods</h3>
              <p className="mb-6 text-muted-foreground">
                Add your first payment method to get started with secure
                payments
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="group relative overflow-hidden rounded-full"
              >
                <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Payment Method
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((payment: any) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onUpdate={openUpdateModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPayment}
        isSubmitting={isSubmitting}
      />

      <UpdatePaymentModal
        isOpen={isUpdateModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleUpdatePayment}
        isSubmitting={isSubmitting}
      />

      {/* <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        paymentName={selectedPayment?.paymentName || ''}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPaymentToDelete('');
          setSelectedPayment(null);
        }}
        onConfirm={handleDeletePayment}
        isDeleting={isDeleting}
      /> */}
    </div>
  );
};

export default PaymentMethodsPage;
