import { Route } from '../../Route.mjs';
import { Status } from '../../Status.mjs';
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
            return Status.ok();
        }
        catch (e) {
            // FIXME: testing
            console.error(e);
            return Status.error(e);
        }
    },
);

export default SignUpEndpoint;
