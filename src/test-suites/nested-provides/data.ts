export const products = [
  {
    id: "p1",
    categories: ["c1", "c2"],
  },
  {
    id: "p2",
    categories: ["c3", "c2"],
  },
];

export const categories = [
  {
    id: "c1",
    name: "Category 1",
    subCategories: ["c2"],
  },
  {
    id: "c2",
    name: "Category 2",
    subCategories: ["c3"],
  },
  {
    id: "c3",
    name: "Category 3",
    subCategories: ["c1"],
  },
];
