const columns = ["name", "age"];

const data = [
  { id: 1, name: "Test 1", age: 13 },
  { id: 2, name: "Test 2", age: 60 },
  { id: 3, name: "Test 3", age: 42 },
];
const filteredData = data.map((item, i) =>
  Object.fromEntries([
    ["no", i + 1],
    ...columns.map((column) => [column, item[column]]),
  ])
);

console.log(filteredData);
