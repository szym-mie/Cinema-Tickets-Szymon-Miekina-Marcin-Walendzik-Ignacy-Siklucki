import { Route } from '../../Route.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';

const MovieRoute = new Route(
    'GET', '/movie/:id', 'text/html',
    async (_req, res) => {
        const id = _req.params.id;
        console.log('ID FILMU' + id);
        const movie = await MovieModel.use().findByPk(id);
        // const movieJSON = JSON.stringify(movie);

        // const dates = await ShowModel.use().findAll({
        //     where: {
        //         movieId: id,
        //     },
        // });
        // const datesJSON = JSON.stringify(dates);

        // return res.viewAsync('movie.hbs', { movie: movieJSON });
        return res.viewAsync('movie.hbs', { movie: movie.get() });
    },
);

export default MovieRoute;
