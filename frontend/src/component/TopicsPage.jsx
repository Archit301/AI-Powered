import React, { useState } from "react";
import { Search } from "react-feather";

const TopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const topics = [
    { id: 1, name: "Artificial Intelligence", description: "Explore the future of AI and its applications." },
    { id: 2, name: "Machine Learning", description: "Learn how machines can learn from data." },
    { id: 3, name: "Blockchain", description: "Understand the concept of decentralized technology." },
    { id: 4, name: "Web Development", description: "Get started with web development using modern technologies." },
    { id: 5, name: "Cloud Computing", description: "Learn about cloud infrastructure and services." },
    { id: 6, name: "Cyber Security", description: "Explore techniques to secure your digital world." },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for topics..."
          />
          <Search className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500" />
        </div>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-800">{topic.name}</h3>
            <p className="text-gray-600 mt-2">{topic.description}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
