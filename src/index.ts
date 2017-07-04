
import * as _ from 'lodash';
import { FnDBService, FnStorageService, ServerlessConfiguration, FnAuthService } from './types/index';
let db: FnDBService;
let storage: FnStorageService;
let auth: FnAuthService;

export default {
    config: function (configuration: ServerlessConfiguration) {},
    setDB: function (db_service: FnDBService, options?: object) {
        db = db_service;
        db.instance(options);
    },
    setStorage: function (storage_service: FnStorageService, options?: object) {
        storage = storage_service;
        storage.instance(options);
    },
    setAuth: function (auth_service: FnAuthService, options?: object) {
        auth = auth_service;
        auth.instance(options);
    },
    table: function (name: string, ids?: string | string[]) {
        let solution;
        switch (typeof ids) {
            case 'string':
                solution = db.getItem(name, <string>ids);
                break;
            case 'object':
                if (Array.isArray(ids)) {
                    solution = db.getItems(name, ids);
                    break;
                }
            default:
                solution = db.getItems(name);
        }

        return new Oasp4Fn(solution, {tableName: name});
    },
    insert: function (table_name: string, items: Object | object[]) {
        let solution;
        if (Array.isArray(items))
            if (_.isEmpty(items))
                solution = Promise.resolve([]);
            else
                solution = db.putItems(table_name, items);
        else
            solution = db.putItem(table_name, items);

        return new Oasp4Fn(solution);
    },
    delete: function (table_name: string, ids: string | string[]) {
        let solution;
        if (Array.isArray(ids))
            if (_.isEmpty(ids))
                solution = Promise.resolve([]);
            else
                solution = db.deleteItems(table_name, ids);
        else
            solution = db.deleteItem(table_name, ids);

        return new Oasp4Fn(solution);
    },
    bucket: function (bucket_name: string, id?: string) {
        let solution;
        if (id)
            solution = storage.getObject(bucket_name, id);
        else
            solution = storage.listObjects(bucket_name);

        return new Oasp4Fn(solution, {bucketName: bucket_name});
    },
    upload: function (bucket_name: string, id: string, buffer: Buffer, mimetype?: string, access?: string) {
        let solution = storage.putObject(bucket_name, id, buffer, mimetype, access);

        return new Oasp4Fn(solution);
    },
    deleteObject: function (bucket_name: string, ids: string | string[]){
        let solution;
        if (Array.isArray(ids))
            if (_.isEmpty(ids))
                solution = Promise.resolve([]);
            else
                solution = storage.deleteObjects(bucket_name, ids);
        else
            solution = storage.deleteObject(bucket_name, ids);

        return new Oasp4Fn(solution);
    },
    login: function (user: string, password: string, pool: string | object) {
        let solution = auth.authenticateUser(user, password, pool);

        return new Oasp4Fn(solution);
    },
    refresh: function (refresh_token: string, pool: string | object) {
        let solution = auth.refreshToken(refresh_token, pool);

        return new Oasp4Fn(solution);
    }
};

class Oasp4Fn {
    private solution: Array<Promise<object[] | object | string | string[] | number | never>> = [];

    constructor (solution: Promise<object[] | object | string | string[] | number | never>, private names?: {tableName?: string, bucketName?: string}) {
        this.solution.push(solution);
    };

    table(name: string, ids?: string | string[]) {
        switch (typeof ids) {
            case 'string':
                this.solution.push(db.getItem(name, <string>ids));
                break;
            case 'object':
                if (Array.isArray(ids)) {
                    this.solution.push(db.getItems(name, ids));
                    break;
                }
            default:
                this.solution.push(db.getItems(name));
        }
        
        (<{tableName: string}>this.names).tableName = name;
    
        return this;
    }
    where(attribute: string, value?: string | number | boolean, comparator?: string) {
        let _comparator = comparator || '=';

        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (Array.isArray(res)) {
                if (typeof value !== 'undefined') {
                    switch (_comparator) {
                        case '=':
                            return _.filter(res, [attribute, value]);
                        case '!=':
                            return _.filter(res, (o: any) => !_.isEqual(o[attribute], value));
                        case '<':
                            return _.filter(res, (o: any) => o[attribute] < value);
                        case '>':
                            return _.filter(res, (o: any) => o[attribute] > value);
                        case '<=':
                            return _.filter(res, (o: any) => o[attribute] <= value);
                        case '>=':
                            return _.filter(res, (o: any) => o[attribute] >= value);
                        case 'has':
                            return _.filter(res, (o: any) => _.indexOf(o[attribute], value) > -1);
                        default:
                            return Promise.reject('Invalid comparator in where operation');
                    }
                }
                else
                    return _.filter(res, (o) => _.has(o, attribute));
            }
            return Promise.reject('Invalid use of where operation');
        });

        return this;
    }
    orderBy(attribute: _.Many<string | _.ListIterator<object, any>>, order?: string | string[]) {
        let _order: string | string[];
        if (typeof attribute === 'string') {
            _order = (order === 'asc' || order === 'desc') ? order : 'asc';
        } else {
            if(order){
                if(typeof order === 'string') {
                    _order = order === 'desc' ? _.fill(Array(attribute.length), 'desc') : _.fill(Array(attribute.length), 'asc');
                }
                else
                    _order = (order.length < attribute.length) ? _.concat(order, _.fill(Array(attribute.length - order.length), 'asc')) : _.take(order, attribute.length);
            }
            else
                _order = _.fill(Array(attribute.length), 'asc');
        }

        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (_.isObject(res))
                return _.orderBy(res, attribute, _order);
            return Promise.reject('Invalid use of orderBy operation');
        });

        return this;
    }
    first(quantity?: number) {
        let _quantity = (quantity && quantity > 1) ? quantity : 1;

        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (Array.isArray(res))
                return _.slice(res, 0, _quantity);
            return Promise.reject('Invalid use of first operation');
        });

        return this;
    }
    count() {
        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (Array.isArray(res))
                return res.length;
            return Promise.reject('Invalid use of count operation');
        });
        return this;
    }
    project(...attributes: Array<string | string[]>) {
        this.solution[0] = this.solution[0].then((res: object[] | object): any => {
            if(attributes.length > 0) {
                if (Array.isArray(res))
                    return _.reduceRight(res, (result: object[], o: object) => {
                        result.push(_.pick(o, attributes));
                        return result;
                    }, []);
                else if (_.isObject(res))
                    return _.pick(res, attributes)
                else
                    return Promise.reject('Invalid use of project operation');
                }
            else
                return Promise.reject('Invalid use of project operation');
        });
        return this;
    }
    map(iteratee: _.ObjectIterator<any, any> | string) {
        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (_.isObject(res))
                return _.map(res, iteratee);
            return Promise.reject('Invalid use of map operation');
        });
        return this;
    }
    filter(iteratee: any) {
        this.solution[0] = this.solution[0].then((res: object[]): any => {
            if (_.isObject(res))
                return _.filter(res, iteratee);
            return Promise.reject('Invalid use of filter operation');
        });
        this.solution
        return this;
    }
    reduce(iteratee: _.MemoIterator<any, any>, accumulator?: any) {
        let _accumulator = accumulator ? accumulator : [];
        this.solution[0] = this.solution[0].then((res: _.Dictionary<string | object>) => {
            if (_.isObject(res))
                return _.reduceRight(res, iteratee, _accumulator);
            return Promise.reject('Invalid use of reduce operation');
        });
        return this;
    }
    insert() {
        if ((<{tableName: string}>this.names).tableName) {
            this.solution[0] = this.solution[0].then((res) => {
                if(Array.isArray(res))
                    if (_.isEmpty(res))
                        return Promise.resolve([]);
                    else 
                        return <any>db.putItems((<{tableName: string}>this.names).tableName, res);
                else
                    return db.putItem((<{tableName: string}>this.names).tableName, res);
            })
        }
        else
            this.solution[0] = Promise.reject('Invalid use of insert operation');

        return this;
    }
    delete() {
        if ((<{tableName: string}>this.names).tableName) {
            this.solution[0] = this.solution[0].then((res: any) => {
                if(Array.isArray(res)) {
                    if (_.isEmpty(res))
                        return Promise.resolve([]);
                    else
                        return <any>db.deleteItems((<{tableName: string}>this.names).tableName, _.reduceRight(res, (accum: string[], item, key) => {
                            if(typeof item === 'string')
                                accum.push(item);
                            else if(_.size(item) === 1)
                                accum.push(<string>_.get(item, _.keys(item)[0]));
                            return accum
                    }, []));
                }
                else if(_.isObject(res) && _.size(res) === 1)
                    return db.deleteItem((<{tableName: string}>this.names).tableName, <string>_.get(res, _.keys(res)[0]));
                else
                    return db.deleteItem((<{tableName: string}>this.names).tableName, res);
                    
            })
        }
        else 
            this.solution[0] = Promise.reject('Invalid use of delete operation');

        return this;
    }
    join(accessor0: string, accessor1: string) {
        this.solution.unshift(Promise.all(_.pullAt(this.solution, [0, 1]))
                .then((res: any[]): any => {
                    if (Array.isArray(res[0]) && Array.isArray(res[1])) {
                        let length0 = res[0].length;
                        let length1 = res[1].length;
                        if (length0 < 1 || length1 < 1)
                            return [];
                        let index: any;
                        let aux;
                        if (length0 < length1) {
                            index = _.groupBy(res[0], accessor0);
                            return _.reduceRight(res[1], (result: Array<object>, o1: any) => {
                                aux = o1[accessor1];
                                if (_.has(index, aux))
                                    return _.map(index[aux], o0 => _.assign({}, _.omit(o0, accessor0), _.omit(o1, accessor1))).concat(result);
                                return result;
                            }, []);
                        }
                        index = _.groupBy(res[1], accessor1);
                        return _.reduceRight(res[0], (result: object[], o0: any) => {
                            aux = o0[accessor0];
                            if (_.has(index, aux))
                                return _.map(index[aux], o1 => _.assign({}, _.omit(o0, accessor0), _.omit(o1, accessor1))).concat(result);
                            return result;
                        }, []);
                    }
                    return Promise.reject('Invalid use of function join');
                }));
        return this;
    }
    deleteObject() {
        if ((<{bucketName: string}>this.names).bucketName) {
            this.solution[0] = this.solution[0].then((res: any) => {
                if(Array.isArray(res)) {
                    if (_.isEmpty(res))
                        return Promise.resolve([]);
                    else
                         return <any>storage.deleteObjects((<{bucketName: string}>this.names).bucketName, res);
                }
                else
                    return storage.deleteObject((<{bucketName: string}>this.names).bucketName, res)
            })
        }
        else 
            this.solution[0] = Promise.reject('Invalid use of deleteObject operation');

        return this;
    }
    then(result: Function | null, reject?: Function) {
        let promise: Promise<object[] | object | string | number> = this.solution[0];
        if (result && reject) {
            promise = this.solution[0]
                .then((res: any) => {
                    return result(res);
                }, (err: Error) => {
                    return reject(err);
                });
        }
        else if (result) {
            promise = this.solution[0]
                .then((res: any) => {
                    return result(res);
                });
        }
        else if (reject) {
            promise = this.solution[0]
                .catch((err: Error) => {
                    return reject(err);
                });
        }
        
        return promise;
    }
    promise() {
        return <Promise<object[] | object | string | string[] | number | never>>this.solution.shift();;
    }
}