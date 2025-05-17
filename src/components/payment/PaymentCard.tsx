import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { PaymentMethod } from "@/types/payment";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PaymentCardProps {
  payment: PaymentMethod;
  onUpdate: (payment: PaymentMethod) => void;
  onDelete: any;
}

export default function PaymentCard({
  payment,
  onUpdate,
  onDelete,
}: PaymentCardProps) {
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const maskBankNumber = (number: string) => {
    const digitsOnly = number.replace(/\D/g, "");

    if (digitsOnly.length < 10) return number;

    const start = digitsOnly.slice(0, 4);
    const end = digitsOnly.slice(-4);

    return `${start}-${"*".repeat(4)}-${end}`;
  };

  return (
    <Card className="overflow-hidden bg-gray-800/30 flex flex-col h-full rounded-2xl border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-300 pt-0">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity group-hover:opacity-70" />
          <img
            src={payment.paymentInfoImageUrl || "/qr-code.png"}
            alt={`${payment.paymentName} image`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">
            {payment.paymentName}
          </h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">
            {payment.paymentType.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Account Number
            </p>
            <div className="flex items-center gap-5">
              <p className="font-mono text-lg font-semibold tracking-wide">
                {showAccountNumber
                  ? payment.paymentNumber
                  : maskBankNumber(payment.paymentNumber)}
              </p>
              <button
                onClick={() => setShowAccountNumber(!showAccountNumber)}
                className="text-sky-500 hover:text-white transition"
              >
                {showAccountNumber ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdate(payment)}
              className="rounded-full p-0 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Edit size={18} className="text-sky-500" />
              <span className="sr-only">Edit</span>
            </button>

            <button
              onClick={() => onDelete(payment.id)}
              className="rounded-full p-0 transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 size={20} className="text-red-500" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
