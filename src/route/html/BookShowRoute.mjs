import { ReplyType, Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const BookShowRoute = new Route(
    'GET', '/book_show/:id', ReplyType.HTML,
    async (req, res) => {
        const id = req.params.id;
        const show = await ShowModel.use().findByPk(id, { include: ['room'] });
        const room = await show.room;
        const seatsBooked = await TicketModel.use().findAll({
            where: {
                showId: id,
            },
        });

        const totalSeats = room.seats;
        const bookedSeats = seatsBooked.map(ticket => ticket.seatNumber);
        const seats = [];

        for (let i = totalSeats; i >= 1; i--) {
            seats.push({
                number: i,
                isBooked: bookedSeats.includes(i),
            });
        }

        return res.viewAsync('book_show.hbs', { show: show.get(), room: room.get(), seats: seats });
    },
);

export default BookShowRoute;
