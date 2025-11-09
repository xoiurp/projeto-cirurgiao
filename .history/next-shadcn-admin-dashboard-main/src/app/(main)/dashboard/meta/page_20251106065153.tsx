import { MetaCampaignsTable } from "./_components/meta-campaigns-table";
import { MetaOverviewCards } from "./_components/meta-overview-cards";
import { getMetaCampaigns, getAggregatedInsights } from "./_actions/meta-actions";

export default async function MetaPage() {
  // Busca dados do servidor
  const [campaignsData, insightsData] = await Promise.all([
    getMetaCampaigns(25),
    getAggregatedInsights(),
  ]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meta Marketing</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas e produtos do Facebook e Instagram
          </p>
        </div>
      </div>

      <MetaOverviewCards insights={insightsData} />
      <MetaCampaignsTable campaigns={campaignsData.campaigns} />
    </div>
  );
}
