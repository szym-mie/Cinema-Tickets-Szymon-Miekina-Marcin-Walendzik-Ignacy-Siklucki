import { ModelManager } from './src/ModelManager.mjs';

import LogModel from './src/model/LogModel.mjs';
import MovieModel from './src/model/MovieModel.mjs';
import RoomModel from './src/model/RoomModel.mjs';
import ShowModel from './src/model/ShowModel.mjs';
import TicketModel from './src/model/TicketModel.mjs';
import UserModel from './src/model/UserModel.mjs';

import TicketUserAssoc from './src/assoc/TicketUserAssoc.mjs';
import TicketShowAssoc from './src/assoc/TicketShowAssoc.mjs';
import ShowMovieAssoc from './src/assoc/ShowMovieAssoc.mjs';
import ShowRoomAssoc from './src/assoc/ShowRoomAssoc.mjs';

import { RouteManager } from './src/RouteManager.mjs';

import mustache from 'mustache';

import IndexRoute from './src/route/html/IndexRoute.mjs';
import LoginEndpoint from './src/route/rest/LoginEndpoint.mjs';
import SignUpEndpoint from './src/route/rest/SignUpEndpoint.mjs';
import BookEndpoint from './src/route/rest/BookEndpoint.mjs';

// Database
const modelManager = new ModelManager({
    database: 'cinema',
    username: 'postgres',
    password: /* process.env.ORM_PASSWORD */ 'zaq1@WSX',
    dialect: 'postgres',
    log: 'line',
});

modelManager.addModel(LogModel);
modelManager.addModel(MovieModel);
modelManager.addModel(RoomModel);
modelManager.addModel(ShowModel);
modelManager.addModel(TicketModel);
modelManager.addModel(UserModel);

modelManager.addAssoc(TicketShowAssoc);
modelManager.addAssoc(TicketUserAssoc);
modelManager.addAssoc(ShowMovieAssoc);
modelManager.addAssoc(ShowRoomAssoc);

try {
    await modelManager.connect();
    await modelManager.init(true);
    console.log('connected to database.');
}
catch (e) {
    console.error('cannot connect to database: ' + e);
}

// HTTP
const routeManager = new RouteManager({
    port: 3000,
});

routeManager.withStatic({
    root: './public/',
    prefix: '/public/',
});

routeManager.withView({
    root: './template/',
    engine: 'mustache',
    plugin: mustache,
    extra: {
        partials: {
            header: 'header.mustache',
            navbar: 'navbar.mustache',
            footer: 'footer.mustache',
        },
    },
});

routeManager.withCookie({
    secret: /* process.env.COOKIE_SECRET */ 'abcdefgh01234567',
    default: { maxAge: 604_800 },
});

routeManager.addRoute(IndexRoute);
routeManager.addRoute(LoginEndpoint);
routeManager.addRoute(SignUpEndpoint);
routeManager.addRoute(BookEndpoint);

await routeManager.startServer();
