const { hashPassword, verifyPassword } = require("../../lib/bcrypt");
const generateToken = require("../../lib/generateToken");
const User = require("../../models/user");

const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the fields");
        }
        email = email?.toLowerCase();
        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }
        const { hashedPassword, salt } = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            salt
        });
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json(err);
    }
}

const signin = async (req, res) => {
    try{
        let { email, password } = req.body;
        if ( !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the fields");
        }
        email = email?.toLowerCase();
        const user = await User.findOne({email}).lean();
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const isMatch = await verifyPassword(password, user.salt, user.password);
        if(!isMatch){
            return res.status(403).json({message: "Email or password is wrong."})
        }
        return res.status(200).json({
            token: generateToken(email),
            name: user.name,
            email,
            _id: user._id
        })
    } catch (err) {
        return res.status(500).json(err);
    }
}

const getUsers = async (req, res) => {
    try{
        const baseUrl = req.baseUrl;
        const {search = "", page = 1} = req.query;
        const { email } = req.user;
        const options = {
            page: page,
            limit: 10,
            select: "name email"
        };
        const users = await User.paginate({name: {$regex: search, $options: "i"}, email: { $ne: email}}, options);
        let next = `${baseUrl}?search=${search}&page=${page+1}`;
        let previous = `${baseUrl}?search=${search}&page=${page-1}`;
        if(users.page == 1){
            previous = null;
        }
        if(users.page == users.pages){
            next = null;
        }
        return res.status(200).json({
            count: users.total,
            results: users.docs,
            next,
            previous
         })
    }catch(err){
        return res.status(500).json(err);
    }
}

const getUser = async (req, res) => {
    try{
        const { id } = req.query;
        const user = await User.findById(id, {name: 1});
        return res.status(200).json({ user })
    }catch(err){
        return res.status(500).json(err);
    }
}

module.exports = {
    signup,
    signin,
    getUsers,
    getUser
}