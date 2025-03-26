import { IssueWithImage } from "@/types/issue";
import { Form } from "./Form";
import { MenuButton } from "./MenuButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface MapUiProps {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  selectedExample: IssueWithImage | null;
  setSelectedExample: (example: IssueWithImage | null) => void;
}

export const MapUi = ({
  sheetOpen,
  setSheetOpen,
  selectedExample,
  setSelectedExample,
}: MapUiProps) => {
  const handleCloseSheet = () => {
    setSelectedExample(null);
    setSheetOpen(false);
  };

  return (
    <>
      <MenuButton className="absolute bg-[#00391F] text-[#DFF7E3]" />

      <div className="absolute bottom-7 right-4 z-10 flex flex-col gap-4">
        {/* <CardSlider /> */}
        {/* <Card>Test</Card> */}
      </div>
      <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="bottom" className="bg-[#F5FFF4]">
          <SheetHeader>
            <SheetTitle>
              {selectedExample ? selectedExample.title : "Create Report"}
            </SheetTitle>
            <SheetDescription>
              {selectedExample ? (
                <div>
                  <p>{selectedExample.description}</p>
                  <img
                    src={selectedExample.image}
                    alt={selectedExample.title}
                    className="mt-5"
                  />
                </div>
              ) : (
                <Form />
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
