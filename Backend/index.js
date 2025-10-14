import express from 'express'
import cors from 'cors'
import mainRoutes from './Routes/routes'
require("dotenv").config();
const Port = process.env.PORT;

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', mainRoutes)

app.listen(Port, ()=>{
    console.log(`server is running on ${Port}`)
})