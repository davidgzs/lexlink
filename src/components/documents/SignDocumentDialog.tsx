
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Document } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Signature } from "lucide-react";

interface SignDocumentDialogProps {
  documentToSign: Document | null;
  onClose: () => void;
  onDocumentSigned: (documentId: string) => void; // This prop might become unused or repurposed if no actual signing occurs
}

export default function SignDocumentDialog({ documentToSign, onClose, onDocumentSigned }: SignDocumentDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDemoInfoAlert, setShowDemoInfoAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (documentToSign) {
      setIsOpen(true);
      setAgreed(false); // Reset agreement on new document
      setShowDemoInfoAlert(false); // Reset demo alert
    } else {
      setIsOpen(false);
    }
  }, [documentToSign]);

  const handleSignAttempt = () => {
    if (!documentToSign) return;
    if (!agreed) {
      toast({
        title: "Se Requiere Aceptación",
        description: "Debes aceptar los términos antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    // Directamente mostrar la alerta informativa de demostración
    setShowDemoInfoAlert(true);
  };

  // Esta función se llama al pulsar "OK" en la alerta de demostración
  const handleCloseDemoInfoAlert = () => {
    setShowDemoInfoAlert(false); // Cerrar la alerta de demostración
    handleDialogClose(); // Cerrar el diálogo principal de firma
    // No se llama a onDocumentSigned, no se muestra toast de éxito.
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  if (!documentToSign) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px] font-body">
          <DialogHeader>
            <DialogTitle className="font-headline">Firmar Documento: {documentToSign.name}</DialogTitle>
            <DialogDescription>
              Por favor, revisa el resumen del documento a continuación y confirma tu firma. Esta es una acción legalmente vinculante (simulada).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
              <p className="font-medium">Vista Previa del Documento (Ejemplo)</p>
              <div className="border rounded-md p-4 h-64 overflow-y-auto bg-muted/50">
                  <Image src="https://placehold.co/500x300.png/EFEFEF/AAAAAA?text=Contenido+del+Documento" alt="Vista previa del documento" width={500} height={300} data-ai-hint="document preview" />
                  <p className="text-sm mt-2">Esto es un ejemplo del contenido real del documento. En una aplicación real, el documento se mostraría aquí.</p>
              </div>

              <div className="flex items-center space-x-2 mt-6">
                  <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      He revisado este documento y acepto firmarlo electrónicamente.
                  </Label>
              </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleDialogClose}>Cancelar</Button>
            <Button type="button" onClick={handleSignAttempt} disabled={!agreed} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Signature className="mr-2 h-4 w-4" /> Firmar Electrónicamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDemoInfoAlert} onOpenChange={setShowDemoInfoAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Funcionalidad de Demostración</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Esta funcionalidad de firma electrónica es una simulación para demostración. Al pulsar "OK", este diálogo se cerrará y no se realizará ninguna acción de firma real sobre el documento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseDemoInfoAlert} className="font-body">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
