import * as _ from 'lodash'
let DynamoDB = require('aws-sdk/clients/dynamodb')

let dynamodb = new DynamoDB({ endpoint: "http://localhost:8000/", region: "us-west-2" })
let docClient = new DynamoDB.DocumentClient({ endpoint: "http://localhost:8000/", region: "us-west-2" })

let tables: any = {}

export function getItem (table_name: string, id: string) {
  let params = {
        TableName: table_name,
        Key: {}
    }

    let promise = Promise.resolve()
    if(!tables[table_name]) 
        promise = getKey(table_name)

    return promise.then((res: any) => {
      params.Key = Object.defineProperty(params.Key, tables[table_name], {
          enumerable: true,
          configurable: true,
          writable: true,
          value: id
        })
      return docClient.get(params).promise()
              .then((res: any) => {
                return res.Item
              }, (err: Error) => {
                return Promise.reject(err)
              })
    })
}

export function getItems (table_name: string, ids?: Array<Object>) {
    if (ids) {
      let params = {
        RequestItems: {}
      } 
      let promise = Promise.resolve()
      if(!tables[table_name])
          promise = getKey(table_name)
      return promise.then((res: any) => {
          let keys = _.reduce(ids, (result: Array<Object>, id: string) => {
          let push_aux: any = {}
          push_aux[tables[table_name]] = id 
          result.push(push_aux)
          return result
        }, [])
        params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: { Keys: keys }
        })
        return docClient.batchGet(params).promise()
                .then((res: any) => {
                  let unprocessed = res.UnprocessedKeys
                  let result = res.Responses[table_name]
                  while(_.size(unprocessed)) {
                     params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: { Keys: unprocessed.Keys }
                     })
                     docClient.batchGet(params).promise()
                       .then((res: any) => {
                         unprocessed = res.UnprocessedKeys
                         result.concat(res.Responses[table_name])
                       })
                  }
                  return result
                }, (err: Error) => {
                  return Promise.reject(err)
                })
      })
    }
    else {
      let params: any = {
        TableName: table_name
      }  
      return docClient.scan(params).promise()
              .then((res: any) => {
                let lastKey = res.LastEvaluatedKey
                let result = res.Items
                while(lastKey){
                  params.ExclusiveStartKey = lastKey
                  docClient.scan(params).promise()
                    .then((res: any) => {
                      result.concat(res.Items)
                      lastKey = res.LastEvaluatedKey
                    })
                }
                return result
              }, (err: Error) => {
                return Promise.reject(err)
              })
    }
}

export function putItem (table_name: string, item: any) {
  let params = {
    TableName: table_name,
    Item: item
  }
   let promise = Promise.resolve()
   if(!tables[table_name])
      promise = getKey(table_name)
   return promise.then((res: any) => {
    return docClient.put(params).promise()
            .then((res: any) => {
              return item[tables[table_name]]
            }, (err: Error) => {
              return Promise.reject(err)
            })
   })
}

export function putItems (table_name: string, items: Array<Object>) {
  let params = {
    RequestItems: {}
  }
  let promise = Promise.resolve()
  if(!tables[table_name])
     promise = getKey(table_name)
  return promise.then((res: any) => {
    let item_list = _.reduceRight(items, (result: any, item: Object) => {
      result.push({PutRequest:{Item: item}})
      return result
    }, [])
    params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: item_list
        }) 
    return docClient.batchWrite(params).promise()
           .then((res: any) => {
              let unprocessed = res.UnprocessedItems
              while(_.size(unprocessed)) {
                  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: res.UnprocessedItems[table_name]
                  })
                  docClient.batchWrite(params).promise()
                    .then((res: any) => {
                      unprocessed = res.UnprocessedItems
                    })
              }
              return _.map(items, tables[table_name])
           }, (err: Error) => {
             return Promise.reject(err)
           })
      })
}

export function deleteItem (table_name: string, id: string) {
  let params = {
    TableName: table_name,
    Key: {},
    ReturnValues: 'ALL_OLD'
  }
  let promise = Promise.resolve()
  if(!tables[table_name])
    promise = getKey(table_name)
  return promise.then((res: any) => {
    params.Key = Object.defineProperty(params.Key, tables[table_name], {
          enumerable: true,
          configurable: true,
          writable: true,
          value: id
        })
    return docClient.delete(params).promise()
            .then((res: any) => {
              if(res.Attributes === undefined)
                return Promise.reject('The item with id: ' + id + ' doesn\'t exist')
              return res.Attributes
            }, (err: Error) => {
              return Promise.reject(err)
            })
    })
}

export function deleteItems (table_name: string, ids: Array<any>) {
  let params = {
    RequestItems: {}
  }
  let promise = Promise.resolve()
   if(!tables[table_name])
      promise = getKey(table_name)
  return promise.then((res: any) => {
    let key_list = _.reduceRight(ids, (result: any, id: string) => {
      let push_aux = {DeleteRequest:{Key:{}}}
      push_aux.DeleteRequest.Key = Object.defineProperty(push_aux.DeleteRequest.Key, tables[table_name], {
          enumerable: true,
          configurable: true,
          writable: true,
          value: id
        }) 
      result.push(push_aux)
      return result
    }, [])
    params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: key_list
        }) 
    return docClient.batchWrite(params).promise()
           .then((res: any) => {
              let unprocessed = res.UnprocessedItems
              while(_.size(unprocessed)) {
                  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: res.UnprocessedItems[table_name]
                  })
                  docClient.batchWrite(params).promise()
                    .then((res: any) => {
                      unprocessed = res.UnprocessedItems
                    })
              }
              return ids
           }, (err: Error) => {
             return Promise.reject(err)
           })
  })
}

async function getKey(table_name: string) {
  try {
    let res = await dynamodb.describeTable({TableName: table_name}).promise()
    let keySchema: any = _.find(res.Table.KeySchema, ["KeyType", "HASH"])
    tables[table_name] = keySchema.AttributeName
  }
  catch (err) {
    return Promise.reject(err)
  }
}