import { MetaCampaignsTable } from "./_components/meta-campaigns-table";
import { MetaOverviewCards } from "./_components/meta-overview-cards";
import { CampaignPerformanceChart } from "./_components/campaign-performance-chart";
import { getMetaCampaigns, getAggregatedInsights } from "./_actions/meta-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MetaPage() {
  // Busca dados do servidor
  const [campaignsData, insightsData] = await Promise.all([
    getMetaCampaigns(25),
    getAggregatedInsights(),
  ]);

  const activeCampaigns = campaignsData.campaigns.filter((c) => c.status === "ACTIVE");
  const pausedCampaigns = campaignsData.campaigns.filter((c) => c.status === "PAUSED");

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

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Desempenho</CardTitle>
          <CardDescription>
            Acompanhe as principais métricas das suas campanhas em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignPerformanceChart />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todas ({campaignsData.campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Ativas ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Pausadas ({pausedCampaigns.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <MetaCampaignsTable campaigns={campaignsData.campaigns} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <MetaCampaignsTable campaigns={activeCampaigns} />
        </TabsContent>
        <TabsContent value="paused" className="mt-4">
          <MetaCampaignsTable campaigns={pausedCampaigns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
