const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/myExerciseDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{
    console.log("DB Connected")
})

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

// const connection= mongoose.connection;
// connection.once('open', () => {
//     console.log("Mongodb database connection established successfully !!");
// })

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const usr = require('./routes/User')

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/',usr)


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});