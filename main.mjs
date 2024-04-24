import { Sequelize } from 'sequelize';
import UserModel from './src/model/UserModel.mjs';

const db = new Sequelize('cinema', 'postgres', 'zaq1@WSX', {
    host: 'localhost',
    dialect: 'postgres'
});

try {
    await db.authenticate();
    console.log('connected to database');
} catch (error) {
    console.error('cannot connect to database: ', error);
}

const User = await UserModel.init(db);

await User.create({
    Login: 'jp2',
    Password: 'zaq1@WSX',
    Email: 'jp2@wadowice.pl'
});

const users = await User.findAll();
console.log(users.map(v => v.dataValues));

db.close();