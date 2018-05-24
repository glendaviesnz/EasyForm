import React from 'react';
import { ReplaySubject, fromEvent } from 'rxjs';

class EasyForm extends React.Component {
  fieldRefs = []
  fieldTypes = ['input', 'button', 'textarea'];

  addRefsToChildren(children) {
    let childPropsChildren;

    const newChildren = React.Children.map(children, child => {
      if (child.props && child.props.children ) {
        childPropsChildren = this.addRefsToChildren(child.props.children);
      }
      if (this.fieldTypes.includes(child.type)) {
        const ref = React.createRef();
        this.fieldRefs.push({ref, props: child.props});
        return React.cloneElement(child, { ref }, childPropsChildren);
      } else if (child.type) {
        return React.cloneElement(child, { }, childPropsChildren);
      } else {
        return child;
      }
    });
    return newChildren;
  }

  render() {
    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, child => {
      let childPropsChildren;
      
      if (child.props.children && child.props.children.length > 0 ) {
        childPropsChildren = this.addRefsToChildren(child.props.children);
      }

      if (this.fieldTypes.includes(child.type)) {
        const ref = React.createRef();
        this.fieldRefs.push({ref, props: child.props});
        return React.cloneElement(child, {ref}, childPropsChildren);
      } else  if (child.type) {
        return React.cloneElement(child, {}, childPropsChildren );
      } else {
        return child;
      }

    });

    return <div>{childrenWithProps}</div>;
  }

  componentDidMount() {
    this.fieldRefs.forEach((ref) => {
      const replay = new ReplaySubject();
      fromEvent(ref.ref.current, 'blur')
        .subscribe(replay);
        if (ref.props.type === 'checkbox' ) { 
          replay.subscribe(data => console.log(ref.props.name, data.target.checked));
        } else {
          replay.subscribe(data => console.log(ref.props.name, data.target.value));
        }
      
    })
  }
}

export default EasyForm;