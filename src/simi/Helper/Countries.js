import Identify from './Identify';
import getCountries from 'src/simi/queries/getCountries.graphql';
import React, { useEffect } from 'react';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';

export const getAllowedCountries = () => {
    const { data } = useQuery(getCountries, {
        fetchPolicy: 'cache-first'
    });
    if (data && data.countries) return data.countries;
    return [];
};
