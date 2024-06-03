import { ReplyType, Route } from '../../Route.mjs';
import { Session } from '../../Session.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';

const ProfileRoute = new Route(
    'GET', '/profile', ReplyType.HTML,
    async (req, res) => {
        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const sessionCookie = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionCookie);
            console.log('session ' + session.token);

            const user = await User.findOne(session.byRef());
            const userId = user.id;

            const tickets = await Ticket.findAll({
                where: {
                    userId: userId,
                },
            });

            console.log(tickets.map(ticket => ticket.get()));

            return res.viewAsync('profile.hbs', { helloName: user.login, tickets: tickets.map(ticket => ticket.get()) });
        }
        catch (e) {
            console.error(e);
            res.redirect('/login');
            return '';
        }
    },
);

export default ProfileRoute;
