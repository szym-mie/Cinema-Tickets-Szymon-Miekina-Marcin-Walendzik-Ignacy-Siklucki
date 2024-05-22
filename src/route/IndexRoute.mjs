import { Route } from '../Route.mjs'
import UserModel from '../model/UserModel.mjs';

const IndexRoute = new Route(
    'GET', '/', 'text/html',
    async (_req, res) => {
        const users = await UserModel.use().findAll();
        const usersJSON = JSON.stringify(users);

        res.setCookie('foo', 'bar', {});
        
        return res.viewAsync('index.mustache', { content: usersJSON });
    },
);

export default IndexRoute;