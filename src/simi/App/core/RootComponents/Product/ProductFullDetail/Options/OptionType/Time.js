import React from 'react';
import Abstract from './Abstract';
import TimePicker from 'material-ui/TimePicker';
import Identify from "src/simi/Helper/Identify";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close';
const muiTheme = getMuiTheme({});
class Time extends Abstract {
    state = {
        time : null,
    };

    handleChangeTimePicker = (event, time) => {
        this.setState({time});
        if(time){
            let val = this.convertTime(time);
            const key = this.key;
            if(this.props.datetime){
                const datetime = this.props.parent.selected[key];
                if(datetime instanceof Object){
                    val = {...datetime,...val};
                }
            }
            this.updateSelected(key,val);
        }else{
            this.deleteSelected()
        }
    };

    convertTime = (time) => {
      let h = time.getHours();
      let day_part = 'am';
      console.log(h);
      if(h >= 12){
        day_part = 'pm';
        h = h > 12 ? h - 12 : h;
      }
      h = h < 10 ? '0' + h : h.toString();
      let m = time.getMinutes();
      m = m < 10 ? '0' + m : m.toString();
      return {
          hour : h,
          minute : m,
          day_part
      }
    };

    renderTimePicker = () => {
        const {time} = this.state
        return (
            <div className='time-picker-ctn'>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <TimePicker
                        format="ampm"
                        hintText={Identify.__('Select time') + ": --:-- --"}
                        value={time}
                        onChange={this.handleChangeTimePicker}
                        textFieldStyle={{
                            fontFamily : 'Montserrat, sans-serif',
                            color : 'rgba(0, 0, 0, 0.87)'
                        }}
                    />
                </MuiThemeProvider>
                <div role="presentation" className='clear-time' onClick={()=>this.handleChangeTimePicker()}>
                    {time && <CloseIcon style={{width: 12, height: 12, fill: '#aeaeae'}}/>}
                </div>
            </div>

        )
    }

    render(){
        return this.renderTimePicker()
    }
}
export default Time;