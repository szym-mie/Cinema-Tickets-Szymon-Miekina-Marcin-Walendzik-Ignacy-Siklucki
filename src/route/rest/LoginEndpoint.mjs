import { Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Op } from 'sequelize';
import { Session } from './Session.mjs';

const LoginEndpoint = new Route(
    'POST', '/login', 'application/json',
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

            const userData = user.get();
            console.log(userData);

            const session = Session.create();
            await user.update(session.getObject());
            res.setCookie(...session.getCookie(), {});
        }
        catch (e) {
            // FIXME: testing
            console.error(e);
        }
    },
);

export default LoginEndpoint;
