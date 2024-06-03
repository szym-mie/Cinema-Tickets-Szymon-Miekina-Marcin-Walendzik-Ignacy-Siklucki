import { ModelManager } from './src/ModelManager.mjs';

import LogModel from './src/model/LogModel.mjs';
import MovieModel from './src/model/MovieModel.mjs';
import PaymentModel from './src/model/PaymentModel.mjs';
import RoomModel from './src/model/RoomModel.mjs';
import ShowModel from './src/model/ShowModel.mjs';
import TicketModel from './src/model/TicketModel.mjs';
import UserModel from './src/model/UserModel.mjs';

import TicketUserAssoc from './src/assoc/TicketUserAssoc.mjs';
import TicketShowAssoc from './src/assoc/TicketShowAssoc.mjs';
import TicketPaymentAssoc from './src/assoc/TicketPaymentAssoc.mjs';
import ShowMovieAssoc from './src/assoc/ShowMovieAssoc.mjs';
import ShowRoomAssoc from './src/assoc/ShowRoomAssoc.mjs';

import { RouteManager } from './src/RouteManager.mjs';

import handlebars from 'handlebars';

import IndexRoute from './src/route/html/IndexRoute.mjs';
import LoginRoute from './src/route/html/LoginRoute.mjs';
import LogoutRoute from './src/route/html/LogoutRoute.mjs';
import SignUpRoute from './src/route/html/SignUpRoute.mjs';
import ProfileRoute from './src/route/html/ProfileRoute.mjs';
import LogsRoute from './src/route/html/LogsRoute.mjs';
import MovieRoute from './src/route/html/MovieRoute.mjs';
import ShowsRoute from './src/route/html/ShowsRoute.mjs';
import ShowRoute from './src/route/html/ShowRoute.mjs';

import LoginEndpoint from './src/route/rest/LoginEndpoint.mjs';
import LogoutEndpoint from './src/route/rest/LogoutEndpoint.mjs';
import SignUpEndpoint from './src/route/rest/SignUpEndpoint.mjs';
import BookShowEndpoint from './src/route/rest/BookShowEndpoint.mjs';
import DeleteUserEndpoint from './src/route/rest/DeleteUserEndpoint.mjs';
import { DemoDataLoader, demoData } from './src/DemoData.mjs';
import DeleteTicketEndpoint from './src/route/rest/DeleteTicketEndpoint.mjs';
import FinishPaymentEndpoint from './src/route/rest/FinishPaymentEndpoint.mjs';
import RefusePaymentEndpoint from './src/route/rest/RefusePaymentEndpoint.mjs';

// Database
const modelManager = new ModelManager({
    database: 'cinema',
    username: 'postgres',
    password: /* process.env.ORM_PASSWORD */ 'zaq1@WSX',
    dialect: 'postgres',
    log: 'line',
});

modelManager.addAssoc(TicketShowAssoc);
modelManager.addAssoc(TicketUserAssoc);
modelManager.addAssoc(TicketPaymentAssoc);
modelManager.addAssoc(ShowMovieAssoc);
modelManager.addAssoc(ShowRoomAssoc);

modelManager.addModel(LogModel);
modelManager.addModel(MovieModel);
modelManager.addModel(PaymentModel);
modelManager.addModel(RoomModel);
modelManager.addModel(ShowModel);
modelManager.addModel(TicketModel);
modelManager.addModel(UserModel);

// DB connecting
try {
    await modelManager.connect();
    await modelManager.nukeData();
    await modelManager.init(true);

    // await addShows();
    console.log('connected to database.');
}
catch (e) {
    console.error('cannot connect to database: ' + e);
}

// DB data adding
const dataLoader = new DemoDataLoader();
await dataLoader.load(demoData(Date.now()));

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
    engine: 'handlebars',
    plugin: handlebars,
    extra: {
        partials: {
            header: 'header.hbs',
            navbar: 'navbar.hbs',
            footer: 'footer.hbs',
        },
    },
});

routeManager.withCookie({
    secret: /* process.env.COOKIE_SECRET */ 'abcdefgh01234567',
    default: { maxAge: 604_800, sameSite: 'lax' },
    default: { maxAge: 604_800, sameSite: 'lax' },
});

routeManager.withContext({ modelManager: modelManager });

routeManager.addRoute(IndexRoute);
routeManager.addRoute(LoginRoute);
routeManager.addRoute(LogoutRoute);
routeManager.addRoute(SignUpRoute);
routeManager.addRoute(ProfileRoute);
routeManager.addRoute(LogsRoute);
routeManager.addRoute(MovieRoute);
routeManager.addRoute(ShowsRoute);
routeManager.addRoute(ShowRoute);

routeManager.addRoute(LoginEndpoint);
routeManager.addRoute(LogoutEndpoint);
routeManager.addRoute(SignUpEndpoint);
routeManager.addRoute(BookShowEndpoint);
routeManager.addRoute(DeleteUserEndpoint);
routeManager.addRoute(DeleteTicketEndpoint);
routeManager.addRoute(FinishPaymentEndpoint);
routeManager.addRoute(RefusePaymentEndpoint);

await routeManager.startServer();
