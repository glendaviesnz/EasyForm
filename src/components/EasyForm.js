import React from 'react';

import ValidationError from './ValidationError';

class EasyForm extends React.Component {
  fieldRefs = []
  fieldTypes = ['input', 'button', 'textarea', 'select'];
  fieldObservables = [];
  state = {
    invalid: false
  }

  render() {
    const { children } = this.props;
    const childrenWithProps = this.addRefsToChildren(children);

    return <div>{childrenWithProps}</div>;
  }

  addRefsToChildren(children) {
    let childPropsChildren;
    const newChildren = React.Children.map(children, child => {

      let onClick;
      if (child.props && child.props.children) {
        childPropsChildren = this.addRefsToChildren(child.props.children);
      } else {
        childPropsChildren = null;
      }
      if (this.fieldTypes.includes(child.type)) {
        if (child.type === 'button') {
          onClick = this.submitForm.bind(this);
          return React.cloneElement(child, { onClick }, childPropsChildren);
        } else {
          const ref = React.createRef();
          const newChild = React.cloneElement(child, { ref }, childPropsChildren);
          let validation;
          if (child.props.validation) {
            validation = child.props.validation;
            this.fieldRefs.push({ validation, ref, props: child.props, type: child.type });
            return React.createElement('div', null,
              newChild,
              React.createElement(ValidationError, { invalid: this.state.invalid }, null));
              
          }
          this.fieldRefs.push({ validation, ref, props: child.props, type: child.type });
          return newChild;

        }
      } else if (child.type) {
        return React.cloneElement(child, {}, childPropsChildren);
      } else {
        return child;
      }
    });
    return newChildren;
  }

  componentWillUpdate() {
    this.fieldRefs = [];
  }

  submitForm() {
    if (!this.validate()) {
      this.setState({ invalid: true });
    } else {
      const formValues = {};
      this.fieldRefs.forEach((element) => {
        if (element.type === 'select') {
          formValues[element.props.name] = this.processSelect(element);
        } else if (element.props.type === 'radio') {
          if (element.ref.current && element.ref.current.checked) {
            formValues[element.props.name] = element.ref.current.value;
          }
        } else if (element.props.type === 'checkbox') {
          formValues[element.props.name] = element.ref.current.checked;
        } else {
          formValues[element.props.name] = element.ref.current.value;
        }
      });
      this.props.onSubmit(formValues);
    }
  }
  
  validate() {
    let valid = true;
    this.fieldRefs.filter(field => {
      return Boolean(field.validation)
    }).forEach(field => {
        if (!field.ref.current.value || field.ref.current.value.trim() === '') {
          valid = false;
        }
    })

    return valid;
  }
  processSelect(element) {
    if (element.props.multiple) {
      const selectedOptions = [...element.ref.current.options].filter((option) => {
        return option.selected === true;
      }).map((option) => {
        return option.value;
      });
      return selectedOptions;
    } else {
      return element.ref.current.value;
    }
  }



  // componentDidMount() {

  //   this.fieldRefs.forEach((element) => {
  //     const replay = new ReplaySubject(1);
  //     fromEvent(element.ref.current, 'blur')
  //       .pipe(startWith({ target: {} }),
  //         map((data) => {
  //           if (element.props.type === 'checkbox') {
  //             return { name: element.props.name, value: data.target.checked };
  //           } else {
  //             return { name: element.props.name, value: data.target.value };
  //           }
  //         })
  //       ).subscribe(replay);
  //     this.fieldObservables.push(replay);
  //   });

  // }

}

export default EasyForm;