"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formColorUtils } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    form: number;
    color: string;
    zone: string;
    meaning: string;
    trend: Array<{
      date: string;
      form: number;
      ctl: number;
      atl: number;
    }>;
  };
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, formData }) => {
  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { ctl: number; atl: number; form: number } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium">{`Date: ${label}`}</p>
          <p className="text-blue-600">{`CTL (Fitness): ${data.ctl.toFixed(
            1
          )}`}</p>
          <p className="text-orange-600">{`ATL (Fatigue): ${data.atl.toFixed(
            1
          )}`}</p>
          <p className="text-green-600 font-bold">{`Form: ${data.form.toFixed(
            1
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${formColorUtils.getIndicatorClass(
                formData.color
              )}`}
            />
            Form Analysis (CTL - ATL) - Current: {formData.form.toFixed(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Form Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center mt-3">
                Current Form Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center pb-4 w-full flex justify-center">
                <div
                  className={`p-4 rounded-lg w-3/5 ${formColorUtils.getBackgroundClass(
                    formData.color
                  )}`}
                >
                  <div className="text-sm font-medium">{formData.meaning}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${formColorUtils.getTextClass(
                      formData.color
                    )}`}
                  >
                    {formData.form.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Form Value
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">
                    {formData.zone}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Zone
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Form Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formData.trend}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value: string) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Reference lines for zones */}
                    <ReferenceLine
                      y={5}
                      stroke="#22c55e"
                      strokeDasharray="2 2"
                    />
                    <ReferenceLine
                      y={0}
                      stroke="#84cc16"
                      strokeDasharray="2 2"
                    />
                    <ReferenceLine
                      y={-10}
                      stroke="#6b7280"
                      strokeDasharray="2 2"
                    />
                    <ReferenceLine
                      y={-30}
                      stroke="#eab308"
                      strokeDasharray="2 2"
                    />

                    <Area
                      type="monotone"
                      dataKey="form"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend for reference lines */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-yellow-500"></div>
                  <span>Transition (+5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Fresh (0)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-gray-500"></div>
                  <span>Grey (-10)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Optimal (-30)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-red-500"></div>
                  <span>High Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interpretation Table */}
          <Card>
            <CardHeader>
              <CardTitle>Form Zone Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Form Range</th>
                      <th className="text-left p-2">Zone</th>
                      <th className="text-left p-2">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">&gt; +5</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Transition / Fresh
                        </span>
                      </td>
                      <td className="p-2">
                        Low load or taper period. Very fresh, but may lose
                        fitness if sustained. Ideal before races.
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">0 to +5</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Fresh
                        </span>
                      </td>
                      <td className="p-2">
                        Well-recovered. Ideal for high-intensity or key
                        workouts.
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">-10 to +5</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          Grey Zone
                        </span>
                      </td>
                      <td className="p-2">
                        Maintenance level. Balanced fatigue and fitness.
                        Progress may stagnate.
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">-30 to -10</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Optimal
                        </span>
                      </td>
                      <td className="p-2">
                        Productive training load. Good stress–recovery balance
                        for long-term gains.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">&lt; -30</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          High Risk
                        </span>
                      </td>
                      <td className="p-2">
                        Excessive fatigue. Recovery or deload required. Risk of
                        overreaching.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Form (CTL - ATL)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What is Form?</h4>
                <p className="text-sm text-muted-foreground">
                  Form represents your current training readiness by comparing
                  your chronic training load (fitness) to your acute training
                  load (fatigue). It indicates whether you&apos;re fresh and
                  ready for hard training or need recovery.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-1">
                    CTL (Chronic Training Load)
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Your fitness level - a 42-day rolling average of training
                    stress. Higher values indicate better fitness.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">
                    ATL (Acute Training Load)
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Your fatigue level - a 7-day rolling average of training
                    stress. Higher values indicate more fatigue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
