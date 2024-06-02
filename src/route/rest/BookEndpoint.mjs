import { Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import { Logging } from '../../Logging.mjs';

const BookEndpoint = new Route(
    'POST', '/book', 'application/json',
    async (req, _res) => {
        const data = req.body;

        const ticketToken = Security.createSecureToken(48);

        const showId = data.showId;
        const seatNumber = data.seatNumber;

        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromToken(sessionToken);

            const user = await User.findOne(session.byRef());
            const userId = user.id;

            await Ticket.create({
                token: ticketToken,
                userId: userId,
                showId: showId,
                seatNumber: seatNumber,
            });

            Logging.logInfo('Ticket for #' + data.showId + ' was booked', 'Ticket');
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Book ticket failed - ' + e.message, 'Ticket');
            return Status.error(e);
        }
    },
);

export default BookEndpoint;
