import { ReplyType, Route } from '../../Route.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const PaymentRoute = new Route(
    'GET', '/payment/:token', ReplyType.HTML,
    async (req, res) => {
        const Payment = PaymentModel.use();
        const Ticket = TicketModel.use();

        try {
            const user = await Session.getUser(req);

            const payment = await Payment.findOne({
                where: {
                    userId: user.id,
                    token: req.params.token,
                },
                include: ['show'],
            });

            const tickets = await Ticket.findAll({
                where: {
                    paymentId: payment.id,
                },
            });

            const price = tickets.length * parseFloat(payment.show.price);

            return res.viewAsync('payment.hbs', {
                title: payment.title,
                token: payment.token,
                tickets: tickets.map(ticket => ticket.get()),
                isNotPaid: !payment.isPaid,
                price: price,
            });
        }
        catch (e) {
            return Status.errorPage(res, e);
        }
    },
);

export default PaymentRoute;
