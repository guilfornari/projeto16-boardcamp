import dayjs from "dayjs";
import { db } from "../database/database.js";

export async function addRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const game = await db.query(`SELECT * FROM games WHERE games.id = $1;`, [gameId]);
        if (!game.rows[0] || game.rows[0].stockTotal === 0) return res.sendStatus(400);

        const price = game.rows[0].pricePerDay;

        const customer = await db.query(`SELECT * FROM customers WHERE customers.id = $1;`, [customerId]);
        if (!customer.rows[0]) return res.sendStatus(400);

        const rentDate = dayjs().format("YYYY-MM-DD");
        const returnDate = null;
        const originalPrice = daysRented * price;
        const delayFee = null;

        await db.query(`
        INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}