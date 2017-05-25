import { Environment } from 'aws-sdk/clients/lambda';

interface Oasp4Fn {
    /**
     * Dummy function, that especifies the event configuration for a serverless function
     * 
     * @param {ServerlessConfiguration} configuration 
     * 
     * @memberof Oasp4Fn
     */
    config(configuration: ServerlessConfiguration): void
    /**
     * Assingns the data base service, with his options, to use in the module
     * 
     * @param {FnDBService} db_service 
     * @param {object} [options] 
     * 
     * @memberOf Oasp4Fn
     */
    setDB(db_service: FnDBService, options?: object): void
    /**
     * Assigns the storage service, with his options, to use in the module
     * 
     * @param {FnStorageService} db_service 
     * @param {object} [options] 
     * 
     * @memberOf Oasp4Fn
     */
    setStorage(db_service: FnStorageService, options?: object): void
    /**
     * Assigns the authentication service, with his options, to use in the module
     * 
     * @param {FnAuthService} auth_service 
     * @param {object} [options] 
     * 
     * @memberof Oasp4Fn
     */
    setAuth(auth_service: FnAuthService, options?: object): void
    /**
     * Function that use the getItems or getItems functionalities to get items of a table with the given name
     * 
     * @param {string} name 
     * @param {(string | string[])} [ids] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    table(name: string, ids?: string | string[]): Oasp4Fn
    /**
     * Function that filter a table
     * 
     * @param {string} attribute 
     * @param {(string | number | boolean)} [value] 
     * @param {string} [comparator] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    where(attribute: string, value?: string | number | boolean, comparator?: string): Oasp4Fn
    /**
     * Function that order the elements of a table
     * 
     * @param {string} attribute 
     * @param {string} [order] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    orderBy(attribute: string, order?: string): Oasp4Fn
    /**
     * Function that returns the first object of a table, or the number of elements specified by quantity if it’s defined
     * 
     * @param {number} [quantity] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    first(quantity?: number): Oasp4Fn
    /**
     * Function that returns the first object of a table, or the number of elements specified by quantity if it’s defined
     * 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    count(): Oasp4Fn
    /**
     * Function that return the elements of a table projecting only the specified attributes
     * 
     * @param {string[]} attributes 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    project(attributes: string[]): Oasp4Fn
    /**
     * Function that iterates over the elements of an Array applying the changes specified by iteratee
     * 
     * @param {Function} iteratee 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    map(iteratee: Function): Oasp4Fn
    /**
     * Function that filters the elements of an Array, returning a new Array with the elements in which iteratee returns true
     * 
     * @param {Function} iteratee 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    filter(iteratee: Function): Oasp4Fn
    /**
     * Function that iterates over the elements of a table applying the changes specified by iteratee, and accumulating the result in the accumulator. This operation is useful to calculate operations like SUM or MAX
     * 
     * @param {Function} iteratee 
     * @param {(any[] | object | number)} [accumulator] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    reduce(iteratee: Function, accumulator?: any[] | object | number ): Oasp4Fn
    /**
     * Function to insert new items in a table
     * 
     * @param {string} table_name 
     * @param {(Object | object[])} items 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    insert(table_name: string, items: Object | object[]): Oasp4Fn
    /**
     * Function to delete one or more items in a table
     * 
     * @param {string} table_name 
     * @param {(string | string[])} ids 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    delete(table_name: string, ids: string | string[]): Oasp4Fn
    /**
     * Function that perform an inner join of two tables
     * 
     * @param {string} accessor0 
     * @param {string} accessor1 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    join(accessor0: string, accessor1: string): Oasp4Fn
    /**
     * Function that list the elements of a bucket or download one if an identifier is passed
     * 
     * @param {string} bucket_name 
     * @param {string} [id] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    bucket(bucket_name: string, id?: string): Oasp4Fn
    /**
     * Function that upload an object to a bucket
     * 
     * @param {string} bucket_name 
     * @param {string} id 
     * @param {Buffer} buffer 
     * @param {string} [mimetype] 
     * @param {string} [access] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    upload(bucket_name: string, id: string, buffer: Buffer, mimetype?: string, access?: string): Oasp4Fn
    /**
     * Function to delete one or more objects in a bucket
     * 
     * @param {string} bucket_name 
     * @param {(string | string[])} ids 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    deleteObject(bucket_name: string, ids: string | string[]): Oasp4Fn
    /**
     * Function that performs a login into an application
     * 
     * @param {string} user 
     * @param {string} password 
     * @param {(string | object)} pool 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    login(user: string, password: string, pool: string | object): Oasp4Fn
    /**
     * Function that refresh the token/s of a logged user
     * 
     * @param {string} refresh_token 
     * @param {(string | object)} pool 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    refresh(refresh_token: string, pool: string | object): Oasp4Fn
    /**
     * A then override following the promise/A+ open standard requirements
     * 
     * @param {(Function | null)} result 
     * @param {(Function | null)} reject 
     * @returns {(Promise<object[] | object | string | number>)} 
     * 
     * @memberOf Oasp4Fn
     */
    then(result: Function | null, reject: Function | null): Promise<object[] | object | string | number>
    /**
     * This function return the solution as a promise
     * 
     * @returns {Promise<object[] | object | string | number>} 
     * 
     * @memberOf Oasp4Fn
     */
    promise(): Promise<object[] | object | string | number>
}

declare let fn: Oasp4Fn
export default fn

export interface FnDBService {
    instance: (options?: Object) => void;
    getItem: (table_name: string, id: string) => Promise<Object | Error>;
    getItems: (table_name: string, ids?: Array<string>) => Promise<Array<Object> | Error>;
    putItem: (table_name: string, item: Object) => Promise<string | Error>;
    putItems: (table_name: string, items: Array<Object>) => Promise<Array<any> | Error>;
    deleteItem: (table_name: string, id: string) => Promise<Object | Error>;
    deleteItems: (table_name: string, ids: Array<string>) => Promise<Array<string> | Error>;
}

export interface FnStorageService {
    instance: (options?: Object) => void;
    getObject: (bucket: string, id: string) => Promise<Buffer | Error>;
    listObjects: (bucket: string) => Promise<Array<string> | Error>;
    putObject: (bucket: string, id: string, buffer: Buffer, mimetype?: string, access?: string) => Promise<string | Error>;
    deleteObject: (bucket: string, id: string) => Promise<string | Error>;
    deleteObjects: (bucket: string, ids: Array<string>) => Promise<Array<string> | Error>
}

export interface FnAuthService {
    instance: (options?: Object) => void;
    authenticateUser: (user: string, password: string, pool: string | object) => Promise<object | string | Error>;
    refreshToken: (refresh_token: string, pool: string | object) => Promise<object | string | Error>;
}

export interface ServerlessConfiguration {
    integration?: string;
    path?: string;
    cors?: true;
    authorizer?: string | {arn: string, claims?: string[]};
    response?:  { header: {[name: string]: string}, template?: {[name: string]: string}},
    statusCodes?: {[code: number]: {pattern: string, header?: {[name: string]: string}, template?: {[name: string]: string}}}
}