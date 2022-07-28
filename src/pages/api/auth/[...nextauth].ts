import { query as q } from "faunadb"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { signIn } from "next-auth/react"
import { fauna } from "../../../services/fauna"

export default NextAuth({

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({session}){
      
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
                q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('USER_BY_EMAIL'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        };

      }catch{
        return {
          ...session,
          activeSubscription: null,
        };
      }     
    },
    async signIn({user, account, profile}){
      const {email} = user;

      try{
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('USER_BY_EMAIL'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('USERS'),
              {
                data: { email: email } 
              }
            ),
            q.Get(
              q.Index('USER_BY_EMAIL'),
              q.Casefold(user.email)
            ),
          )
        )
        .then((ret) => console.log(ret))
        .catch((err) => console.error(
          'Error: [%s] %s: %s',
          err.name,
          err.message,
          err.errors()[0].description,
        ));

        return true;
      }catch{
        return false;
      }      
    }
  },
})