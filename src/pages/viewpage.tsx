import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Movie {
    Poster: string;
    Title: string;
    Plot: string;
    Year: string;
    Director: string;
    Actors: string;
    imdbRating: string;
    Genre: string;
    Runtime: string;
}

interface Review {
    id: number;
    author: string;
    content: string;
}

export default function MovieDetail() {
    const { id } = useParams(); // Get the movie ID from the URL
    const [movie, setMovie] = useState<Movie | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]); // State for reviews
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                // Ensure the URL uses HTTPS
                const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=1e3a2392`);
                if (!response.ok) {
                    throw new Error("Failed to fetch movie details");
                }
                const data = await response.json();
                if (data.Response === "False") {
                    throw new Error(data.Error || "Movie not found");
                }
                setMovie(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching movie details:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Static reviews for demonstration purposes
    useEffect(() => {
        const staticReviews: Review[] = [
            { id: 1, author: "John Doe", content: "An amazing movie! Highly recommended." },
            { id: 2, author: "Jane Smith", content: "A thrilling experience from start to finish." },
            { id: 3, author: "Sam Wilson", content: "Not what I expected, but still enjoyable." }
        ];
        setReviews(staticReviews);
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text -red-500">{error}</p>;
    }

    if (!movie) {
        return <p className="text-center text-gray-500">No movie data available.</p>;
    }

    // Ensure the poster URL uses HTTPS
    const posterUrl = movie.Poster.startsWith("http://") 
        ? movie.Poster.replace("http://", "https://") 
        : movie.Poster;

    return (
        <div className="bg-black grid grid-cols-1 sm:grid-cols-[1fr_auto] text-white p-4 rounded-lg font-display gap-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{movie.Title}</h1>
            <img src={posterUrl} alt={movie.Title} className="w-full rounded-md shadow-md object-contain mx-auto p-2" />
            <p className="text-lg md:text-xl mb-4">{movie.Plot}</p>
            <p className="mb-2">
                <span className="font-semibold">Year:</span> <span>{movie.Year}</span>
            </p>
            <p className="mb-2">
                <span className="font-semibold">Director:</span> <span>{movie.Director}</span>
            </p>
            <p className="mb-2">
                <span className="font-semibold">Actors:</span> <span>{movie.Actors}</span>
            </p>
            <p className="mb-2">
                <span className="font-semibold">Rating:</span> <span>{movie.imdbRating}</span>
            </p>
            <p className="mb-2">
                <span className="font-semibold">Genre:</span> <span>{movie.Genre}</span>
            </p>
            <p className="mb-2">
                <span className="font-semibold">Runtime:</span> <span>{movie.Runtime}</span>
            </p>
            <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm flex gap-4 transition-transform transform hover:shadow-lg">
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-gray-600">{review.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
        </div>
    );
}