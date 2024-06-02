import { Route } from '../../Route.mjs';

const LoginRoute = new Route(
    'GET', '/login', 'text/html',
    async (_req, res) => {
        return res.viewAsync('login.hbs', {});
    },
);

export default LoginRoute;
