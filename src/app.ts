import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { notFound } from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import status from 'http-status';

const app: Application = express();

app.all('/api/auth/*', toNodeHandler(auth));
// parsers
app.use(express.json());
app.use(cors());

// application routes
// app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "CineTube server is running successfully",
    data: null,
    author: {
      name: "Md Abu Sufian Jidan",
      version: "1.0.0",
      github: "https://github.com/Md-Sufian-Jidan",
      linkedin: "https://www.linkedin.com/in/md-sufian-jidan/",
      portfolio: "https://mdabusufianjidan-portfolio.vercel.app",
    }
  });
});


app.use(globalErrorHandler);
app.use(notFound);
export default app;
