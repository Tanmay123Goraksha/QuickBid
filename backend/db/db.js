const {Client} = require('pg');


const client = new Client({

user:"postgres",
host:"localhost",
database:"auctiondb",
password:"postgres",
port: 5432,

});


client.connect()
.then(() => {
    console.log("Connected to PG DB");
})
.catch((err) => {
    console.log("Connection Error",err.stack);
});
client.query('SELECT NOW()')
  .then(res => console.log("DB Time:", res.rows[0]))
  .catch(err => console.error("Query error:", err.stack));


  module.exports = client;