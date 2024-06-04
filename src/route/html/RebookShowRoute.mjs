import { ReplyType, Route } from '../../Route.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const RebookShowRoute = new Route(
    'GET', '/rebook_show/:token', ReplyType.HTML,
    async (req, res) => {
        const paymentToken = req.params.token;

        const payment = await PaymentModel.use().findOne({
            where: {
                token: paymentToken,
            },
        });

        const seatsBooked = await TicketModel.use().findAll({
            where: {
                showId: payment.showId,
            },
        });

        const seatsTaken = await TicketModel.use().findAll({
            where: {
                paymentId: payment.id,
            },
        });

        const show = await ShowModel.use().findOne({
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

        console.log(seats);

        return res.viewAsync('rebook_show.hbs', { payment: payment.get(), seats: seats });
    },
);

export default RebookShowRoute;
