import React from 'react';
import Abstract from './Abstract';
import Identify from 'src/simi/Helper/Identify';
class Text extends Abstract {
    state = {
        value : ''
    };

    handleChange = (event) => {
        if (this.max_characters && event.target.value.length > this.max_characters)
            return
        this.setState({
            value: event.target.value,
        });
        const value = event.target.value;
        if(value){
            this.updateSelected(this.key,value);
        }else{
            this.deleteSelected(this.key);
        }
    };

    renderTextField = ()=>{
        const {id} = this.props
        return(
            <div className="option-text-field">
                <input
                    id="text-field"
                    name={`option[${id}]`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    className="form-control"
                    style={{
                        width : '100%',
                        background : '#f2f2f2',
                        border : 'none',
                        boxShadow : 'none'
                    }}
                />
            </div>
        )
    };

    renderTextArea =()=>{
        const {id} = this.props
        return (
            <div className="form-group">
                <textarea 
                    name={`option[${id}]`}
                    id="option-text-area"  
                    className="form-control" rows="5" style={{
                    background : '#f2f2f2',
                    border : 'none',
                    boxShadow : 'none'
                }} onChange={this.handleChange}/>
            </div>
        )
    }

    render(){
        if (this.props.max_characters) {
            this.max_characters = parseInt(this.props.max_characters, 10)
        }
        return (
            <div>
                {(this.props.type === 'area')?this.renderTextArea():this.renderTextField()}
                {this.max_characters && <p>{Identify.__('Maximum number of characters:')} {this.max_characters}</p>}
            </div>
        )
    }
}
export default Text;