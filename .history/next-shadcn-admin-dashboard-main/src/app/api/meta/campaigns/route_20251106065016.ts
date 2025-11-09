import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 25, status } = body;

    // Aqui você chamaria o servidor MCP diretamente
    // Por enquanto, vamos simular a chamada retornando dados reais da sua conta
    
    // Em um ambiente de produção, você faria algo como:
    // const mcpResponse = await callMCPServer('meta-marketing', 'get_campaigns', { limit, status });
    
    // Como o MCP server roda localmente e não pode ser chamado diretamente do navegador,
    // você precisaria de um proxy server-side ou usar server actions do Next.js
    
    // Por enquanto, retornamos os dados que sabemos que existem na sua conta
    const campaigns = [
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

    const filteredCampaigns = status
      ? campaigns.filter((c) => c.status === status)
      : campaigns;

    return NextResponse.json({
      ad_account_id: "act_748894959735898",
      total_campaigns: filteredCampaigns.length,
      campaigns: filteredCampaigns.slice(0, limit),
    });
  } catch (error) {
    console.error("Error in campaigns API:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
