import * as _ from 'lodash'
let DynamoDB = require('aws-sdk/clients/dynamodb')

let dynamodb: AWS.DynamoDB
let docClient: AWS.DynamoDB.DocumentClient
const DEFAULT_OPTS = { endpoint: "http://localhost:8000/", region: "us-west-2" }

let tables: any = {}

export function instance(options: Object = {}) {
    dynamodb = new DynamoDB(_.assign(DEFAULT_OPTS, options))
    docClient = new DynamoDB.DocumentClient(_.assign(DEFAULT_OPTS, options))
}

export function getItem (table_name: string, id: string) {
  let params = {
      TableName: table_name,
      Key: {}
  }

  let promise = Promise.resolve()
  if(!tables[table_name]) 
      promise = getKey(table_name)

  return promise.then((res: void) => {
    params.Key = Object.defineProperty(params.Key, tables[table_name], {
        enumerable: true,
        configurable: true,
        writable: true,
        value: id
      })
    return docClient.get(params).promise()
            .then((res: AWS.DynamoDB.GetItemOutput) => {
              return <AWS.DynamoDB.AttributeMap>res.Item
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
      return promise.then((res: void) => {
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
                .then((res: AWS.DynamoDB.BatchGetItemOutput) => {
                  let unprocessed = <AWS.DynamoDB.BatchGetRequestMap>res.UnprocessedKeys
                  let result = (<AWS.DynamoDB.BatchGetResponseMap>res.Responses)[table_name]
                  while(_.size(unprocessed)) {
                     params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: { Keys: unprocessed.Keys }
                     })
                     docClient.batchGet(params).promise()
                       .then((res: AWS.DynamoDB.BatchGetItemOutput) => {
                         unprocessed = <AWS.DynamoDB.BatchGetRequestMap>res.UnprocessedKeys
                         result.concat((<AWS.DynamoDB.BatchGetResponseMap>res.Responses)[table_name])
                       })
                  }
                  return result
                }, (err: Error) => {
                  return Promise.reject(err)
                })
      }, (err: Error) => {
        return Promise.reject(err)
      })
    }
    else {
      let params: AWS.DynamoDB.ScanInput = {
        TableName: table_name
      }  
      return docClient.scan(params).promise()
              .then((res: AWS.DynamoDB.ScanOutput) => {
                let lastKey = res.LastEvaluatedKey
                let result = <AWS.DynamoDB.AttributeMap[]>res.Items
                while(lastKey){
                  params.ExclusiveStartKey = lastKey
                  docClient.scan(params).promise()
                    .then((res: AWS.DynamoDB.ScanOutput) => {
                      result.concat(<AWS.DynamoDB.AttributeMap[]>res.Items)
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
   return promise.then((res: void) => {
    return docClient.put(params).promise()
            .then((res: AWS.DynamoDB.PutItemOutput) => {
              return <string>item[tables[table_name]]
            }, (err: Error) => {
              return Promise.reject(err)
            })
   }, (err: Error) => {
     return Promise.reject(err)
   })
}

export function putItems (table_name: string, items: Array<Object>) {
  let params = {
    RequestItems: {}
  }
  let promise = Promise.resolve()
  if(!tables[table_name])
     promise = getKey(table_name)
  return promise.then((res: void) => {
    let item_list = _.reduceRight(items, (result: Array<{PutRequest:{Item:{}}}>, item: Object) => {
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
           .then((res: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => {
              let unprocessed = <AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems
              while(_.size(unprocessed)) {
                  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (<AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems)[table_name]
                  })
                  docClient.batchWrite(params).promise()
                    .then((res: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => {
                      unprocessed = <AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems
                    })
              }
              return _.map(items, tables[table_name])
           }, (err: Error) => {
             return Promise.reject(err)
           })
      }, (err: Error) => {
        return Promise.reject(err)
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
  return promise.then((res: void) => {
    params.Key = Object.defineProperty(params.Key, tables[table_name], {
          enumerable: true,
          configurable: true,
          writable: true,
          value: id
        })
    return docClient.delete(params).promise()
            .then((res: AWS.DynamoDB.DeleteItemOutput) => {
              if(res.Attributes === undefined)
                return Promise.reject('The item with id: ' + id + ' doesn\'t exist')
              return res.Attributes
            }, (err: Error) => {
              return Promise.reject(err)
            })
    }, (err: Error) => {
      return Promise.reject(err)
    })
}

export function deleteItems (table_name: string, ids: Array<string>) {
  let params = {
    RequestItems: {}
  }
  let promise = Promise.resolve()
   if(!tables[table_name])
      promise = getKey(table_name)
  return promise.then((res: void) => {
    let key_list = _.reduceRight(ids, (result: Array<{DeleteRequest:{Key:{}}}>, id: string) => {
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
           .then((res: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => {
              let unprocessed = <AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems
              while(_.size(unprocessed)) {
                  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (<AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems)[table_name]
                  })
                  docClient.batchWrite(params).promise()
                    .then((res: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => {
                      unprocessed = <AWS.DynamoDB.BatchWriteItemRequestMap>res.UnprocessedItems
                    })
              }
              return ids
           }, (err: Error) => {
             return Promise.reject(err)
           })
  }, (err: Error) => {
    return Promise.reject(err)
  })
}

async function getKey(table_name: string) {
  try {
    let res = await dynamodb.describeTable({TableName: table_name}).promise()
    if(typeof res.Table === "undefined")
      throw new Error(`Error getting the schema of the table ${table_name}`)
    let keySchema = <AWS.DynamoDB.KeySchemaElement>_.find(<AWS.DynamoDB.KeySchemaElement[]>res.Table.KeySchema, ["KeyType", "HASH"])
    tables[table_name] = keySchema.AttributeName
  }
  catch (err) {
    return Promise.reject(err)
  }
}