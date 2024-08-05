/**
 * Wandelt eine Datei in ein Base64-String um
 * @param file Die umzuwandelnde Datei
 * @returns Der Base64 String
 */
export const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => reject(error);
    });
