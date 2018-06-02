import React from 'react';
class Validate extends React.Component {

  render() {
    return <div>
      {this.props.invalid &&
       <span>Field invalid</span>
      }

    </div>;
  }
}
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
    // this.fieldRefs = [];
    // console.log('what',this.fieldRefs)
    // console.log('here', this.fieldrefs);
    const newChildren = React.Children.map(children, child => {
      
      let onClick;
      if (child.props && child.props.children) {
        childPropsChildren = this.addRefsToChildren(child.props.children);
      } else {
        childPropsChildren = null;
      }
      if (this.fieldTypes.includes(child.type)) {
        // console.log('here',this.fieldRefs)
        if (child.type === 'button') {
          onClick = this.submitForm.bind(this);
          return React.cloneElement(child, { onClick }, childPropsChildren);
        } else {
          const ref = React.createRef();
          // this.fieldRefs.push({ ref, props: child.props, type: child.type });
          const newChild = React.cloneElement(child, { ref }, childPropsChildren);
          if (child.props.validate) {
             return React.createElement('div', null,
            newChild,
              React.createElement(Validate, {invalid: this.state.invalid}, null));
          }
          this.fieldRefs.push({ element: newChild, ref, props: child.props, type: child.type });
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
  componentDidUpdate() {
    console.log('update', this.fieldRefs);
  }
  componentDidMount() {
    //console.log('mount', this.fieldRefs);
  }
  componentWillUpdate() {
    this.fieldRefs = [];
  }
  submitForm() {
    
    this.setState({invalid: true});
    //console.log(this.fieldRefs);
    const formValues = {};
    // this.fieldRefs.forEach((element) => {
    //   if (element.type === 'select') {
    //     formValues[element.props.name] = this.processSelect(element);
    //   } else if (element.props.type === 'radio') {
    //     if (element.ref.current && element.ref.current.checked) {
    //       formValues[element.props.name] = element.ref.current.value;
    //     }
    //   } else if (element.props.type === 'checkbox') {
    //     formValues[element.props.name] = element.ref.current.checked;
    //   } else {
    //     formValues[element.props.name] = element.ref.current.value;
    //   }
    // });
    this.props.onSubmit(formValues);
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