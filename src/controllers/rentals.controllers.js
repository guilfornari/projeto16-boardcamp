import dayjs from "dayjs";
import { db } from "../database/database.js";

export async function addRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const game = await db.query(`SELECT * FROM games WHERE games.id = $1;`, [gameId]);
        if (!game.rows[0]) return res.sendStatus(400);

        const price = game.rows[0].pricePerDay;

        const customer = await db.query(`SELECT * FROM customers WHERE customers.id = $1;`, [customerId]);
        if (!customer.rows[0]) return res.sendStatus(400);

        const rental = await db.query(`SELECT * FROM rentals WHERE rentals."gameId" = $1;`, [gameId]);
        if (rental.rows.length === game.rows[0].stockTotal) return res.sendStatus(400);

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

export async function listRentals(req, res) {

    try {
        const resRentals = await db.query(`
        SELECT rentals.*,
        customers.id AS c_id,
        customers.name AS c_name,
        games.id AS g_id,
        games.name AS g_name
        FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id;`);

        const rentals = resRentals.rows.map(r =>
        ({
            id: r.id,
            customerId: r.customerId,
            gameId: r.gameId,
            rentDate: dayjs(r.rentDate).format("YYYY-MM-DD"),
            daysRented: r.daysRented,
            returnDate: r.returnDate,
            originalPrice: r.originalPrice,
            delayFee: r.delayFee,
            customer: {
                id: r.c_id,
                name: r.c_name
            },
            game: {
                id: r.g_id,
                name: r.g_name
            }
        }));

        res.status(200).send(rentals);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;
    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE rentals.id = $1;`, [id]);
        if (!rental.rows[0]) return res.sendStatus(404);

        if (rental.rows[0].returnDate === null) {

            const today = dayjs();
            const toReturnDate = dayjs(rental.rows[0].rentDate).add(rental.rows[0].daysRented, "day");
            const delayDays = today.diff(toReturnDate, "day");
            const delayFee = (delayDays > 0) ? (delayDays * (rental.rows[0].originalPrice / rental.rows[0].daysRented)) : 0;

            await db.query(`UPDATE rentals
        SET "returnDate" = $1,
        "delayFee" = $2
        WHERE rentals.id = $3;`, [today, delayFee, id]);

            res.sendStatus(200);
        }

        if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE rentals.id = $1;`, [id]);
        if (!rental.rows[0]) return res.sendStatus(404);

        console.log(rental.rows[0].returnDate !== null);

        if (rental.rows[0].returnDate !== null) {

            await db.query(`DELETE FROM rentals
        WHERE rentals.id = $1;`, [id]);

            res.sendStatus(200);
        }

        if (rental.rows[0].returnDate === null) return res.sendStatus(400);

    } catch (err) {
        res.status(500).send(err.message);
    }
}



