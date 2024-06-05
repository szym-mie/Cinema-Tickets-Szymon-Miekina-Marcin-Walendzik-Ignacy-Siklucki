import { ReplyType, Route } from '../../Route.mjs';
import { Op } from 'sequelize';
import { Status } from '../../Status.mjs';
import { TimeFormat } from '../../TimeFormat.mjs';

import ShowModel from '../../model/ShowModel.mjs';

const ShowsRoute = new Route(
    'GET', '/shows', ReplyType.HTML,
    async (_req, res) => {
        const today = new Date();
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        try {
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
                    price: parseFloat(showData.price).toFixed(2),
                    time: new TimeFormat(show.startTime).toTimeString(),
                };
            });

            return res.viewAsync('shows.hbs', { shows: mappedShows });
        }
        catch (e) {
            return Status.errorPage(res, e);
        }
    },
);

export default ShowsRoute;
