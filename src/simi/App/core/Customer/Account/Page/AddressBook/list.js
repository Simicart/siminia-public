import React, {useReducer, useCallback} from 'react';
import Identify from 'src/simi/Helper/Identify';
import Pagination from './pagination';
import ListItem from './listItem';

const List = props => {
    const { items, classes, address_fields_config, address_option } = props;
    const addressConfig = address_fields_config;

    const editAddressHandle = (id) => {
        props.editAddress(id);
    }

    const deleteAddressHandle = (id) => {
        props.mutaionCallback({ variables: {id: id}});
        props.dispatchDelete(id);
        dispatch({dataItems: items});
    }

    const renderItems = (itemsRender) => {
        let rendering = items;
        if (typeof itemsRender !== 'undefined') {
            rendering = itemsRender;
        }
        return rendering.map((item, index) => {
            item.index = index; // add index of array to item
            return <ListItem data={item} editAddress={editAddressHandle} deleteAddress={deleteAddressHandle} key={index} classes={classes}
                address_fields_config={addressConfig} address_option={address_option}
            />
        })
    }

    const reducer = (state, action) => {
        return {...state, ...{dataItems: action.items}}
    }
    const reducerMemoized = useCallback(reducer, [items]);
    const [state, dispatch] = useReducer(reducerMemoized, {dataItems: items});

    const renderPagination = () => {
        if (items.length < 1) {
            return null
        }
        return <Pagination className={classes["pagination"]} dispatch={dispatch} dataItems={items} pageSize={10} classes={classes}/>
    }

    return (
        <div className={classes["table-wrap"]}>
            <table>
                <thead>
                    <tr>
                        <th className="col firstname">{Identify.__("First Name")}</th>
                        <th className="col lastname">{Identify.__("Last Name")}</th>
                        {(!addressConfig || addressConfig && addressConfig.street_show) ? 
                            <th className="col streetaddress">{Identify.__("Street Address")}</th> : null
                        }
                        {(!addressConfig || addressConfig && addressConfig.city_show) ? <th className="col city">{Identify.__("City")}</th> : null}
                        {(!addressConfig || addressConfig && addressConfig.country_id_show) ? <th className="col country">{Identify.__("Country")}</th> : null}
                        {(!addressConfig || addressConfig && addressConfig.region_id_show) ? <th className="col state">{Identify.__("State")}</th> : null}
                        {(!addressConfig || addressConfig && addressConfig.zipcode_show) ? <th className="col zip">{Identify.__("Zip/Postal Code")}</th> : null}
                        {(!addressConfig || addressConfig && addressConfig.telephone_show) ? <th className="col phone">{Identify.__("Phone")}</th> : null}
                        <th className="col actions"></th>
                    </tr>
                </thead>
                <tbody>{renderItems(state.dataItems)}</tbody>
            </table>
            {renderPagination()}
        </div>
    );
}

export default List;
