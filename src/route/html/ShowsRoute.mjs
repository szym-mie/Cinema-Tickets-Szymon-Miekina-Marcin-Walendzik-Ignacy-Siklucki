import { ReplyType, Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { Op } from 'sequelize';

const ShowsRoute = new Route(
    'GET', '/shows', ReplyType.HTML,
    async (_req, res) => {
        const today = new Date();
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        const shows = await ShowModel.use().findAll({
            where: {
                startTime: {
                    [Op.gte]: today,
                    [Op.lt]: week,
                },
            },
            order: ['startTime'],
            include: ['movie', 'room'],
        });

        console.log(shows.map(show => show.get()));

        const mappedShows = shows.map((show) => {
            const showData = show.get();
            const movieData = show.movie.get();
            const roomData = show.room.get();

            return {
                id: showData.id,
                movie: movieData,
                room: roomData,
                price: showData.price,
                day: showData.startTime.getDate().toString().padStart(2, '0'),
                month: (showData.startTime.getMonth() + 1).toString().padStart(2, '0'),
                year: showData.startTime.getFullYear(),
                hour: showData.startTime.getHours(),
                minutes: showData.startTime.getMinutes().toString().padStart(2, '0'),
            };
        });

        return res.viewAsync('shows.hbs', { shows: mappedShows });
    },
);

export default ShowsRoute;
