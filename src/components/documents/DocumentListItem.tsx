
import type { Document } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertTriangle, PenSquare, Download, Eye } from "lucide-react";

interface DocumentListItemProps {
  document: Document;
  onSign: (document: Document) => void;
}

const statusIcons: Record<Document["status"], React.ElementType> = {
  "Awaiting Signature": AlertTriangle,
  "Signed": CheckCircle2,
  "Requires Review": AlertTriangle,
  "Completed": CheckCircle2,
};

const statusColors: Record<Document["status"], string> = {
    "Awaiting Signature": "bg-yellow-500",
    "Signed": "bg-green-500",
    "Requires Review": "bg-orange-500",
    "Completed": "bg-blue-500",
};

const documentStatusTranslations: Record<Document["status"], string> = {
  "Awaiting Signature": "Pendiente de Firma",
  "Signed": "Firmado",
  "Requires Review": "Requiere Revisión",
  "Completed": "Completado",
};

export default function DocumentListItem({ document, onSign }: DocumentListItemProps) {
  const Icon = statusIcons[document.status];
  const badgeColor = statusColors[document.status];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline text-lg">{document.name}</CardTitle>
          </div>
          <Badge className={`${badgeColor} text-white whitespace-nowrap`}>
            <Icon className="mr-1 h-3 w-3" />
            {documentStatusTranslations[document.status]}
          </Badge>
        </div>
        <CardDescription className="font-body text-sm">ID Caso: {document.caseId} | Versión: {document.version}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-body text-xs text-muted-foreground">Subido: {new Date(document.uploadedDate).toLocaleDateString('es-ES')}</p>
      </CardContent>
      <CardFooter className="flex justify-end flex-wrap gap-2">
        <Button variant="outline" size="sm" className="font-body" onClick={() => alert('Ver documento: ' + document.name)}>
          <Eye className="mr-2 h-4 w-4" /> Ver
        </Button>
        <Button variant="outline" size="sm" className="font-body" onClick={() => alert('Descargar documento: ' + document.name)}>
          <Download className="mr-2 h-4 w-4" /> Descargar
        </Button>
        {document.status === "Awaiting Signature" && (
          <Button size="sm" onClick={() => onSign(document)} className="font-body bg-accent hover:bg-accent/90 text-accent-foreground">
            <PenSquare className="mr-2 h-4 w-4" /> Firmar Documento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

