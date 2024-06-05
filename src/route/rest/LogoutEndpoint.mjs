import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

const LogoutEndpoint = new Route(
    'POST', '/logout', ReplyType.JSON,
    async (req, res) => {
        try {
            const { user, session } = await Session.getUserAndSession(req);

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
