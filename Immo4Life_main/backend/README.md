### Server starten

1. Installieren mit `npm install`
2. Nach dem Install Starten mit `npm run start`
3. Die Anwendung wird auf localhost:8080 zur Verfügung gestellt

### Dependencies:

- Express  
  Wird verwendet als HTTP Server mit Management-Funktionen.
- SQLite3  
  Wird verwendet um eine Datenbank im selben Verzeichnis ohne Installation zu verwalten, welche benutzt wird um alle Daten zu speichern.
- CORS  
  Wird verwendet für CORS mit dem Frontend.
- Body-Parser  
  Wird verwendet um die Daten im Body der Requests zu parsen und auf diese zuzugreifen
- Formidable  
  Das Bild wird über Form-Data übergeben dieses, um diese zu parsen wird Formidable verwendet.

### Dev-Dependencies:

- @types/..  
  Typen für Typescript
- @typescript/eslint/..  
  Für die Funktion von Typescript mit ESLint
- Typescript  
  Zum verwenden von Typescript
- ESLint  
  Für Linting
- JSDoc
  Für JSDoc Kommentare
- Nodemon  
  Für das neustarten der Node App wenn sich die Datein dieser ändern.
- Concurrently  
  Für das gleichzeitige ausführen von Befehlen; hier verwendet für das Ausführen vom TS Compiler und und Nodemon
