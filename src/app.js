import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app=express();

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true,


}));// ".use()" is used to configure & middlewares setting

app.use(express.json({limit:'12kb'}));
app.use(express.urlencoded({extended:true,limit:'12kb'}));//to encode urls eg, krishnendu%20Roy%20
app.use(express.static("photo"));//to keep temporary phtos to server

app.use(cookieParser());//crud operation on cookie


export {app}