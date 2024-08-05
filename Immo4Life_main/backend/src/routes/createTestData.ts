import express, { Express, Request, Response, Router } from "express";
import { RunResult } from "sqlite3";
import { db } from "../db";
export const routeCreateTestData: Router = express.Router();

//Erstelle Dummy Data
routeCreateTestData.post("/", (req: Request, res: Response) => {
  db.run(
    "INSERT INTO listing ('createdOn', 'createdBy', 'softwareVersion', 'customer') VALUES(1667400075,'Max Musterman', '2022-1.3.2', 'Gut & Unbezahlbar GmbH');",
    function (this: RunResult, err: Error): void {
      db.run(
        `INSERT INTO estate VALUES(${this.lastID},'house','Beispielstraße 56',89522,` +
          `'Heidenheim an der Brenz',246,'Ruhige Lage, mitten im Zentrum','Objekt AB-246',NULL,0);`
      );
    }
  );
  db.run(
    "INSERT INTO listing ('createdOn', 'createdBy', 'softwareVersion', 'customer') VALUES(1667400075,'Frieda Fröhlich', '3.4.2.6', 'Studentenbuden AG');",
    function (this: RunResult, err: Error): void {
      db.run(
        `INSERT INTO estate VALUES(${this.lastID},'apartment','Am bekannten Platz 28',89522,` +
          `'Heidenheim an der Brenz',34,'kleine Wohnung für Studenten, Möbiliert, Gute lage, Preiswert','Studenten Wohnung am bekannten Platz 28',NULL,0)`
      );
    }
  );
  db.run(
    "INSERT INTO listing ('createdOn', 'createdBy', 'softwareVersion', 'customer') VALUES(1667400075,'Manfred Stein', NULL, 'Stein Bauexperte GmbH');",
    function (this: RunResult, err: Error): void {
      db.run(
        `INSERT INTO estate VALUES(${this.lastID},'construction-site','Straße am Fluss 1',89522,` +
          `'Heidenheim an der Brenz',600,'Neues Baugebiet, Platz für Wohnungen oder Einfamilienhäuser, Fertigstellung 2076, Preis 750.000','Bauplatz BP-2022-01',NULL,0)`
      );
    }
  );
  res.status(200);
  res.send("success");
});
