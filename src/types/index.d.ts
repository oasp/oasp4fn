import { MemoIterator, ObjectIterator } from 'lodash'

interface QueryStarters {
    /**
     * Dummy function, that especifies the event configuration for a serverless function
     * 
     * @param {ServerlessConfiguration} configuration 
     * 
     * @memberof QueryStarters
     */
    config(configuration: ServerlessConfiguration): void
    /**
     * Assingns the data base service, with his options, to use in the module
     * 
     * @param {FnDBService} db_service 
     * @param {object} [options] 
     * 
     * @memberof QueryStarters
     */
    setDB(db_service: FnDBService, options?: object): void
    /**
     * Assigns the storage service, with his options, to use in the module
     * 
     * @param {FnStorageService} db_service 
     * @param {object} [options] 
     * 
     * @memberof QueryStarters
     */
    setStorage(db_service: FnStorageService, options?: object): void
    /**
     * Assigns the authentication service, with his options, to use in the module
     * 
     * @param {FnAuthService} auth_service 
     * @param {object} [options] 
     * 
     * @memberof QueryStarters
     */
    setAuth(auth_service: FnAuthService, options?: object): void
    /**
     * Function that use the getItem or getItems functionalities to get items of a table with the given name
     * 
     * @param {string} name 
     * @param {(string | string[])} [ids] 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
     */
    table(name: string, ids?: string | string[]): Oasp4Fn
    /**
     * Function to insert new items in a table
     * 
     * @param {string} table_name 
     * @param {(Object | object[])} items 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
     */
    insert(table_name: string, items: Object | object[]): Oasp4Fn
    /**
     * Function to delete one or more items in a table
     * 
     * @param {string} table_name 
     * @param {(string | string[])} ids 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
     */
    delete(table_name: string, ids: string | string[]): Oasp4Fn
    /**
     * Function that list the elements of a bucket or download one if an identifier is passed
     * 
     * @param {string} bucket_name 
     * @param {string} [id] 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
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
     * @memberof QueryStarters
     */
    upload(bucket_name: string, id: string, buffer: Buffer, mimetype?: string, access?: string): Oasp4Fn
    /**
     * Function to delete one or more objects in a bucket
     * 
     * @param {string} bucket_name 
     * @param {(string | string[])} ids 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
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
     * @memberof QueryStarters
     */
    login(user: string, password: string, pool: string | object): Oasp4Fn
    /**
     * Function that refresh the token/s of a logged user
     * 
     * @param {string} refresh_token 
     * @param {(string | object)} pool 
     * @returns {Oasp4Fn} 
     * 
     * @memberof QueryStarters
     */
    refresh(refresh_token: string, pool: string | object): Oasp4Fn
}

declare class Oasp4Fn {
    /**
     * Property that will store the solution and partial solution of the query as a promise.
     * This property will be used in the class methods as an input and mutate it in the result of the method.
     */
    private solution: Array<Promise<object[] | object | string | string[] | number | never>>;
    /**
     * Property that will store the names of the table or the bucket to use later in the query.
     */
    private names: {tableName?: string, bucketName?: string};
    /**
     * Creates an instance of Oasp4Fn.
     * @param {(Promise<object[] | object | string | string[] | number | never>)} solution 
     * @param {{tableName?: string, bucketName?: string}} [names] 
     * 
     * @memberof Oasp4Fn
     */
    constructor(solution: Promise<object[] | object | string | string[] | number | never>, names?: {tableName?: string, bucketName?: string});
    /**
     * Function that use the {@link getItem} or {@link getItems} functionalities to get items of a table with the given name.
     * 
     * {@link solution} input: any.
     * 
     * {@link solution} result: object | object[] | undefined.
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
     * {@link solution} input: object[].
     * 
     * {@link solution} result: object[].
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
     * Function that orders the elements of a table. This method is based in the {@link https://lodash.com/docs/4.17.4#orderBy lodash orderBy}
     * 
     * {@link solution} input: Array | object.
     * 
     * {@link solution} result: Array.
     * 
     * @param {(string | string[])} [order] 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    orderBy(attribute: _.Many<string | _.ListIterator<object, any>>, order?: string | string[]): Oasp4Fn
    /**
     * Function that returns the first object of a table, or the number of elements specified by quantity if it’s defined. 
     * 
     * {@link solution} input: object[].
     * 
     * {@link solution} result: object[].
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
     * {@link solution} input: object[].
     * 
     * {@link solution} result: number.
     * 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    count(): Oasp4Fn
    /**
     * Function that return the elements of a table projecting only the specified attributes
     * 
     * {@link solution} input: object[].
     * 
     * {@link solution} result: object[].
     * 
     * @param {string[]} attributes 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    project(attributes: string[] | string): Oasp4Fn
    /**
     * Function that iterates over the elements of a collection applying the changes specified by iteratee. The iteratee is invoked with three arguments: (value, index|key, collection). This method is based in the {@link https://lodash.com/docs/4.17.4#map lodash map}
     * 
     * {@link solution} input: object | object[].
     * 
     * {@link solution} result: object[].
     * 
     * @param {ObjectIterator<object, any>} iteratee 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    map(iteratee: ObjectIterator<object, any>): Oasp4Fn
    /**
     * Function that filters the elements of a collection, returning a new Array with the elements in which iteratee returns true. The iteratee is invoked with three arguments: (value, index|key, collection). This method is based in the {@link https://lodash.com/docs/4.17.4#filter lodash filter}
     * 
     * {@link solution} input: object | object[].
     * 
     * {@link solution} result: object[].
     * 
     * @param {object} iteratee 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    filter(iteratee: object): Oasp4Fn
    /**
     * Function that iterates over the elements of a table applying the changes specified by iteratee, and accumulating the result in the accumulator. This operation is useful to calculate operations like SUM or MAX. The iteratee is invoked with four arguments: (accumulator, value, index|key, collection). This method is based in the {@link https://lodash.com/docs/4.17.4#reduceRight lodash reduceRight}
     * 
     * {@link solution} input: object | object[].
     * 
     * {@link solution} result: any.
     * 
     * @param {MemoIterator<object, object>} iteratee 
     * @param {(any[] | object | number)} [accumulator] 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    reduce(iteratee: MemoIterator<object, object>, accumulator?: any[] | object | number ): Oasp4Fn
    /**
     * Function that perform an inner join of two tables. This function is based in {@link https://github.com/mtraynham/lodash-joins join operation} of Matt Traynham
     * 
     * {@link solution} input: object[]. (In this case solution must have at least 2 tables)
     * 
     * {@link solution} result: object[].
     * 
     * @param {string} accessor0 
     * @param {string} accessor1 
     * @returns {Oasp4Fn} 
     * 
     * @memberOf Oasp4Fn
     */
    join(accessor0: string, accessor1: string): Oasp4Fn
    /**
     * Function to insert the modified items in a table
     * 
     * {@link solution} input: object | object[].
     * 
     * {@link solution} result: string | string[]. 
     * 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    insert(): Oasp4Fn
    /**
     * Function to delete the extracted items in the query
     * 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    delete(): Oasp4Fn
    /**
     * Function to delete objects specifieds in the query
     * 
     * @returns {Oasp4Fn} 
     * 
     * @memberof Oasp4Fn
     */
    deleteObject(): Oasp4Fn
    /**
     * A then override following the promise/A+ open standard requirements
     * 
     * @param {(Function | null)} result 
     * @param {Function} reject 
     * @returns {(Promise<object[] | object | string | number>)} 
     * 
     * @memberOf Oasp4Fn
     */
    then(result: Function | null, reject?: Function): Promise<object[] | object | string | number>
    /**
     * This function return the solution as a promise
     * 
     * @returns {Promise<object[] | object | string | number>} 
     * 
     * @memberOf Oasp4Fn
     */
    promise(): Promise<object[] | object | string | number>
}

declare let fn: QueryStarters
export default fn

export interface FnDBService {
    /**
     * Creates an instance of the service with the given options.
     * 
     * @param {Object} [options] 
     * @memberof FnDBService
     */
    instance(options?: Object): void;
    /**
     * Return the item specified by id, else undefined.
     * 
     * @param {string} table_name 
     * @param {string} id 
     * @returns {(Promise<Object | Error>)} 
     * @memberof FnDBService
     */
    getItem(table_name: string, id: string): Promise<Object | Error>;
    /**
     * Return an array of items specifieds by ids, but if none is passed the full table is returned.
     * 
     * @param {string} table_name 
     * @param {string[]} [ids] 
     * @returns {(Promise<object[]| Error>)} 
     * @memberof FnDBService
     */
    getItems(table_name: string, ids?: string[]): Promise<object[] | Error>;
    /**
     * Insert an item of the table.
     * 
     * @param {string} table_name 
     * @param {Object} item 
     * @returns {(Promise<string | Error>)} 
     * @memberof FnDBService
     */
    putItem(table_name: string, item: Object): Promise<string | Error>;
    /**
     * Insert a list of items in the table.
     * 
     * @param {string} table_name 
     * @param {Object[]} items 
     * @returns {(Promise<any[] | Error>)} 
     * @memberof FnDBService
     */
    putItems(table_name: string, items: Object[]): Promise<any[] | Error>;
    /**
     * Delete an item of the table, with a given id.
     * 
     * @param {string} table_name 
     * @param {string} id 
     * @returns {(Promise<object | Error>)} 
     * @memberof FnDBService
     */
    deleteItem(table_name: string, id: string): Promise<object | Error>;
    /**
     * Delete various items in the table, specifieds by an array of ids.
     * 
     * @param {string} table_name 
     * @param {string[]} ids 
     * @returns {(Promise<string[] | Error>)} 
     * @memberof FnDBService
     */
    deleteItems(table_name: string, ids: string[]): Promise<string[] | Error>;
}

export interface FnStorageService {
    /**
     * Creates an instance of the service with the given options.
     * 
     * @param {Object} [options] 
     * @memberof FnStorageService
     */
    instance(options?: Object): void;
    /**
     * Get an object from a bucket as a binary buffer
     * 
     * @param {string} bucket 
     * @param {string} id 
     * @returns {(Promise<Buffer | Error>)} 
     * @memberof FnStorageService
     */
    getObject(bucket: string, id: string): Promise<Buffer | Error>;
    /**
     * Lists the objects of a bucket.
     * 
     * @param {string} bucket 
     * @returns {(Promise<string[] | Error>)} 
     * @memberof FnStorageService
     */
    listObjects(bucket: string): Promise<string[] | Error>;
    /**
     * Insert an object into a bucket
     * 
     * @param {string} bucket 
     * @param {string} id 
     * @param {Buffer} buffer 
     * @param {string} [mimetype] 
     * @param {string} [access] 
     * @returns {(Promise<string | Error>)} 
     * @memberof FnStorageService
     */
    putObject(bucket: string, id: string, buffer: Buffer, mimetype?: string, access?: string): Promise<string | Error>;
    /**
     * Delete an object form a bucket, with a given id.
     * 
     * @param {string} bucket 
     * @param {string} id 
     * @returns {(Promise<string | Error>)} 
     * @memberof FnStorageService
     */
    deleteObject(bucket: string, id: string): Promise<string | Error>;
    /**
     * Delete a list of objects from a bucket, specifieds by an array of ids.
     * 
     * @param {string} bucket 
     * @param {string[]} ids 
     * @returns {(Promise<string[] | Error>)} 
     * @memberof FnStorageService
     */
    deleteObjects(bucket: string, ids: string[]): Promise<string[] | Error>
}

export interface FnAuthService {
    /**
     * Creates an instance of the service with the given options.
     * 
     * @param {Object} [options] 
     * @memberof FnAuthService
     */
    instance(options?: Object): void;
    /**
     * Authenticate an user and return a token or tokens if the operation is succesful.
     * 
     * @param {string} user 
     * @param {string} password 
     * @param {(string | object)} pool 
     * @returns {(Promise<object | string | Error>)} 
     * @memberof FnAuthService
     */
    authenticateUser(user: string, password: string, pool: string | object): Promise<object | string | Error>;
    /**
     * Refresh the tokens given by @see authenticateUser
     * 
     * @param {string} refresh_token 
     * @param {(string | object)} pool 
     * @returns {(Promise<object | string | Error>)} 
     * @memberof FnAuthService
     */
    refreshToken(refresh_token: string, pool: string | object): Promise<object | string | Error>;
}

export interface ServerlessConfiguration {
    [name: string]: any;
}