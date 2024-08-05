import { db } from "../db";
import { ErrorTypeEnum } from "../types/ErrorTypeEnum";
import { Listing } from "../types/Listing";
import { RealEstate } from "../types/RealEstate";
/**
 * Überpruft ob ein angegebenes Listing alle nötigen Daten enthält
 * @param listing Das zu überprüfende Objekt
 * @returns wahr wenn es alle daten enthält flasch wenn nicht
 */
export function checkDataValid(listing: Listing): boolean {
  const entry: RealEstate = listing?.entry;
  if (
    listing === undefined ||
    listing.createdOn === undefined ||
    listing.createdBy === undefined ||
    listing.softwareVersion === undefined ||
    listing.customer === undefined ||
    entry === undefined ||
    entry.type === undefined ||
    entry.address === undefined ||
    entry.postal === undefined ||
    entry.city === undefined ||
    entry.size === undefined ||
    entry.comment === undefined ||
    entry.shortHand === undefined
  ) {
    return false;
  }
  return true;
}
/**
 * Aufgabe 3
 * Überprüfe ob eine Zeile bearbeitbar ist.
 * @param id ID des eintrages
 * @param callback Funktion welche aufgerufen werden ssoll mit resultat.
 */
export function checkEditable(
  id: any,
  callback: (err: ErrorTypeEnum | null, result: boolean) => void
) {
  db.get(
    "SELECT customerCount FROM estate WHERE id = ?",
    [id],
    (err: Error, row: any) => {
      if (err) {
        callback(ErrorTypeEnum.DBError, false);
      } else if (row?.customerCount === undefined) {
        callback(ErrorTypeEnum.CustomerNotFound, false);
      } else {
        callback(null, row.customerCount < 3);
      }
    }
  );
}
