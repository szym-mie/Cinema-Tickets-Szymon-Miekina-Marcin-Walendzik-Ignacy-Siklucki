import { Route } from '../Route.mjs'
import UserModel from '../model/UserModel.mjs';

const MainRoute = new Route(
    'GET', '/', 'text/html',
    async (_req, _res) => {
        const users = await UserModel.use().findAll();
        const usersJSON = JSON.stringify(users);
        return '<h1>Hello</h1><pre>' + usersJSON + '</pre>';
    },
);

export default MainRoute;