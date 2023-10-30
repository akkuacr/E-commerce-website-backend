import express from'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true

}));

//cookie parser 
app.use(cookieParser());



//morgan ek tarah ka ka logger h jo aap iski documentation m pd skte ho
app.use(morgan('dev'));


app.use('/ping',function(req,res){
    res.send('/pong');
});



app.use('/api/v1/user',userRoutes)




//routes of 3 modules

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not Found');
});

app.use(errorMiddleware);

export default app;

