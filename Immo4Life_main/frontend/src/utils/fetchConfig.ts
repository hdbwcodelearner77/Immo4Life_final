/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Der Grundaufbau eines HTTP-Aufrufes
 * @param method Die HTTP-Methode
 * @param data Die benötigten Daten für den Aufruf
 * @param headers Weitere benötigte Header-Eigenschaften
 * @param isFormData Wert, der angibt, ob der Request Daten vom Typ FormData enthählt
 * @returns Den fertigen Grundaufbau für einen HTTP-Aufruf
 */
export const initRequest = (method: RequestMethod, data?: any, headers?: unknown, isFormData = false): RequestInit => {
    const requestInit: RequestInit = {
        method,
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
        },
    };

    if (!isFormData) {
        requestInit.headers = {
            ...requestInit.headers,
            ...{
                'Content-Type': 'application/json',
            },
        };
    }

    if (headers) {
        requestInit.headers = { ...requestInit.headers, ...headers };
    }

    if (data) {
        requestInit.body = isFormData ? data : JSON.stringify(data);
    }

    return requestInit;
};
