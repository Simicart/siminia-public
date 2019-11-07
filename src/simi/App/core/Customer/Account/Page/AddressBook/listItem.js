import React, { useCallback, useMemo } from 'react';
import Identify from 'src/simi/Helper/Identify';

const ListItem = props => {

    const { data, address_fields_config } = props;
    const addressConfig = address_fields_config;
    const { id } = data;

    const deleteCallback = useCallback((e) => {
        e.preventDefault();
        if (confirm(Identify.__("Are you sure?"))) {
            props.deleteAddress(id);
        }
    }, [id]);

    const editAddressHandle = (e) => {
        e.preventDefault();
        props.editAddress(id);
    }

    return (
        <tr>
            <td className="row firstname" data-th={Identify.__("First Name")}>{data.firstname}</td>
            <td className="row lastname" data-th={Identify.__("Last Name")}>{data.lastname}</td>
            {(!addressConfig || addressConfig && addressConfig.street_show) ?  
                <td className="row streetaddress" data-th={Identify.__("Street Address")} style={{display: 'flex', flexDirection: 'column'}}>{data.street.map((address, index) => {
                    return <span key={index}>{address}</span>
                })}</td>
                : null
            }
            {(!addressConfig || addressConfig && addressConfig.city_show) ?  
                <td className="row city" data-th={Identify.__("City")}>{data.city}</td>
                : null
            }
            {(!addressConfig || addressConfig && addressConfig.country_id_show) ?  
                <td className="row country" data-th={Identify.__("Country")}>{data.country}</td>
                : null
            }
            {(!addressConfig || addressConfig && addressConfig.region_id_show) ?  
                <td className="row state" data-th={Identify.__("State")}>{data.region_code}</td>
                : null
            }
            {(!addressConfig || addressConfig && addressConfig.zipcode_show) ?  
                <td className="row zip" data-th={Identify.__("Zip/Postal Code")}>{data.postcode}</td>
                : null
            }
            {(!addressConfig || addressConfig && addressConfig.telephone_show) ?  
                <td className="row phone" data-th={Identify.__("Phone")}>{data.telephone}</td>
                : null
            }
            <td className="row actions" data-th={Identify.__("Actions")}>
                <a className="edit" href="" onClick={editAddressHandle}>{Identify.__("Edit")}</a>
                |
                <a className="delete" href="" onClick={deleteCallback}>{Identify.__("Delete")}</a>
            </td>
        </tr>
    );
}

export default ListItem;
