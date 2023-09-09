// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) {this.employees = data}

// }
// const fsPromise = require('fs').promises
// const path = require('path')
const Employee = require('../model/Employee')



const getAllEmployees = async (req, res) => {
    console.log(req.params)
    const employees = await Employee.find()
    res.json(employees)
}

const createNewEmployee = async (req, res) => {
    // we want to make sure the req.body object contain firstname and lastname
    if(!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({'message': 'firstname and lastname are required'})
    }
    // check if the employee already exist in the db. lets assume fullname has to be different
    const foundEmployee = await Employee.findOne({firstname: req.body.firstname, lastname: req.body.lastname}).exec()
    if(foundEmployee) return res.sendStatus(409)

    // create a new employee object
    const newEmployee = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    try {
        const result = await Employee.create(newEmployee)
        res.status(200).json({message: "new employee added"})

    }catch (e) {
        console.log(e)
        res.status(500).json({message: "something we wrong when creating new user"})
    }
    // data.setEmployees([...data.employees, newEmployee])
    // console.log(data.employees)
    // await fsPromise.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(data.employees))
    // res.status(200).json({message: "new employee added"})
}

const updateEmployee = async (req, res) => {
    // res.json({
    //     "firstname": req.body.firstname,
    //     "lastname": req.body.lastname
    // })
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    const employee = await Employee.findById(req.body.id)
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    try {
        const result = await Employee.findOneAndUpdate({_id: req.body.id}, {firstname: req.body.firstname, lastname: req.body.lastname})
        res.json({"message": "employee updated"});
    }catch(e){
        console.log(e)
    }

    // if (req.body.firstname) employee.firstname = req.body.firstname;
    // if (req.body.lastname) employee.lastname = req.body.lastname;
    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filteredArray, employee];
    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));



}

const deleteEmployee = async (req, res) => {
    // at the moment we just want to return the post data
    // and learning how to access the data from the request
    // res.json({
    //     "id": req.body.id,
    // })
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    const foundEmployee = await Employee.findOne({firstname: req.body.firstname, lastname: req.body.lastname}).exec()
    if (!foundEmployee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // Employee.findOneAndDelete
    // data.setEmployees([...filteredArray]);
    
    try{
        const result = await foundEmployee.deleteOne()
        res.status(200).json({"message": "employee has been deleted"})
    }catch(e) {
        console.log(e)
    }
}

const getEmployee = async (req, res) => {
    // res.json({'id': req.params.id})
    const params =  req.params
    if(!params?.id) return res.status(400).json({message: "missing employee id"});

    // fetch the employee from the mongdb
    const employee = await Employee.findById(params.id)
    if (!employee) {
        return res.status(200).json({ "message": `Employee with ID: ${req.params.id} not found` });
    }
    res.json(employee);
}

module.exports =  {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee}