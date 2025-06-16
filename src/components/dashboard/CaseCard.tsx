
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Case, CaseStatus } from "@/types";
import Link from "next/link";
import { ArrowRight, FileText, Gavel } from "lucide-react";

interface CaseCardProps {
  caseItem: Case;
}

const caseBaseTypeIcons: Record<CaseStatus, React.ElementType> = {
  Administrativo: FileText,
  Judicial: Gavel,
};

export default function CaseCard({ caseItem }: CaseCardProps) {
  const TypeIcon = caseBaseTypeIcons[caseItem.status]; // Icon based on base type
  const displayType = caseItem.subtype ? `${caseItem.status} - ${caseItem.subtype}` : caseItem.status;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          {caseItem.state === 'Abierto' ? (
            <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white font-semibold text-base shrink-0" title="Abierto">A</div>
          ) : (
            <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full text-white font-semibold text-base shrink-0" title="Cerrado">C</div>
          )}
          <CardTitle className="font-headline text-xl">{caseItem.caseNumber}</CardTitle>
        </div>
        <CardDescription className="font-body text-sm">Cliente: {caseItem.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <TypeIcon className="mr-1 h-4 w-4" />
          <span>Tipo: {displayType}</span>
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
