import MongoDBObject from "./MongoDBObject";

export default interface User extends MongoDBObject {
  firstName: string;
  lastName: string;
}
