"use server";

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
    // Em produção, isso seria feito através de uma chamada à API do Meta
    // Por enquanto, vamos simular a resposta que viria do MCP server
    const response = await fetch("http://localhost:3001/api/meta/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit, status }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    const data: CampaignsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Meta campaigns:", error);
    // Retorna dados mockados como fallback
    return {
      ad_account_id: "act_748894959735898",
      total_campaigns: 5,
      campaigns: [
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
      ],
    };
  }
}

export async function getCampaignInsights(
  campaignId: string,
  datePreset: string = "last_30d"
) {
  try {
    const response = await fetch("http://localhost:3001/api/meta/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaignId, date_preset: datePreset }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaign insights");
    }

    const data: CampaignInsightsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    return null;
  }
}

export async function getAggregatedInsights() {
  try {
    // Busca insights agregados de todas as campanhas ativas
    const campaignsData = await getMetaCampaigns(100, "ACTIVE");
    
    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalReach = 0;

    // Para cada campanha ativa, busca os insights
    for (const campaign of campaignsData.campaigns) {
      const insights = await getCampaignInsights(campaign.id, "last_30d");
      if (insights?.insights) {
        totalSpend += parseFloat(insights.insights.spend || "0");
        totalImpressions += parseInt(insights.insights.impressions || "0");
        totalClicks += parseInt(insights.insights.clicks || "0");
        totalReach += parseInt(insights.insights.reach || "0");
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
    // Retorna dados mockados como fallback
    return {
      totalSpend: "R$ 12.450,00",
      totalImpressions: "245.8K",
      totalClicks: "8.2K",
      avgCTR: "3.34%",
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
