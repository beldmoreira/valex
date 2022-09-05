import * as cardService from "../services/cardService.js";
import * as companyService from "../services/companyService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function recharge(apiKey: string, id: number, amount: number) {
  await companyService.findCompanyApiKey(apiKey);
  const card = await cardService.getById(id);
  cardService.validateExpirationDate(card.expirationDate);
  await rechargeRepository.insert({ cardId: id, amount });
}
