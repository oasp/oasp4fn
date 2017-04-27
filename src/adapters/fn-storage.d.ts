
export interface FnStorageService {
    instance: (options?: Object) => void;
    getObject: (bucket: string, id: string) => Promise<Buffer | Error>;
    listObjects: (bucket: string) => Promise<Array<string> | Error>;
    putObject: (bucket: string, id: string, buffer: Buffer, mimetype?: string, access?: string) => Promise<string | Error>;
    deleteObject: (bucket: string, id: string) => Promise<string | Error>;
    deleteObjects: (bucket: string, ids: Array<string>) => Promise<Array<string> | Error>
}