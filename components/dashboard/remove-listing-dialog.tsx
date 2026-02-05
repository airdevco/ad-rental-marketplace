"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RemoveListingDialogProps = {
  listingTitle: string;
  children: React.ReactNode;
};

export function RemoveListingDialog({ listingTitle, children }: RemoveListingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove listing?</DialogTitle>
          <DialogDescription>
            This will remove &quot;{listingTitle}&quot; from the marketplace. You can add it again later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Remove listing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
