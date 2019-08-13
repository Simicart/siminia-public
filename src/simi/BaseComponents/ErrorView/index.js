import React from 'react';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';

const ErrorView = props => {
    const { loading, notFound } = props;
    const message = loading
        ? <Loading/>
        : notFound
        ? Identify.__('That page could not be found. Please try again.')
        : Identify.__('Something went wrong. Please try again.')

    return <h1 style={{textAlign: 'center', marginTop: 20, padding: 15}}>{message}</h1>;
}

export default ErrorView;
