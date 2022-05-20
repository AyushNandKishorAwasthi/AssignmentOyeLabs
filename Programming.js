// Copy two objects to create another one

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com",
};
const person = {
  id: 2,
  gender: "mail",
};

const newObj = { ...student, ...person };
console.log(newObj);




//Find the missing number..............................
const n = [
  1, 2, 3, 5, 4, 7, 9, 8, 11, 10, 13, 14, 15, 17, 19, 21, 23, 26, 22, 24, 28,
  30, 32, 37, 35, 38, 40, 43, 42, 46,63, 47, 45, 49, 50, 52, 53, 54, 56, 57, 59,
  61
];
//Sorting the array in ascending order
n.sort((a, b) => {
  return a - b;
});

console.log('Sorted Array',n)

//This finds only one missing number;
/* const x = n.find((element,i,number)=>number[i+1]-element>1)
 console.log('Missing number',x+1) */

//---The algorithm is based on the difference between two consecutive numbers--//

//This finds all missing numbers
n.forEach((e, i, a) => {
  if (a[i + 1] - e > 1) console.log(e + 1);
});
