import { Route } from '../../Route.mjs';

const SignUpRoute = new Route(
    'GET', '/signup', 'text/html',
    async (_req, res) => {
        return res.viewAsync('signup.hbs', {});
    },
);

export default SignUpRoute;
