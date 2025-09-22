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




// // controllers/signup.js
// import User from "../models/user.js";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
// import { sequelize } from "../config/database.js";
// import dns from "dns/promises"; 

// // Configurables
// const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? "12", 10);
// const VERIFY_TTL_MS = 60 * 60 * 1000; // 1 hour

// // Create a nodemailer transporter (Gmail example; switch to SES/SendGrid in prod)
// const makeTransporter = () =>
//   nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

// // Optional: quick MX check to reject clearly invalid email domains
// async function hasMxRecords(email) {
//   try {
//     const domain = email.split("@")[1];
//     if (!domain) return false;
//     const mx = await dns.resolveMx(domain);
//     return Array.isArray(mx) && mx.length > 0;
//   } catch {
//     return false;
//   }
// }

// const signupController = async (req, res) => {
//   try {
//     let { name, email, password, confirmPassword } = req.body;

//     // Basic presence checks
//     if (!name || !email || !password || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ message: "Password and confirm password do not match" });
//     }

//     // Normalize email
//     email = email.trim().toLowerCase();

//     // Optional: quick email format sanity (Sequelize model also validates)
//     // Simple regex avoided; rely on model + optional MX
//     // MX check to filter obvious typos/disposables (best-effort, not authoritative)
//     if (!(await hasMxRecords(email))) {
//       return res.status(400).json({ message: "Invalid email domain" });
//     }

//     const now = Date.now();
//     let user = await User.findOne({ where: { email } });

//     // If user already exists
//     if (user) {
//       // If verified already:
//       if (user.isVerified) {
//         // Allow one-time password set if the account was created via Google
//         if (!user.password && user.googleId) {
//           user.password = await bcrypt.hash(password, SALT_ROUNDS);
//           await user.save();
//           return res.status(200).json({
//             message:
//               "Password added successfully. You can now log in with email or Google.",
//           });
//         }

//         return res
//           .status(400)
//           .json({ message: "User already exists. Please log in instead." });
//       }

//       // User exists but not verified
//       const tokenStillValid =
//         user.verificationToken &&
//         user.tokenExpires &&
//         user.tokenExpires.getTime() > now;

//       if (tokenStillValid) {
//         // Token not expired yet; instruct to verify without spamming mail
//         return res.status(200).json({
//           message:
//             "You have already signed up. Please verify your email before login.",
//         });
//       }

//       // Token missing/expired → regenerate inside a transaction & send email
//       const t = await sequelize.transaction();
//       try {
//         const rawToken = crypto.randomBytes(32).toString("hex");
//         const tokenHash = crypto
//           .createHash("sha256")
//           .update(rawToken)
//           .digest("hex");

//         user.name = name; // allows updating name on re-signup
//         user.password = await bcrypt.hash(password, SALT_ROUNDS);
//         user.verificationToken = tokenHash;
//         user.tokenExpires = new Date(now + VERIFY_TTL_MS);

//         await user.save({ transaction: t });

//         const verifyUrl = ${process.env.APP_URL}/api/verify/${rawToken};
//         const transporter = makeTransporter();

//         await transporter.sendMail({
//           from: "Linked_in" <${process.env.EMAIL_USER}>,
//           to: user.email,
//           subject: "Verify your email",
//           html: `<p>Hello ${user.name},</p>
//                  <p>Click the link below to verify your email:</p>
//                  <a href="${verifyUrl}">${verifyUrl}</a>
//                  <p>This link expires in 1 hour.</p>`,
//         });

//         await t.commit();

//         return res.status(200).json({
//           message:
//             "Your previous token expired. A new verification email has been sent.",
//         });
//       } catch (err) {
//         await t.rollback(); // rollback changes if sendMail failed synchronously
//         console.error("signup reissue token error:", err);
//         return res.status(500).json({
//           message:
//             "Could not send verification email. Please try again later.",
//         });
//       }
//     }

//     // New user path: create + send verification email transactionally
//     const t = await sequelize.transaction();
//     try {
//       const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
//       const rawToken = crypto.randomBytes(32).toString("hex");
//       const tokenHash = crypto
//         .createHash("sha256")
//         .update(rawToken)
//         .digest("hex");

//       user = await User.create(
//         {
//           name,
//           email,
//           password: hashedPassword,
//           role: "user",
//           isVerified: false,
//           verificationToken: tokenHash,
//           tokenExpires: new Date(now + VERIFY_TTL_MS),
//         },
//         { transaction: t }
//       );

//       const verifyUrl = ${process.env.APP_URL}/api/verify/${rawToken};
//       const transporter = makeTransporter();

//       // If SMTP rejects immediately, this throws → rollback below
//       await transporter.sendMail({
//         from: "Linked_in" <${process.env.EMAIL_USER}>,
//         to: user.email,
//         subject: "Verify your email",
//         html: `<p>Hello ${user.name},</p>
//                <p>Click the link below to verify your email:</p>
//                <a href="${verifyUrl}">${verifyUrl}</a>
//                <p>This link expires in 1 hour.</p>`,
//       });

//       await t.commit();

//       return res.status(201).json({
//         message:
//           "User registered. Please check your email to verify your account.",
//       });
//     } catch (error) {
//       await t.rollback(); // do not keep an orphan user if email couldn't be sent
//       console.error("signup transactional error:", error);
//       return res.status(500).json({
//         message: "Could not send verification email. Please try again later.",
//       });
//     }
//   } catch (error) {
//     console.error("signup unexpected error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export { signupController };
// // full optimiize