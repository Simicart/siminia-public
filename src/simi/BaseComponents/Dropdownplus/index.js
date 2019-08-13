import React from 'react'
import Addic from 'src/simi/BaseComponents/Icon/Add'
import Minusic from 'src/simi/BaseComponents/Icon/Minus'
class Dropdownplus extends React.Component {
    sliding = false
    handleShowContent() {
        if (this.sliding) return
        this.sliding = true
        const obj = this
        $(this.content).slideToggle('fast', function () {
            obj.sliding = false 
            if ($(this).is(':visible')) {
                $(obj.plusIc).hide()
                $(obj.minusIc).show()
            } else {
                $(obj.plusIc).show()
                $(obj.minusIc).hide()
            }
        });
    }

    render() {
        const classes = this.props.classes?this.props.classes:{}
        return (
            <div className={`${classes['dropdownplus']} ${this.props.className}`}>
                <div role="presentation" className={classes['dropdownplus-title']} onClick={() => this.handleShowContent()}>
                    {this.props.title}
                    <div 
                        className={classes["dropdownplus-title-plus-ic"]}
                        ref={(item) => this.plusIc = item}>
                        <Addic />
                    </div>
                    <div 
                        className={classes["dropdownplus-title-minus-ic"]}
                        ref={(item) => this.minusIc = item}
                        style={{display: 'none'}}>
                        <Minusic />
                    </div>
                </div>
                <div 
                    className={classes["dropdownplus-inner"]}
                    ref={(item) => this.content = item}
                    style={{display: this.props.expanded?'block':'none'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Dropdownplus