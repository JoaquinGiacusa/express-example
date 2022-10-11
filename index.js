const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Hola mundo" })
})

app.listen(3000, () => {
    return console.log(
        `Server running on 3000`
    );
});
