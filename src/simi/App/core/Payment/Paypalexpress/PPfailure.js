import { showToastMessage } from 'src/simi/Helper/Message';
import { useIntl } from 'react-intl';
const PPfailure = props => {
    const { formatMessage } = useIntl();
    const { history } = props;
    showToastMessage(
        formatMessage({ id: 'Express Checkout has been canceled.' })
    );
    history.push('/cart');
    return '';
};
export default PPfailure;
