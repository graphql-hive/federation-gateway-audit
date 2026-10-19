// Each product is only ever referenced by one kind of component, and the
// `product` subgraph can only resolve the field matching that kind
// (`a` for products of `ComponentA`, `b` for `ComponentB`, `c` for `ComponentC`).
export const productA = { id: "product-a", kind: "a", a: "A1" };
export const productB = { id: "product-b", kind: "b", b: "B1" };
export const productC = { id: "product-c", kind: "c", c: "C1" };

export const products = [productA, productB, productC];

export const componentA = {
  __typename: "ComponentA",
  a: "component a",
  product: { id: productA.id },
};

export const componentB = {
  __typename: "ComponentB",
  b: "component b",
  product: { id: productB.id },
};

export const componentC = {
  __typename: "ComponentC",
  c: "component c",
  product: { id: productC.id },
};

// `card` returns components of type `ComponentA` and `ComponentB` only.
// There is intentionally no `ComponentC` in the response.
export const card = {
  id: "card-1",
  components: [componentA, componentB],
};

// `cardC` returns only a `ComponentC`.
export const cardC = {
  id: "card-c",
  components: [componentC],
};
