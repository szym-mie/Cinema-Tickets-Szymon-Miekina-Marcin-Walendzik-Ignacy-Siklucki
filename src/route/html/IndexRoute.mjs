import { ReplyType, Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import RoomModel from '../../model/RoomModel.mjs';

const IndexRoute = new Route(
    'GET', '/', ReplyType.HTML,
    async (_req, res) => {
        // const users = await UserModel.use().findAll();
        // const usersJSON = JSON.stringify(users);

        // // return res.viewAsync('index.html', { content: usersJSON });
        // const movies = await MovieModel.use().findAll();
        // const moviesJSON = JSON.stringify(movies);

        const rooms = await RoomModel.use().findAll();
        const roomsJSON = JSON.stringify(rooms);

        return res.viewAsync('index.hbs', { content: roomsJSON });
    },
);

export default IndexRoute;
