import { ReplyType, Route } from '../../Route.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import { TimeFormat } from '../../TimeFormat.mjs';
import { TokenImage } from '../../TokenImage.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const ProfileRoute = new Route(
    'GET', '/profile', ReplyType.HTML,
    async (req, res) => {
        const Payments = PaymentModel.use();
        const Ticket = TicketModel.use();

        try {
            const user = await Session.getUser(req);

            const payments = await Payments.findAll({
                where: {
                    userId: user.id,
                },
            });

            const tickets = await Ticket.findAll({
                where: {
                    '$payment.userId$': user.id,
                    '$payment.isPaid$': true,
                },
                include: { all: true, nested: true },
            });

            const mappedTickets = tickets.map(ticket => ({
                title: ticket.payment.show.movie.title,
                time: new TimeFormat(ticket.payment.show.startTime).toTimeString(),
                roomNumber: ticket.payment.show.room.number,
                seatNumber: ticket.seatNumber,
                tokenImage: new TokenImage(ticket.token, 8).toImageString(),

            }));

            const paymentData = payments.map(payment => payment.get());

            return res.viewAsync('profile.hbs', {
                helloName: user.login,
                unpaidPayments: paymentData.filter(pay => !pay.isPaid),
                paidPayments: paymentData.filter(pay => pay.isPaid),
                tickets: mappedTickets,
            });
        }
        catch (e) {
            return Status.errorPage(res, e);
        }
    },
);

export default ProfileRoute;
