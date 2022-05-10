import React, {} from 'react';


const RequiredInput = (props) => {
    const title = props ? props.title : 'null';
    const handleChange = props ? props.handleChange : () => null;
    const value = props ? props.value : '';
    const isDate = props ? props.isDate : false;
    const readOnly = props ? props.readOnly : false;
    const hidden = props ? props.hidden : false;
    const isTime = props ? props.isTime : null;
    const choices = props ? props.choices : null;

    if (hidden) {
        return (
            <div>

            </div>
        )
    }

    const mainInput = isTime ? (
        <select style={{
            fontSize: 18,
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 5,
            paddingBottom: 5
        }}
                onChange={e => handleChange(e.target.value)}
        >
            <option value={'a'}>a</option>
            <option value={'a'}>b</option>
            <option value={'a'}>c</option>
        </select>
    ) : (
        <input type={isDate ? 'date' : 'text'}
               style={{
                   fontSize: 18,
                   paddingLeft: 5,
                   paddingRight: 5,
                   paddingTop: 5,
                   paddingBottom: 5
               }}
               onChange={e => handleChange(e.target.value)}
               value={value || ''}
               required={true}
               readOnly={readOnly}
        />
    )

    return (
        <div style={{display: 'flex', flexDirection: "column", marginBottom: 7}}>
            <label style={{fontSize: 20, marginBottom: 5}}>
                {title}
                <span style={{color: "#c15050"}}>  *</span>

            </label>
            {mainInput}
        </div>
    );
};

export default RequiredInput;