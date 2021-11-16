import React from 'react';
import Abstract from './Abstract';
import DatePicker from 'material-ui/DatePicker';
import Identify from "src/simi/Helper/Identify";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close';
const muiTheme = getMuiTheme({});
class DateField extends Abstract {

    constructor(props){
        super(props);
        this.state = {
            date : null
        }
    }

    handleChange = (event, date) => {
        this.setState({
            date: date,
        });
        const {key} = this;
        if(date){
            let value = this.convertDate(date);
            if(this.props.datetime){
                const datetime = this.props.parent.selected[key];
                if(datetime instanceof Object){
                    value = {...datetime,...value};
                }
            }
            this.props.parent.updateOptions(key,value)
        }else{
            this.deleteSelected(key)
        }
    };

    convertDate = (date) => {
        const d = date.getDate();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0"+m : m;
        const y = date.getFullYear();
        const dateFM = y + '-' + m + '-' + d;
        return {
            date: dateFM
        }
    };

    formatDate = (date) =>{
        let m = date.getMonth() + 1;
        m = m < 10 ? "0"+m : m;
        if(Identify.isRtl()){
            date = date.getFullYear() + '/' + m + '/' + date.getDate() ;
            return date;
        }
        date = date.getDate() + '/' + m + '/' + date.getFullYear()
        return date;
    };

    renderDate = ()=> {
        const {date} = this.state
        const text = Identify.isRtl() ? 'yyyy/mm/dd' : 'dd/mm/yyyy';
        return (
            <div className='date-picker-ctn'>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <DatePicker
                        className="date-picker"
                        hintText={<div className="flex"><span>{Identify.__('Select date')}</span> <span>: {text}</span></div>}
                        value={date}
                        minDate={new Date()}
                        mode={window.innerWidth < 768 ? 'portrait' : "landscape"}
                        onChange={this.handleChange}
                        formatDate={this.formatDate}
                        textFieldStyle={{
                            fontFamily : 'Montserrat, sans-serif',
                            color : 'rgba(0, 0, 0, 0.87)'
                        }}
                    />
                </MuiThemeProvider>
                <div role="presentation" className='clear-date' onClick={()=>this.handleChange()}>
                    {date && <CloseIcon style={{width: 12, height: 12, fill: '#aeaeae'}}/>}
                </div>
            </div>
        )
    }

    render(){
        return this.renderDate();
    }
}
export default DateField;