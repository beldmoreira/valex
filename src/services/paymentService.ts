import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as cardService from "../services/cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function payment(
  id: number,
  password: string,
  amount: number,
  businessId: number
) {
  const card = await cardService.getById(id);
  cardService.validateExpirationDate(card.expirationDate);
  cardService.validatePassword(password, card.password);

  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw { type: "bad_request" };
  }

  const payments = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);
  const cardQuantity = getCardsQuantities(payments, recharges);
  if (cardQuantity < amount) {
    throw { type: "bad_request" };
  }
  await paymentRepository.insert({ cardId: id, businessId, amount });
}

function getCardsQuantities(
  payments: paymentRepository.PaymentWithBusinessName[],
  recharges: rechargeRepository.Recharge[]
) {
  const paymentQuantity = payments.reduce(sumTransactionAmount, 0);
  const rechargeQuantity = recharges.reduce(sumTransactionAmount, 0);
  return rechargeQuantity - paymentQuantity;
}

function sumTransactionAmount(amount: number, transaction) {
  return amount + transaction.amount;
}
