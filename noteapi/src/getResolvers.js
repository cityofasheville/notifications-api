import merge_deep from './util/merge_deep.js';
import { graphql } from './util/coa-web-login/index.js';
import * as fs from 'fs';
const packagejson = JSON.parse(fs.readFileSync('./package.json'));
const version = packagejson.version;
// import { get } from 'http';

function getResolvers(apiResolvers) {
  const resolverMap = {
    Query: {
      version(obj, args, context) { // eslint-disable-line no-unused-vars
        return version;
      },
      user(obj, args, context) {
        // console.log("context", context, "cache", context.cache.get(context.session.id));
        return context.cache.get(context.session.id)
          .then((cData) => {
            if (cData && cData.user) {
              const u = cData.user;
              return Promise.resolve({
                id: u.id,
                name: u.name,
                email: u.email,
                position: u.position,
                department: u.department,
                division: u.division,
                supervisor_id: u.supervisor_id,
                supervisor: u.supervisor,
                supervisor_email: u.supervisor_email,
              });
            }
            return Promise.resolve({
              id: null,
              name: null,
              email: null,
              position: null,
              department: null,
              division: null,
              supervisor_id: null,
              supervisor: null,
              supervisor_email: null,
            });
          });
      },
    },
    Mutation: {
      test(obj, args, context) { // eslint-disable-line no-unused-vars
        return { message: 'You have successfully called the test mutation' };
      },
    },
  };

  const loginResolvers = graphql.resolvers;
  return merge_deep(
    resolverMap,
    apiResolvers,
    loginResolvers,
  );
}

export default getResolvers;
