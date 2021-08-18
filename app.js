const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));

const port = parseInt(process.env.PORT, 10) || 3000;
http.listen(port, async () => {
	console.log(`App listening on port ${port}...`);
});
