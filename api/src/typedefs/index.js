
export const typeDefs = `

  input regInput{
    firstName: String!
    middleName: String
    lastName: String
    photo: fileType
    phoneNumber: [Int]!
    emailId: String!
    bio: String
    gender: String!
    religion: String!
    category: String!
    nationality: String!
    dateOfBirth: String!
    address: [addressType]!
    father: familyMemberType!
    mother: familyMemberType!
  }

  input familyMemberType{
    name: String!
    occupation: String!
    phoneNumber: [Int]!
    age: Int
  }


  input fileType{
    url: String!
    size: Int
    createdDate: String!
  }

  input addressType{
    type: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    pincode: Int!
    state: ID!
    country: ID!
  }

  input inputFeildsType{
    userType: String
    name: String
    order: Int
    value: String
    type: String
    required: Boolean
    options: [String]
    constraints: [String]
  }

  type inputFeilds{
    userType: String
    name: String
    order: Int
    value: String
    type: String
    required: Boolean
    options: [String]
    constraints: [String]
  }

  type customForm{
    formInput: [inputFeilds]
  }

  type enrolmentProcess{
    type: String
  }

  type enroll{
    shouldEnroll: String
  }

  type registration {
    firstName: String!
    middleName: String
    lastName: String
    photo: File
    phoneNumber: [Int]!
    emailId: String!
    bio: String
    gender: String!
    religion: String!
    category: String!
    nationality: String!
    dateOfBirth: String!
    address: [Address]!
    father: FamilyMember
    mother: FamilyMember
  }

  type Address{
    type: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    pincode: Int!
    state: ID!
    country: ID!
  }

  type FamilyMember{
    name: String!
    occupation: String!
    phoneNumber: [Int]!
    age: Int
  }

  type File{
    url: String!
    size: Int
    createdDate: String!
  }

  type response{
    status: String
    error: [String]
    message: String
  }

  type Query {
    registration(email: String): registration
  }

  type Mutation{
    register(input: regInput): response
    enrolmentProcess(type: String, prevProcessId: Int): response
    inputFeilds(input: inputFeildsType, formId: Int): response
    enroll(shouldEnroll: String, prevProcessId: Int): response
  }

  `