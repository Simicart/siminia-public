import React from 'react'
import Identify from 'src/simi/Helper/Identify';

class Abstract extends React.PureComponent {
    constructor(props){
        super(props)
        const style = {
            fontSize:30,
            fill : '#eaeaea',
            width: 65,
            height : 65
        };
        const color = this.props.color ? {fill: this.props.color} : {};
        this.style = {...style,...this.props.loadingStyle,...color};
        const divStyle = {
            textAlign : 'center',width : '100%',marginTop : 50
        }
        this.divStyle = {...divStyle,...this.props.divStyle}
    }

    renderLoading = (icon) => {
        return (
            <div id={this.props.id?this.props.id:Identify.randomString()}
                 className={`loading-spiner ${this.props.className}`}
                 style={this.divStyle}>
                {icon}
            </div>
        )
    }
}
export default Abstract