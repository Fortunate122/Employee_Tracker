import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
// establish a connection to the database before executing any queries
await connectToDb();

const PORT = process.env.PORT || 3001; // set the server port from the environment variable, or default to 3001
const app = express(); // initialize an express application

// Express middleware
app.use(express.urlencoded({ extended: false })); // parse incoming URL encoded data
app.use(express.json()); // parse incoming json data in request

// TODO: Write a comment to explain what the following code is doing.
// This query retrieves the total count of books in each stock status category from the "favorite_books" table.
// It groups the results by the "in_stock" column and counts the number of book entries for each group.
pool.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log(result.rows);
  }
});

// TODO: Write a comment to explain what the following code is doing.
// This query calculates various statistics for books in each section from the "favorite_books" table.
// It groups the books by the "section" column and computes:
// - SUM(quantity): Total number of books in the section. add the vals of all the values in the quantity column. renames as "total_in_section"
// - MAX(quantity): The maximum quantity of books in any record within the section. return the highest val in the column (col)
// - MIN(quantity): The minimum quantity of books in any record within the section. reutnr the lowest val in the column 
// - AVG(quantity): The average quantity of books per record in the section. quantity of all the values.
pool.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log(result.rows);
  }
});
// middleware to handle 404 errors (for any route that does not match an existing endpoint)
app.use((_req, res) => {
  res.status(404).end(); // send a 404 status code and end the response
});
// start the express server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // log that the server has started successfully
});
