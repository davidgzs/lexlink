
import type { Document, DocumentStatus } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertTriangle, PenSquare, Download, Eye } from "lucide-react";

interface DocumentListItemProps {
  document: Document;
  onSign: (document: Document) => void;
}

const statusIcons: Record<DocumentStatus, React.ElementType> = {
  "Pendiente de Firma": AlertTriangle,
  "Firmado": CheckCircle2,
  "Requiere Revisión": AlertTriangle,
  "Completado": CheckCircle2,
};

const statusColors: Record<DocumentStatus, string> = {
    "Pendiente de Firma": "bg-yellow-500",
    "Firmado": "bg-green-500",
    "Requiere Revisión": "bg-orange-500",
    "Completado": "bg-blue-500",
};

// documentStatusTranslations is no longer needed as document.status will be Spanish
// const documentStatusTranslations: Record<Document["status"], string> = {
//   "Pendiente de Firma": "Pendiente de Firma",
//   "Firmado": "Firmado",
//   "Requiere Revisión": "Requiere Revisión",
//   "Completado": "Completado",
// };

export default function DocumentListItem({ document, onSign }: DocumentListItemProps) {
  const Icon = statusIcons[document.status];
  const badgeColor = statusColors[document.status];

  const formattedUploadedDate = new Date(document.uploadedDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline text-lg">{document.name}</CardTitle>
          </div>
          <Badge className={`${badgeColor} text-white whitespace-nowrap`}>
            <Icon className="mr-1 h-3 w-3" />
            {document.status} {/* Directly use document.status as it's now in Spanish */}
          </Badge>
        </div>
        <CardDescription className="font-body text-sm">ID Caso: {document.caseId} | Versión: {document.version}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="font-body text-xs text-muted-foreground">Subido: {formattedUploadedDate}</p>
        {document.status === "Pendiente de Firma" && (
          <Button
            size="sm"
            onClick={() => onSign(document)}
            className="font-body bg-accent hover:bg-accent/90 text-accent-foreground w-full mt-4"
          >
            <PenSquare className="mr-2 h-4 w-4" /> Firmar Documento
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        <Button variant="outline" size="sm" className="font-body" onClick={() => alert('Ver documento: ' + document.name)}>
          <Eye className="mr-2 h-4 w-4" /> Ver
        </Button>
        <Button variant="outline" size="sm" className="font-body" onClick={() => alert('Descargar documento: ' + document.name)}>
          <Download className="mr-2 h-4 w-4" /> Descargar
        </Button>
      </CardFooter>
    </Card>
  );
}
