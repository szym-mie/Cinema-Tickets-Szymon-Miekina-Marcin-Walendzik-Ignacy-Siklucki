import { ReplyType, Route } from '../../Route.mjs';
import MovieModel from '../../model/MovieModel.mjs';

const IndexRoute = new Route(
    'GET', '/', ReplyType.HTML,
    async (_req, res) => {

        const earliestMovies = await MovieModel.use().findAll({
            order: [['createdAt', 'ASC']],
            limit: 3,
        });

        const mappedMovies = earliestMovies.map(movie => movie.get());

        console.log(mappedMovies);

        return res.viewAsync('index.hbs', { earliestMovies: mappedMovies });
    },
);

export default IndexRoute;