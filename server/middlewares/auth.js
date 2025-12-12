import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);
    
    const free_usage = user.privateMetadata?.free_usage || 0;
    const hasPremiumPlan = await req.auth().has({ plan: 'premium' });

    req.free_usage = free_usage;
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
