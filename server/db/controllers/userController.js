import { generateToken } from '../../utils/jwt.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'

export async function createUser(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(500).json({
            message: "Some fidels are missing"
        })
    } else {

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return (res.status(500).json({
                message: "Email already in use"
            })
            )
        } else {
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(password, salt)

            await User.create({
                name,
                email,
                password: hashedPassword,
                level: 1,
                exp: 0,
                userPayment: "Trial"
            }).then((data) => {
                res.status(201).json({
                    _id: data.id,
                    email: data.email,
                    name: data.name,
                    token: generateToken({ id: data.id }),
                    level: data.level,
                    exp: data.exp,
                    payment: data.userPayment
                })
            }).catch((error) => {
                res.status(500).json({
                    error: "Error creating new user",
                    message: error
                })
            })
        }
    }
}



export async function authUser(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(500).json({ message: "Some fields are missing" })
    } else {
        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user.id,
                email: user.email,
                name: user.name,
                token: generateToken({ id: user.id })
            })
        } else {
            res.status(403).json(
                { message: "Invalid email or password" }
            )
        }
    }
}

export async function getMe(req, res) {
    await User.findById(req.user.id).select('-password').then((data) => {
        res.status(200).json({
            _id: data.id,
            message: "success",
            data: data
        })

    })
}

export async function getUsers(req, res) {
    await User.find().select('-password')
        .then((data) => {
            res.status(200).json({
                messagees: "all Users",
                data: data
            })
        })
}


export async function updateExp(req, res) {
    const { exp } = req.body

    const _user = await User.findById(req.user.id)

    if (_user) {
        await User.findByIdAndUpdate(req.user.id, {
            exp: _user.exp + parseInt(exp),
            level: _user.level += 1
        }).select('-password')
            .then((data) => {
                res.status(200).json({
                    messagees: "User Leved Up",
                    data: data
                })
            }).catch((error) => {
                res.status(403).json(
                    { message: "error updating exp" }
                )
            })
    }
}



export async function paymentRecord(req, res) {
    const { paymentType } = req.body

    if (paymentType) {
        await User.findByIdAndUpdate(req.user.id, { userPayment: paymentType })
            .then((data) => {
                res.status(200).json({
                    messagees: `${paymentType} plan has been added to to your account`,
                    data: data
                })
            }).catch((error) => {
                res.status(400).json(
                    { message: "error updating exp" }
                )
            })
    }
}


// import nodemailer from 'nodemailer'

// const adminMail = "dev.hype7@gmail.com"
// const adminPassword = "#justHYPE7"
// const baseUrl = "http://localhost:5173/"

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: adminMail,
//         pass: adminPassword
//     }
// });

// export async function forgotPassword(req, res) {
//     const { email } = req.user

//     await User.findOne({ email: email })
//         .then((data) => {
//             const mailOptions = {
//                 from: adminMail,
//                 to: email,
//                 subject: 'Reset Password',
//                 text: `Use this link to reset your password link: ${baseUrl}changePassword/${data._id}`
//             };

//             // Send email
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log('Error:', error);
//                     res.status(400).json({
//                         message: "error sending mail",
//                         error: error
//                     })
//                 } else {
//                     console.log('Email sent:', info.response);
//                     res.status(200).json({
//                         message: "Mail sent ",
//                         data: info.response
//                     })
//                 }
//             });
//         })
//         .catch((error) => {
//             res.status(400).json(
//                 {
//                     message: "Mail not found",
//                     error: error
//                 }
//             )
//         })
// }

// export async function changePassword(req, res) {
//     const { id } = req.body

//     await User.findById({ id })
//         .then((data) => {
//             res.status(200).json({
//                 message: "Mail sent ",
//                 data: info.response
//             })
//         })
// }