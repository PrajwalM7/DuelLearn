import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const TeacherCharts = () => {

  // Random topic accuracy
  const topicData = {
    labels: ["OS", "DBMS", "CN", "OOPS", "DSA"],
    datasets: [
      {
        label: "Student Accuracy %",
        data: [
          Math.floor(Math.random()*40)+60,
          Math.floor(Math.random()*40)+60,
          Math.floor(Math.random()*40)+60,
          Math.floor(Math.random()*40)+60,
          Math.floor(Math.random()*40)+60,
        ],
        backgroundColor: "#6366f1"
      }
    ]
  };

  // Random performance trend
  const trendData = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [
      {
        label: "Average Score %",
        data: [
          65 + Math.random()*20,
          60 + Math.random()*20,
          70 + Math.random()*20,
          68 + Math.random()*20,
          72 + Math.random()*20,
          75 + Math.random()*20,
          80 + Math.random()*20,
        ],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <>
      <div style={{height:"300px"}}>
        <Bar data={topicData}/>
      </div>

      <div style={{height:"300px",marginTop:"40px"}}>
        <Line data={trendData}/>
      </div>
    </>
  );
};

export default TeacherCharts;