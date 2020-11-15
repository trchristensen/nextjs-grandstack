import { driver } from "../server/neo4j/db";

export async function neo4jVerifyUser(user: any) {
  const userID = user.user.uid;
  const session = driver().session();

  session
    .run("MATCH (u:User) WHERE u.id = $id RETURN u as USER", {
      id: userID,
    })
    //@ts-ignore
    .then((result: any) => {
      if (result.records.length === 0) {
        return session.run(
          "CREATE (u:User {id: $id, userId: $userId, name: $name, isAdmin: false, isPremium: false, avatar: $avatar})",
          {
            id: userID,
            userId: userID,
            name: user.user.displayName,
            avatar: user.user.photoURL,
          }
        );
      } else {
        return console.log(result.records[0]);
      }
    })
    .catch((err) => console.log(err));
}
