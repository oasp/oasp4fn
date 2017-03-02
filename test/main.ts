import { error } from 'util';

import { expect } from 'chai'
import db from '../src/data-collector'

describe('table', () => {
  
     it('The function should return a reference to the self object', () => {
         expect(db.table('employees')).to.be.an('object')
         expect(db.table('employees')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it('If the table exist, the resolution promise should return an Array<Object>', (done: Function) => {
        db.table('employees').then((res: Array<Object>) => {
            try {
                expect(res).to.be.an('array')
                expect(res).to.have.lengthOf(4)
            }
            catch (err){
                done(err)
            }
         }, (err: Error) => {
             try{
                expect(err).to.be.undefined 
             }
             catch (err) {
                done(err)
             }
         })
         done()
     })
     it('If the table doesn\'t exist, the resoluton promise should return an Error', (done: Function) => {
         db.table('some_table').then((res: Array<Object>) => {
            try {
                expect(res).to.be.undefined
             }
             catch (err) {
                 done(err)
             } 
            }, (err: Error) => {
             try {
                expect(err).to.be.a('string')
             }
             catch (err) {
                 done(err)
             }
         })
         done()
     })
     it('If an id is passed along with the name of the table, the corresponding item will be returned', (done: Function) => {
         db.table('departments', '1')
             .then((res: Object) => {
                 try {
                 expect(res).to.be.an('object')
                 expect(res).to.have.property('id', '1')
                }
                catch (err) {
                    done(err)
                }
             }, (err: Error) => {
                 try {
                     expect(err).to.be.undefined 
                 }
                 catch (err) {
                     done(err)
                 }
             })
             done()
     })
     it('If an array of id\'s is passed along with the name of the table, the corresponding list of items will be returned', (done: Function) => {
             db.table('departments', ['1', '3', '4'])
                 .then((res: Object) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(3)
                    }
                    catch (err){
                        done(err)
                    }
                 }, (err: Error) => {
                     try {
                         expect(err).to.be.undefined 
                     }
                     catch (err) {
                         done(err)
                     }
                 })
                 done()
     })
     it('If an id passed doesn\'t have an item in the table, an error will be returned', (done: Function) => {
         db.table('departments', '7')
             .then((res: Array<Object>) => {
                 try {
                    expect(res).to.be.undefined
                   }
                 catch (err) {
                        done(err)
                   } 
             }, (err: Error) => {
                 try {
                     expect(err).to.be.a('string')
                 }
                 catch (err) {
                     done(err)
                 }
             })
        db.table('departments',  ['1', '6', '4'])
            .then((res: Array<Object>) => {
                   try {
                    expect(res).to.be.undefined
                   }
                   catch (err) {
                        done(err)
                   } 
                }, (err: Error) => {
                    try {
                        expect(err).to.be.a('string')
                    }
                    catch (err) {
                        done(err)
                    }
            })
            done()
     })
})


describe('where', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.where('id')).to.be.an('object')
         expect(db.where('id')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it('If the operation is succesful, the resolution should be an Array<Object>', (done: Function) => {
         db.table('employees')
             .where('id', '1')
             .then((res: Array<Object>) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(1)
                    }
                    catch (err){
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined 
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
     it('If the operation fail, the resolution should be an error', (done: Function) => {
         db.table('employess')
             .where('id', '1', 23)
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined
                    }
                    catch (err) {
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string')
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
})

describe('orderBy', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.orderBy('id')).to.be.an('object')
         expect(db.orderBy('id')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it("If you don't specify an order, the result array is sorted ascendingly", (done: Function) => {
         db.table('employees')
             .orderBy('id')
             .then((res: any) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(4)
                        let i = res.length
                        while(--i) {
                            expect(res[i].id >= res[i - 1].id).to.be.true
                        }
                            
                    }
                    catch (err){
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined 
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
     it("If you specify 'desc' as the order, the result array is sorted descendingly", (done: Function) => {
         db.table('employees')
             .orderBy('id', 'desc')
             .then((res: any) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(4)
                        let i = res.length
                        while(--i) {
                            expect(res[i].id <= res[i - 1].id).to.be.true
                        }
                            
                    }
                    catch (err){
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined 
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
     it("If the especified attribute doesn't exist, the function return the same array", (done: Function) => {
         db.table('employees')
             .orderBy('error')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.an('array')
                       expect(res).to.have.lengthOf(4)
                    }
                    catch (err) {
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
})

describe('first', () => {
    let first_object: Object
     before(() => {
         db.table('employees')
             .then((res: Array<Object>) => {
                 first_object = res[0]
             })
     })
     it('The function should return a reference to the self object', () => {
         expect(db.first()).to.be.an('object')
         expect(db.first()).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it("If the operation is succesful, the result is the first object of the table", (done: Function) => {
         db.table('employees')
             .first()
             .then((res: any) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(1)
                        expect(res[0]).to.be.equal(first_object)    
                    }
                    catch (err){
                        done(err)
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined 
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
     it("If the especified attribute doesn't exist, the function return the same array", (done: Function) => {
         db.table('employees', '1')
             .first()
             .first()
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined
                    }
                    catch (err) {
                        done(err)
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.a('string')
                    }
                    catch (err) {
                        done(err)
                    }
             })
         done()
     })
})