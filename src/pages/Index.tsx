
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

const Index = () => {
  // Datos del análisis financiero
  const financialData = [
    { year: 2024, sales: 2454919, pac: 800058, rent: 281579, serviceFees: 122746, soi: 142198, cashflow: 202809, freeCF: 234287 },
    { year: 2025, sales: 2528566, pac: 809141, rent: 290027, serviceFees: 126428, soi: 136729, cashflow: 197341, freeCF: 228819 },
    { year: 2026, sales: 2604423, pac: 833415, rent: 298727, serviceFees: 130221, soi: 146052, cashflow: 206664, freeCF: 238141 },
    { year: 2027, sales: 2682556, pac: 858418, rent: 307689, serviceFees: 134128, soi: 155691, cashflow: 216303, freeCF: 247780 },
    { year: 2028, sales: 2763033, pac: 884170, rent: 316920, serviceFees: 138152, soi: 165657, cashflow: 226268, freeCF: 257746 },
    { year: 2029, sales: 2845924, pac: 910696, rent: 326427, serviceFees: 142296, soi: 175959, cashflow: 236571, freeCF: 268049 },
    { year: 2030, sales: 2931301, pac: 938016, rent: 336220, serviceFees: 146565, soi: 186610, cashflow: 247221, freeCF: 278699 },
    { year: 2031, sales: 3019240, pac: 966157, rent: 346307, serviceFees: 150962, soi: 197619, cashflow: 258230, freeCF: 289708 },
    { year: 2032, sales: 3109817, pac: 995142, rent: 356696, serviceFees: 155491, soi: 208998, cashflow: 269609, freeCF: 301087 },
    { year: 2033, sales: 3203112, pac: 1024996, rent: 367397, serviceFees: 160156, soi: 220758, cashflow: 281370, freeCF: 312847 }
  ];

  const keyMetrics = {
    currentPrice: 1242206,
    discountRate: 21,
    salesGrowth: 3,
    inflation: 1.5,
    franchiseYears: 20,
    contractEnd: "28/09/2026"
  };

  const costBreakdown = [
    { name: 'P.A.C.', value: 32, color: '#8884d8' },
    { name: 'Alquiler', value: 11.47, color: '#82ca9d' },
    { name: 'Service Fees', value: 5, color: '#ffc658' },
    { name: 'Depreciación', value: 2.94, color: '#ff7300' },
    { name: 'Otros Gastos', value: 6.39, color: '#00ff00' },
    { name: 'Margen S.O.I.', value: 42.2, color: '#0088fe' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-ES').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Análisis Financiero - McDonald's Parc Central
          </h1>
          <p className="text-lg text-gray-600">
            Valoración y Proyecciones Financieras 2024-2043
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Valoración</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(keyMetrics.currentPrice)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Precio actual estimado</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tasa Descuento</CardTitle>
              <Percent className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {keyMetrics.discountRate}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Tasa de descuento aplicada</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Crecimiento Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {keyMetrics.salesGrowth}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Anual proyectado</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Años Restantes</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {keyMetrics.franchiseYears}
              </div>
              <p className="text-xs text-gray-500 mt-1">Contrato franquicia</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-sm">Resumen</TabsTrigger>
            <TabsTrigger value="projections" className="text-sm">Proyecciones</TabsTrigger>
            <TabsTrigger value="cashflow" className="text-sm">Flujo de Caja</TabsTrigger>
            <TabsTrigger value="breakdown" className="text-sm">Desglose Costos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Evolución de Ventas</CardTitle>
                  <CardDescription>Proyección de ingresos 2024-2033</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `€${(value/1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Ventas']} />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={{ fill: '#8884d8', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Rentabilidad (S.O.I.)</CardTitle>
                  <CardDescription>Store Operating Income proyectado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `€${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'S.O.I.']} />
                      <Bar dataKey="soi" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Métricas Financieras Clave - Año 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Ventas Anuales</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(financialData[0].sales)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">S.O.I. Margen</div>
                    <div className="text-2xl font-bold text-green-600">
                      5.79%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Flujo de Caja Libre</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(financialData[0].freeCF)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Proyecciones Financieras Completas</CardTitle>
                <CardDescription>Evolución de principales métricas 2024-2033</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `€${(value/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventas" strokeWidth={2} />
                    <Line type="monotone" dataKey="pac" stroke="#82ca9d" name="P.A.C." strokeWidth={2} />
                    <Line type="monotone" dataKey="soi" stroke="#ffc658" name="S.O.I." strokeWidth={2} />
                    <Line type="monotone" dataKey="freeCF" stroke="#ff7300" name="Flujo Libre" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Supuestos de Crecimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Crecimiento en Ventas</span>
                    <span className="text-green-600 font-bold">3.00% anual</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Inflación</span>
                    <span className="text-blue-600 font-bold">1.50% anual</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Tasa de Descuento</span>
                    <span className="text-purple-600 font-bold">21.00%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Información del Contrato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Fin de Contrato</span>
                    <span className="text-red-600 font-bold">{keyMetrics.contractEnd}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Años Restantes</span>
                    <span className="text-orange-600 font-bold">{keyMetrics.franchiseYears} años</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Fecha de Valoración</span>
                    <span className="text-gray-600 font-bold">31/12/2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Flujo de Caja Libre Proyectado</CardTitle>
                <CardDescription>Generación de caja libre anual 2024-2033</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `€${(value/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Flujo de Caja Libre']} />
                    <Bar dataKey="freeCF" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Cashflow vs S.O.I.</CardTitle>
                  <CardDescription>Comparación de métricas de rentabilidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={financialData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `€${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                      <Legend />
                      <Line type="monotone" dataKey="cashflow" stroke="#82ca9d" name="Cashflow" strokeWidth={2} />
                      <Line type="monotone" dataKey="soi" stroke="#8884d8" name="S.O.I." strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Resumen Flujos de Caja</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">CF Libre Año 1</span>
                      <span className="text-green-600 font-bold">{formatCurrency(234287)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">CF Libre Año 5</span>
                      <span className="text-blue-600 font-bold">{formatCurrency(257746)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span className="font-medium">CF Libre Año 10</span>
                      <span className="text-purple-600 font-bold">{formatCurrency(312847)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                      <span className="font-medium">Crecimiento Promedio</span>
                      <span className="text-orange-600 font-bold">+3.3% anual</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Estructura de Costos</CardTitle>
                  <CardDescription>Distribución porcentual sobre ventas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Evolución de Costos Principales</CardTitle>
                  <CardDescription>P.A.C. y Alquiler proyectados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `€${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                      <Legend />
                      <Bar dataKey="pac" fill="#8884d8" name="P.A.C." />
                      <Bar dataKey="rent" fill="#82ca9d" name="Alquiler" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Detalle de Costos No Controlables</CardTitle>
                <CardDescription>Evolución de gastos fijos y variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Concepto</th>
                        <th className="text-right p-2">2024</th>
                        <th className="text-right p-2">2025</th>
                        <th className="text-right p-2">2026</th>
                        <th className="text-right p-2">% Ventas 2024</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Alquiler</td>
                        <td className="text-right p-2">{formatCurrency(281579)}</td>
                        <td className="text-right p-2">{formatCurrency(290027)}</td>
                        <td className="text-right p-2">{formatCurrency(298727)}</td>
                        <td className="text-right p-2">11.47%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Service Fees</td>
                        <td className="text-right p-2">{formatCurrency(122746)}</td>
                        <td className="text-right p-2">{formatCurrency(126428)}</td>
                        <td className="text-right p-2">{formatCurrency(130221)}</td>
                        <td className="text-right p-2">5.00%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Depreciación</td>
                        <td className="text-right p-2">{formatCurrency(72092)}</td>
                        <td className="text-right p-2">{formatCurrency(72092)}</td>
                        <td className="text-right p-2">{formatCurrency(72092)}</td>
                        <td className="text-right p-2">2.94%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Intereses</td>
                        <td className="text-right p-2">{formatCurrency(19997)}</td>
                        <td className="text-right p-2">{formatCurrency(19997)}</td>
                        <td className="text-right p-2">{formatCurrency(19997)}</td>
                        <td className="text-right p-2">0.81%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>Análisis generado el {new Date().toLocaleDateString('es-ES')} | Valoración: {formatCurrency(keyMetrics.currentPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
