import { Route } from '../../Route.mjs';
import { Session } from '../../Session.mjs';
import UserModel from '../../model/UserModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import { Logging } from '../../Logging.mjs';

const DeleteUserEndpoint = new Route(
    'POST', '/delete_user', 'application/json',
    async (req, _res) => {
        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionToken);

            const user = await User.findOne(session.byRef());
            const userId = user.id;

            await req.modelManager.newTransaction()
                .with((t) => {
                    User.destroy(t.wrap({
                        where: {
                            userId: userId,
                        },
                    }));

                    Ticket.destroy(t.wrap({
                        where: {
                            userId: userId,
                        },
                    }));
                });

            Logging.logInfo('User ' + data.login + ' was deleted', 'User/Ticket');
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('User delete failed - ' + e.message, 'User/Ticket');
            return Status.error(e);
        }
    },
);

export default DeleteUserEndpoint;
