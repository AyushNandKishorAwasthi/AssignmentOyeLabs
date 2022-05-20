const request = require("request");
const { promisify } = require("util");

const runPromise = async (fbC) => {
  try {
    const response = await promisify(request)("http://www.google.com");
    console.log("Status Code", response && response.statusCode);
    console.log(response.body); //Print body HTML
    fbC(null, response.body);
  } catch (error) {
    // Print the error if caught
    fbC(err);
    console.log("Caught Error", error);
  }
};

console.log(
  runPromise((result) => {
    console.log("Result--------->>", result);
  })
);

/*
function getGoogleHomePage(finalCallBack){
request("http://www.google.com", function (error, response, body) {
  console.error("error:", error); // Print the error if one occurred
  finalCallBack(error);
  console.log("statusCode:", response && response.statusCode); // Print the response status
  // code if a response was received
  console.log("body:", body); // Print the HTML for the Google homepage.
  finalCallBack(null, body);
});
};
console.log(getGoogleHomePage((result)=>{
console.log("RESULT==>",result);
}));
*/
