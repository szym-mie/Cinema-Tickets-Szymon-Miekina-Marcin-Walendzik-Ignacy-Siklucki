import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import { Op } from 'sequelize';

const ShowRoute = new Route(
    'GET', '/show/:id', 'text/html',
    async (_req, res) => {
        const id = _req.params.id;
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

        const movie = await MovieModel.use().findByPk(show.movieId);
        const date = {
            day: show.startTime.getDate().toString().padStart(2, '0'),
            month: (show.startTime.getMonth() + 1).toString().padStart(2, '0'),
            year: show.startTime.getFullYear(),
            hour: show.startTime.getHours(),
            minutes: show.startTime.getMinutes().toString().padStart(2, '0'),
        }
        
        return res.viewAsync('show.hbs', { show: show.get(), room: room.get(), seats: seats, movie: movie.get(), date: date});
    },
);

export default ShowRoute;
