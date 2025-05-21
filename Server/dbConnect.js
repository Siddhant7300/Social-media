const mongoose = require("mongoose");
const url = "";
async function connectToDB(){
    try {
        await mongoose.connect(url);
        console.log("Connected To mongo");
    } catch (error) {
        console.log("Error on db connect : ",error);
    }
}

module.exports = {connectToDB};
