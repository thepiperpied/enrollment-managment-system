import { v1 as neo4j} from 'neo4j-driver';
require('dotenv').config();

var driver = neo4j.driver("bolt://db:7687", neo4j.auth.basic("neo4j", "_^p7dHe*hJXp7aGd"));
var session = driver.session();

export default {
    Query: {
        registration: async (_, args, ctx) => {
            console.log(args);
            let query = `
                MATCH(u:Registration)
                WHERE u.emailId=$email
                RETURN u{
                    .firstName,
                    .middleName,
                    .lastName,
                    .emailId,
                    .bio,
                    .gender,
                    .religion,
                    .category,
                    .nationality,
                    .dateOfBirth
                } AS data;
            `;
            let result = session.run(query, args).then(result => {
                session.close();
                console.log(result.records[0].get('data'));
                return result.records[0].get('data');
            });
            return await result;
        },
    },
    Mutation:{
        register: async(_, {input}, cntx) => {

            var phoneStudent = '', phoneFather = '', phoneMother = '', address = '', i = 0;
            input.address.forEach(element => {
                address = "MERGE(addr" + i + ":Address{type: \"" + element.type + "\"," +
                    "addressLine1: \"" + element.addressLine1 +"\"," +
                    "addressLine1: \"" +element.addressLine2 + "\"," +
                    "city: \"" + element.city + "\"," +
                    "state: \"" + element.state + "\","+
                    "country: \"" + element.country + "\","+
                    "pincode: \"" + element.pincode + "\" })\n" +
                    "MERGE (addr" + i + ")-[ad:Address]->(n)\n";
                    i = i+1;
            });

            input.phoneNumber.forEach(element => {
                phoneStudent = phoneStudent +',' +  element;
            });
            phoneStudent = phoneStudent.replace(/(^,)|(,$)/g, "");
            input.father.phoneNumber.forEach(element => {
                phoneFather = phoneFather + ',' + element;
            });
            phoneFather = phoneFather.replace(/(^,)|(,$)/g, "")
            input.mother.phoneNumber.forEach(element => {
                phoneMother = phoneMother + ',' +element;
            });
            phoneMother = phoneMother.replace(/(^,)|(,$)/g, "");
            let query = `MERGE(n:Registration{
                firstName: "${input.firstName}",
                middleName: "${input.middleName}",
                lastName: "${input.lastName}",
                phoneNumber: "[${phoneStudent}]",
                emailId: "${input.emailId}",
                bio: "${input.bio}",
                gender: "${input.gender}",
                religion: "${input.religion}",
                category: "${input.category}",
                nationality: "${input.nationality}",
                dateOfBirth: "${input.dateOfBirth}"
            })
            MERGE(f:FamilyMember{
                name: "${input.father.name}",
                occupation: "${input.father.occupation}",
                age: "${input.father.age}",
                phoneNumber: "[${phoneFather}]"
            })
            MERGE(m:FamilyMember{
                name: "${input.mother.name}",
                occupation: "${input.mother.occupation}",
                age: "${input.mother.age}",
                phoneNumber: "[${phoneMother}]"
            })
            MERGE(photo:Document{
                url: "${input.photo.url}",
                size: "${input.photo.size}",
                createdDate: "${input.photo.createdDate}"
            })
            MERGE (f)-[r:FATHER]->(n)
            MERGE (m)-[j:MOTHER]->(n)
            MERGE (photo)-[pl:DOCUMENTS]->(n)

            ${address}
            `;

            console.log(query);
            const resultPromise = session.run(query);
            let returnValue = resultPromise.then(result => {
                session.close();
                return {'status': 'success'};
            });
            return await returnValue;
        },
        enrolmentProcess: async(_, {type, prevProcessId}, cntx) => {

            let query = `
            MATCH (n) WHERE ID(n)=${prevProcessId}
            MERGE (ep:enrollmentProcess{
                type: "${type}"
            })
            MERGE (n)-[:NEXT]->(ep)
            `;

            console.log(query);
                
            const resultPromise = session.run(query);
            let returnValue = resultPromise.then(result => {
                session.close();
                return {'status': 'success'};
            });
            return  returnValue;
        },
        inputFeilds: async(_, {input, formId}, cntx) => {

            let options = '', constraints = '';

            input.options.forEach(element => {
                options = options +',"' +  element + '"';
            });
            options = options.replace(/(^,)|(,$)/g, "");

            input.constraints.forEach(element => {
                constraints = constraints +',"' +  element + '"';
            });
            constraints = constraints.replace(/(^,)|(,$)/g, "");


            let query = `
            MATCH (n) WHERE ID(n)=${formId}
            CREATE (ep:InputFeild{
                userType: "${input.userType}",
                name: "${input.name}",
                order: ${input.order},
                value: "${input.value}",
                type: "${input.type}",
                required: "${input.required}",
                options: [${options}],
                constraints: [${constraints}]
            })
            MERGE (n)-[:FORM]->(ep)
            `;

            console.log(query);
                
            const resultPromise = session.run(query);
            let returnValue = resultPromise.then(result => {
                session.close();
                return {'status': 'success'};
            });
            return  returnValue;
        },
        enroll: async(_, {shouldEnroll, prevProcessId}, cntx) => {

            let query = `
            MATCH (n) WHERE ID(n)=${prevProcessId}
            MERGE (ep:Enroll{
                shouldEnroll: "${shouldEnroll}"
            })
            MERGE (n)-[:NEXT]->(ep)
            `;

            console.log(query);
                
            const resultPromise = session.run(query);
            let returnValue = resultPromise.then(result => {
                session.close();
                return {'status': 'success'};
            });
            return  returnValue;
        },
    }
};
