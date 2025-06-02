"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Document } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Signature } from "lucide-react";

interface SignDocumentDialogProps {
  documentToSign: Document | null;
  onClose: () => void;
  onDocumentSigned: (documentId: string) => void;
}

export default function SignDocumentDialog({ documentToSign, onClose, onDocumentSigned }: SignDocumentDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (documentToSign) {
      setIsOpen(true);
      setAgreed(false); // Reset agreement on new document
    } else {
      setIsOpen(false);
    }
  }, [documentToSign]);

  const handleSign = () => {
    if (!documentToSign) return;
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms before signing.",
        variant: "destructive",
      });
      return;
    }
    onDocumentSigned(documentToSign.id);
    toast({
      title: "Document Signed",
      description: `"${documentToSign.name}" has been successfully signed.`,
    });
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  if (!documentToSign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] font-body">
        <DialogHeader>
          <DialogTitle className="font-headline">Sign Document: {documentToSign.name}</DialogTitle>
          <DialogDescription>
            Please review the document summary below and confirm your signature. This is a legally binding action.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <p className="font-medium">Document Preview (Placeholder)</p>
            <div className="border rounded-md p-4 h-64 overflow-y-auto bg-muted/50">
                <Image src="https://placehold.co/500x300.png/EFEFEF/AAAAAA?text=Document+Content" alt="Document Preview" width={500} height={300} data-ai-hint="document preview" />
                <p className="text-sm mt-2">This is a placeholder for the actual document content. In a real application, the document would be rendered here.</p>
            </div>

            <div className="flex items-center space-x-2 mt-6">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I have reviewed this document and agree to electronically sign it.
                </Label>
            </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
          <Button type="button" onClick={handleSign} disabled={!agreed} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Signature className="mr-2 h-4 w-4" /> Sign Electronically
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
