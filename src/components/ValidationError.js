import React from 'react';

class ValidationError extends React.Component {
    render() {
      return <div>
        {this.props.invalid &&
          <span>Field invalid</span>
        }
      </div>;
    }
  }

  export default ValidationError;
  