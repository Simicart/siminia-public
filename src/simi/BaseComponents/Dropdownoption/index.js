import React from 'react'
require ('./index.scss')

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
        return (
            <div role="presentation" className={`dropdownoption ${this.props.className}`} onClick={() => this.handleToggle()}>
                <div role="presentation" className='dropdownoption-title' >
                    <div className="dropdown-title">
                        {this.props.title}
                    </div>
                        <i 
                        ref={(item) => this.downIc = item}
                        className="dropdownoption-title-down-ic icon-chevron-down icons"></i>
                        <i 
                        ref={(item) => this.upIc = item}
                        className="dropdownoption-title-up-ic icon-chevron-up icons"></i>
                </div>
                <div 
                    className="dropdownoption-inner"
                    ref={(item) => this.content = item}
                    style={{display: this.props.expanded?'block':'none'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Dropdownoption