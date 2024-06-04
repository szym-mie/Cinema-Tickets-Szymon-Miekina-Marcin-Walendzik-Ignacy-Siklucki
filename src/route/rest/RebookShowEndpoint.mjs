import { ReplyType, Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Security } from '../../Security.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import { Logging } from '../../Logging.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';

const RebookShowEndpoint = new Route(
    'POST', '/rebook_show', ReplyType.JSON,
    async (req, _res) => {
        const data = req.body;

        const showId = data.showId;
        const paymentToken = data.paymentToken;
        const seatNumbers = data.seatNumbers;

        if (seatNumbers.length === 0) return Status.ok();

        const Payment = PaymentModel.use();
        const Ticket = TicketModel.use();
        const User = UserModel.use();

        console.log(req.modelManager.newTransaction);

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionToken);
            const user = await User.findOne(session.byRef());

            const payment = await Payment.findOne({
                where: {
                    token: paymentToken,
                    userId: user.id,
                },
                include: ['tickets'],
            });

            if (payment === null || payment.tickets.length === 0 || payment.isPaid)
                return Status.error(new Error('No such payment'));

            const transaction = await req.modelManager.newTransaction();
            await transaction.of(async (t) => {
                for (const ticket of payment.tickets) {
                    await ticket.destroy();
                }
                for (const seatNumber of seatNumbers) {
                    const ticketToken = Security.createSecureToken(48);
                    await Ticket.create(t.wrap({
                        token: ticketToken,
                        userId: user.id,
                        showId: showId,
                        paymentId: payment.id,
                        seatNumber: seatNumber,
                    }));
                    Logging.logInfo('Ticket for #' + showId + ', seat ' + seatNumber + ' was rebooked', 'Ticket');
                }
            });

            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Rebook ticket failed - ' + e.message, 'Ticket');
            return Status.error(e);
        }
    },
);

export default RebookShowEndpoint;
