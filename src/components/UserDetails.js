import React from 'react';


import EasyForm from './EasyForm';

class UserDetails extends React.Component {
  ref = React.createRef();
  
  render() {
    return  <EasyForm>
            <input name="Bob" />
            <input name="Sarah" />
            </EasyForm>;
  }

}

export default UserDetails;