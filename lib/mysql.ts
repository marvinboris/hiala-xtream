import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT!),
    dialect: "mysql",
})

if (process.env.NODE_ENV !== 'production') (async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

export default sequelize