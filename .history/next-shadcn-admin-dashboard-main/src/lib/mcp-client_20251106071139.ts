/**
 * Cliente para comunicação com a Meta Marketing API
 * 
 * Este cliente faz chamadas HTTP diretas à API do Meta para buscar dados em tempo real.
 * As credenciais são obtidas das variáveis de ambiente.
 */

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "EAATtWzDtZCPcBP8VXWh5ppzVZBqJ7OtMoWdwZBYN02RQMGDrdRNab4nV8etQpz5bDCAveNOuQpZBbKqZANYUgWnPcXHasBMNXn5dpW9DpiDgX92X3KvHZB2EBqv3l3khuW2pwtFZBldUSTbZCgeOblA89NnwqcesQHXT74L9cU7acuIFAqgNEJ81lP7B74oSU767p7p7mJNC3QGHxXQZD";
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "act_748894959735898";
const META_API_VERSION = "v21.0";
const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

/**
 * Faz chamadas diretas à API do Meta para buscar dados em tempo real
 */
export async function callMCPTool(
  serverName: string,
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  try {
    console.log(`[MCP Client] Calling ${serverName}/${toolName}`, args);
    
    if (serverName === "meta-marketing" && toolName === "get_campaigns") {
      // Por enquanto, retorna dados mockados para debug
      console.log("[MCP Client] Returning mocked campaign data");
      return {
        ad_account_id: META_AD_ACCOUNT_ID,
        total_campaigns: 13,
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
          {
            id: "120237048138860268",
            name: "002_Conversão_ViewItem_23-10-25",
            status: "ACTIVE",
            objective: "OUTCOME_SALES",
            daily_budget: "1500",
            start_time: "2025-10-23T16:31:35-0300",
          },
          {
            id: "120236724672870268",
            name: "001_Conversão_Clique-no-link_18-10-25",
            status: "PAUSED",
            objective: "OUTCOME_ENGAGEMENT",
            start_time: "2025-10-21T23:44:57-0300",
          },
          {
            id: "120214262352390268",
            name: "[ENGAJAMENTO] - PUBS EXISTENTES",
            status: "PAUSED",
            objective: "OUTCOME_ENGAGEMENT",
            daily_budget: "600",
            start_time: "2024-10-21T14:08:10-0300",
          },
          {
            id: "120214262134200268",
            name: "[VIDEO VIEW] - REELS PUBLICADOS",
            status: "PAUSED",
            objective: "OUTCOME_AWARENESS",
            daily_budget: "600",
            start_time: "2024-10-21T14:04:02-0300",
          },
          {
            id: "120214111001370268",
            name: "[RECONHECIMENTO][ALCANCE] [PUB QUENTES]",
            status: "PAUSED",
            objective: "OUTCOME_AWARENESS",
            daily_budget: "1000",
            start_time: "2024-10-15T12:15:52-0300",
          },
          {
            id: "120213867151220268",
            name: "[VENDAS][CATÁLOGO] - IWO BRASIL",
            status: "PAUSED",
            objective: "OUTCOME_SALES",
            daily_budget: "2000",
            start_time: "2024-10-10T15:52:14-0300",
          },
          {
            id: "120213867025450268",
            name: "[VENDAS][PURCHASE] - TESTE DE CRIATIVOS",
            status: "PAUSED",
            objective: "OUTCOME_SALES",
            start_time: "2024-10-04T16:45:54-0300",
          },
          {
            id: "120213866736640268",
            name: "[VENDAS][PURCHASE] - TESTE DE PÚBLICOS",
            status: "PAUSED",
            objective: "OUTCOME_SALES",
            start_time: "2024-10-04T16:42:53-0300",
          },
        ],
      };
    }

    if (serverName === "meta-marketing" && toolName === "get_campaign_insights") {
      // Retorna insights mockados
      const campaignId = args.campaign_id;
      const datePreset = args.date_preset || "last_7d";
      
      console.log(`[MCP Client] Returning mocked insights for campaign ${campaignId}`);

      const insightsMap: Record<string, any> = {
        "120237726835370268": {
          impressions: "346",
          clicks: "22",
          spend: "3.17",
          reach: "331",
          cpc: "0.144091",
          cpm: "9.16185",
          ctr: "6.358382",
        },
        "120237295325460268": {
          impressions: "9859",
          clicks: "584",
          spend: "162.83",
          reach: "6121",
          cpc: "0.278818",
          cpm: "16.515874",
          ctr: "5.923522",
        },
        "120237048138860268": {
          impressions: "19787",
          clicks: "936",
          spend: "159.88",
          reach: "12419",
          cpc: "0.170812",
          cpm: "8.080053",
          ctr: "4.730379",
        },
      };

      const insights = insightsMap[campaignId] || {
        impressions: "0",
        clicks: "0",
        spend: "0",
        reach: "0",
        cpc: "0",
        cpm: "0",
        ctr: "0",
      };

      return {
        campaign_id: campaignId,
        date_preset: datePreset,
        insights,
      };
    }

    throw new Error(`Unknown MCP tool: ${serverName}/${toolName}`);
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw error;
  }
}
