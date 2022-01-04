import { useRef } from 'react';
import { randomString } from 'src/simi/Helper/String';

export const useIdentity = () => {
    const id = useRef(randomString(5)).current;
    return id;
};
