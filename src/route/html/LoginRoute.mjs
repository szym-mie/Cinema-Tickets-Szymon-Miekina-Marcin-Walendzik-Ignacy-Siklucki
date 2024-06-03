import { ReplyType, Route } from '../../Route.mjs';

const LoginRoute = new Route(
    'GET', '/login', ReplyType.HTML,
    async (_req, res) => {
        return res.viewAsync('login.hbs', {});
    },
);

export default LoginRoute;
