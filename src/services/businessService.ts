import * as businessRepository from "../repositories/businessRepository.js";

export async function findBusinessById(id: number) {
  const business = businessRepository.findById(id);
  if (!business) {
    throw { type: "bad_request" };
  }
}
