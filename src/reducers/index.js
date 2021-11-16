import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import user from './user';
import simireducers from 'src/simi/Redux/reducers/simireducers';

const reducers = {
    app,
    cart,
    catalog,
    checkout,
    simireducers,
    user
};

export default reducers;
