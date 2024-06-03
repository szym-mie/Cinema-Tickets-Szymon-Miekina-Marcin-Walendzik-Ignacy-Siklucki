import { ReplyType, Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import { Logging } from '../../Logging.mjs';

const LogoutEndpoint = new Route(
    'POST', '/logout', ReplyType.JSON,
    async (req, res) => {
        const User = UserModel.use();

        try {
            const sessionCookie = req.unsignCookie(req.cookies.currentSession);
            console.log(sessionCookie);
            const session = Session.fromCookie(sessionCookie);
            console.log(session);
            const user = await User.findOne(session.byRef());

            if (user !== null) {
                await user.update(session.getObject());
                Logging.logInfo('User ' + user.login + ' logout', 'User');
            }

            session.destroy();
            res.setCookie(...session.getCookie(), {});

            return Status.ok();
        }
        catch (e) {
            Logging.logError('Logout failed - ' + e.message, 'User');
            return Status.error(e);
        }
    },
);

export default LogoutEndpoint;
