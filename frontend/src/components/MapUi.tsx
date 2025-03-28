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
  selectedIssue: IssueWithImage | null;
  setSelectedIssue: (example: IssueWithImage | null) => void;
}

export const MapUi = ({
  sheetOpen,
  setSheetOpen,
  selectedIssue,
  setSelectedIssue,
}: MapUiProps) => {
  const handleCloseSheet = () => {
    setSelectedIssue(null);
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
              {selectedIssue ? selectedIssue.title : "Create Report"}
            </SheetTitle>
            <SheetDescription>
              {selectedIssue ? (
                <div>
                  <p>{selectedIssue.description}</p>
                  <img
                    src={selectedIssue.image}
                    alt={selectedIssue.title}
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
