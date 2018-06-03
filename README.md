# A React form component

No the world doesn't need another React form library!

This is just a small library that I created for some personal projects that allows forms to be set up using a very simple declaritive style using standard form elements, eg.

```javascript
render() {
    return <EasyForm onSubmit={(data) => this.onSubmit(data)} >
      <label>
        First name
        <input name="firstName" validation="required" />
      </label>
      <label>
        Email
        <input name="email"  validation='email' />
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
```

It allows the form fields to be nested within any number of other fields, and returns a simple name/value object of field values if all fields pass validation.