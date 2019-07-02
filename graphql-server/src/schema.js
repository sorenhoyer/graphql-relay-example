import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay';
import * as dummyData from './data';
import { getUserId } from './utils';

const { languages, translations, users } = dummyData;

// GraphQL example query
// query http://localhost:4000/graphql
// with Authorization: Bearer 1
// where "1" is the userId
// {
//   language(id: 1) {
//       id,
//       name,
//       translations(applicationId: "1") {
//           edges {
//               node {
//                   id,
//                   applicationId,
//                   languageId,
//                   key,
//                   value
//               }
//           }
//       }
//   },
//   user {
//       id,
//       firstName,
//       language {
//           edges {
//               node {
//                   id,
//                   name,
//                   translations {
//                       edges {
//                           node {
//                               id,
//                               key,
//                               value
//                           }
//                       }
//                   }
//               }
//           }
//       }
//   }
// }

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Language') {
      return languages.find(item => item.id === id)
    }

    if (type === 'Translation') {
      return translations.find(item => item.id === id)
    }

    if (type === 'User') {
      return users.find(item => item.id === id)
    }

    return null;
  },
  obj => {
    if (obj && obj.translations /* instanceof Language */) {
      return LanguageType;
    }

    if (obj && obj.key && obj.value /* instanceof Language */) {
      return TranslationType;
    }

    if (obj && obj.firstName /* instanceof Language */) {
      return UserType;
    }

    return null;
  }
);

const TranslationType = new GraphQLObjectType({
  name: 'Translation',
  fields: () => ({
    id: globalIdField('Translation'),
    applicationId: { type: GraphQLID },
    languageId: { type: GraphQLID },
    key: { type: GraphQLString },
    value: { type: GraphQLString },
  }),
  interfaces: [nodeInterface]
});

const {
  connectionType: TranslationConnection,
  edgeType: TranslationEdge
} = connectionDefinitions({name: 'Translation', nodeType: TranslationType});

const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: () => ({
    id: globalIdField('Language'),
    name: { type: GraphQLString },
    translations: {
      type: TranslationConnection,
      // args: { applicationId: { type: GraphQLID } },
      args: {
        ... connectionArgs,
        applicationId: { type: GraphQLID }
      },
      // resolve: (parent, args) => {
      //   if (args.applicationId) {
      //     return translations.filter(item => item.languageId === parent.id && item.applicationId === args.applicationId)
      //   }
      //   return translations.filter(item => item.languageId === parent.id)
      // }
      resolve: (parent, args) => {
        if (args.applicationId) {
          return connectionFromArray(
            translations.filter(item => item.languageId === parent.id && item.applicationId === args.applicationId),
            // language.translations.map((id) => data.Ship[id]),
            args
          );
        }

        return connectionFromArray(
          translations.filter(item => item.languageId === parent.id),
          // language.translations.map((id) => data.Ship[id]),
          args
        )
      }
    }
  }),
  interfaces: [nodeInterface]
});

const {
  connectionType: LanguageConnection,
  edgeType: LanguageEdge
} = connectionDefinitions({name: 'Language', nodeType: LanguageType});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    firstName: { type: GraphQLString },
    language: {
      args: connectionArgs,
      type: LanguageConnection,
      resolve: (parent, args) => {
        return connectionFromArray([languages.find(item => item.id === parent.languageId)], args)
      }
    }
  }),
  interfaces: [nodeInterface]
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    node: nodeField,
    language: { 
      type: LanguageType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args, request) => {
        // code to get data from db / other source
        const userId = getUserId(request);

        if (userId) return languages.find(item => item.id === args.id)
      }
    },
    languages: { 
      type: new GraphQLList(LanguageType),
      resolve: (parent, args, request) => {
        // code to get data from db / other source
        const userId = getUserId(request);

        if (userId) return languages;
      }
    },
    translations: { 
      type: new GraphQLList(TranslationType),
      resolve: (parent, args, request) => {
        // code to get data from db / other source
        const userId = getUserId(request);

        if (userId) return translations;
      }
    },
    user: {
      type: UserType,
      args: { id: {type: GraphQLID }},
      resolve: (parent, args, request) => {
        // code to get data from db / other source
        const userId = getUserId(request);
        
        if (userId) {
          if (args.id) return users.find(item => item.id === args.id);
 
          return users.find(item => item.id === userId);
        }
      }
    }
  },
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField
  })
});

export default new GraphQLSchema({
  query: RootQueryType,
});