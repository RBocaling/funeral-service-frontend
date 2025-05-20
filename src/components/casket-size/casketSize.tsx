import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  isOpen: boolean;
  setIsOpen: any;
};

const CasketSizeModal = ({ isOpen, setIsOpen }: Props) => {
  const sizes = [
    { name: "Small", height: "up to 150 cm", width: "50 – 55 cm", weight: "up to 50 kg" },
    { name: "Medium", height: "151 – 165 cm", width: "55 – 60 cm", weight: "up to 70 kg" },
    { name: "Large", height: "166 – 180 cm", width: "60 – 65 cm", weight: "up to 90 kg" },
    { name: "Extra Large", height: "181 – 195+ cm", width: "65 – 70 cm", weight: "up to 120 kg" },
    { name: "Standard", height: "160 – 180 cm", width: "60 cm", weight: "up to 80 kg" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Casket Size Guide</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Height Range</TableHead>
              <TableHead>Width (cm)</TableHead>
              <TableHead>Weight Capacity (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((s) => (
              <TableRow key={s.name}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.height}</TableCell>
                <TableCell>{s.width}</TableCell>
                <TableCell>{s.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default CasketSizeModal;
