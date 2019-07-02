import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import environment from './environment';

export default class App extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery {
            user {
              id,
              firstName
            }
          }
        `}
        variables={{
          userId: 1,
        }}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <div>
              <div>User ID: {props.user.id}</div>
              <div>User First Name: {props.user.firstName}</div>
            </div>
          );
        }}
      />
    );
  }
}