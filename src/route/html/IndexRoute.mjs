import { Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import MovieModel from '../../model/MovieModel.mjs';


const IndexRoute = new Route(
    'GET', '/', 'text/html',
    async (_req, res) => {
        const users = await UserModel.use().findAll();
        const usersJSON = JSON.stringify(users);

        // return res.viewAsync('index.html', { content: usersJSON });
        const movies = await MovieModel.use().findAll();
        const moviesJSON = JSON.stringify(movies);

        return res.viewAsync('index.html', { content: moviesJSON });
    },
);

export default IndexRoute;
