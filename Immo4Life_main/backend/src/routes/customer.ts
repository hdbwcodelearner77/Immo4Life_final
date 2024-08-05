/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, Router } from "express";
import { db } from "../db";
import { ErrorTypeEnum } from "../types/ErrorTypeEnum";
export const routeCustomer: Router = express.Router();

//Erhalte Counter
routeCustomer.get("/:id", (req: Request, res: Response) => {
  db.get(
    "SELECT customerCount FROM estate WHERE id = ?",
    [req.params.id],
    (err, row: any) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when searching Database",
          errorType: ErrorTypeEnum.DBError,
        });
      } else {
        res.json({ count: row.customerCount });
      }
    }
  );
});
//Erhöhe Counter um 1
routeCustomer.put("/:id", (req: Request, res: Response) => {
  db.get(
    "SELECT customerCount FROM estate WHERE id = ?",
    [req.params.id],
    (err, row: any) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when searching Database",
          errorType: ErrorTypeEnum.DBError,
        });
      } else {
        const newCount = row.customerCount + 1;
        db.run(
          "UPDATE estate SET customerCount = ? WHERE id = ?",
          [newCount, req.params.id],
          (err) => {
            if (err) {
              console.log(err);
              res.status(500);
              res.json({
                message: "Error when updating customer count",
                errorType: ErrorTypeEnum.DBError,
              });
            } else {
              res.status(200);
              res.json({ count: newCount });
            }
          }
        );
      }
    }
  );
});
