import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export async function loader() {
    const apiUrl = 'https://www.omdbapi.com/?s=movie&apikey=1e3a2392';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        console.error(`Error: ${response.status}`);
        return null;
    }
    const data = await response.json();
    console.log("Fetched Movies:", data);
    return data;
}

interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Runtime: string;
    Plot: string;
}

interface LoaderData {
    Search: Movie[];
}

export default function Dashboard() {
    const data = useLoaderData() as LoaderData;
    const navigate = useNavigate();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (!data) {
            setError("Failed to load data.");
            return;
        }
        const fetchMovieDetails = async () => {
            try {
                if (data && data.Search) {
                    const moviesWithDetails = await Promise.all(
                        data.Search.map(async (movie: any) => {
                            const response = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=1e3a2392`);
                            const detailedData = await response.json();
                            return detailedData;
                        })
                    );
                    setMovies(moviesWithDetails);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };
        fetchMovieDetails();
    }, [data]);

    const fetchMovies = async (searchTerm: string, page: number) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=1e3a2392&page=${page}`);
            const data = await response.json();
            if (data.Response === "False") {
                setError(data.Error);
                setMovies([]);
            } else {
                setMovies(data.Search || []);
            }
            setCurrentPage(page);
        } catch (error) {
            setError("Network error: Unable to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (searchTerm) {
            await fetchMovies(searchTerm, 1);
        } else {
            setMovies(data.Search || []);
            setCurrentPage(1);
        }
    };

    const handleFeedbackSubmit = (e: any) => {
        e.preventDefault();
        console.log("Feedback submitted:", feedback);
        setFeedback("");
        setShowFeedbackForm(false);
    };

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(movies.length / moviesPerPage);

    const handlePageChange = async (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        if (searchTerm) {
            await fetchMovies(searchTerm, pageNumber);
        } else {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
           <section className="bg-gray-800 p-4 grid grid-cols-3 md:grid-cols-3 sm:grid-cols-3 gap-4 justify-between items-center">
                <h2 className="text-white text-xl md:text-xl sm:text-xl font-bold">Movie Finder</h2>
                <form onSubmit={handleSearch} className="flex w-full md:w-auto mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
                    />
                    <button type="submit" className="bg-red-500 text-white p-2 rounded-r-md hover:bg-red-600 transition duration-200">
                        Search
                    </button>
                </form>
                <button 
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)} 
                    className="bg-blue-500 text-white p-2 rounded-md mt-4 md:mt-0 hover:bg-blue-600 transition duration-200"
                >
                    Feedback
                </button>
            </section>

            {showFeedbackForm && (
                <div className="p-4">
                    <h3 className="text-lg font-semibold">Feedback Form</h3>
                    <form onSubmit={handleFeedbackSubmit} className="mt-2 flex flex-col">
                        <textarea 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                            placeholder="Your feedback..." 
                            className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        />
                        <button type="submit" className="bg-green-500 text-white p-2 rounded-md mt-2 hover:bg-green-600 transition duration-200">
                            Submit Feedback
                        </button>
                    </form>
                </div>
            )}
            <div className="p-4 font-display">
                {loading ? <p className="text-center text-gray-500">Loading...</p>
                : error
                ? <p className="text-center text-red-500">{error}</p>
                : (
                    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 cursor-pointer">
                        {currentMovies.length > 0 ? (
                            currentMovies.map(movie => (
                                <div key={movie.imdbID} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 p-2" onClick={() => navigate(`/movie/${movie.imdbID}`)}>
                                    <img 
                                        src={movie.Poster} 
                                        alt={movie.Title} 
                                        className="w-full h-60 mb-2 object-contain" 
                                    />
                                    <div className ="p-2">
                                        <h2 className="text-md font-semibold">{movie.Title}</h2>
                                        <p className="text-gray-500 text-sm">({movie.Year})</p>
                                        <span className="font font-semibold">Runtime:</span> <span>{movie.Runtime || "N/A"}</span>
                                        <p className="text-sm mb-2 text-gray-700 line-clamp-1">{movie.Plot || "No plot available."}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No movies found.</p>
                        )}
                    </section>
                )}
            </div>
            <div className="flex justify-center my-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className="bg-red-500 text-white p-2 rounded-md mx-1 hover:bg-red-600 transition duration-200"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={`p-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-black'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    className="bg-red-500 text-white p-2 rounded-md mx-1 hover:bg-red-600 transition duration-200"
                >
                    Next
                </button>
            </div>
        </>
    );
}






