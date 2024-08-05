export interface ResponseError {
    status: number;
    error: BackendError;
}

export interface BackendError {
    message: string;
    errorType: ErrorTypeEnum;
}

export enum ErrorTypeEnum {
    DBError,
    CustomerNotFound,
    NoEntryFound,
    InvalidData,
    CantEdit,
    FormError,
}
