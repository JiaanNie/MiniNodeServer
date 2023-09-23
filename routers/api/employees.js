const express = require("express");
const router = express.Router();
const path = require("path");
const data = {};
const employeeController = require("../../controllers/employeesController");
const ROLES = require("../../config/rolesList");
const verifyRoles = require("../../middlewares/verifyRoles");

// instead of using router.get router.put etc...
// use router.route. handle muitple http methods
router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES.Admin, ROLES.Editor),
    employeeController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES.Admin, ROLES.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES.Admin), employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);

module.exports = router;
