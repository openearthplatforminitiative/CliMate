import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MenuButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
}

export const MenuButton = ({ className }: MenuButtonProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={cn("top-4 right-4 z-10", className)}>Menu</Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#F5FFF4]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>TODO: User/login, reports/status</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
