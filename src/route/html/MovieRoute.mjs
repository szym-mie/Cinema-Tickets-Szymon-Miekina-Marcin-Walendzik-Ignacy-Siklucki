import { Route } from '../../Route.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';


const MovieRoute = new Route(
    'GET', '/movie/:id', 'text/html',
    async (_req, res) => {
    
        const id = _req.params.id;
        const movie = await MovieModel.use().findByPk(id);
        const movieJSON = JSON.stringify(movie);

        const dates = await ShowModel.findAll({
            where: {
                movieId: id,
            },
        });

        return res.viewAsync('movie.html', { movie: movieJSON, dates: dates });
        
    }
);

export default MovieRoute;
