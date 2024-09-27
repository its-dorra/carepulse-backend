import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { error } from './middlewares/error';

import { corsOptions } from './constants/cors';

import auth from './routes/auth';
import appointments from './routes/appointments';

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/auth', auth);

app.use('/appointments', appointments);

app.use(error);

app.listen(8000, () => {
  console.log('port ', 8000);
});
