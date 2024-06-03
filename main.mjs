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
import SignUpRoute from './src/route/html/SignUpRoute.mjs';
import ProfileRoute from './src/route/html/ProfileRoute.mjs';
import LogsRoute from './src/route/html/LogsRoute.mjs';
import MovieRoute from './src/route/html/MovieRoute.mjs';
import ShowsRoute from './src/route/html/ShowsRoute.mjs';
import ShowRoute from './src/route/html/ShowRoute.mjs';

import LoginEndpoint from './src/route/rest/LoginEndpoint.mjs';
import SignUpEndpoint from './src/route/rest/SignUpEndpoint.mjs';
import BookShowEndpoint from './src/route/rest/BookShowEndpoint.mjs';
import DeleteUserEndpoint from './src/route/rest/DeleteUserEndpoint.mjs';

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

// DB data adding

const deleteMovies = async () => {
    for (let i = 1; i < 33; i++) {
        const deleted = await MovieModel.use().destroy({
            where: {
                id: i,
            },
        });
        console.log('lol');
    }
};

const addMovies = async () => {
    try {
        await MovieModel.use().create({
            title: 'The Shawshank Redemption',
            description: 'The Shawshank Redemption is a 1994 American prison drama film written and directed by Frank Darabont, based on the 1982 Stephen King novella Rita Hayworth and Shawshank Redemption. The film tells the story of banker Andy Dufresne (Tim Robbins), who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence. Over the following two decades, he befriends a fellow prisoner, contraband smuggler Ellis Red Redding (Morgan Freeman), and becomes instrumental in a money laundering operation led by the prison warden Samuel Norton (Bob Gunton). William Sadler, Clancy Brown, Gil Bellows, and James Whitmore appear in supporting roles.',
            year: 1994,
            runtime: 142,
        });

        await MovieModel.use().create({
            title: 'Fight club',
            description: 'Fight Club is a 1999 American film directed by David Fincher, and starring Brad Pitt, Edward Norton and Helena Bonham Carter. It is based on the 1996 novel by Chuck Palahniuk. Norton plays the unnamed narrator, who is discontented with his white-collar job. He forms a fight club with soap salesman Tyler Durden (Pitt), and becomes embroiled in a relationship with an impoverished but beguilingly attractive woman, Marla Singer (Bonham Carter).',
            year: 1999,
            runtime: 139,
        });

        await MovieModel.use().create({
            title: 'Inglourious Basterds',
            description: 'Inglourious Basterds is a 2009 war film[8] written and directed by Quentin Tarantino, starring Brad Pitt, Christoph Waltz, Michael Fassbender, Eli Roth, Diane Kruger, Daniel Brühl, Til Schweiger and Mélanie Laurent. The film tells an alternate history story of two converging plots to assassinate Nazi Germany\'s leadership at a Paris cinema—one through a British operation largely carried out by a team of Jewish American soldiers led by First Lieutenant Aldo Raine (Pitt), and another by French Jewish cinema proprietor Shosanna Dreyfus (Laurent) who seeks to avenge her murdered family. Both are faced against Hans Landa (Waltz), an SS colonel with a fearsome reputation of hunting Jews. The title was inspired by Italian director Enzo G. Castellari\'s 1978 Euro War film The Inglorious Bastards, though Tarantino\'s film is not a remake of it.',
            year: 2009,
            runtime: 153,
        });

        await MovieModel.use().create({
            title: 'Gran Torino',
            description: 'Gran Torino is a 2008 American drama film directed and produced by Clint Eastwood, who also starred in the film. This was Eastwood\'s first starring role since 2004\'s Million Dollar Baby. The film features a large Hmong-American cast (the first time for an American mainstream film),[4] as well as one of Eastwood\'s younger sons, Scott. Eastwood\'s oldest son of record, Kyle, composed the film\'s score with Michael Stevens, while Jamie Cullum and Clint Eastwood (in-character as Kowalski) provide the theme song.',
            year: 2008,
            runtime: 116,
        });

        console.log('Movies added.');
    }
    catch (error) {
        console.error('Cannot add movies: ', error);
    }
};

const addRooms = async () => {
    try {
        await RoomModel.use().create({
            number: 1,
            seats: 60,
        });
        await RoomModel.use().create({
            number: 2,
            seats: 60,
        });
        await RoomModel.use().create({
            number: 3,
            seats: 60,
        });
        await RoomModel.use().create({
            number: 4,
            seats: 50,
        });
        await RoomModel.use().create({
            number: 5,
            seats: 50,
        });
        await RoomModel.use().create({
            number: 6,
            seats: 50,
        });
        console.log('Added rooms');
    }
    catch (error) {
        console.error('Cannot add rooms: ', error);
    }
};

const addShows = async () => {
    try {
        for (let i = 33; i < 37; i++) {
            for (let j = 0; j < 4; j++) {
                await ShowModel.use().create({
                    movieId: i,
                    roomId: j + 1,
                    startTime: new Date(2024, 5, 3 + (j * 2) + (i - 33), 12 + j, ((j % 2) * 30), 0),
                    price: 18.99,
                });
                // console.log('Added lol', i)
            }
        }
        console.log('Added shows');
    }
    catch (error) {
        console.error('Cannot add shows: ', error);
    }
};

// DB connecting

try {
    await modelManager.connect();
    await modelManager.init(true);

    // await addShows();
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

routeManager.withContext({ modelManager });

routeManager.addRoute(IndexRoute);
routeManager.addRoute(LoginRoute);
routeManager.addRoute(SignUpRoute);
routeManager.addRoute(ProfileRoute);
routeManager.addRoute(LogsRoute);
routeManager.addRoute(MovieRoute);
routeManager.addRoute(ShowsRoute);
routeManager.addRoute(ShowRoute);

routeManager.addRoute(LoginEndpoint);
routeManager.addRoute(SignUpEndpoint);
routeManager.addRoute(BookShowEndpoint);
routeManager.addRoute(DeleteUserEndpoint);

await routeManager.startServer();
