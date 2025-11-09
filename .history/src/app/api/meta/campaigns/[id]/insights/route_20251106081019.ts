import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const datePreset = searchParams.get("date_preset") || "last_7d";

    // Buscar insights da campanha usando o MCP server
    const mcpResponse = await fetch("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server: "meta-marketing",
        tool: "get_campaign_insights",
        arguments: {
          campaign_id: campaignId,
          date_preset: datePreset,
        },
      }),
    });

    if (!mcpResponse.ok) {
      throw new Error("Erro ao buscar insights da campanha");
    }

    const mcpData = await mcpResponse.json();

    // Processar os dados para o formato esperado pelo frontend
    const insights = mcpData.data || [];
    
    // Transformar os insights em dados diários
    const dailyInsights = insights.map((insight: any) => {
      const date = new Date(insight.date_start);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      return {
        date: formattedDate,
        fullDate: insight.date_start,
        impressions: parseInt(insight.impressions || "0"),
        clicks: parseInt(insight.clicks || "0"),
        spend: parseFloat(insight.spend || "0"),
        reach: parseInt(insight.reach || "0"),
        cpc: parseFloat(insight.cpc || "0"),
        cpm: parseFloat(insight.cpm || "0"),
        ctr: parseFloat(insight.ctr || "0"),
      };
    });

    return NextResponse.json({
      daily_insights: dailyInsights,
      total: dailyInsights.length,
    });
  } catch (error) {
    console.error("Erro ao buscar insights da campanha:", error);
    return NextResponse.json(
      { error: "Erro ao buscar insights da campanha" },
      { status: 500 }
    );
  }
}
