import Main from './main';
import { connect } from 'src/drivers';

const mapStateToProps = ({ simireducers }) => {
    const { storeConfig } = simireducers;
    return {
        storeConfig
    };
};

export default connect(mapStateToProps)(Main);
