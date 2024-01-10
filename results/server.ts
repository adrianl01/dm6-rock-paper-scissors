import express from "express"
import { json } from "body-parser";
import { fs } from "./db";
const port = 3000;
const app = express();
const col = fs.collection('results')
app.use(json());
app.get("/users/", function (req, res) {
    res.json(["todos los users"]);
});
app.get("/users/:userId", function (req, res) {
    const userId = req.params.userId
    const doc = col.doc(userId)
    doc.get().then(snap => {
        const data = snap.data();
        res.json(data);
    })
});
app.post("/users/", function (req, res) {
    const userCol = col.doc()
    userCol.create(req.body).then(() => {
        res.json({
            id: userCol.id
        });
    })
});
app.patch("/users/:id", function (req, res) {
    const userId = req.params.id
    const coll = col.doc(userId);
    const updateObj = req.body

    coll.update(updateObj).then((result) => {
        console.log(result);
        res.json({ messag: "ok" });
    })
});
app.delete("/users/:userId", function (req, res) {
    res.status(204);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});





