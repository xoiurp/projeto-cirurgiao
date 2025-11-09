"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Smartphone } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface Insights {
  impressions?: string;
  reach?: string;
}

interface CampaignAudienceTabProps {
  campaign: Campaign;
  insights?: Insights;
}

export function CampaignAudienceTab({ campaign, insights }: CampaignAudienceTabProps) {
  // Dados simulados para demonstração (em produção, viriam da API)
  const ageData = [
    { name: "18-24", value: 15, color: "#8884d8" },
    { name: "25-34", value: 35, color: "#82ca9d" },
    { name: "35-44", value: 28, color: "#ffc658" },
    { name: "45-54", value: 15, color: "#ff8042" },
    { name: "55+", value: 7, color: "#a4de6c" },
  ];

  const genderData = [
    { name: "Feminino", value: 58, color: "#ff69b4" },
    { name: "Masculino", value: 40, color: "#4169e1" },
    { name: "Não especificado", value: 2, color: "#9370db" },
  ];

  const locationData = [
    { city: "São Paulo", percentage: 35, impressions: 120 },
    { city: "Rio de Janeiro", percentage: 22, impressions: 76 },
    { city: "Belo Horizonte", percentage: 15, impressions: 52 },
    { city: "Brasília", percentage: 12, impressions: 41 },
    { city: "Curitiba", percentage: 8, impressions: 28 },
    { city: "Outros", percentage: 8, impressions: 29 },
  ];

  const deviceData = [
    { name: "Mobile", value: 72, color: "#10b981" },
    { name: "Desktop", value: 25, color: "#3b82f6" },
    { name: "Tablet", value: 3, color: "#f59e0b" },
  ];

  const platformData = [
    { platform: "Instagram Feed", percentage: 45 },
    { platform: "Instagram Stories", percentage: 28 },
    { platform: "Facebook Feed", percentage: 18 },
    { platform: "Facebook Stories", percentage: 9 },
  ];

  return (
    <div className="space-y-4">
      {/* Resumo de Alcance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumo de Alcance
          </CardTitle>
          <CardDescription>
            Quantas pessoas únicas viram seus anúncios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Alcance Total</p>
              <p className="text-3xl font-bold">
                {insights?.reach
                  ? parseInt(insights.reach).toLocaleString("pt-BR")
                  : "0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Impressões</p>
              <p className="text-3xl font-bold">
                {insights?.impressions
                  ? parseInt(insights.impressions).toLocaleString("pt-BR")
                  : "0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Frequência Média</p>
              <p className="text-3xl font-bold">
                {insights?.impressions && insights?.reach
                  ? (
                      parseInt(insights.impressions) / parseInt(insights.reach)
                    ).toFixed(2)
                  : "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Demográficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Idade</CardTitle>
            <CardDescription>Faixa etária do público alcançado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Gênero</CardTitle>
            <CardDescription>Composição de gênero do público</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Localização Geográfica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Principais Localizações
          </CardTitle>
          <CardDescription>
            Cidades com maior alcance da campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{location.city}</span>
                  <span className="text-sm text-muted-foreground">
                    {location.percentage}% ({location.impressions.toLocaleString("pt-BR")}{" "}
                    impressões)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${location.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dispositivos e Plataformas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Dispositivos
            </CardTitle>
            <CardDescription>Tipo de dispositivo usado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plataformas</CardTitle>
            <CardDescription>Onde os anúncios foram exibidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{platform.platform}</span>
                    <span className="text-sm font-bold">{platform.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
