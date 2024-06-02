import { Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

const BookEndpoint = new Route(
    'POST', '/book', 'application/json',
    async (req, _res) => {
        const data = req.body;

        const sessionToken = req.unsignCookie(req.cookies.currentSession);
        const session = Session.fromToken(sessionToken);

        const ticketToken = Security.createSecureToken(48);

        const showId = data.showId;
        const seatNumber = data.seatNumber;

        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const user = await User.findOne(session.byRef());
            const userId = user.id;

            await Ticket.create({
                token: ticketToken,
                userId: userId,
                showId: showId,
                seatNumber: seatNumber,
            });
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            return Status.error(e);
        }
    },
);

export default BookEndpoint;
