import express from 'express';
import auth from './routes/auth';
import helmet from 'helmet';
import cors from 'cors';
import { error } from './middlewares/error';
import { corsOptions } from './constants/cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/auth', auth);

app.use(error);

app.listen(8000, () => {
  console.log('port ', 8000);
});
