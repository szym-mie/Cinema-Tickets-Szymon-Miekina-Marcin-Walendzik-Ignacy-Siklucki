import { Route } from '../../Route.mjs';
import ShowModel from '../../model/ShowModel.mjs';
import { Op } from 'sequelize';

const ShowRoute = new Route(
    'GET', '/shows/:id', 'text/html',
    async (_req, res) => {

        const id = _req.params.id;
        const show = await ShowModel.use().findByPk(id);
        const showJSON = JSON.stringify(show);

        // czy nie dodać trzeba tego jakie miejsca są zarezerwowane

        return res.viewAsync('show.html', { content: showJSON });
    },
);

export default ShowRoute;
