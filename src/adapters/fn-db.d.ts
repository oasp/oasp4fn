
export interface FnDBService {
    instance: (options?: Object) => void;
    getItem: (table_name: string, id: string) => Promise<Object | Error>;
    getItems: (table_name: string, ids?: Array<string>) => Promise<Array<Object> | Error>;
    putItem: (table_name: string, item: Object) => Promise<string | Error>;
    putItems: (table_name: string, items: Array<Object>) => Promise<Array<any> | Error>;
    deleteItem: (table_name: string, id: string) => Promise<Object | Error>;
    deleteItems: (table_name: string, ids: Array<string>) => Promise<Array<string> | Error>;
}