import User from "./User";
import Message from "./Message";
import MongoDBObject from "./MongoDBObject";

export default interface Channel extends MongoDBObject {
  users: User[];
  messages: Message[];
}
