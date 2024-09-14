const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const routes = require('./routes/customer.routes')


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}));
app.use('/api',routes);
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("mongodb connected")).catch((err)=>console.log(err))

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('server running on port ', port);

})