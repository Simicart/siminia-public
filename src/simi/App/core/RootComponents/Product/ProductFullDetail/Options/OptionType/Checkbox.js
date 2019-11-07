import React from 'react';
import Abstract from "./Abstract";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OptionLabel from '../OptionLabel'

class CheckboxField extends Abstract {
    constructor(props) {
        super(props);
        const checked = this.setDefaultSelected(this.props.value);
        this.state = {
            checked
        }
    }
    
    updateCheck = () => {
        this.setState((oldState) => {
            const checked = !oldState.checked;
            const key = this.props.id;
            let mutilChecked = this.props.parent.selected[key];
            mutilChecked = mutilChecked instanceof Array ? mutilChecked : [];
            if(checked){
                mutilChecked.push(this.props.value);

            }else{
                const index = mutilChecked.indexOf(this.props.value);
                mutilChecked.splice(index,1);
            }
            this.updateSelected(key,mutilChecked);
            return {checked };
        });
    };

    render = () => {
        this.className += ' checkbox-option';
        const { item, title } = this.props;
        return (
            <div className="option-value-item-checkbox" id={`check-box-option-${this.props.value}`} style={{width : '100%'}}>
                <FormControlLabel
                    style={{
                        color:'#333'
                    }}
                    control={<Checkbox
                        checked={this.state.checked}
                        onChange={() => this.updateCheck()}
                        style={{
                            fontFamily : 'Montserrat, sans-serif'
                        }}
                        // classes={{
                        //     root: classes.root,
                        //     checked: classes.checked,
                        // }}
                    />}
                    label={<OptionLabel title={title} item={item} type_id={this.type_id}/>}
                />

            </div>
        );
    }
}
export default CheckboxField;