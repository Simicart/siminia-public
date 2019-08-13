import React from 'react'
import Arrowup from "src/simi/BaseComponents/Icon/TapitaIcons/ArrowUp"

import defaultClasses from './index.css'
import { mergeClasses } from 'src/classify'

class Dropdownoption extends React.Component {
    sliding = false
    
    handleToggle() {
        if (this.sliding) return
        this.sliding = true
        const obj = this
        $(this.content).slideToggle('fast', function () {
            obj.sliding = false 
            if ($(this).is(':visible')) {
                $(obj.downIc).hide()
                $(obj.upIc).show()
            } else {
                $(obj.downIc).show()
                $(obj.upIc).hide()
            }
        });
    }

    render() {
        const propsClasses = this.props.classes?this.props.classes:{}
        const classes = mergeClasses(defaultClasses, propsClasses);
        return (
            <div className={`${classes['dropdownoption']} ${this.props.className}`}>
                <div role="presentation" className={classes['dropdownoption-title']} onClick={() => this.handleToggle()}>
                    {this.props.title}
                    <div 
                        className={classes["dropdownoption-title-down-ic"]}
                        ref={(item) => this.downIc = item}>
                        <Arrowup />
                    </div>
                    <div 
                        className={classes["dropdownoption-title-up-ic"]}
                        ref={(item) => this.upIc = item}>
                        <Arrowup />
                    </div>
                </div>
                <div 
                    className={classes["dropdownoption-inner"]}
                    ref={(item) => this.content = item}
                    style={{display: this.props.expanded?'block':'none'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Dropdownoption