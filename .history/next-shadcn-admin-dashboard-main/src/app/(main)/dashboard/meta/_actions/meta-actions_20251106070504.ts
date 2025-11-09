"use server";

import { callMCPTool } from "@/lib/mcp-client";

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface MetaCampaignInsights {
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
}

interface CampaignsResponse {
  ad_account_id: string;
  total_campaigns: number;
  campaigns: MetaCampaign[];
}

interface CampaignInsightsResponse {
  campaign_id: string;
  date_preset: string;
  insights: MetaCampaignInsights;
}

export async function getMetaCampaigns(limit: number = 25, status?: string) {
  try {
    // Chama o servidor MCP para buscar campanhas reais
    const data = await callMCPTool("meta-marketing", "get_campaigns", {
      limit,
      status,
    });

    return data as CampaignsResponse;
  } catch (error) {
    console.error("Error fetching Meta campaigns:", error);
    throw error;
  }
}

export async function getCampaignInsights(
  campaignId: string,
  datePreset: string = "last_30d"
) {
  try {
    // Chama o servidor MCP para buscar insights reais
    const data = await callMCPTool("meta-marketing", "get_campaign_insights", {
      campaign_id: campaignId,
      date_preset: datePreset,
    });

    return data as CampaignInsightsResponse;
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    return null;
  }
}

export async function getAggregatedInsights() {
  try {
    // Busca campanhas ativas em tempo real
    const campaignsData = await getMetaCampaigns(100);
    const activeCampaigns = campaignsData.campaigns.filter((c) => c.status === "ACTIVE");

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    // Busca insights de cada campanha ativa em tempo real
    for (const campaign of activeCampaigns) {
      try {
        const insights = await getCampaignInsights(campaign.id, "last_7d");
        if (insights?.insights) {
          totalSpend += parseFloat(insights.insights.spend || "0");
          totalImpressions += parseInt(insights.insights.impressions || "0");
          totalClicks += parseInt(insights.insights.clicks || "0");
        }
      } catch (error) {
        console.error(`Error fetching insights for campaign ${campaign.id}:`, error);
        // Continua com as outras campanhas
      }
    }

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalSpend: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalSpend),
      totalImpressions: formatNumber(totalImpressions),
      totalClicks: formatNumber(totalClicks),
      avgCTR: `${avgCTR.toFixed(2)}%`,
    };
  } catch (error) {
    console.error("Error fetching aggregated insights:", error);
    // Retorna dados zerados em caso de erro
    return {
      totalSpend: "R$ 0,00",
      totalImpressions: "0",
      totalClicks: "0",
      avgCTR: "0%",
    };
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
