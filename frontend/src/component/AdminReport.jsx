import React, { useState, useEffect } from 'react';

const AdminReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports([
      { id: 1, content: "Report 1", status: "Pending" },
      { id: 2, content: "Report 2", status: "Resolved" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Resolve Reports</h2>
      </div>

      {/* Reports list */}
      <main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800">{report.content}</h3>
            <p className={`text-lg font-medium mt-2 ${report.status === "Resolved" ? "text-green-600" : "text-yellow-600"}`}>
              Status: {report.status}
            </p>
            <button
              onClick={() => {} /* Add resolve functionality */}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              Resolve Report
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminReport;
