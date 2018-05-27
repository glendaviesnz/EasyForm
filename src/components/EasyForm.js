import React from 'react';
import { ReplaySubject, fromEvent, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

class EasyForm extends React.Component {
  fieldRefs = []
  fieldTypes = ['input', 'button', 'textarea'];
  fieldObservables = [];

  submitForm() {
    this.props.onSubmit(
      combineLatest(this.fieldObservables, (...fieldValues) => { 
        const formValues = {};
        fieldValues.forEach((field) => {
          formValues[field.name] = field.value;
        })
        return formValues;
      })
    );
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
          this.fieldRefs.push({ ref, props: child.props });
          return React.cloneElement(child, { ref }, childPropsChildren);
        }
 
      } else if (child.type) {
        return React.cloneElement(child, {}, childPropsChildren);
      } else {
        return child;
      }
    });
    return newChildren;
  }

  render() {
    const { children } = this.props;
    const childrenWithProps = this.addRefsToChildren(children);

    return <div>{childrenWithProps}</div>;
  }

  componentDidMount() {

    this.fieldRefs.forEach((element) => {
      const replay = new ReplaySubject();
      fromEvent(element.ref.current, 'blur')
        .pipe(
          map((data) => {
            if (element.props.type === 'checkbox') {
              return { name: element.props.name, value: data.target.checked };
            } else {
              return { name: element.props.name, value: data.target.value };
            }
          })
        ).subscribe(replay);
      this.fieldObservables.push(replay);
    });

  }
}

export default EasyForm;