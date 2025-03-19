"use client"; // Ensure this runs on the client side

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { getFinancialRecords } from "@/lib/actions/financial.action";
import { useUser } from "@clerk/nextjs";

// Define types for financial records
interface FinancialRecord {
  userId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

// Define types for chart data
interface ChartData {
  name: string;
  amt: number;
}

export default function Chart() {
  const { user } = useUser(); // Get user data from Clerk
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month"
  );

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const records: FinancialRecord[] = await getFinancialRecords(user.id);
        formatChartData(records, filterType);
      } catch (error) {
        console.error("❌ Error fetching financial records:", error);
      }
    };

    fetchRecords();
  }, [user, filterType]);

  const formatChartData = (
    records: FinancialRecord[],
    filter: "day" | "month" | "year"
  ) => {
    const groupedData: Record<string, ChartData> = {};

    records.forEach((record) => {
      const date = new Date(record.date);
      let key = "";

      // Group data based on selected filter
      if (filter === "day") {
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (filter === "month") {
        key = date.toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
      } else if (filter === "year") {
        key = date.getFullYear().toString(); // "2024"
      }

      if (!groupedData[key]) {
        groupedData[key] = { name: key, amt: 0 };
      }
      groupedData[key].amt += Number(record.amount);
    });

    let sortedData = Object.values(groupedData);

    if (filter === "month") {
      // Sort by month order
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      sortedData.sort(
        (a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name)
      );
    } else if (filter === "year") {
      // Sort by year (ascending order)
      sortedData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    } else {
      // Sort by date (ascending for daily filter)
      sortedData.sort(
        (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
      );
    }

    setChartData(sortedData);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <div>
        <div className="mb-4">
          <select
            onChange={(e) =>
              setFilterType(e.target.value as "day" | "month" | "year")
            }
            value={filterType}
            className="text-black"
          >
            <option value="month">Monthly</option>
            <option value="day">Day</option>
            <option value="year">Year</option>
          </select>
        </div>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis stroke="#fff" dataKey="name" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar radius={[30, 30, 0, 0]} dataKey="amt">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.amt < 0 ? "red" : "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </ResponsiveContainer>
  );
}
