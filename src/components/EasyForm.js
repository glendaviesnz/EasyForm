import React from 'react';
import { ReplaySubject, fromEvent } from 'rxjs';

class EasyForm extends React.Component {
  fieldRefs = []
  render() {
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      const ref = React.createRef();
      this.fieldRefs.push(ref);
      return React.cloneElement(child, { ref })
    });
    return <div>{childrenWithProps}</div>;
  }

  componentDidMount() {
    const replay = new ReplaySubject();
    this.fieldRefs.forEach((ref) => {
      fromEvent(ref.current, 'blur')
        .subscribe(replay);
      replay.subscribe(data => console.log(data.target.value));
    })
  }
}

export default EasyForm;