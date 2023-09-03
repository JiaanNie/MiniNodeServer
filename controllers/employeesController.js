const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) {this.employees = data}

}
const fsPromise = require('fs').promises
const path = require('path')



const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployee = async (req, res) => {
    // we want to make sure the req.body object contain firstname and lastname
    if(!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({'message': 'firstname and lastname are required'})
    }
    // create a new employee object
    const newEmployee = {
        id: data.employees[data.employees.length -1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    data.setEmployees([...data.employees, newEmployee])
    console.log(data.employees)
    await fsPromise.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(data.employees))
    res.status(200).json({message: "new employee added"})
}

const updateEmployee = (req, res) => {
    // res.json({
    //     "firstname": req.body.firstname,
    //     "lastname": req.body.lastname
    // })
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);



}

const deleteEmployee = (req, res) => {
    // at the moment we just want to return the post data
    // and learning how to access the data from the request
    // res.json({
    //     "id": req.body.id,
    // })
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    // res.json({'id': req.params.id})
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
}

module.exports =  {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee}