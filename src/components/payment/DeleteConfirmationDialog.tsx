// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//   } from '@/components/ui/alert-dialog';
  
//   interface DeleteConfirmationDialogProps {
//     isOpen: boolean;
//     paymentName: string;
//     onClose: () => void;
//     onConfirm: () => void;
//     isDeleting?: boolean;
//   }
  
//   export default function DeleteConfirmationDialog({
//     isOpen,
//     paymentName,
//     onClose,
//     onConfirm,
//     isDeleting = false,
//   }: DeleteConfirmationDialogProps) {
//     return (
//       <AlertDialog open={isOpen} onOpenChange={onClose}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete the {paymentName} payment method? This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={onConfirm}
//               disabled={isDeleting}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {isDeleting ? 'Deleting...' : 'Delete'}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     );
//   }