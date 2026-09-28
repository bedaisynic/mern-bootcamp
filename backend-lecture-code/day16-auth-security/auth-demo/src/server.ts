import "./env";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const PORT = Number(process.env.PORT) || 4002;
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "user" | "admin" | "manager";
}

const usersDB: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "adminpass",
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    role: "admin",
  },
  {
    id: "2",
    email: "alice@example.com",
    password: "123",
    firstName: "Alice",
    lastName: "Johnson",
    username: "alicej",
    role: "manager",
  },
  {
    id: "3",
    email: "bob@example.com",
    password: "123",
    firstName: "Bob",
    lastName: "Smith",
    username: "bobsmith",
    role: "user",
  },
  {
    id: "4",
    email: "carol@example.com",
    password: "123",
    firstName: "Carol",
    lastName: "Brown",
    username: "carolb",
    role: "user",
  },
];

// // session based authentication
// // session is stored inside server
// const sessions: any = {};

// app.get("/", (req, res) => {
//   res.json({ message: "Day 16 auth demo API" });
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // skipped: validate request body with/without zod schema
//   // validate email & email
//   const user = usersDB.find((u) => u.email === email);
//   if (!user)
//     return res.status(401).json({ error: { message: "Invalid Credential" } });
//   // if(!user) res.status(404).json({error:{message:"User not found"}})
//   if (user.password !== password)
//     return res.status(401).json({ error: { message: "Invalid Credential" } });

//   // 1. session based authentication
//   const sessionId = crypto.randomUUID();
//   sessions[sessionId] = user.id;
//   console.log(sessions);

//   // option 1: send credentials back in the body
//   // res.send({
//   //   user,
//   //   sessionId,
//   // });
//   res.cookie("sessionId", sessionId).send(user);
// });

// app.post("/logout", async (req, res) => {
//   // const { sessionId } = req.body;

//   // option 2: get credentials from cookies
//   const { sessionId } = req.cookies;
//   delete sessions[sessionId];
//   console.log(sessions);

//   res.clearCookie("sessionId").json({ message: "log out success" });
// });

// // can only see after login
// app.get("/private", async (req, res) => {
//   // option1: get session id from authorization header
//   // const authHeader = req.headers.authorization;
//   // if(!authHeader) return res.status(401).json({ error: { message: "Please log in" }});
//   // const sessionId = authHeader.split(" ")[1]

//   // option2: get session id from cookie
//   const { sessionId } = req.cookies;
//   // if !sessionsId, throw error

//   // 1. session based authentication check
//   const userId = sessions[sessionId];

//   if (!userId) {
//     return res.status(401).json({ error: { message: "Please log in" } });
//   }

//   const user = usersDB.find((u) => u.id === userId);
//   if (!user)
//     return res.status(401).json({ error: { message: "Invalid Credential" } });

//   res.send({
//     user,
//   });
// });

// ======================== Token Based Authentication =================

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: { message: "Please log in" } });
  }

  try {
    // validate if token is valid or not
    const { id } = jwt.verify(token, "secrets-only-our-server-knows") as {
      id: string;
    };

    const user = usersDB.find((u) => u.id === id);
    if (!user)
      return res.status(401).json({ error: { message: "Invalid Credential" } });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: "Invalid Credential" } });
  }
};

const authorize =
  // rest operator
  (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = req.user!;
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: { message: "Unauthorized" } });
      }
      next();
    };

app.get("/", (req, res) => {
  res.json({ message: "Day 16 auth demo API" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = usersDB.find((u) => u.email === email);
  if (!user)
    return res.status(401).json({ error: { message: "Invalid Credential" } });
  if (user.password !== password)
    return res.status(401).json({ error: { message: "Invalid Credential" } });

  // generate a jwt token
  const token = jwt.sign({ id: user.id }, "secrets-only-our-server-knows");
  res
    .cookie("token", token, {
      httpOnly: true, // cookie won't be accessible via javascript
    })
    .send(user);
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token").json({ message: "log out success" });
});

// can only see after login
app.get("/private", authenticate, async (req, res) => {
  const user = req.user;

  res.send({
    message: "user retrieved successfully",
    user: user,
  });
});

app.get(
  "/management",
  authenticate,
  authorize("admin", "manager"),
  async (req, res) => {
    res.json({
      info: "management only",
    });
  },
);
app.get("/admin", authenticate, authorize("admin"), async (req, res) => {
  res.json({
    adminInfo: "top secret",
  });
});

app.listen(PORT, () => {
  console.log(`Auth demo API running on http://localhost:${PORT}`);
});

// 1. client logs in
// 2. server checks credentials
// 3. server signs token and sends back, server doesn't store the token
// 4. client sends request with token, server validates token
