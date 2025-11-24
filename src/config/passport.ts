import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import {
  findUserById,
  findUserByGoogleId,
  creatGoogleUser,
} from "../services/userService";

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (payload, done) => {
      try {
        const user = await findUserById(payload.userId);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile || !profile.id) {
          const err = new Error("Google profile or profile id is missing");
          console.error(err);
          return done(err as Error, undefined);
        }

        // make sure we have an email to create user with
        const email = profile.emails?.[0]?.value;
        if (!email) {
          const err = new Error("Google profile does not contain an email");
          console.error("Google profile missing email:", profile);
          return done(err as Error, undefined);
        }

        let user = await findUserByGoogleId(profile.id);
        if (!user) {
          user = await creatGoogleUser({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName as string,
            lastName: profile.name?.familyName as string,
            profilePicture: profile.photos?.[0]?.value,
            isEmailVerified: true,
          });
        }
        return done(null, user);
      } catch (err) {
        // Log full error for diagnosis (Sequelize/SQL error will appear here)
        console.error("Error in GoogleStrategy verify callback:", err);
        return done(err as Error, undefined);
      }
    }
  )
);

export default passport;
