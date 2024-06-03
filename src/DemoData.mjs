import MovieModel from './model/MovieModel.mjs';
import RoomModel from './model/RoomModel.mjs';
import ShowModel from './model/ShowModel.mjs';

class DemoDataLoader {
    constructor() {
        this.movies = [];
        this.rooms = [];
        this.shows = [];
    }

    async load(object) {
        const { movies, rooms, shows } = object;

        console.log(movies, rooms, shows);

        for (const movie of movies) await this.addMovie(movie);
        for (const room of rooms) await this.addRoom(room);

        for (let showIndex = 0; showIndex < shows.length; showIndex++) {
            const movieIndex = showIndex % this.movies.length;
            const roomIndex = showIndex % this.rooms.length;

            await this.addShow(shows[showIndex], this.movies[movieIndex], this.rooms[roomIndex]);
        }
    }

    async addMovie(movie) {
        const Movie = MovieModel.use();
        const { title, description, posterUrl, year, runtime } = movie;

        const newMovie = await Movie.create({
            title: title,
            description: description,
            posterUrl: posterUrl,
            year: year,
            runtime: runtime,
        });

        this.movies.push(newMovie);
    }

    async addRoom(room) {
        const Room = RoomModel.use();
        const { number, seats } = room;

        const newRoom = await Room.create({
            number: number,
            seats: seats,
        });

        this.rooms.push(newRoom);
    }

    async addShow(show, movie, room) {
        const Show = ShowModel.use();

        const { startTime, price } = show;

        const newShow = await Show.create({
            movieId: movie.id,
            roomId: room.id,
            startTime: startTime,
            price: price,
        });

        this.shows.push(newShow);
    }
}

const demoData = startTime => ({
    movies: [
        {
            title: 'The Shawshank Redemption',
            description: 'The Shawshank Redemption is a 1994 American prison drama film written and directed by Frank Darabont, based on the 1982 Stephen King novella Rita Hayworth and Shawshank Redemption. The film tells the story of banker Andy Dufresne (Tim Robbins), who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence. Over the following two decades, he befriends a fellow prisoner, contraband smuggler Ellis Red Redding (Morgan Freeman), and becomes instrumental in a money laundering operation led by the prison warden Samuel Norton (Bob Gunton). William Sadler, Clancy Brown, Gil Bellows, and James Whitmore appear in supporting roles.',
            posterUrl: '/public/movies/33.png',
            year: 1994,
            runtime: 142,
        },
        {
            title: 'Fight club',
            description: 'Fight Club is a 1999 American film directed by David Fincher, and starring Brad Pitt, Edward Norton and Helena Bonham Carter. It is based on the 1996 novel by Chuck Palahniuk. Norton plays the unnamed narrator, who is discontented with his white-collar job. He forms a fight club with soap salesman Tyler Durden (Pitt), and becomes embroiled in a relationship with an impoverished but beguilingly attractive woman, Marla Singer (Bonham Carter).',
            posterUrl: '/public/movies/34.png',
            year: 1999,
            runtime: 139,
        },
        {
            title: 'Inglourious Basterds',
            description: 'Inglourious Basterds is a 2009 war film[8] written and directed by Quentin Tarantino, starring Brad Pitt, Christoph Waltz, Michael Fassbender, Eli Roth, Diane Kruger, Daniel Brühl, Til Schweiger and Mélanie Laurent. The film tells an alternate history story of two converging plots to assassinate Nazi Germany\'s leadership at a Paris cinema—one through a British operation largely carried out by a team of Jewish American soldiers led by First Lieutenant Aldo Raine (Pitt), and another by French Jewish cinema proprietor Shosanna Dreyfus (Laurent) who seeks to avenge her murdered family. Both are faced against Hans Landa (Waltz), an SS colonel with a fearsome reputation of hunting Jews. The title was inspired by Italian director Enzo G. Castellari\'s 1978 Euro War film The Inglorious Bastards, though Tarantino\'s film is not a remake of it.',
            posterUrl: '/public/movies/35.png',
            year: 2009,
            runtime: 153,
        },
        {
            title: 'Gran Torino',
            description: 'Gran Torino is a 2008 American drama film directed and produced by Clint Eastwood, who also starred in the film. This was Eastwood\'s first starring role since 2004\'s Million Dollar Baby. The film features a large Hmong-American cast (the first time for an American mainstream film),[4] as well as one of Eastwood\'s younger sons, Scott. Eastwood\'s oldest son of record, Kyle, composed the film\'s score with Michael Stevens, while Jamie Cullum and Clint Eastwood (in-character as Kowalski) provide the theme song.',
            posterUrl: '/public/movies/36.png',
            year: 2008,
            runtime: 116,
        },
        {
            title: 'Psy',
            description: 'In the good old days Franz Maurer and his partners from the secret police used to live like kings. Now, they all must adapt to a new post-communist environment where they are scorned and losing all privileges. Some, like Franz, are like ordinary police fighting against drug dealers. But Franz will soon find out that some of his friends are on the other side.',
            posterUrl: '/public/movies/37.png',
            year: 1992,
            runtime: 104,
        },
    ],
    rooms: [
        {
            number: '1A',
            seats: 56,
        },
        {
            number: '1B',
            seats: 36,
        },
        {
            number: '2',
            seats: 108,
        },
    ],
    shows: (new Array(18)
        .fill(0)
        .map((_, i) => i)
        .map(j => ({
            startTime: startTime + 86_400_000 + j * 7_200_000,
            price: 11.99 + (j % 5) * 3,
        }))
    ),
});

export { DemoDataLoader, demoData };
