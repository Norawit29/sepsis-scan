import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const data = [
  { month: 'Jan', screeningRate: 95, antibioticsRate: 88, fluidRate: 92 },
  { month: 'Feb', screeningRate: 97, antibioticsRate: 90, fluidRate: 94 },
  { month: 'Mar', screeningRate: 96, antibioticsRate: 89, fluidRate: 93 },
  { month: 'Apr', screeningRate: 98, antibioticsRate: 92, fluidRate: 95 },
];

const KPICard = ({ title, value, target, unit }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}{unit}</div>
      <p className="text-xs text-muted-foreground">
        Target: {target}{unit}
      </p>
    </CardContent>
  </Card>
);

const SepsisKPIDashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Sepsis KPI Dashboard - Emergency Department</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Average Time to Antibiotics" value={45} target={60} unit=" min" />
        <KPICard title="Sepsis Screening Compliance" value={97} target={95} unit="%" />
        <KPICard title="Mortality Rate" value={12} target={15} unit="%" />
        <KPICard title="Average LOS for Sepsis Patients" value={4.2} target={5} unit=" days" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sepsis Bundle Compliance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="screeningRate" name="Screening" fill="#8884d8" />
              <Bar dataKey="antibioticsRate" name="Antibiotics" fill="#82ca9d" />
              <Bar dataKey="fluidRate" name="Fluid Resuscitation" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Sepsis screening compliance has improved, but time to antibiotics administration needs attention.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SepsisKPIDashboard;
