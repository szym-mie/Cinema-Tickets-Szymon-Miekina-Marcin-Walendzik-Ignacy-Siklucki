import { Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Session } from './Session.mjs';

const BookEndpoint = new Route(
    'POST', '/book', 'application/json',
    async (req, _res) => {
        const data = req.body;

        const sessionToken = req.unsignCookie(req.cookies.sessionToken);
        const session = Session.fromToken(sessionToken);

        const ticketToken = Security.createSecureToken(48);

        const showId = data.showId;
        const seatNumber = data.seatNumber;

        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const user = await User.findOne(session.byRef());
            const userId = user.get().id;

            await Ticket.create({
                token: ticketToken,
                userId: userId,
                showId: showId,
                seatNumber: seatNumber,
            });
            return { status: 'ok' };
        }
        catch (e) {
            console.error(e);
            return { status: 'error' };
        }
    },
);

export default BookEndpoint;
