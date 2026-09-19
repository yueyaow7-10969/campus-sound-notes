import {Component,type ReactNode} from 'react';
export default class Boundary extends Component<{children:ReactNode;map?:boolean},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div role="alert" className="inline-note section"><p>{this.props.map?'The map could not load. You can still enter coordinates or use List.':'This view could not load. Your saved draft remains on this device.'}</p><button className="textlink plain" onClick={()=>location.reload()}>Reload this page</button></div>:this.props.children;}
}
