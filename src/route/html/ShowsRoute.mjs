import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { Op } from 'sequelize';

const ShowsRoute = new Route(
    'GET', '/shows', 'text/html',
    async (_req, res) => {
        const today = new Date();
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        const dates = await ShowModel.use().findAll({
            where: {
                startTime: {
                    [Op.gte]: today,
                    [Op.lt]: week,
                },
            },
        });

        const mappedDates = dates.map((show) => {
            return {
                showId: show.id,
                day: show.startTime.getDate(),
                month: show.startTime.getMonth() + 1,
                year: show.startTime.getFullYear(),
                hour: show.startTime.getHours(),
                minutes: show.startTime.getMinutes(),
            };
        });

        return res.viewAsync('shows.hbs', { shows: mappedDates });
        // return res.viewAsync('shows.hbs');
    },
);

export default ShowsRoute;
