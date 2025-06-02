import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Case } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, FileText, Gavel, Repeat, CheckCircle2 } from "lucide-react";

interface CaseCardProps {
  caseItem: Case;
}

const statusIcons: Record<Case["status"], React.ElementType> = {
  Administrative: FileText,
  Judicial: Gavel,
  Appeal: Repeat,
  Closed: CheckCircle2,
};

const statusColors: Record<Case["status"], string> = {
    Administrative: "bg-blue-500",
    Judicial: "bg-orange-500",
    Appeal: "bg-purple-500",
    Closed: "bg-green-500",
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
            {caseItem.status}
          </Badge>
        </div>
        <CardDescription className="font-body text-sm">Client: {caseItem.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="font-body text-sm text-muted-foreground mb-2 line-clamp-3">{caseItem.description}</p>
        <p className="font-body text-xs text-muted-foreground">Last Update: {new Date(caseItem.lastUpdate).toLocaleDateString()}</p>
        {caseItem.attorneyAssigned && (
          <p className="font-body text-xs text-muted-foreground">Attorney: {caseItem.attorneyAssigned}</p>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/documents?caseId=${caseItem.id}`} className="w-full">
          <Button variant="outline" className="w-full font-body">
            View Details & Documents <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
