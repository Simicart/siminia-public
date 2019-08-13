import React, { Component } from 'react';
import ContactForm from './Components/Form';
import Info from './Components/Info';
// import Loading from 'src/simi/BaseComponents/Loading'
import {compose} from 'redux';
import classify from "src/classify";
import defaultClasses from "./style.css";
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from "../../../Helper/Identify";
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"

class Contact extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // componentWillMount() {
    //     window.scrollTo(0, 0);
    // }
    
    
    render() {
        return (
            <div className="contact-page">
                {TitleHelper.renderMetaHeader({
                    title: Identify.__("Contact"),
                    desc: Identify.__("Contact")
                })}
                <BreadCrumb breadcrumb={[{name:'Home',link:'/'},{name:'Contact Us'}]}/>
                <div className="container">
                    <div className="col-xs-12 col-sm-6">
                        <ContactForm/>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Info/>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    classify(defaultClasses)
)(Contact);