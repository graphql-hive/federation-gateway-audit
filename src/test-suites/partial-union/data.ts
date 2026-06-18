export const message = "Hello, Federation!";

export const alpha = {
  __typename: "Alpha",
  id: "alpha-1",
  value: "alpha value",
};

export const beta = {
  __typename: "Beta",
  id: "beta-1",
  name: "beta name",
  details: "beta details",
};

export const gamma = {
  __typename: "Gamma",
  id: "gamma-1",
  label: "gamma label",
};

// The primary subgraph can resolve all three union members.
export const actions = [alpha, beta, gamma];
