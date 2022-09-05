import * as companyRepository from "../repositories/companyRepository.js";

export async function findCompanyApiKey(apiKey: string) {
  const company = companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw { type: "unathourized" };
  }
}
