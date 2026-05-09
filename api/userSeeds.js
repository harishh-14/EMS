import connectToDatabase from "./db/db.js"
import User from "./models/user.model.js"
import bcrypt from "bcrypt"



const userRegister = async() => {
   
    try {
        await  connectToDatabase();
       const hashedPassword = await bcrypt.hash("admin",10)

        const newUser = new User({
            name:"Admin",
            email:"admin@gmail.com",
            password:hashedPassword,
            role:"admin"
        })
        await newUser.save()
        console.log("Admin user created successfully!");
    } catch (error) {
        console.log(error)
    }
}

userRegister();