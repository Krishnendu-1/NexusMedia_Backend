//app for server(express) setup

import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app=express();

/*app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true,

}));*/


app.use(cors());// ".use()" is used to configure & middlewares setting
app.use(express.json());
app.use(express.urlencoded({extended:true,limit:'12kb'}));//to encode urls eg, krishnendu%20Roy%20
app.use(express.static("photo"));//to keep temporary phtos to server
app.use(cookieParser());//crud operation on cookie

//* importing "router" can be imported like that in case of "default" exporting*/
import userRouter  from "./routes/user.routes.js";

//routes declaration
//**we can't use app.get() since routes are in different file, this can be used only if "controller" and "routes" written in same file*/

app.use('/api/users', userRouter);//-->whenever this "/users" gets there "router" controller activates
//*the URL might look like--> http://localhost:5000/api/users/register or http://localhost:5000/users/login ...like that

app.use((req, res, next) => {
    res.status(404).json(`Route not found: ${req.originalUrl}`);
})

export {app}