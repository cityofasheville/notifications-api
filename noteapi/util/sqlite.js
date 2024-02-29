import sqlite3 from 'sqlite3';
sqlite3.verbose();

function initializeDB() {
    const db = new sqlite3.Database(':memory:');
    // const db = new sqlite3.Database('./db.sqlite3');

    db.serialize(() => {
        db.run(`
    CREATE TABLE IF NOT EXISTS categories (
	id  INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" varchar
    );`);
        db.exec(`
    INSERT INTO categories (name) VALUES
	 ('Development'),
	 ('Noise Compliance');
     `);
        //////////////////////////////////////////
        db.run(`
    CREATE TABLE IF NOT EXISTS tags (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        "name" varchar
    );`);
        db.exec(`
    INSERT INTO tags (category_id,"name") VALUES
    (1,'Minor'),
    (1,'Major'),
    (1,'Affordable'),
    (1,'Slope'),
    (2,'SoundExceedance');
    `);
        //////////////////////////////////////////
        db.run(`
    CREATE TABLE IF NOT EXISTS user_preferences (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        location_x FLOAT,
        location_y FLOAT
    );`);
        // db.exec(`
        // INSERT INTO user_preferences (location_x,location_y) VALUES
        //  (-82.54104097735943,35.58199933945632);	
        //  `);
        //////////////////////////////////////////
        db.run(`
    CREATE TABLE IF NOT EXISTS send_types (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        "type" varchar(10),
        email varchar,
        phone varchar
    );`);
        // db.exec(`
        // INSERT INTO send_types (user_id,"type",email,phone) VALUES
        //  (1,'EMAIL','jtwilson@ashevillenc.gov',NULL);
        //  `);

        //////////////////////////////////////////
        db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tag_id INTEGER,
        radius_miles FLOAT,
        whole_city BOOLEAN
    );`);
        // db.exec(`
        // INSERT INTO subscriptions (user_id,tag_id,radius_miles,whole_city) VALUES
        //  (1,4,NULL,true),
        //  (1,3,NULL,true),
        //  (1,2,NULL,true),
        //  (1,1,NULL,true),
        //  (1,5,1.0,false);
        //  `);
    });

    return db;
}
const db = initializeDB();

// Returns an array of rows
let DBAll = function (sqlString, args) {
    return new Promise((resolve, reject) => {
        db.all(sqlString, args, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}
// Returns a single row
let DBGet = function (sqlString, args) {
    return new Promise((resolve, reject) => {
        db.get(sqlString, args, (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}
// No data returned. (Only returns rows affected for UPDATE, DELETE)
let DBRun = function (sqlString, args) {
    return new Promise((resolve, reject) => {
        db.run(sqlString, args, function (err) {
            if (err) reject(err);
            resolve(this.changes);
        });
    });
}

// No data returned. Return INSERTed id
let DBRunIns = function (sqlInsertString, args) {
    return new Promise((resolve, reject) => {
        db.run(sqlInsertString, args, function (err) {
            if (err) reject(err);
            // lastID is the inserted id, changes is rows affected
            resolve(this.lastID);
        });
    });
}

export { DBAll, DBGet, DBRun, DBRunIns };
