import { Route } from '../../Route.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { Op } from 'sequelize';

const MovieRoute = new Route(
    'GET', '/movie/:id', 'text/html',
    async (_req, res) => {
        const id = _req.params.id;
        console.log('ID FILMU' + id);
        const movie = await MovieModel.use().findByPk(id);

        // getting 7 days time shows

        const today = new Date();
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        const dates = await ShowModel.use().findAll({
            where: {
                movieId: id,
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

        // return res.viewAsync('movie.hbs', { movie: movieJSON });
        return res.viewAsync('movie.hbs', { movie: movie.get(), dates: mappedDates });
    },
);

export default MovieRoute;
