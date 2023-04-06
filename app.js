
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const news = require('./news.js');

// Construct a schema, using GraphQL schema language
var schema = buildSchema
(`

type Article
{
  category: String,
  journalist: String,
  headline: String,
  text: String,
  date: String
}

type User
{
  firstName: String,
  lastName: String,
  emailId: String,
  phone: String,
  getFullName: String,
  getContact: String,
  getUserDetails: String
}




  type Query 
  {
    property1: String!,
    property2: String,
    property3: [String],
    increment(num: Int, numtype: String) : String,
    user: User,
    userList: [User]   
  }

`);

class User{

    constructor(firstName,lastName,emailId,phone)
    {
      this.firstName = firstName;
      this.lastName = lastName;
      this.emailId = emailId;
      this.phone = phone;
    }

    getFullName()
    {
      return `${this.firstName} ${this.lastName}`;
    }

    getContact()
    {
      return `${this.emailId} ${this.phone}`;
    }

    getUserDetails()
    {
      return `${this.firstName} ${this.lastName} ${this.emailId} ${this.phone}`;
    }


}

class Article
{

  constructor(category,journalist,headline,text,date)
  {
    this.category = category;
    this.journalist = journalist;
    this.headline = headline;
    this.text = text;
    this.date = date;
  }  

}

class ArticleGetter{

    constructor()
    {
      this.category = category;
      this.journalist = journalist;
      this.headline = headline;
      this.text = text;
    }

    async getArticle(category)
    {
        
        news.readNewsMongoSingle(category).then((Article) => {return Article});      
        
        
    }

}

// The root provides a resolver function for each API endpoint
var root =
 { 
    property1: () => {return 'this is the only value for property1 that you are going to get!';},
    property2: () => {return null;},
    property3: () => {return ['stringOne','stringTwo','stringThree'];},
    increment: ({num,numtype}) => { return ` ${numtype}  ${num+1}`},
    //articleGetter: async (category) => { return new ArticleGetter() ; } ,
    user: () => {
      let tempUser = new User('jimmy','mcgill','jimmy@gmail.com','637216332');
      return tempUser;

    },
    userList: () => {

      let tempUserList = new Array();
      let tempUser = new User('jimmy','mcgill','jimmy@gmail.com','637216332');
      tempUserList.push(tempUser);
      tempUser = new User('kim','wexler','kim@gmail.com','435346665');
      tempUserList.push(tempUser);
      tempUser = new User('howard','hamlin','howard@hhm.com','34635435543');
      tempUserList.push(tempUser);

      return tempUserList;

    }
    //property3: () => {return 'Hello world!';},
    //property4: () => {return 'Hello world!';},
    //property5: () => {return 'Hello world!';}, 
};

var app = express();

app.use('/graphql', graphqlHTTP({ schema: schema,  rootValue: root,  graphiql: true, }));
//app.use('/graphql/journalist', graphqlHTTP({ schema: schema,  rootValue: root,  graphiql: true, }));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');