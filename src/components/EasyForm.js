import React from 'react';
import { ReplaySubject, fromEvent } from 'rxjs';

class EasyForm extends React.Component {
  fieldRefs = []
  fieldTypes = ['input', 'button', 'textarea'];
  render() {
    const { children } = this.props;
    console.log(children);
    const childrenWithProps = React.Children.map(children, child => {
      if (this.fieldTypes.includes(child.type)) {
        const ref = React.createRef();
        this.fieldRefs.push({ref, props: child.props});
        return React.cloneElement(child, { ref })
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