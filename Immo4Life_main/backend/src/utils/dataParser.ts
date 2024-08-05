import { Listing } from "../types/Listing";

/**
 * Parse eine Spalte mit estate und listing von DB fürs FE
 * @param row Spalte aus der Datenbank
 * @returns ein angepasstes Objekt für das Frontend
 */
export function parseDBQuery(row: any): Listing {
  return {
    createdOn: row.createdOn,
    createdBy: row.createdBy,
    softwareVersion: row.softwareVersion,
    id: row.id,
    customer: row.customer,
    entry: {
      id: row.id,
      type: row.type,
      address: row.address,
      postal: row.postal,
      city: row.city,
      size: row.size,
      comment: row.comment,
      shortHand: row.shortHand,
      image: row.image,
      customerCount: row.customerCount,
    },
  };
}
/**
 * Parst einen Array fürs Frontend
 * @param rows Array von Spalten aus der DB
 * @returns ein neues Array verwendbar im Frontend
 */
export function parseDBQueryArr(rows: any[]): Listing[] {
  const newArr = [];
  for (const row of rows) {
    newArr.push(parseDBQuery(row));
  }
  return newArr;
}
