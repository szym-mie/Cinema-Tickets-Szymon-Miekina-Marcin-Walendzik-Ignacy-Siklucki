import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { ValidationError } from 'sequelize';
import { Status } from '../../Status.mjs';

import UserModel from '../../model/UserModel.mjs';

const SignUpEndpoint = new Route(
    'POST', '/signup', ReplyType.JSON,
    async (req, _res) => {
        const data = req.body;

        const User = UserModel.use();

        try {
            await User.create({
                login: data.login,
                password: data.password,
                email: data.email,
            });
            Logging.logInfo('User ' + data.login + ' signed up', 'User');
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            if (e instanceof ValidationError) {
                Logging.logInfo('User ' + data.login + ' failed to sign up - ' + e.message, 'User');
                const errorMessage = e.errors.reduce((a, c) => a + c.message, '');
                return Status.error(new Error(errorMessage));
            }

            Logging.logError('Signup failed - ' + e.message, 'User');
            return Status.error(e);
        }
    },
);

export default SignUpEndpoint;
