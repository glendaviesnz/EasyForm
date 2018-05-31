import React from 'react';

import EasyForm from './EasyForm';

class UserDetails extends React.Component {
  ref = React.createRef();
  onSubmit(formData) {
      console.log(formData);
  }
  render() {
    return <EasyForm onSubmit={(data) => this.onSubmit(data)}>
      <label>
        First name
        <input name="firstName" />
      </label>
      <label>
        Last name
        <input name="lastName" />
      </label>
      <input type="radio" name="test" value="sister" />
      <input type="radio" name="test" value="mum"/>
      <input type="radio" name="test" value="dad" />
      <input type="checkbox" name="newsletterSub" />
      <button type="submit">Submit</button>
    </EasyForm>;
  }
}

export default UserDetails;
