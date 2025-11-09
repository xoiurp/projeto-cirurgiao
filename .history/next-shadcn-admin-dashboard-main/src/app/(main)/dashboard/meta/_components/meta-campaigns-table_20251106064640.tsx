"use client";

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
  start_time?: string;
}

export function MetaCampaignsTable() {
  // Em produção, esses dados viriam da API do Meta via server action
  const campaigns: Campaign[] = [
    {
      id: "120237726835370268",
      name: "004_Conversão_AddToCart_04-11-25",
      status: "ACTIVE",
      objective: "OUTCOME_SALES",
      daily_budget: "1500",
      start_time: "2025-11-04T19:30:54-0300",
    },
    {
      id: "120237422425370268",
      name: "007_Purchase_Catálogo_29-10-25",
      status: "PAUSED",
      objective: "OUTCOME_SALES",
      daily_budget: "2500",
      start_time: "2025-10-29T21:20:03-0300",
    },
    {
      id: "120237347775840268",
      name: "005_Tráfego Site_28-10-2025",
      status: "PAUSED",
      objective: "OUTCOME_TRAFFIC",
      daily_budget: "1000",
      start_time: "2025-10-28T19:06:33-0300",
    },
    {
      id: "120237295325460268",
      name: "008_Conversão_InitiateCheckout_04-11-25",
      status: "ACTIVE",
      objective: "OUTCOME_SALES",
      daily_budget: "1500",
      start_time: "2025-10-27T21:08:12-0300",
    },
    {
      id: "120237294847490268",
      name: "003_Conversão_Purchase_27-10-25",
      status: "PAUSED",
      objective: "OUTCOME_SALES",
      daily_budget: "2500",
      start_time: "2025-10-27T21:03:02-0300",
    },
  ];

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
                <TableHead>Orçamento Diário</TableHead>
                <TableHead>Data de Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{getObjectiveLabel(campaign.objective)}</TableCell>
                  <TableCell>{formatBudget(campaign.daily_budget)}</TableCell>
                  <TableCell>{formatDate(campaign.start_time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
