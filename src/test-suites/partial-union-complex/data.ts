export const common = {
  __typename: "Common",
  label: "common label",
};

export const onlyA = {
  __typename: "OnlyA",
  a: "only a",
};

export const onlyB = {
  __typename: "OnlyB",
  b: "only b",
};

export const container = {
  id: "container-1",
};

export const aActions = [common, onlyA];
export const bActions = [common, onlyB];
export const sharedActions = [common];
