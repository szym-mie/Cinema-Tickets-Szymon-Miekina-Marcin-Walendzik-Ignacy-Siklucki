import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Security } from '../../Security.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

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

        try {
            const user = await Session.getUser(req);

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
                    await ticket.destroy(t.wrap({}));
                }
                for (const seatNumber of seatNumbers) {
                    const hasSeatBeenTaken = await Ticket.count(t.wrap({
                        where: {
                            '$payment.showId$': showId,
                            'seatNumber': seatNumber,
                        },
                        include: ['payment'],
                    })) > 0;

                    if (hasSeatBeenTaken) {
                        throw new Error('Seat taken');
                    }

                    const ticketToken = Security.createSecureToken(48);
                    await Ticket.create(t.wrap({
                        token: ticketToken,
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
