import * as employeeRepository from "../repositories/employeeRepository.js";

export async function findEmployeeById(id: number) {
  const employee = employeeRepository.findById(id);
  if (!employee) {
    throw { type: "bad_request" };
  }
}
