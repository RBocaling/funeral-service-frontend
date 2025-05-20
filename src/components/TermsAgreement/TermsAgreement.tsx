import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type TermsAgreementProps = {
  title: string;
  onAgreeChange?: (agreed: boolean) => void;
  termsText?: string;
};

export default function TermsAgreement({ title, onAgreeChange, termsText }: TermsAgreementProps) {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (checked: boolean) => {
    setAgreed(checked);
    onAgreeChange?.(checked);
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${title}-terms`}
          checked={agreed}
          onCheckedChange={handleChange}
        />
        <Label htmlFor={`${title}-terms`} className="text-sm leading-6 flex items-center whitespace-nowrap">
          I agree to the{" "}
          <Dialog>
            <DialogTrigger asChild>
              <button type="button" className="underline text-sky-500 hover:text-sky-500/40">
                Terms and Conditions
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-sky-500">Terms and Conditions</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {termsText ||
                  `Default terms and conditions go here.\n\nReplace this text by passing 'termsText' prop to the component.`}
              </div>
            </DialogContent>
          </Dialog>{" "}
          for <strong>{title}</strong>.
        </Label>
      </div>
    </div>
  );
}
