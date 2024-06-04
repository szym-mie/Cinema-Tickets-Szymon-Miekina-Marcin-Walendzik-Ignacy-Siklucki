import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import RoomModel from '../../model/RoomModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import { Op } from 'sequelize';

const ShowRoute = new Route(
    'GET', '/show/:id', 'text/html',
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

        return res.viewAsync('show.hbs', { show: show.get(), room: room.get(), seats: seats });
    },
);

export default ShowRoute;
