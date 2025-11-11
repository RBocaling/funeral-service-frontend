import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TermsAgreementProps = {
  title: string;
  onAgreeChange?: (agreed: boolean) => void;
  termsText?: string;
};

export default function TermsAgreement({
  title,
  onAgreeChange,
  termsText,
}: TermsAgreementProps) {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (checked: boolean) => {
    setAgreed(!!checked);
    onAgreeChange?.(!!checked);
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm space-y-3">
      <h3 className="text-sm font-medium text-gray-700">
        Booking Confirmation Requirement
      </h3>

      <div className="flex items-start space-x-3">
        <Checkbox
          id={`${title}-terms`}
          checked={agreed}
          onCheckedChange={handleChange}
        />

        <Label
          htmlFor={`${title}-terms`}
          className="text-sm text-gray-600 leading-6"
        >
          I have read and agree to the{" "}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="underline font-medium text-sky-600 hover:text-sky-400"
              >
                Terms and Conditions
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-sky-600 text-lg">
                  Funeral Booking – Terms & Conditions
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-sm leading-6 text-gray-600">
                {termsText ?? (
                  <>
                    <p>
                      By proceeding with the booking, you confirm that all
                      information provided is accurate and that you have the
                      legal authority to arrange funeral services.
                    </p>

                    <p className="font-semibold text-gray-800">Important:</p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Booking is not final until verified and approved by our
                        Funeral Coordinator.
                      </li>
                      <li>
                        Any changes to schedule must be requested at least{" "}
                        <strong>24 hours</strong> prior to the service.
                      </li>
                      <li>
                        Payments made are non-refundable but may be transferred
                        to another schedule subject to availability.
                      </li>
                      <li>
                        The funeral home is not responsible for delays caused by
                        external factors (traffic, weather, etc.).
                      </li>
                    </ul>

                    <p>
                      By clicking <strong>Agree</strong>, you acknowledge that
                      you fully understand and accept these conditions.
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-sky-600 hover:bg-sky-500">Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Label>
      </div>
    </div>
  );
}
