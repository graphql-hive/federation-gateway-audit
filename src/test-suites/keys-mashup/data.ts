export const data: {
  a: Record<
    string,
    {
      id: string;
      pId: string;
      name: string;
      compositeId: {
        one: string;
        two: string;
        three: string;
      };
    }
  >;
  b: Record<string, { id: string; a: string[] }>;
} = {
  a: {
    "1": {
      id: "1",
      pId: "a.1.pId",
      name: "a.1",
      compositeId: {
        one: "a.1.compositeId.one",
        two: "a.1.compositeId.two",
        three: "a.1.compositeId.three",
      },
    },
    "2": {
      id: "2",
      pId: "a.2.pId",
      name: "a.2",
      compositeId: {
        one: "a.2.compositeId.one",
        two: "a.2.compositeId.two",
        three: "a.2.compositeId.three",
      },
    },
  },
  b: {
    "100": { id: "100", a: ["1"] },
    "200": { id: "200", a: ["1", "2"] },
  },
};
