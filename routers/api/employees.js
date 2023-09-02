const express = require('express');
const router =  express.Router();
const path = require('path');
const data = {}
data.employee = require('../../model/employees.json')
const  employeeController = require('../../controllers/employeesController')

// instead of using router.get router.put etc...
// use router.route. handle muitple http methods
router.route('/')
    .get(employeeController.getAllEmployees)
    .post(employeeController.createNewEmployee)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee)



router.route('/:id')
    .get(employeeController.getEmployee)


module.exports = router