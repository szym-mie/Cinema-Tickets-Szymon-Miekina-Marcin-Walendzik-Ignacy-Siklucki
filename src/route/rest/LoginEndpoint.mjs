import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Op } from 'sequelize';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

import UserModel from '../../model/UserModel.mjs';

const LoginEndpoint = new Route(
    'POST', '/login', ReplyType.JSON,
    async (req, res) => {
        const data = req.body;
        const User = UserModel.use();

        try {
            const user = await User.findOne({
                where: {
                    [Op.and]: {
                        login: data.login,
                        password: data.password,
                    },
                },
            });

            if (user === null) {
                Logging.logInfo('User ' + data.login + ' failed to log in - no such user', 'User');
                return Status.error(new Error('No such user'));
            }

            const userData = user.get();
            console.log(userData);

            const session = Session.create();
            await user.update(session.getObject());
            res.setCookie(...session.getCookie(), {});

            Logging.logInfo('User ' + user.login + ' login', 'User');
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Login failed - ' + e.message, 'User');
            return Status.error(e);
        }
    },
);

export default LoginEndpoint;
