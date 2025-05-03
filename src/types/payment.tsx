export interface PaymentMethod {
    id: string;
    paymentInfoImageUrl: string;
    paymentName: string;
    paymentType: PaymentType;
    paymentNumber: string;
  }
  
  export type PaymentType = 
    | 'bank' 
    | 'e-wallet' 
    | 'credit-card' 
    | 'debit-card' 
    | 'other';
  
  export interface PaymentFormValues {
    paymentInfoImageUrl: string;
    paymentName: string;
    paymentType: PaymentType;
    paymentNumber: string;
  }