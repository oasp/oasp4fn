import { error } from 'util';

import { expect } from 'chai';
import db from '../src/index';

describe('table', () => {

     it('The function should return a reference to the self object', () => {
         expect(db.table('employees')).to.be.an('object');
         expect(db.table('employees')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the table exist, the resolution promise should return an Array<Object>', (done: Function) => {
        db.table('employees').then((res: Array<Object>) => {
            try {
                expect(res).to.be.an('array');
                expect(res).to.have.lengthOf(4);
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
             }
             catch (err) {
                done(err);
             }
         });
         done();
     });
     it('If the table doesn\'t exist, the resoluton promise should return an Error', (done: Function) => {
         db.table('some_table').then((res: Array<Object>) => {
            try {
                expect(res).to.be.undefined;
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                expect(err).to.be.a('string');
             }
             catch (err) {
                 done(err);
             }
         });
         done();
     });
     it('If an id is passed along with the name of the table, the corresponding item will be returned', (done: Function) => {
         db.table('departments', '1')
             .then((res: Object) => {
                 try {
                 expect(res).to.be.an('object');
                 expect(res).to.have.property('id', '1');
                }
                catch (err) {
                    done(err);
                }
             }, (err: Error) => {
                 try {
                     expect(err).to.be.undefined;
                 }
                 catch (err) {
                     done(err);
                 }
             });
             done();
     });
     it('If an array of id\'s is passed along with the name of the table, the corresponding list of items will be returned', (done: Function) => {
             db.table('departments', ['1', '3', '4'])
                 .then((res: Object) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(3);
                    }
                    catch (err) {
                        done(err);
                    }
                 }, (err: Error) => {
                     try {
                         expect(err).to.be.undefined;
                     }
                     catch (err) {
                         done(err);
                     }
                 });
                 done();
     });
     it('If an id passed doesn\'t have an item in the table, an error will be returned', (done: Function) => {
         db.table('departments', '7')
             .then((res: Array<Object>) => {
                 try {
                    expect(res).to.be.undefined;
                   }
                 catch (err) {
                        done(err);
                   }
             }, (err: Error) => {
                 try {
                     expect(err).to.be.a('string');
                 }
                 catch (err) {
                     done(err);
                 }
             });
        db.table('departments',  ['1', '6', '4'])
            .then((res: Array<Object>) => {
                   try {
                    expect(res).to.be.undefined;
                   }
                   catch (err) {
                        done(err);
                   }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
            });
            done();
     });
});


describe('where', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.where('id')).to.be.an('object');
         expect(db.where('id')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the resolution should be an Array<Object>', (done: Function) => {
         db.table('employees')
             .where('id', '1')
             .then((res: Array<Object>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(1);
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it('If the operation fail, the resolution should be an error', (done: Function) => {
         db.table('employees')
             .where('id', '1', 23)
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('orderBy', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.orderBy('id')).to.be.an('object');
         expect(db.orderBy('id')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it("If you don't specify an order, the result array is sorted ascendingly", (done: Function) => {
         db.table('employees')
             .orderBy('id')
             .then((res: any) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(4);
                        let i = res.length;
                        while(--i) {
                            expect(res[i].id >= res[i - 1].id).to.be.true;
                        }

                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If you specify 'desc' as the order, the result array is sorted descendingly", (done: Function) => {
         db.table('employees')
             .orderBy('id', 'desc')
             .then((res: any) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(4);
                        let i = res.length;
                        while(--i) {
                            expect(res[i].id <= res[i - 1].id).to.be.true;
                        }

                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If the especified attribute doesn't exist, the function return the same array", (done: Function) => {
         db.table('employees')
             .orderBy('error')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.an('array');
                       expect(res).to.have.lengthOf(4);
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('first', () => {
    let first_object: Object;
     before(() => {
         db.table('employees')
             .then((res: Array<Object>) => {
                 first_object = res[0];
             });
     });
     it('The function should return a reference to the self object', () => {
         expect(db.first()).to.be.an('object');
         expect(db.first()).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it("If the operation is succesful, the result is the first object of the table", (done: Function) => {
         db.table('employees')
             .first()
             .then((res: Array<Object>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(1);
                        expect(res[0]).to.be.equal(first_object);
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If the operation isn't done over an array, the operation should return an error", (done: Function) => {
         db.table('employees')
             .count()
             .first()
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('count', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.count()).to.be.an('object');
         expect(db.count()).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is the number of items of the table', (done: Function) => {
         db.table('employees')
             .count()
             .then((res: number) => {
                    try {
                        expect(res).to.be.an('number');
                        expect(res).to.be.equals(4);
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If the operation isn't done over an array, the operation should return an error", (done: Function) => {
         db.table('employees')
             .count()
             .count()
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('project', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.project('hi', 'bye')).to.be.an('object');
         expect(db.project(['hi', 'bye'])).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is all the objects of the table but only with the specified properties', (done: Function) => {
         db.table('employees')
             .project('id', 'name')
             .then((res: Array<Object>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(4);
                        let i = res.length;
                        while(i--) {
                            expect(res[i]).to.be.an('object');
                            expect(res[i]).to.have.all.keys(['id', 'name']);
                            expect(res[i]).to.not.have.all.keys(['surname', 'department']);
                        }
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it('If the function is called with no parametters, the operation should return an error', (done: Function) => {
         db.table('employees')
             .project()
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If the operation isn't done over an array, the operation should return an error", (done: Function) => {
         db.table('employees')
             .count()
             .project('id', 'name')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('reduce', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.reduce((result: Array<Object>, o: any) => {
                result.push(o);
                return result;
            }, [])).to.be.an('object');
         expect(db.reduce((result: Array<Object>, o: any) => {
                result.push(o);
                return result;
            }, [])).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is the table with the item changes specified by the passed function', (done: Function) => {
         db.table('employees')
             .reduce((result: Array<Object>, o: any) => {
                 o.department = 1;
                 result.push(o);
                 return result;
             }, [])
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(4);
                        let i = res.length;
                        while(i--) {
                            expect(res[i]).to.be.an('object');
                            expect(res[i]).to.have.all.keys(['id', 'name', 'surname', 'department']);
                            expect(res[i].department).to.be.equal(1);
                        }
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it("If the operation isn't done over an array, the operation should return an error", (done: Function) => {
         db.table('employees')
             .count()
             .reduce((result: Array<Object>, o: any) => {
                 o.department = 1;
                 result.push(o);
                 return result;
             }, [])
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('join', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.table('employees').table('departments').join('department', 'id')).to.be.an('object');
         expect(db.table('employees').table('departments').join('department', 'id')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is a joined table', (done: Function) => {
         db.table('employees')
             .table('departments')
             .join('department', 'id')
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(4);
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it('If the operation fail, the resolution should be an error', (done: Function) => {
         db.table('employees')
             .join('department', 'id')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('insert', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.insert('departments', [{id: '7', name: 'Sales'}, {id: '5', name: 'Comercial'}])).to.be.an('object');
         expect(db.insert('departments', {id: '7', name: 'Sales'})).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is an id or an array of ids', (done: Function) => {
         db.insert('departments', [{id: '7', name: 'Sales'}, {id: '5', name: 'Comercial'}])
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(2);
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         db.insert('departments', {id: '7', name: 'Sales'})
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.a('string').equal('7');
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it('If the operation fail, the resolution should be an error', (done: Function) => {
         db.insert('employee', {id: '7', name: 'Sales'})
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

describe('delete', () => {
     it('The function should return a reference to the self object', () => {
         expect(db.delete('employees', '1')).to.be.an('object');
         expect(db.delete('employees', '3')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'reduce', 'insert', 'delete', 'join', 'then']);
     });
     it('If the operation is succesful, the result is an id or an array of ids', (done: Function) => {
         db.delete('departments', ['2', '1'])
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.an('array');
                        expect(res).to.have.lengthOf(2);
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         db.delete('departments', '4')
             .then((res: Array<any>) => {
                    try {
                        expect(res).to.be.a('string').equals('4');
                    }
                    catch (err){
                        done(err);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
     it('If the operation fail, the resolution should be an error', (done: Function) => {
         db.delete('employee', '3')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
             db.delete('employees', 'hola')
             .then((res: Array<Object>) => {
                    try {
                       expect(res).to.be.undefined;
                    }
                    catch (err) {
                        done(err);
                    }
                }, (err: Error) => {
                    try{
                        expect(err).to.be.a('string');
                    }
                    catch (err) {
                        done(err);
                    }
             });
         done();
     });
});

