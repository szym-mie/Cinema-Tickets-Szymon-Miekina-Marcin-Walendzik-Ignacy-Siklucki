import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { Op } from 'sequelize';

const ShowRoute = new Route(
    'GET', '/shows', 'text/html',
    async (_req, res) => {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const shows = await ShowModel.use().findAll({
            where: {
                startDate: {
                    [Op.between]: [startOfWeek, endOfWeek],
                },
            },
        });

        return res.viewAsync('shows.hbs', { shows: shows });
    },
);

export default ShowRoute;
