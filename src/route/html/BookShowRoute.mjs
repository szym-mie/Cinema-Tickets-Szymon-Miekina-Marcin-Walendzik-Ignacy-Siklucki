import { ReplyType, Route } from '../../Route.mjs';
import { Status } from '../../Status.mjs';
import { TimeFormat } from '../../TimeFormat.mjs';

import MovieModel from '../../model/MovieModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import TicketModel from '../../model/TicketModel.mjs';

const BookShowRoute = new Route(
    'GET', '/book_show/:id', ReplyType.HTML,
    async (req, res) => {
        const id = req.params.id;

        const Show = ShowModel.use();
        const Ticket = TicketModel.use();
        const Movie = MovieModel.use();

        try {
            const show = await Show.findByPk(id, { include: ['room'] });
            const movie = await Movie.findByPk(show.movieId);

            const seatsBooked = await Ticket.findAll({
                where: {
                    '$payment.showId$': id,
                },
                include: ['payment'],
            });

            const totalSeats = show.room.seats;
            const bookedSeats = seatsBooked.map(ticket => ticket.seatNumber);
            const seats = [];

            for (let i = totalSeats; i >= 1; i--) {
                seats.push({
                    number: i,
                    isBooked: bookedSeats.includes(i),
                });
            }

            const time = new TimeFormat(show.startTime).toTimeString();

            return res.viewAsync('book_show.hbs', {
                time: time,
                show: show.get(),
                room: show.room.get(),
                movie: movie.get(),
                seats: seats,
            });
        }
        catch (e) {
            return Status.errorPage(res, e);
        }
    },
);

export default BookShowRoute;
