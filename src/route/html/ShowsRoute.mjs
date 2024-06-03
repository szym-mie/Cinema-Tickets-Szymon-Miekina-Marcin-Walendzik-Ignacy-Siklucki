import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import MovieModel from '../../model/MovieModel.mjs';
import { Op } from 'sequelize';

const ShowsRoute = new Route(
    'GET', '/shows', 'text/html',
    async (_req, res) => {
        const today = new Date();
        const week = new Date(today);
        week.setDate(week.getDate() + 7);

        const showsDict = {};

        const actualShows = await ShowModel.use().findAll({
            where: {
                startTime: {
                    [Op.gte]: today,
                    [Op.lt]: week,
                },
            },
        });

        actualShows.forEach(show => {
            const movieId = show.movieId;

            if (!showsDict.hasOwnProperty(movieId)) {
                showsDict[movieId] = [];
            }

            showsDict[movieId].push({
                showId: show.id,
                startTime: show.startTime,
                roomId: show.roomId,
                price: show.price
            });
        });

        const movieIds = Object.keys(showsDict);

        const movies = await MovieModel.use().findAll({
            where: {
                id: {
                    [Op.in]: movieIds,
                },
            },
        });

        const showsArray = movies.map(movie => {
            return {
                movieId: movie.id,
                title: movie.title
            };
        });

        return res.viewAsync('shows.hbs', {shows: showsArray});
    },
);

export default ShowsRoute;
