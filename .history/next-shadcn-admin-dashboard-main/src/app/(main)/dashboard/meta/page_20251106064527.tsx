import { Suspense } from "react";
import { MetaCampaignsTable } from "./_components/meta-campaigns-table";
import { MetaOverviewCards } from "./_components/meta-overview-cards";

export default function MetaPage() {
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

      <Suspense fallback={<div>Carregando...</div>}>
        <MetaOverviewCards />
      </Suspense>

      <Suspense fallback={<div>Carregando campanhas...</div>}>
        <MetaCampaignsTable />
      </Suspense>
    </div>
  );
}
