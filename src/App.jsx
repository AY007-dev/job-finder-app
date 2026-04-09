import { useState, useEffect } from "react";

function App() {
  const [jobs, setJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("jobs")) || [];
  });

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const [search, setSearch] = useState(() => {
    return localStorage.getItem("search") || "";
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 🔥 FETCH API
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `https://remotive.com/api/remote-jobs?search=${search}`
      );
      const data = await res.json();
      setJobs(data.jobs.slice(0, 10));
      setSelectedJob(null);
      setShowFavorites(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ❤️ TOGGLE FAVORITE
  const toggleFavorite = (job) => {
    const exists = favorites.find((f) => f.id === job.id);

    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== job.id));
    } else {
      setFavorites([...favorites, job]);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((f) => f.id === id);
  };

  // 💾 SAVE LOCAL
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("search", search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  return (
    <div className={`min-h-screen flex justify-center items-center ${
      dark ? "bg-gray-900" : "bg-gray-100"
    }`}>
      
      <div className={`w-[500px] p-6 rounded-xl shadow-xl ${
        dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}>
        
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">💼 Job Finder</h1>
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* MENU */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowFavorites(false)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Job List
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className="bg-pink-500 text-white px-3 py-1 rounded"
          >
            ❤️ Favorite
          </button>
        </div>

        {/* SEARCH */}
        {!showFavorites && (
          <div className="flex gap-2 mb-4">
            <input
              className={`flex-1 p-2 border rounded ${
                dark
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-gray-300"
              }`}
              placeholder="Cari job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={fetchJobs}
              className="bg-blue-500 text-white px-3 rounded"
            >
              Cari
            </button>
          </div>
        )}

        {/* LIST JOB */}
        {!selectedJob && !showFavorites && (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className={`p-4 rounded-lg ${
                  dark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex justify-between">
                  <div onClick={() => setSelectedJob(job)} className="cursor-pointer">
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm opacity-70">{job.company_name}</p>
                  </div>

                  <button onClick={() => toggleFavorite(job)}>
                    {isFavorite(job.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* FAVORITE LIST */}
        {showFavorites && (
          <ul className="space-y-3">
            {favorites.length === 0 && (
              <p className="text-center text-gray-400">
                Belum ada favorite
              </p>
            )}

            {favorites.map((job) => (
              <li
                key={job.id}
                className={`p-4 rounded-lg ${
                  dark
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <div className="flex justify-between">
                  <div onClick={() => setSelectedJob(job)} className="cursor-pointer">
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm opacity-70">{job.company_name}</p>
                  </div>

                  <button onClick={() => toggleFavorite(job)}>
                    ❤️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* DETAIL */}
        {selectedJob && (
          <div>
            <button
              onClick={() => setSelectedJob(null)}
              className="mb-3 text-blue-500"
            >
              ← Kembali
            </button>

            <h2 className="text-lg font-bold mb-2">
              {selectedJob.title}
            </h2>

            <p>🏢 {selectedJob.company_name}</p>
            <p>📍 {selectedJob.candidate_required_location}</p>

            <div
              className="text-sm mt-2 mb-3"
              dangerouslySetInnerHTML={{
                __html: selectedJob.description,
              }}
            />

            <a
              href={selectedJob.url}
              target="_blank"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Apply Job
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;