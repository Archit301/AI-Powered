import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Author = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [authors, setAuthors] = useState([]);
  const [followedAuthors, setFollowedAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthors = async () => {
    if (!currentUser) return;
    try {
      const authorResponse = await fetch("/api/users/author");
      const followedResponse = await fetch(`/api/users/${currentUser._id}`);
      const authorsData = await authorResponse.json();
      const followedData = await followedResponse.json();
      setAuthors(authorsData);
      setFollowedAuthors(followedData || []);
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };

  useEffect(() => {
    fetchAuthors();
    const interval = setInterval(fetchAuthors, 10000);
    return () => clearInterval(interval);
  }, [currentUser, followedAuthors]);

  const handleFollow = async (authorId, isFollowing) => {
    setLoading(true);

    try {
      const endpoint = isFollowing
        ? `/api/users/${currentUser._id}/unfollow/${authorId}`
        : `/api/users/${currentUser._id}/follow/${authorId}`;

      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to update follow status");
      }

      // Update states after successful operation
      const updatedFollowedAuthors = isFollowing
        ? followedAuthors.filter((author) => author._id !== authorId)
        : [...followedAuthors, authors.find((author) => author._id === authorId)];

      setFollowedAuthors(updatedFollowedAuthors);

      setAuthors((prev) =>
        prev.map((author) =>
          author._id === authorId ? { ...author, followed: !isFollowing } : author
        )
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        Discover Amazing Authors
      </h1>

      {/* Followed Authors Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Followed Authors</h2>
        {followedAuthors.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {followedAuthors.map((author) => (
              <div
                key={author._id}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl p-6 flex flex-col items-center w-40 min-w-[10rem] text-white"
              >
                <img
                   src={author.avatar==="defaultProfilePicUrl"?"https://www.w3schools.com/w3images/avatar2.png":author.avatar}
                  alt={author.username}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white"
                />
                <h3 className="text-lg font-medium">{author.username}</h3>
                {currentUser && (
                  <button
                    onClick={() => handleFollow(author._id, true)}
                    className="mt-4 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Unfollow"}
                  </button>
                )}
                <a
                  href={`/author/${author._id}`}
                  className="text-gray-200 mt-3 text-sm underline"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              You haven’t followed any authors yet.
            </h2>
            <p className="text-gray-600 mt-2">
              Explore and follow authors to see their content here.
            </p>
          </div>
        )}
      </div>

      {/* Other Authors Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Other Authors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {authors
            .filter((author) => !followedAuthors.some((fa) => fa._id === author._id))
            .map((author) => (
              <div
                key={author._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 flex flex-col items-center"
              >
                <img
                  src={author.avatar==="defaultProfilePicUrl"?"https://www.w3schools.com/w3images/avatar2.png":author.avatar}
                  alt={author.username}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800">{author.username}</h3>
                {currentUser && (
                  <button
                    onClick={() => handleFollow(author._id, false)}
                    className="mt-4 px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Follow"}
                  </button>
                )}
                <a
                  href={`/author/${author._id}`}
                  className="text-blue-500 mt-3 text-sm underline"
                >
                  View Profile
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Author;
