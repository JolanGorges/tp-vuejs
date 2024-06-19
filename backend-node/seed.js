const { fakerFR } = require("@faker-js/faker");
const fs = require("fs");

function createClient() {
  const countries = ["France", "Belgique", "Suisse"];
  return {
    id: fakerFR.string.uuid(),
    firstName: fakerFR.person.firstName(),
    lastName: fakerFR.person.lastName(),
    jobTitle: fakerFR.person.jobTitle(),
    phoneNumber: fakerFR.phone.number(),
    email: fakerFR.internet.email(),
    company: fakerFR.company.name(),
    address1: fakerFR.location.streetAddress(),
    address2: "",
    zipCode: fakerFR.location.zipCode(),
    city: fakerFR.location.city(),
    country: fakerFR.helpers.arrayElement(countries),
    dateAdded: fakerFR.date
      .between({ from: "2019-01-01", to: "2023-06-23" })
      .toISOString()
      .split("T")[0],
  };
}

function createBill() {
  const prestationsLength = fakerFR.number.int({ min: 1, max: 3 });
  const prestations = [];
  let totalHT = 0;
  for (let j = 0; j < prestationsLength; j++) {
    const prestation = {
      description: fakerFR.commerce.productName(),
      qty: fakerFR.number.int({ min: 1, max: 3 }),
      price: fakerFR.number.int({ min: 1, max: 5000 }),
    };
    totalHT += prestation.qty * prestation.price;
    prestations.push(prestation);
  }

  const totalTTC = totalHT * 1.2;
  const paid = fakerFR.number.int({ min: 0, max: totalTTC });
  const client = fakerFR.helpers.arrayElement(clients);
  return {
    id: fakerFR.string.uuid(),
    billnum: fakerFR.number.int({ min: 0, max: 99999 }),
    description: fakerFR.commerce.productName(),
    date: fakerFR.date
      .between({ from: "2023-06-23", to: "2024-06-23" })
      .toISOString()
      .split("T")[0],
    client: {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
    },
    prestations,
    discount: 0,
    paid,
    totalHT: totalHT,
    tva: 20,
    totalTTC: Math.floor(totalTTC - paid),
  };
}

const clients = fakerFR.helpers
  .multiple(createClient, {
    count: { min: 15, max: 30 },
  })
  .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

const bills = fakerFR.helpers
  .multiple(createBill, {
    count: { min: 50, max: 60 },
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync("./db/clients.json", JSON.stringify(clients));
fs.writeFileSync("./db/bills.json", JSON.stringify(bills));
