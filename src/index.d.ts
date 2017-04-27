
// export as namespace Oasp4Fn
 
// declare namespace Oasp4Fn {
//     function table(name: string, ids?: string | string[]) 
//     function where(attribute: string, value?: string | number | boolean, comparator?: string)
//     function orderBy(attribute: string, order?: string)
//     function first(quantity?: number)
//     function count()
//     function project(attributes: string[])
//     function map(iteratee: Function)
//     function filter(iteratee: Function)
//     function reduce(iteratee: Function, accumulator?: any[] | object | number )
//     function insert(table_name: string, items: Object | object[])
//     function delete(table_name: string, ids: string | string[])
//     function join(accessor0: string, accessor1: string)
//     function bucket(bucket_name: string, id?: string)
//     function upload(bucket_name: string, id: string, buffer: Buffer, mimetype?: string, access?: string)
//     function deleteObject(bucket_name: string, ids: string | string[])
//     function then(result: Function | null, reject: Function | null)
//     function promise()
// }

export = Oasp4Fn

declare interface Oasp4Fn {
    table: (name: string, ids?: string | string[]) => Oasp4Fn
    where: (attribute: string, value?: string | number | boolean, comparator?: string) => Oasp4Fn
    orderBy: (attribute: string, order?: string) => Oasp4Fn
    first: (quantity?: number) => Oasp4Fn
    count: () => Oasp4Fn
    project: (attributes: string[]) => Oasp4Fn
    map: (iteratee: Function) => Oasp4Fn
    filter: (iteratee: Function) => Oasp4Fn
    reduce: (iteratee: Function, accumulator?: any[] | object | number ) => Oasp4Fn
    insert: (table_name: string, items: Object | object[]) => Oasp4Fn
    delete: (table_name: string, ids: string | string[]) => Oasp4Fn
    join: (accessor0: string, accessor1: string) => Oasp4Fn
    bucket: (bucket_name: string, id?: string) => Oasp4Fn
    upload: (bucket_name: string, id: string, buffer: Buffer, mimetype?: string, access?: string) => Oasp4Fn
    deleteObject: (bucket_name: string, ids: string | string[]) => Oasp4Fn
    then: (result: Function | null, reject: Function | null) => Promise<object[] | object | string | number>
    promise: () => Promise<object[] | object | string | number>
}