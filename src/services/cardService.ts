import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as cardRepository from "../repositories/cardRepository.js";
import * as companyService from "../services/companyService.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as employeeService from "../services/employeeService.js";

export async function createCard(
  apiKey: string,
  employeeId: number,
  type: cardRepository.TransactionTypes
) {
  await companyService.findCompanyApiKey(apiKey);
  const employee = await employeeService.findEmployeeById(employeeId);
  const cardExists = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (cardExists) {
    throw { type: "bad_request" };
  }

  const cardData = createCardData(employeeId, type);
  await cardRepository.insert(cardData);
}

function createCardData(
  employeeId: number,
  type: cardRepository.TransactionTypes
) {
  const number = faker.finance.creditCardNumber("visa");
  const cardholderName = settingFormatCarholderName(employeeId);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");
  const hashedSecurityCode = createCVV();
  const cardData = {
    employeeId,
    number,
    cardholderName,
    securityCode: hashedSecurityCode,
    expirationDate,
    type,
  };
  return cardData;
}

export async function settingFormatCarholderName(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  const name = employee.fullName;
  const surnames = name.split(" ");
  const middleName = new Array();

  for (let i = 1; i < surnames.length - 1; i++) {
    if (surnames[i].length >= 3) {
      middleName.push(name[i][0]);
    }
  }
  const completeName = [surnames[0], middleName, surnames[surnames.length - 1]];

  return completeName.join(" ").toUpperCase();
}

function createCVV() {
  const securityCode = faker.finance.creditCardCVV();
  return bcrypt.hashSync(securityCode, 8);
}
export async function getById(id: number) {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw { type: "not_found" };
  }
  return card;
}

export async function validateExpirationDate(expirationDate: string) {
  const today = dayjs().format("MM/YY");
  if (dayjs(today).isAfter(dayjs(expirationDate))) {
    throw { type: "bad_request" };
  }
}
export async function validateCVV(cvc: string, cardCVC: string) {
  const isCVVRight = bcrypt.compareSync(cvc, cardCVC);
  if (!isCVVRight) {
    throw { type: "unauthorized" };
  }
}

export async function validatePassword(password: string, cardPassword: string) {
  const isPasswordCorrect = bcrypt.compareSync(password, cardPassword);
  if (!isPasswordCorrect) {
    throw { type: "bad_request" };
  }
}

export async function activateCard(id: number, cvc: string, password: string) {
  const card = await getById(id);
  validateExpirationDate(card.expirationDate);
  validateCVV(cvc, card.securityCode);
  const isItActive = card.password;
  if (!isItActive) {
    throw { type: "bad_request" };
  }
  const passwordFormat = /^d{4}$/;
  if (!passwordFormat.test(password)) {
    throw { type: "bad_request" };
  }

  const hashedPassword = bcrypt.hashSync(password, 12);
  await cardRepository.update(id, { password: hashedPassword });
}
