import { ReplyType, Route } from '../../Route.mjs';

const SignUpRoute = new Route(
    'GET', '/signup', ReplyType.HTML,
    async (_req, res) => {
        return res.viewAsync('signup.hbs', {});
    },
);

export default SignUpRoute;
