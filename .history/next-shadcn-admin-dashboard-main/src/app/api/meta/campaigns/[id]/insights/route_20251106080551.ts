import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const datePreset = searchParams.get("date_preset") || "last_7d";

    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = process.env.META_API_VERSION || "v21.0";

    if (!accessToken) {
      return NextResponse.json(
        { error: "META_ACCESS_TOKEN não configurado" },
        { status: 500 }
      );
    }

    // Buscar insights com breakdown por dia
    const insightsUrl = `https://graph.facebook.com/${apiVersion}/${campaignId}/insights?fields=impressions,clicks,spend,reach,cpc,cpm,ctr&date_preset=${datePreset}&time_increment=1&access_token=${accessToken}`;

    const response = await fetch(insightsUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar insights da campanha:", errorData);
      return NextResponse.json(
        { error: "Erro ao buscar insights da campanha", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Formatar os dados para o gráfico
    const formattedData = data.data.map((insight: any) => {
      const date = new Date(insight.date_start);
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

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

    // Calcular totais
    const totals = formattedData.reduce(
      (acc: any, day: any) => ({
        impressions: acc.impressions + day.impressions,
        clicks: acc.clicks + day.clicks,
        spend: acc.spend + day.spend,
        reach: Math.max(acc.reach, day.reach), // Reach é único, não soma
        cpc: 0, // Será calculado depois
        cpm: 0, // Será calculado depois
        ctr: 0, // Será calculado depois
      }),
      { impressions: 0, clicks: 0, spend: 0, reach: 0, cpc: 0, cpm: 0, ctr: 0 }
    );

    // Calcular médias
    if (totals.clicks > 0) {
      totals.cpc = totals.spend / totals.clicks;
    }
    if (totals.impressions > 0) {
      totals.cpm = (totals.spend / totals.impressions) * 1000;
      totals.ctr = (totals.clicks / totals.impressions) * 100;
    }

    return NextResponse.json({
      campaign_id: campaignId,
      date_preset: datePreset,
      daily_insights: formattedData,
      totals: totals,
    });
  } catch (error) {
    console.error("Erro ao processar insights:", error);
    return NextResponse.json(
      { error: "Erro ao processar insights da campanha" },
      { status: 500 }
    );
  }
}
