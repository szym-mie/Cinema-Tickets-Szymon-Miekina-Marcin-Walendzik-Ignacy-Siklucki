import { Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';

const SignUpEndpoint = new Route(
    'POST', '/signup', 'application/json',
    async (req, _res) => {
        const data = req.body;

        console.log(data.login);
        console.log(data.password);
        console.log(data.email);

        const User = UserModel.use();

        try {
            await User.create({
                login: data.login,
                password: data.password,
                email: data.email,
            });
            return { status: 'ok' };
        }
        catch (e) {
            // FIXME: testing
            console.error(e);
            return { status: 'error' };
        }
    },
);

export default SignUpEndpoint;
