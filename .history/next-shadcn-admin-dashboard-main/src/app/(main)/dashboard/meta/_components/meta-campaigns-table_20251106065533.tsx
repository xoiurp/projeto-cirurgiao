import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface CampaignWithInsights extends Campaign {
  insights?: {
    impressions?: string;
    clicks?: string;
    spend?: string;
    ctr?: string;
    cpc?: string;
  };
}

interface MetaCampaignsTableProps {
  campaigns: Campaign[];
}

export function MetaCampaignsTable({ campaigns }: MetaCampaignsTableProps) {

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: "default",
      PAUSED: "secondary",
      DELETED: "destructive",
      ARCHIVED: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status === "ACTIVE" ? "Ativa" : status === "PAUSED" ? "Pausada" : status}
      </Badge>
    );
  };

  const getObjectiveLabel = (objective?: string) => {
    const labels: Record<string, string> = {
      OUTCOME_SALES: "Vendas",
      OUTCOME_TRAFFIC: "Tráfego",
      OUTCOME_AWARENESS: "Reconhecimento",
      OUTCOME_ENGAGEMENT: "Engajamento",
      OUTCOME_LEADS: "Leads",
    };

    return objective ? labels[objective] || objective : "-";
  };

  const formatBudget = (budget?: string) => {
    if (!budget) return "-";
    const value = parseInt(budget) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas Ativas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Impressões</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>CPC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                // Simula insights para cada campanha (em produção viria da API)
                const mockInsights = {
                  impressions: Math.floor(Math.random() * 50000 + 10000).toString(),
                  clicks: Math.floor(Math.random() * 2000 + 200).toString(),
                  spend: (Math.random() * 500 + 100).toFixed(2),
                  ctr: (Math.random() * 5 + 1).toFixed(2),
                  cpc: (Math.random() * 5 + 1).toFixed(2),
                };

                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {campaign.name}
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{getObjectiveLabel(campaign.objective)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {formatBudget(campaign.daily_budget)}
                        </span>
                        <span className="text-xs text-muted-foreground">diário</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {parseInt(mockInsights.impressions).toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {parseInt(mockInsights.clicks).toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(mockInsights.spend))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{mockInsights.ctr}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(mockInsights.cpc))}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
