import React from 'react';
import Identify from "src/simi/Helper/Identify";

const AddressItem = props => {
    const { addressData } = props;

    const showAddress = (address) => {
        let result = address.map((item, index) => {
            return (
                <p key={index} className="address">
                    {item}
                </p>
            );
        });
        return result;
    }
    
    return (
        <div className='col-address-book'>
            <div>
                {(addressData.firstname || addressData.lastname) && <p className="customer-name">{addressData.firstname +' '+ addressData.lastname}</p>}
                {addressData.street &&
                    addressData.street.length > 0 &&
                    showAddress(addressData.street)}
                {addressData.city && (
                    <p className="city">{addressData.city}</p>
                )}
                {addressData.postcode && (
                    <React.Fragment>
                        <p className="post-code">
                            {Identify.__("Postcode")}
                        </p>
                        <p className="post-code-number">
                            {addressData.postcode}
                        </p>
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}

export default AddressItem;