import express, { Express, Request, Response, Router } from "express";
import { RunResult } from "sqlite3";
import { db } from "../db";
import { Listing } from "../types/Listing";
import { RealEstate } from "../types/RealEstate";
import { parseDBQueryArr, parseDBQuery } from "../utils/dataParser";
import formidable from "formidable";
import { checkDataValid, checkEditable } from "../utils/listingCheck";
import { ErrorTypeEnum } from "../types/ErrorTypeEnum";
export const routeRealEstate: Router = express.Router();

//Alle Einträge nach Filter erhalten
routeRealEstate.get("/", (req: Request, res: Response) => {
  const locationFilter = String(req.query.filterLocation ?? "").toLowerCase();
  const typeFilter = String(req.query.filterType ?? "").toLowerCase();
  db.all(
    /*
     * Erhalte alle Zeilen aus listing und estate welche die selbe id haben.
     * Schaue ob die Suchfilter in den Spalten enthalten sind.
     * Wenn die Suchfilter leer sind werden alle Daten zurück gegeben.
     */
    "SELECT * FROM listing JOIN estate ON listing.id = estate.id WHERE INSTR(LOWER(type), ?) > 0 AND INSTR(LOWER(address || city), ?) > 0;",
    [typeFilter, locationFilter],
    (err: Error, rows: any[]) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when searching Database",
          errorType: ErrorTypeEnum.DBError,
        });
        return;
      }
      const data = parseDBQueryArr(rows);
      res.status(200);
      res.json(data);
    }
  );
});
//Eintrag von id erhalten
routeRealEstate.get("/:id", (req: Request, res: Response) => {
  db.get(
    //Erhalte die Zeile wo id wie die angegebene id ist
    "SELECT * FROM listing JOIN estate ON listing.id = estate.id WHERE listing.id = ?",
    [req.params.id],
    (err: Error, rows: any[]) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when searching Database",
          errorType: ErrorTypeEnum.DBError,
        });
        return;
      } else if (rows.length === 0) {
        res.status(404);
        res.json({
          message: "No Entry found for ID",
          errorType: ErrorTypeEnum.NoEntryFound,
        });
        return;
      }
      res.status(200);
      const data = parseDBQuery(rows);
      res.json(data);
    }
  );
});
//Eintrag erstellen
routeRealEstate.post("/", (req: Request, res: Response) => {
  const listing: Listing = req.body;
  if (!checkDataValid(listing)) {
    res.status(400);
    res.json({
      message: "Missing required data for Entry",
      errorType: ErrorTypeEnum.InvalidData,
    });
    return;
  }
  const entry: RealEstate = listing.entry;
  db.run(
    //Füge das Listing in tabelle listing ein
    "INSERT INTO listing ('createdOn', 'createdBy', 'softwareVersion', 'customer') VALUES(?,?,?,?)",
    [
      listing.createdOn,
      listing.createdBy,
      listing.softwareVersion,
      listing.customer,
    ],
    function (this: RunResult, err: Error): void {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when inserting entry",
          errorType: ErrorTypeEnum.DBError,
        });
      } else {
        db.run(
          //Erstelle eine Zeile in estate mit den angegebenen Werten. Setze Bild auf NULL und den Counter auf 0.
          "INSERT INTO estate VALUES(?,?,?,?,?,?,?,?,NULL,0)",
          [
            this.lastID,
            entry.type,
            entry.address,
            entry.postal,
            entry.city,
            entry.size,
            entry.comment,
            entry.shortHand,
          ],
          (err) => {
            if (err) {
              res.status(500);
              res.json({
                message: "Error when inserting estate",
                errorType: ErrorTypeEnum.DBError,
              });
              return;
            }
            res.status(200);
            res.json(req.body);
          }
        );
      }
    }
  );
});
//Eintrag updaten
routeRealEstate.put("/:id", (req: Request, res: Response) => {
  const listing: Listing = req.body;
  if (!checkDataValid(listing)) {
    res.status(400);
    res.json({
      message: "Missing required data for entry",
      errorType: ErrorTypeEnum.InvalidData,
    });
    return;
  }
  const entry: RealEstate = listing.entry;
  checkEditable(req.params.id, (err: ErrorTypeEnum | null, result: boolean) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Could not check if editable",
        errorType: err,
      });
      return;
    } else if (!result) {
      res.status(400);
      res.json({
        message: "Cant edit cause there are more than 2 customers",
        errorType: ErrorTypeEnum.CantEdit,
      });
      return;
    }
    db.run(
      //Aktualisiere die Werte für den Eintrag mit id
      "UPDATE listing SET createdOn = ?, createdBy = ?, softwareVersion = ?, customer = ? WHERE id = ?",
      [
        listing.createdOn,
        listing.createdBy,
        listing.softwareVersion,
        listing.customer,
        req.params.id,
      ],
      function (this: RunResult, err: Error): void {
        if (err) {
          console.log(err);
          res.status(500);
          res.json({
            message: "Error when updating entry",
            errorType: ErrorTypeEnum.DBError,
          });
        } else {
          db.run(
            //Aktualisiere die Werte für den Eintrag mit id
            "UPDATE estate SET type = ?, address = ?, postal = ?, city = ?, size = ?, comment = ?, shortHand = ? WHERE id = ?",
            [
              entry.type,
              entry.address,
              entry.postal,
              entry.city,
              entry.size,
              entry.comment,
              entry.shortHand,
              req.params.id,
            ],
            (err) => {
              if (err) {
                console.log(err);
                res.status(500);
                res.json({
                  message: "Error when updating estate",
                  errorType: ErrorTypeEnum.DBError,
                });
                return;
              }
              res.status(200);
              res.json(req.body);
            }
          );
        }
      }
    );
  });
});
//Bild hochladen
routeRealEstate.put("/:id/image", (req: Request, res: Response) => {
  checkEditable(req.params.id, (err: ErrorTypeEnum | null, result: boolean) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Could not check if editable",
        errorType: err,
      });
      return;
    } else if (!result) {
      res.status(400);
      res.json({
        message: "Cant edit cause there are more than 2 customers",
        errorType: ErrorTypeEnum.CantEdit,
      });
      return;
    }
    const form = formidable();
    form.parse(req, (err, fields) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: err,
          errorType: ErrorTypeEnum.FormError,
        });
        return;
      }
      if (!fields.image) {
        res.status(400);
        res.json({
          message: "No image found",
          errorType: ErrorTypeEnum.InvalidData,
        });
        return;
      }
      db.run(
        //Update das Bild für id
        "UPDATE estate SET image = ? WHERE id = ?;",
        [fields.image, req.params.id],
        (err) => {
          if (err) {
            console.log(err);
            res.status(500);
            res.json({
              message: "Error when updating image",
              errorType: ErrorTypeEnum.DBError,
            });
          } else {
            res.status(200);
            res.json({ image: fields.image });
          }
        }
      );
    });
  });
});
//Eintrag löschen
routeRealEstate.delete("/:id", (req: Request, res: Response) => {
  checkEditable(req.params.id, (err: ErrorTypeEnum | null, result: boolean) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Could not check if editable",
        errorType: err,
      });
      return;
    } else if (!result) {
      res.status(400);
      res.json({
        message: "Cant edit cause there are more than 3 customers",
        errorType: ErrorTypeEnum.CantEdit,
      });
      return;
    }
    //Lösche von listing für id
    const stmtListing = db.prepare("DELETE FROM listing WHERE id = $id;", {
      $id: req.params.id,
    });
    //Lösche von estate für id
    const stmtEstate = db.prepare("DELETE FROM estate WHERE id = $id", {
      $id: req.params.id,
    });
    stmtListing.run((err) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Error when deleting entry",
          errorType: ErrorTypeEnum.DBError,
        });
      } else {
        stmtEstate.run((err) => {
          if (err) {
            console.log(err);
            res.status(500);
            res.json({
              message: "Error when deleting estate",
              errorType: ErrorTypeEnum.CantEdit,
            });
          } else {
            res.status(200);
            res.send({ message: "Successfully deleted" });
          }
        });
      }
    });
  });
});
