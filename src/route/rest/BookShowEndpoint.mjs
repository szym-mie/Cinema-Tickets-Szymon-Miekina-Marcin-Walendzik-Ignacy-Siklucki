import { ReplyType, Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import { Logging } from '../../Logging.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { TimeFormat } from '../../TimeFormat.mjs';

const BookShowEndpoint = new Route(
    'POST', '/book_show', ReplyType.JSON,
    async (req, _res) => {
        const data = req.body;

        const showId = data.showId;
        const seatNumbers = data.seatNumbers;

        if (seatNumbers.length === 0) return Status.ok();

        const Show = ShowModel.use();
        const Payment = PaymentModel.use();
        const Ticket = TicketModel.use();
        const User = UserModel.use();

        console.log(req.modelManager.newTransaction);

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionToken);
            const user = await User.findOne(session.byRef());

            const show = await Show.findOne({
                where: {
                    id: showId,
                },
                include: ['movie', 'room'],
            });

            const time = new TimeFormat(show.startTime);

            const title = show.movie.title + ' ' + time.toTimeString();

            const transaction = await req.modelManager.newTransaction();
            await transaction.of(async (t) => {
                const paymentToken = Security.createSecureToken(12);
                const payment = await Payment.create(t.wrap({
                    title: title,
                    token: paymentToken,
                    userId: user.id,
                }));

                for (const seatNumber of seatNumbers) {
                    const ticketToken = Security.createSecureToken(48);
                    await Ticket.create(t.wrap({
                        token: ticketToken,
                        userId: user.id,
                        showId: showId,
                        paymentId: payment.id,
                        seatNumber: seatNumber,
                    }));
                    Logging.logInfo('Ticket for #' + data.showId + ', seat ' + seatNumber + ' was booked', 'Ticket');
                }
            });

            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Book ticket failed - ' + e.message, 'Ticket');
            return Status.error(e);
        }
    },
);

export default BookShowEndpoint;
