
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Case, CaseStatus } from "@/types";
import Link from "next/link";
import { ArrowRight, FileText, Gavel } from "lucide-react";

interface CaseCardProps {
  caseItem: Case;
}

// Icons and translations for CaseStatus (Type: Judicial/Administrative)
const caseTypeIcons: Record<CaseStatus, React.ElementType> = {
  Administrative: FileText,
  Judicial: Gavel,
};

const caseTypeTranslations: Record<CaseStatus, string> = {
  Administrative: "Administrativo",
  Judicial: "Judicial",
};

export default function CaseCard({ caseItem }: CaseCardProps) {
  const TypeIcon = caseTypeIcons[caseItem.status];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1">{caseItem.caseNumber}</CardTitle>
          {caseItem.state === 'Abierto' ? (
            <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white font-semibold text-base" title="Abierto">A</div>
          ) : (
            <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full text-white font-semibold text-base" title="Cerrado">C</div>
          )}
        </div>
        <CardDescription className="font-body text-sm">Cliente: {caseItem.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <TypeIcon className="mr-1 h-4 w-4" />
          <span>Tipo: {caseTypeTranslations[caseItem.status]}</span>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-2 line-clamp-3">{caseItem.description}</p>
        <p className="font-body text-xs text-muted-foreground">Última Actualización: {new Date(caseItem.lastUpdate).toLocaleDateString('es-ES')}</p>
        {caseItem.attorneyAssigned && (
          <p className="font-body text-xs text-muted-foreground">Abogado/a: {caseItem.attorneyAssigned}</p>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/documents?caseId=${caseItem.id}`} className="w-full">
          <Button variant="outline" className="w-full font-body">
            Ver Detalles y Documentos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
