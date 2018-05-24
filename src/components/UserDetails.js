import React from 'react';


import EasyForm from './EasyForm';

class UserDetails extends React.Component {
  ref = React.createRef();

  render() {
    return <EasyForm>
      <input name="firstName" />
      <input name="lastName" />
      <textarea></textarea>
      <input type="checkbox" />
      <button>Submit</button>
      <div> test </div>
    </EasyForm>;
  }

}

export default UserDetails;