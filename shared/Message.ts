import User from "./User";
import MongoDBObject from "./MongoDBObject";

export default interface Message extends MongoDBObject {
  text: string;
  author: User;
  channelId: string;
}
