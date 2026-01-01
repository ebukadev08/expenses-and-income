import React from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { dateFormat } from "../../utils/dateFormat";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();

  const labels = [...incomes, ...expenses]
    .map((item) => dateFormat(item.date))
    .sort();

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomes.map((income) => income.amount),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.2,
        fill: false,
      },
      {
        label: "Expenses",
        data: expenses.map((expense) => expense.amount),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Incomes vs Expenses",
      },
    },
  };

  return (
    <ChartStyled>
      <Line data={data} options={options}/>
    </ChartStyled>
  );
}

const ChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`;

export default Chart;
