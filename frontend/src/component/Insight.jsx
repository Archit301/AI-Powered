import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, LineController, BarController } from 'chart.js';
import { Chart } from 'chart.js';
import { useSelector } from 'react-redux';

// Register the necessary components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController, // Register the LineController for line charts
  BarController // Register the BarController for bar charts
);

const Insight = () => {
  const [data, setData] = useState({
    monthlyViews: [],
    monthlyLikes: [150, 200, 180, 220, 240],
    monthlyDislikes: [30, 50, 40, 70, 60],
    monthlyEngagement: [0.75, 0.8, 0.65, 0.9, 0.85],
  });

  const { currentUser } = useSelector((state) => state.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));
  
  const [userAccountCreationDate, setUserAccountCreationDate] = useState(new Date(currentUser.dateJoined).toLocaleDateString());

  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const generateYearAndMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const accountYear = new Date(userAccountCreationDate).getFullYear();
    const accountMonth = new Date(userAccountCreationDate).getMonth(); // Account month
    let yearOptions = [];
    for (let year = accountYear; year < currentYear + 1; year++) {
      yearOptions.push(year);
    }

    let monthOptions = [];
    const currentMonth = new Date().getMonth();
    const startMonth = accountYear === currentYear ? accountMonth : 0;
    for (let i = startMonth; i <= currentMonth; i++) {
      monthOptions.push(Object.keys(monthMap)[i]);
    }

    return { yearOptions, monthOptions };
  };

  const { yearOptions, monthOptions } = generateYearAndMonthOptions();

  useEffect(() => {
    const fetchFilteredViews = async () => {
      const response = await fetch(`/api/profile/filtered-views/${selectedYear}/${selectedMonth}/${currentUser._id}`);
      const fetchedData = await response.json();

      // Initialize an array to hold the total views for each month
      const viewsByMonth = Array(12).fill(0); // 12 months, initialize with zero

      // Loop through the fetched data to calculate the views for each month
      fetchedData.forEach((article) => {
        article.monthlyViews.forEach((view) => {
          const month = parseInt(view.month.split('-')[1], 10) - 1; // Extract month (index 0-11)
          const count = view.count;
          viewsByMonth[month] += count; // Add the view count to the corresponding month
        });
      });

      setData((prevData) => ({
        ...prevData,
        monthlyViews: viewsByMonth,
      }));
    };

    const fetchFilteredLikesDislikes = async () => {
      const response = await fetch(`/api/profile/filtered-likes/${selectedYear}/${selectedMonth}/${currentUser._id}`);
      const fetchedData = await response.json();

      // Initialize counts for likes, dislikes, and engagement
      let likesByMonth = Array(12).fill(0); // 12 months, initialize with zero
      let dislikesByMonth = Array(12).fill(0);
      let engagementByMonth = Array(12).fill(0); // Store engagement ratios

      // Loop through the fetched data to calculate likes, dislikes, and engagement for each month
      fetchedData.forEach((article) => {
        article.monthlyData.likes.forEach((like) => {
          const month = parseInt(like.month.split('-')[1], 10) - 1; // Extract month (index 0-11)
          const count = like.count;
          likesByMonth[month] += count; // Add the like count to the corresponding month
        });
        article.monthlyData.dislikes.forEach((dislike) => {
          const month = parseInt(dislike.month.split('-')[1], 10) - 1; // Extract month (index 0-11)
          const count = dislike.count;
          dislikesByMonth[month] += count; // Add the dislike count to the corresponding month
        });
      });

      // Calculate engagement for each month (likes / (likes + dislikes))
      for (let i = 0; i < 12; i++) {
        const totalInteractions = likesByMonth[i] + dislikesByMonth[i];
        if (totalInteractions > 0) {
          engagementByMonth[i] = likesByMonth[i] / totalInteractions; // Engagement ratio
        } else {
          engagementByMonth[i] = 0; // If no interactions, set engagement to 0
        }
      }

      // Update the state for likes, dislikes, and engagement
      setData((prevData) => ({
        ...prevData,
        monthlyLikes: likesByMonth,
        monthlyDislikes: dislikesByMonth,
        monthlyEngagement: engagementByMonth, // Update the engagement data
      }));
    };

    fetchFilteredLikesDislikes();

    fetchFilteredViews();
  }, [selectedYear, selectedMonth, userAccountCreationDate]);

  useEffect(() => {
    // Graph setup for Monthly Views
    const viewsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Article Views',
          data: data.monthlyViews,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    };

    // Graph setup for Likes & Dislikes
    const likesDislikesData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Likes',
          data: data.monthlyLikes,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Dislikes',
          data: data.monthlyDislikes,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };

    // Graph setup for Engagement Rates
    const engagementRateData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Engagement Rate',
          data: data.monthlyEngagement,
          borderColor: 'rgba(153, 102, 255, 1)',
          fill: false,
        },
      ],
    };

    const viewsChart = new Chart(document.getElementById('viewsChart'), {
      type: 'line',
      data: viewsData,
    });

    const likesDislikesChart = new Chart(document.getElementById('likesDislikesChart'), {
      type: 'bar',
      data: likesDislikesData,
      options: {
        scales: {
          y: { stacked: true },
        },
      },
    });

    const engagementRateChart = new Chart(document.getElementById('engagementRateChart'), {
      type: 'line',
      data: engagementRateData,
    });

    return () => {
      viewsChart.destroy();
      likesDislikesChart.destroy();
      engagementRateChart.destroy();
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>

          <div className="flex space-x-4">
            <select
              className="p-2 border rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              className="p-2 border rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Monthly Views</h2>
            <p className="text-3xl font-bold text-gray-700">{data.monthlyViews.reduce((a, b) => a + b, 0)} Views</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Monthly Likes & Dislikes</h2>
            <p className="text-3xl font-bold text-gray-700">
              {data.monthlyLikes.reduce((a, b) => a + b, 0)} Likes | {data.monthlyDislikes.reduce((a, b) => a + b, 0)} Dislikes
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Engagement Rate</h2>
            <p className="text-3xl font-bold text-gray-700">
              {(data.monthlyEngagement.reduce((a, b) => a + b, 0) / data.monthlyEngagement.length).toFixed(2)} Avg Engagement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Views</h3>
            <canvas id="viewsChart" width="400" height="200"></canvas>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Likes & Dislikes</h3>
            <canvas id="likesDislikesChart" width="400" height="200"></canvas>
          </div>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Engagement Rate</h3>
          <canvas id="engagementRateChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Insight;
