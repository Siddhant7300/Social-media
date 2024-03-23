const mongoose = require("mongoose");
const url = "mongodb+srv://Amanpandey:Swlb6UXmN9Sbmt4Q@cluster0.5gsuwse.mongodb.net/?retryWrites=true&w=majority";
async function connectToDB(){
    try {
        await mongoose.connect(url);
        console.log("Connected To mongo");
    } catch (error) {
        console.log("Error on db connect : ",error);
    }
}

module.exports = {connectToDB};
