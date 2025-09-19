import User from "../models/user.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const signupController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    let user = await User.findOne({ where: { email } })
    const now = Date.now();

    if (user) {
      if (user.isVerified) {
        if (!user.password && user.googleId) {
          user.password = await bcrypt.hash(password, 10);
          await user.save();
          return res.status(200).json({
            message:
              "Password added successfully. You can now log in with email or Google.",
          });
        }

        return res
          .status(400)
          .json({ message: "User already exists. Please log in instead." });
      } else {
        if (user.verificationToken && user.tokenExpires > now) {
          return res.status(200).json({
            message:
              "You have already signed up. Please verify your email before login.",
          });
        } else {
          const token = crypto.randomBytes(32).toString("hex");
          const tokenExpires = new Date(now + 3600000);

          user.verificationToken = token;
          user.tokenExpires = tokenExpires;
          user.name = name;
          user.password = await bcrypt.hash(password, 10);
          await user.save();

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const verifyUrl = `${process.env.LOCALHOST}/api/verify/${token}`;

          await transporter.sendMail({
            from: `"Linked_in " <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your email",
            html: `<p>Hello ${user.name},</p>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verifyUrl}">${verifyUrl}</a>
                   <p>This link expires in 1 hour.</p>`,
          });

          return res.status(200).json({
            message:
              "Your previous token expired. A new verification email has been sent.",
          });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(now + 3600000);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verificationToken: token,
      tokenExpires,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.LOCALHOST}/api/verify/${token}`;

    await transporter.sendMail({
      from: `"Linked_in " <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email",
      html: `<p>Hello ${user.name},</p>
             <p>Click the link below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>
             <p>This link expires in 1 hour.</p>`,
    });

    return res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { signupController };



// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// const signupController = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     if (!name || !email || !password || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     let user = await User.findOne({ where: { email } });
//     const now = Date.now();

//     if (user) {
//       if (user.isVerified) {
//         return res.status(400).json({ message: "User already exists, please log in." });
//       } else {
//         if (user.verificationToken && user.tokenExpires > now) {
//           return res.status(200).json({
//             message: "Already signed up, please verify your email.",
//           });
//         } else {
//           const token = crypto.randomBytes(32).toString("hex");
//           const tokenExpires = new Date(now + 3600000);

//           user.verificationToken = token;
//           user.tokenExpires = tokenExpires;
//           user.name = name;
//           user.password = await bcrypt.hash(password, 10);
//           await user.save();

//           await sendVerificationEmail(user.email, user.name, token);

//           return res.status(200).json({
//             message: "New verification email sent.",
//           });
//         }
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenExpires = new Date(now + 3600000);

//     user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "user",
//       isVerified: false,
//       verificationToken: token,
//       tokenExpires,
//     });

//     console.log(user);

//     await sendVerificationEmail(user.email, user.name, token);

//     return res.status(201).json({
//       message: "User registered. Please verify your email.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// const sendVerificationEmail = async (email, name, token) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const verifyUrl = `${process.env.LOCALHOST}/api/verify/${token}`;

//   await transporter.sendMail({
//     from: `"Linked_in " <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `<p>Hello ${name},</p>
//            <p>Click the link below to verify your email:</p>
//            <a href="${verifyUrl}">${verifyUrl}</a>
//            <p>This link expires in 1 hour.</p>`,
//   });
// };

// export { signupController };
