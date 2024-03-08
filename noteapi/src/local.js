import app from './app.js';
import "dotenv/config.js";
const port = process.env.PORT || 3000;

app.listen(port);
console.info(`listening on http://localhost:${port}/graphql`);
