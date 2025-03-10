const { faker } = require('@faker-js/faker');
const prisma = require("../prisma");

const seed = async () => {
  const numberOfItems = 10;
  const subjects = Array.from({ length: numberOfItems }).map(() => ({
    text: faker.commerce.productName(), 
  }));

  await prisma.subject.createMany({
    data: subjects,
  });

  console.log(`Successfully seeded ${numberOfItems} items!`);
}
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });