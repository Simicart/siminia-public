import React from 'react';
import Abstract from "./Abstract";
import Identify from "src/simi/Helper/Identify"
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OptionLabel from '../OptionLabel'

class Select extends Abstract {
    constructor(props){
        super(props);
        const value = this.setDefaultSelected(0,false);
        this.state = {
            value
        };
    }

    componentDidMount(){
        if(this.state.value !== 0){
            this.updateForBundle(this.state.value,'select');
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        const value = event.target.value.toString();
        const key = this.key;
        if(value !== 0){
            this.updateSelected(key,value);
        }else{
            this.deleteSelected();
        }
        this.updateForBundle(value,'select');
    };

    renderWithBundle = (data) => {
        const {classes} = this.props
        const options = data.selections;
        const items = [];
        for (const i in options) {
            const item = options[i];
            const element = (
                <MenuItem key={Identify.randomString(5)} name={this.props.key_field} value={parseInt(i,10)}>
                    <div className={classes["option-row"]} style={{alignItems : 'center',fontFamily: 'Montserrat , sans-serif'}}>
                        {<OptionLabel title={item.name} type_id='bundle' classes={classes} item={item} style={{alignItems : 'center'}}/>}
                    </div>
                </MenuItem>
            );
            items.push(element);
        }
        return items;
    };

    renderWithCustom = (data) => {
        const {classes} = this.props
        const values = data.values;
        if(values instanceof Array && values.length > 0){
            const items = values.map(item => {
                return (
                    <MenuItem key={Identify.randomString(5)} value={parseInt(item.id,10)}>
                        <div className={classes["option-row"]} style={{alignItems : 'center'}}>
                            {<OptionLabel title={item.title}  classes={classes} item={item} style={{alignItems : 'center'}}/>}
                        </div>
                    </MenuItem>
                );

            });
            return items;
        }
        return <div></div>
    };

    render = () => {
        const {data, classes} = this.props;
        const type_id = this.props.parent.getProductType();
        let items = null;
        if(type_id === 'bundle'){
            items = this.renderWithBundle(data);
        }else {
            items = this.renderWithCustom(data)
        }
        return (
            <div className={classes["option-value-item-select"]}>
                <FormControl  style={{color : '#333',marginTop:20}} fullWidth={true}>
                    <SelectField
                        value={this.state.value}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'value',
                            id: 'selection',
                        }}
                    >
                        <MenuItem key={Identify.randomString(5)} value={0}>
                            <div className={classes["option-row"]} style={{alignItems : 'center',fontSize:16,fontWeight:100}}>
                                <em>{Identify.__('Choose a selection')}</em>
                            </div>
                        </MenuItem>
                        {items}
                    </SelectField>
                </FormControl>

            </div>

        );
    }
}

export default Select;