import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetail() {
    const { id } = useParams(); // Get the movie ID from the URL
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]); // State for reviews

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=1e3a2392`);
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Static reviews for demonstration purposes
    useEffect(() => {
        const staticReviews = [
            { id: 1, author: "John Doe", content: "An amazing movie! Highly recommended." },
            { id: 2, author: "Jane Smith", content: "A thrilling experience from start to finish." },
            { id: 3, author: "Sam Wilson", content: "Not what I expected, but still enjoyable." }
        ];
        setReviews(staticReviews);
    }, []);

    if (!movie) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg font-display max-w-screen-lg mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{movie.Title}</h1>
            <img src={movie.Poster} alt={movie.Title} className="w-full h-64 md:h-80 mb-4 rounded-md shadow-md object-contain mx-auto p-2" />
            <p className="text-lg md:text-xl mb-4">{movie.Plot}</p>
            <div className="mb-2">
                <span className="font-semibold">Year:</span> <span>{movie.Year}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold">Director:</span> <span>{movie.Director}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold">Actors:</span> <span>{movie.Actors}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold">Rating:</span> <span>{movie.imdbRating}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold">Genre:</span> <span>{movie.Genre}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold">Runtime:</span> <span>{movie.Runtime}</span>
            </div>

            {/* Reviews Section */}
            <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm flex gap-4 transition-transform transform hover:scale-105 hover:shadow-lg">
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