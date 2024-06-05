import { ReplyType, Route } from '../../Route.mjs';
import { Status } from '../../Status.mjs';
import { TimeFormat } from '../../TimeFormat.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const RebookShowRoute = new Route(
    'GET', '/rebook_show/:token', ReplyType.HTML,
    async (req, res) => {
        const paymentToken = req.params.token;

        const Payment = PaymentModel.use();
        const Ticket = TicketModel.use();
        const Show = ShowModel.use();

        try {
            const payment = await Payment.findOne({
                where: {
                    token: paymentToken,
                },
                include: { all: true, nested: true },
            });

            const seatsBooked = await Ticket.findAll({
                where: {
                    '$payment.showId$': payment.showId,
                },
                include: ['payment'],
            });

            const seatsTaken = await Ticket.findAll({
                where: {
                    paymentId: payment.id,
                },
                include: ['payment'],
            });

            const show = await Show.findOne({
                where: {
                    id: payment.showId,
                },
                include: ['room'],
            });

            const totalSeats = show.room.seats;
            const seatsNumbersBooked = seatsBooked.map(ticket => ticket.seatNumber);
            const seatsNumbersTaken = seatsTaken.map(ticket => ticket.seatNumber);
            const seats = [];

            for (let i = totalSeats; i >= 1; i--) {
                const seatIsTaken = seatsNumbersTaken.includes(i);
                seats.push({
                    number: i,
                    isBooked: seatsNumbersBooked.includes(i) && !seatIsTaken,
                    isTaken: seatIsTaken,
                });
            }

            const time = new TimeFormat(show.startTime).toTimeString();

            return res.viewAsync('rebook_show.hbs', {
                time: time,
                payment: payment.get(),
                show: payment.show.get(),
                room: payment.show.room.get(),
                movie: payment.show.movie.get(),
                seats: seats,
            });
        }
        catch (e) {
            return Status.errorPage(res, e);
        }
    },
);

export default RebookShowRoute;
