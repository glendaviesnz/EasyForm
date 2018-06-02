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
        <input name="firstName" validation="required" />
      </label>
      <label>
        Last name
        <input name="lastName"  validation="required" />
      </label>
      <input type="radio" name="relationship" value="sister" />
      <input type="radio" name="relationship" value="mum" />
      <input type="radio" name="relationship" value="dad" />
      <input type="checkbox" name="newsletterSub" />
      <select name="car" multiple>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <textarea name="bio"></textarea>
      <button type="submit">Submit</button>
    </EasyForm>;
  }
}

export default UserDetails;
