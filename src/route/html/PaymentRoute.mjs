import { ReplyType, Route } from '../../Route.mjs';
import { Session } from '../../Session.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';

const PaymentRoute = new Route(
    'GET', '/payment/:token', ReplyType.HTML,
    async (req, res) => {
        const Payment = PaymentModel.use();
        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const sessionCookie = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionCookie);
            console.log('session ' + session.token);

            const user = await User.findOne(session.byRef());

            const payment = await Payment.findOne({
                where: {
                    userId: user.id,
                    token: req.params.token,
                },
            });

            const tickets = await Ticket.findAll({
                where: {
                    paymentId: payment.id,
                },
                include: ['show'],
            });

            console.log(tickets);

            const price = tickets
                .map(ticket => ticket.show.price)
                .reduce((a, c) => a + parseFloat(c), 0);

            return res.viewAsync('payment.hbs', {
                title: payment.title,
                token: payment.token,
                tickets: tickets.map(ticket => ticket.get()),
                isNotPaid: !payment.isPaid,
                price: price,
            });
        }
        catch (e) {
            console.error(e);
            return res.viewAsync('error.hbs', {
                reason: e,
            });
        }
    },
);

export default PaymentRoute;
