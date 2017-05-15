
import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'

const DEFAULTS = {
    path: "handlers",
    provider: {name: "aws", runtime: "nodejs6.10", region: "us-west-2"},
    plugins: ["serverles-webpack", "serverless-offline"]
}

export function run() {
    let dirs = fs.readdirSync(DEFAULTS.path)
    dirs = _.reduceRight(<any>dirs, (accumulator: any, value) => {
        let aux = `${DEFAULTS.path}${path.sep}${value}`
        if(fs.statSync(aux).isDirectory())
            accumulator.push(aux)
        return accumulator
    }, [])
    let files = extractFiles(dirs, [])
    let tscParser: Function
    switch(DEFAULTS.provider.name) {
        case "aws":
            // import { tscParser } from '../aws'
            tscParser = require('./aws').tscParser
            break
        default:
            tscParser = require('./aws').tscParser
    }
    let serverless_yml = serviceName(DEFAULTS)
    serverless_yml = tscParser(files, serverless_yml)
    console.log(serverless_yml)
}

let extractFiles = (paths: string[], files: string[]): string[] => {
    if(paths.length === 0)
        return files
    else {
        let aux_dir = <string>paths.pop()
        let paths_aux = _.reduceRight(fs.readdirSync(aux_dir), (accumulator: any, value: string) => {
            let aux = `${aux_dir}${path.sep}${value}`
            if(fs.statSync(aux).isFile())
                files.push(aux)
            else
                accumulator.push(aux)
            return accumulator
        }, [])
        return extractFiles(_.concat(paths, paths_aux), files)
    }
}

let serviceName = (obj: any) => {
    if(!obj.service){
        let dirs = process.cwd().split(path.sep)
        obj.service = dirs[dirs.length - 1]
    }
    return _.omit(obj, 'path') 
}