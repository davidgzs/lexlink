
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Case, CaseStatus } from "@/types"; // Import CaseStatus
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, FileText, Gavel, CheckCircle2 } from "lucide-react"; // Removed Repeat

interface CaseCardProps {
  caseItem: Case;
}

const statusIcons: Record<CaseStatus, React.ElementType> = { // Use CaseStatus type
  Administrative: FileText,
  Judicial: Gavel,
  Closed: CheckCircle2,
  // "Appeal" was removed
};

const statusColors: Record<CaseStatus, string> = { // Use CaseStatus type
    Administrative: "bg-blue-500",
    Judicial: "bg-orange-500",
    Closed: "bg-green-500",
    // "Appeal" was removed
};

const caseStatusTranslations: Record<CaseStatus, string> = { // Use CaseStatus type
  Administrative: "Administrativo",
  Judicial: "Judicial",
  Closed: "Cerrado",
  // "Appeal" was removed
};

export default function CaseCard({ caseItem }: CaseCardProps) {
  const Icon = statusIcons[caseItem.status];
  const badgeColor = statusColors[caseItem.status];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1">{caseItem.caseNumber}</CardTitle>
          <Badge className={`${badgeColor} text-white whitespace-nowrap`}>
            <Icon className="mr-1 h-3 w-3" />
            {caseStatusTranslations[caseItem.status]}
          </Badge>
        </div>
        <CardDescription className="font-body text-sm">Cliente: {caseItem.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
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
