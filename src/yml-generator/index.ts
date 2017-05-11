
import * as fs from 'fs'

console.log(process.cwd())

export function run() {
    let cwd = process.cwd()
    const dir = fs.readdirSync(cwd)
    console.log(dir)
}