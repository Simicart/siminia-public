import React, {useState} from 'react';

const RoundButton = (props) => {
    const [isHover, setHover] = useState(false)
    const onCLick = props ? props.onClick : null;
    const title = props ? props.title : 'default_title';

    return (
        <>
            <button onClick={onCLick}
                    style={{
                        backgroundColor: isHover ? '#ff7171' : '#e9896a',
                        paddingLeft: 18,
                        paddingRight: 18,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderRadius: 4,
                        fontSize: 22,
                        color: '#fff',
                        fontWeight: "bold"
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    {...props}
            >{title}
            </button>
        </>
    );
};

export default RoundButton;