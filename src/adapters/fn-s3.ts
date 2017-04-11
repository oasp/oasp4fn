import * as AWS from 'aws-sdk'
import * as _ from 'lodash'

AWS.config.region = "us-west-2"

const s3 = new AWS.S3()

export function getObject(bucket: string, id: string) {
     return s3.getObjectTorrent({ Bucket: bucket, Key: id }).promise()
         .then((res: AWS.S3.GetObjectTorrentOutput) => {
            return res.Body
         }, (err: Error) => {
            return Promise.reject(err)
         })
}

export function listObjects(bucket: string) {
    return s3.listObjectsV2({ Bucket: bucket }).promise()
        .then((res: AWS.S3.ListObjectsV2Output) => {
            // let truncated = res.IsTruncated
            let next = res.NextContinuationToken
            let result: string[] | Promise<never> = _.reduceRight(res, (accumulator: Array<string>, o: any) => {
                            accumulator.push(o.key)
                            return accumulator
                        }, [])
            while(next){
                s3.listObjectsV2({ Bucket: bucket, ContinuationToken: next }).promise()
                    .then((res: AWS.S3.ListObjectsV2Output) => {
                        // truncated = res.IsTruncated
                        next = res.NextContinuationToken as string
                        (<string[]>result).concat(_.reduceRight(res, (accumulator: Array<string>, o: any) => {
                            accumulator.push(o.key)
                            return accumulator
                        }, []))
                    }, (err: Error) => {
                        // truncated = false
                        next = undefined
                        result = Promise.reject(err)
                    })
            }
            return result 
        }, (err: Error) => {
            return Promise.reject(err)
        })
}

export function putObject(bucket: string, id: string, buffer: Buffer, mimetype?: string, access: string = 'public-read'){
    let params = {
            ACL: access,
            Bucket: bucket,
            Key: id,
            Body: buffer,
            ContentType: mimetype
        }
        return s3.upload(params).promise()
            .then((res: AWS.S3.ManagedUpload.SendData) => {
                return res.Location
            }, (err: Error) => {
                return Promise.reject(err)
            })
}

export function deleteObject(bucket: string, id: string){
    return s3.deleteObject({ Bucket: bucket, Key: id }).promise()
        .then((res: AWS.S3.DeleteObjectOutput) => {
            return id
        }, (err: Error) => {
            return Promise.reject(err)
        })
}

export function deleteObjects(bucket: string, ids: Array<string>){
     let params = { 
         Bucket: bucket, 
         Delete: { 
         } 
     }
     let objects: Array<any> = []
     _.forEach(ids, (value: string) => {
         objects.push({ Key: value })
     })
     params.Delete = Object.defineProperty(params.Delete, "Objects", {
         enumerable: true,
         configurable: true,
         writable: true,
         value: objects
     })
     return s3.deleteObjects(<AWS.S3.DeleteObjectsRequest>params).promise()
        .then((res: AWS.S3.DeleteObjectsOutput) => {
            if(typeof res.Deleted === "undefined")
                throw new Error("No objects have been deleted")
            let result = _.reduceRight(res.Deleted, (accumulator: Array<string>,  o: any) => {
                accumulator.push(o.Key)
                return accumulator
            }, [])
            return result
        }, (err: Error) => {
            return Promise.reject(err)
        })
}
