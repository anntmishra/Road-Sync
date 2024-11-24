const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    year: Number,
    // Add other fields as per your collection's structure
});

const Movie = mongoose.model('Movie', movieSchema);

// Example: Fetch all movies
Movie.find({}, (err, movies) => {
    if (err) {
        console.error(err);
    } else {
        console.log(movies);
    }
});