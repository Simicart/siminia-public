import Identify from 'src/simi/Helper/Identify'
import { showToastMessage } from 'src/simi/Helper/Message';
const PPfailure = props => {
    const {history} = props
    showToastMessage(Identify.__('Express Checkout has been canceled.'))
    history.push('/cart.html')
    return ''
}
export default PPfailure
