const express  = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const PORT  = process.env.PORT || 8080 

//schema
const schemaData = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    description: String, // Added description field
    category: String,    // Added category field
    active: Boolean,     // Added active field
  }, {
    timestamps: true
  });
  

const userModel  = mongoose.model("user",schemaData)

// read
// ​ http://localhost:8080/
app.get("/", async (req, res) => {
    const { active, search } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.active = active === "true"; // Convert active to boolean
    }
  
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive name search
    }
  
    const data = await userModel.find(filter);
    res.json({ success: true, data: data });
  });
  
  

//create data || save data in mongodb
//http://localhost:8080/create
/*
{
    name,
    email,
    mobile
}
*/
app.post("/create", async (req, res) => {
    const data = new userModel(req.body);
    await data.save();
    res.send({ success: true, message: "data save successfully", data: data });
  });
  
 

//update data 
// http://localhost:8080/update
/**
 *  {
 *      id :"",
 *      name : "",
 *      email : "",
 *       moible : ""
 * }
 */

app.put("/update", async (req, res) => {
    const { _id, ...rest } = req.body;
  
    try {
      const data = await userModel.findByIdAndUpdate(_id, { ...rest }, { new: true });
      res.send({ success: true, message: "data update successfully", data: data });
    } catch (error) {
      res.status(500).send({ success: false, message: "data update failed", error: error.message });
    }
  });
  

//delete api
// http://localhost:8080/delete/id
// Delete a single record
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const data = await userModel.deleteOne({ _id: id });
    res.send({ success: true, message: "data delete successfully", data: data });
  });
  
  // Bulk delete records (by passing an array of IDs)
  app.post("/delete/bulk", async (req, res) => {
    const { ids } = req.body;
    const data = await userModel.deleteMany({ _id: { $in: ids } });
    res.send({ success: true, message: "data bulk delete successfully", data: data });
  });
  


mongoose.connect("mongodb+srv://soumyasri2245:Soumya22%4034@cluster0.u2ywt3o.mongodb.net/mypcotttest?retryWrites=true&w=majority"
)
.then(()=>{
    console.log("connect to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(err))

