import { Route } from '../../Route.mjs';

const LogoutRoute = new Route(
    'GET', '/logout', 'text/html',
    async (_req, res) => {
        return res.viewAsync('logout.hbs', {});
    },
);

export default LogoutRoute;
