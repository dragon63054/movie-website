// In your main App or Router file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import MovieDetails from './pages/viewpage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/movie/:imdbID" element={<MovieDetails />} />
            </Routes>
        </Router>
    );
}

export default App;