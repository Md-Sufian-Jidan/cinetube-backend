import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { notFound } from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import status from 'http-status';
import router from './app/routes';
import { sendResponse } from './app/utils/sendResponse';
import { env } from './app/config/env';
import cookieParser from 'cookie-parser';
import { PurchaseController } from './app/modules/purchase/purchase.controller';

const app: Application = express();

// parsers
app.use(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }),
  PurchaseController.handleWebhook
);
app.use(express.json({ limit: "16kb", }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({
  origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:7000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "cookie"],
  credentials: true
}));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "CineTube server is running successfully",
    data: {
      author: {
        name: "Md Abu Sufian Jidan",
        version: "1.0.0",
        github: "https://github.com/Md-Sufian-Jidan",
        linkedin: "https://www.linkedin.com/in/md-sufian-jidan/",
        portfolio: "https://mdabusufianjidan-portfolio.vercel.app",
      },
      host: req.hostname,
      time: new Date().toISOString(),
    }
  });
});

app.all("/api/auth/*any", toNodeHandler(auth));
// application routes
app.use('/api/v1', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;