import express, {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
  json,
  urlencoded
} from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
// @ts-ignore
import { RegisterRoutes } from "../build/routes";
import { NoteExistsError } from "./errors/NoteExistsError";

export const app = express();

app.use(
  urlencoded({
    extended: true
  })
);
app.use(json());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    // @ts-ignore
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found"
  });
});

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields
    });
  }
  if (err instanceof NoteExistsError) {
    return res.status(400).json({
      message: "Note already exists",
      details: err.message
    });
  }
  if (err instanceof Error) {
    console.warn("unexpected error: ", err.message);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }

  next();
});
