const { fakerFR } = require("@faker-js/faker");
const fs = require("fs");

function createClient() {
  const countries = ["France", "Belgique", "Suisse"];
  return {
    id: fakerFR.string.uuid(),
    prenom: fakerFR.person.firstName(),
    nom: fakerFR.person.lastName(),
    fonction: fakerFR.person.jobTitle(),
    telephone: fakerFR.phone.number(),
    email: fakerFR.internet.email(),
    entreprise: fakerFR.company.name(),
    adresse1: fakerFR.location.streetAddress(),
    adresse2: "",
    codePostal: fakerFR.location.zipCode(),
    ville: fakerFR.location.city(),
    pays: fakerFR.helpers.arrayElement(countries),
    dateAjout: fakerFR.date
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
      firstName: client.prenom,
      lastName: client.nom,
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
  .sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout));

const bills = fakerFR.helpers
  .multiple(createBill, {
    count: { min: 50, max: 60 },
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync("./db/clients.json", JSON.stringify(clients));
fs.writeFileSync("./db/bills.json", JSON.stringify(bills));
