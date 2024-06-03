import { ReplyType, Route } from '../../Route.mjs';

const LogoutRoute = new Route(
    'GET', '/logout', ReplyType.HTML,
    async (_req, res) => {
        return res.viewAsync('logout.hbs', {});
    },
);

export default LogoutRoute;
