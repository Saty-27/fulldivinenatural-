import type { Express, Request, Response } from "express";
import { nanoid } from "nanoid";
import bcryptjs from "bcryptjs";
import { storage } from "../storage";

export function setupAuthRoutes(app: Express) {
  // LOGIN endpoint - check email/password against database
  app.post("/api/auth/login", async (req: any, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Check if user exists with this email
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: "User not found. Please sign up first.",
          code: "USER_NOT_FOUND",
        });
      }

      // Verify password
      const passwordMatch = await bcryptjs.compare(
        password,
        user.passwordHash || ""
      );

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userEmail = user.email;

      console.log("📝 Setting session:", {
        sessionId: req.sessionID,
        userId: user.id,
        email: user.email,
      });

      req.session.save((err: any) => {
        if (err) {
          console.error("❌ Session save error:", err);
          return res
            .status(500)
            .json({ message: "Failed to create session" });
        }

        console.log("✅ Session saved successfully:", {
          sessionId: req.sessionID,
          userId: req.session.userId,
        });

        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
          },
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // SIGNUP endpoint - create new user (with optional file upload)
  app.post("/api/auth/signup", async (req: any, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, address } = req.body;
      const profilePhoto = req.files?.profilePhoto;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          message: "Email already registered. Please login instead.",
          code: "USER_EXISTS",
        });
      }

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);

      // For profile photo, we'll store as base64 or URL in a simple implementation
      let profileImageUrl = undefined;
      if (profilePhoto) {
        // In production, upload to cloud storage
        // For now, store file name or create a reference
        profileImageUrl = `/uploads/${profilePhoto.name}`;
      }

      // Create new user
      const newUser = await storage.createUserWithPassword({
        id: nanoid(),
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        address,
        profileImageUrl,
        role: "customer",
      });

      // Create session
      req.session.userId = newUser.id;
      req.session.userRole = newUser.role;
      req.session.userEmail = newUser.email;

      req.session.save((err: any) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to create session" });
        }

        res.status(201).json({
          message: "Signup successful",
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
          },
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  // GET current user from session - fetch full user details from database
  app.get("/api/auth/current-user", async (req: any, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // Fetch full user details from database
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // LOGOUT endpoint
  app.post("/api/auth/logout", (req: any, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
}
