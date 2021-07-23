const faker = require("faker");
const fs = require("fs");

faker.locale = "vi";

console.log(faker.name.findName());

const createCategories = (n) => {
  if (n <= 0) return [];
  const categories = [];
  // Array.from(
  //   new Array(n).forEach(() => {
  //     const category = {
  //       id: faker.uuid(),
  //       name: faker.commerce.department(),
  //       createdAt: Date.now(),
  //       updatedAt: Date.now(),
  //     };
  //     categories.push(category);
  //   })
  // );
  Array.from(new Array(n)).forEach(() => {
    const category = {
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    categories.push(category);
  });
  return categories;
};

const createProducts = (categories, n) => {
  let products = [];
  if (n <= 0) return [];
  for (const category of categories) {
    Array.from(new Array(n)).forEach(() => {
      const product = {
        categoryId: category.id,
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: Number.parseInt(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.imageUrl(400, 400),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      products.push(product);
    });
  }
  return products;
};

(() => {
  //fake data here
  const categories = createCategories(4);
  const products = createProducts(categories, 20);

  //init database
  const db = {
    categories,
    products,
    profile: {
      name: "tam",
    },
  };

  //write data to db.json
  fs.writeFileSync("db.json", JSON.stringify(db), () => {
    console.log("Generate data successfully!");
  });
})();
