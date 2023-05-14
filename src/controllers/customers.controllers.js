import { db } from "../database/database.js";
import dayjs from "dayjs";


export async function addCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customer = await db.query(`SELECT customers.cpf FROM customers WHERE cpf = $1;`, [cpf]);
        if (customer.rows[0]) return res.sendStatus(409);

        await db.query(`
                INSERT INTO customers ("name", "phone", "cpf", "birthday")
                VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomers(req, res) {

    try {
        const resCustomers = await db.query(`SELECT * FROM customers;`);

        const customers = resCustomers.rows.map(c => ({ ...c, birthday: dayjs(c.birthday).format("YYYY-MM-DD") }));

        res.send(customers).status(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;

    try {
        const resCustomer = await db.query(`SELECT * FROM customers WHERE customers.id = $1;`
            , [id]);

        if (!resCustomer.rows[0]) return res.sendStatus(404);

        const customer = { ...resCustomer.rows[0], birthday: dayjs(resCustomer.rows[0].birthday).format("YYYY-MM-DD") };

        res.send(customer).status(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function editCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const existCustomer = await db.query(`SELECT * FROM customers WHERE customers.id = $1;`, [id]);
        if (!existCustomer.rows[0]) return res.sendStatus(404);

        const sameCpf = await db.query(`SELECT customers.cpf
        FROM customers WHERE (customers.id != $1 AND customers.cpf = $2);`, [id, cpf]);
        console.log(sameCpf.rows[0]);
        if (sameCpf.rows[0]) return res.sendStatus(409);


        await db.query(`UPDATE customers
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE customers.id = $5;`, [name, phone, cpf, birthday, id]);

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}
