import React from 'react';
import Identify from "src/simi/Helper/Identify";
import {Link} from 'react-router-dom';

const Copyright = props => {
    const {isPhone, classes} = props;
    let copyright = `${new Date().getFullYear()} ${Identify.__('Simicart')}`;
    return (
        <div className={classes["app-copyright"]}>
            <div className="container">
                <div className={`row ${classes['pd-tb-15']}`}>
                    <div className={`col-xs-6 ${classes["app--flex"]}`} style={{ frontSize: '13px'}}>
                        <span>
                            &copy; {copyright}
                        </span>
                    </div>
                    <div
                            className="col-xs-6 text-right"
                            style={{ fontSize: "13px" }}
                        >
                            {Identify.__("eCommerce by ")}
                            <Link to="/" style={{ color: "#FC565A" }}>
                                {Identify.__("Simicart")}
                            </Link>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Copyright;