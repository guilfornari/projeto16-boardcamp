import { db } from "../database/database.js";


export async function addGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const game = await db.query(`
        INSERT INTO games (name, image, "stockTotal", "pricePerDay")
        VALUES (${name}, ${image}, ${stockTotal}, ${pricePerDay});`);

        console.table(game);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`);
        console.table(games.rows);
        res.send(games.rows).status(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}