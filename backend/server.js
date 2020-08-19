const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { default: TodosList } = require("../src/components/todos-list.component");
const todoRoutes = express.Router();
const PORT = 4000;


app.use(cors());
app.use(bodyParser.json());
app.use("/todos", todoRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/todos", {
    useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once("open", function() {
    console.log((`MongoDB database connection established successfully`));
});

todoRoutes.route("/").get(function(req, res) {
    TodosList.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
todoRoutes.route("/:id").get(function(req, res) {
    let id = req.params.id;
    TodosList.findByID(id, function(err, todo) {
        res.json(todo);
    });
});
todoRoutes.route("/add").post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
    .then(todo => {
        res.status(200).json({"todo": "todo added successfully"});
    })
        .catch(err => {
        res.status(400).send("adding a new todo failed")
    })
})
app.listen(PORT, function() {
    console.log(`Server is running on post ${PORT}`);
});

