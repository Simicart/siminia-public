import React from  'react';
import ToggleStar from '@material-ui/icons/Star';
import {configColor} from 'src/simi/Config';;
import PropTypes from 'prop-types';

class SwipeableRate extends React.Component {
    constructor(props){
        super(props);
        this.rate = this.props.rate ;
        this.size = this.props.size ;
        this.rate_option = this.props.rate_option ;
        this.rate_code = this.props.rate_code ;
        this.flag = this.props.change ;
    }
    handleChangeRate = (item, id) => {
        if (item) {
            const ColorStar = configColor.button_background;
            const star = $('#' + item + '-' + id + '');
            $(star[0]).nextAll().children().css('fill', '#e0e0e0');
            $(star[0]).prevAll().children().css('fill', ColorStar);
            $(star[0]).children().css('fill', ColorStar);
            $(star[0]).prevAll().removeClass('select-star');
            $(star[0]).nextAll().removeClass('select-star');
            $(star[0]).addClass('select-star');
        }
    };

    renderRate = () => {
        this.rate = Math.round(this.rate, 10);
        const rate_point = this.flag ? 'rate-point' : '';
        const select = this.flag ? 'select-star' : '';
        const star = [];
        let point = 0;
        let rate_key = 0;
        let id = '';
        for (let i = 0; i < 5; i++) {
            if (this.flag) {
                id = this.rate_code + '-' + i
            }
            if (this.rate_option) {
                point = this.rate_option[i].value;
                rate_key = this.rate_option[i].key;
            }
            if (i + 1 <= this.rate) {
                star.push(
                    <span role="presentation" key={i} id={id} className={rate_point + " rate-star " + select}
                          onClick={() => this.handleChangeRate(this.rate_code, i)} data-key={rate_key}
                          data-point={point}><ToggleStar style={{height: this.size + 'px', width: this.size + 'px',fill:configColor.button_background}}/></span>
                );
            } else {
                star.push(
                    <span role="presentation" key={i} id={id} className={rate_point + " rate-star "}
                          onClick={() => this.handleChangeRate(this.rate_code, i)} data-key={rate_key}
                          data-point={point}><ToggleStar style={{fill : '#e0e0e0',height: this.size + 'px', width: this.size + 'px'}}/></span>
                );
            }
        }

        return star;
    };
    render(){
        const {classes} = this.props
        return <div className={classes["rate-review"]}>{this.renderRate()}</div>
    }
}
SwipeableRate.defaultProps = {
    rate : 0,
    size : 15,
    rate_option: null,
    rate_code : null,
    change : false,
    classes: {},
};
SwipeableRate.propTypes = {
    rate : PropTypes.number,
    size : PropTypes.number,
    rate_option: PropTypes.array,
    rate_code : PropTypes.string,
    change : PropTypes.bool,
    classes : PropTypes.object,
};
export default SwipeableRate;