const express = require("express");
const app = express();
const morgan = require("morgan");
const Customer = require("./customer.js");
const Subject = require("./subjects");
app.use(morgan("dev"));
app.use(express.json());

// Middleware for checking authorized users
const checkAdmin = (...roles) => {
  return (req, res, next) => {
    // console.log(roles,req.body);
    if (!roles.includes(req.body.role))
      return next(
        new Error("You do not have permission to perform this action")
      );
    next();
  };
};

app.post("/addCustomer", checkAdmin("admin"), async (req, res, next) => {
  try {
    // Email and Mobile is Checked for Uniqueness and Name, Email, Mobile is required
    const customer = await Customer({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      mobile: req.body.mobile,
      subjects: req.body.subjects,
    });

    const customerDoc = await customer.save();
    res.status(201).json({
      status: "Ok",
      message: customerDoc,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate Key Error
      let x;
      x = Object.keys(err.keyValue).map((val) => {
        return val[0].toUpperCase() + val.slice(1, val.length);
      });
      return res.status(400).json({
        status: "Fail",
        message: `${x.join(", ")} already exists`,
      });
    }
    if (err.name === "ValidationError") {
      //Validation Error
      let message = "";
      for (const key in err.errors) {
        let msg;
        msg = err.errors[key].message;
        message += msg + ",";
      }
      message = message.split(",");
      message.pop(); //To remove the last comma separator
      return res.status(400).json({
        status: "Fail",
        message: message,
      });
    } else next(err);
  }
});

app.post("/addSubject", async (req, res, next) => {
  const subjectDoc = await Subject({
    name: req.body.name,
  });
  const subject = await subjectDoc.save();
  res.status(201).json({
    status: "Ok",
    subject: subjectDoc,
  });
});

app.get("/readSubject", async (req, res, next) => {
  const customers = await Customer.aggregate([
    {
      $lookup: {
        from: "Subject_AssignmentOyeLabs",
        localField: "subjects",
        foreignField: "_id",
        as: "subject_info",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        "subject_info.name": 1,
      },
    },
    {
      $unwind:'$subject_info'
    },
    {
      $sort:{'subject_info.name':1}
    },
    {
      $group:{
        _id:'$_id',
        name:{$first:"$name"},
        subjects:{$push:'$subject_info.name'}
      }
    }

  ]);

  console.log(customers);
  res.status(200).json({
    status: "OK",
    customers,
  });
});

// The function will be called from the API
app.post("/addMany", async (req, res, next) => {
  try {
    const dataArr = [
      {
        email: "anurag11@yopmail.com",
        name: "Anurag",
        mobile: 9987324509,
      },
      {
        email: "sameer11@yopmail.com",
        name: "sameer",
        mobile: 9987324511,
      },
      {
        email: "ravi11@yopmail.com",
        name: "ravi",
        mobile: 9987324502,
      },
      {
        email: "akash11@yopmail.com",
        name: "akash",
        mobile: 9987324513,
      },
      {
        email: "anjali11@yopmail.com",
        name: "anjai",
        mobile: 9987324504,
      },
      {
        email: "santosh11@yopmail.com",
        name: "santosh",
        mobile: 9987324515,
      },
    ];

    const docsPromise = dataArr.map(async (customer) => {
      //Using upsert:true existing documents will be overwritten with new values and new docs will be added if filter 'email' does not matches
      return await Customer.findOneAndUpdate(
        { email: customer.email },
        { $set: { name: customer.name, mobile: customer.mobile } },
        { upsert: true, new: true }
      );
    });

    const docs = await Promise.all(docsPromise); //The array will be consisting of pending promises so awaiting resolved promises
    res.status(201).json({
      status: "Ok",
      docs,
    });
  } catch (err) {
    next(err);
  }
});

// Global error handler catches error sent by next(err)
app.use((err, req, res, next) => {
  res.status(401).json({
    status: "Fail",
    message: err.message,
  });
});

module.exports = app;
