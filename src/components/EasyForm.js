import React from 'react';

import ValidationError from './ValidationError';
import { validationTypes } from './validations';

class EasyForm extends React.Component {
  fieldRefs = []
  fieldTypes = ['input', 'button', 'textarea', 'select'];
  fieldObservables = [];
  state = {
    invalid: false,
    invalidFields: {}
  }
  validationTypes;

  componentWillMount() {
    this.validationTypes = { ...validationTypes, ...this.props.validationTypes};
  }

  render() {
    const { children } = this.props;
    const childrenWithProps = this.addRefsToChildren(children);

    return <div>{childrenWithProps}</div>;
  }

  addRefsToChildren(children) {
    let childPropsChildren;
    const newChildren = React.Children.map(children, child => {
      if (child.props && child.props.children) {
        childPropsChildren = this.addRefsToChildren(child.props.children);
      } else {
        childPropsChildren = null;
      }
      if (this.fieldTypes.includes(child.type)) {
        return this.addRefToField(child, childPropsChildren)
      } else if (child.type) {
        return React.cloneElement(child, {}, childPropsChildren);
      } else {
        return child;
      }
    });
    return newChildren;
  }

  addRefToField(field, childPropsChildren) {
    if (field.type === 'button') {
      const onClick = this.submitForm.bind(this);
      return React.cloneElement(field, { onClick }, childPropsChildren);
    } else {
      const ref = React.createRef();
      const newChild = React.cloneElement(field, { ref }, childPropsChildren);
      if (field.props.validation) {
        return this.addValidationToField(newChild, ref);
      }
      this.fieldRefs.push({ ref, props: field.props, type: field.type });
      return newChild;
    }
  }

  addValidationToField(field, ref) {
    let validation = field.props.validation;
    this.fieldRefs.push({ validation, ref, props: field.props, type: field.type });
    return React.createElement('div', null,
      field,
      React.createElement(ValidationError, { 
        invalid: this.state.invalidFields[field.props.name],
        message: this.validationTypes[validation].message
      }, null));
  }

  componentWillUpdate() {
    this.fieldRefs = [];
  }

  submitForm() {
    const validation = this.validate();
    if (!validation.valid) {
      this.setState({ invalid: true, invalidFields: validation.invalidFields });
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
      this.setState({ invalid: false, invalidFields: {} });
    }
  }

  validate() {
    let valid = true;
    const invalidFields = {};
    this.fieldRefs.filter(field => {
      return Boolean(field.validation)
    }).forEach(field => {
      if (!this.validationTypes[field.validation].validate(field.ref.current.value)) {
        valid = false;
        invalidFields[field.props.name] = true;
      }
    })

    return { valid, invalidFields };
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
}

export default EasyForm;