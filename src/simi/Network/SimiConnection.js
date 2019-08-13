import Identify from 'src/simi/Helper/Identify';
import  * as Constants from 'src/simi/Config/Constants'

class SimiConnection {
    constructor() {
        this.config = window.SMCONFIGS;
        // this.config = config;
        this._dataGet = [];
        this._dataPost = null;
        this._headers = new Headers({
            'Content-Type': 'application/json',
        });
        this._init = {cache: 'default', mode: 'cors'};

    }

    restData() {
        this._dataGet = [];
        this._dataPost = null;
        this._init['body'] = null;
    }

    //param is array
    setGetData(data) {
        this._dataGet = Object.keys(data).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(data[key]);
        })
    }
    
    /**
     * param method - simicart server
     **/
    async connectSimiCartServer(method = 'GET', forceUpdate =false, obj =null, fullUrl = null) {
        let _fullUrl = fullUrl ? fullUrl : this.config.simicart_url;
        _fullUrl += ('bear_token/' + this.config.simicart_authorization + '/pwa/1')
        const _init = {};
        _init['method'] = method;
        _init['mode'] = 'cors';
        var _request = new Request(_fullUrl, _init);
        await fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(function (data) {
                if (data && data['app-configs']) {
                    Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, Constants.DASHBOARD_CONFIG, data);
                    if (forceUpdate === true && obj !== null) {
                        obj.forceUpdate();
                    }
                } else if (obj) {
                    obj.setData(data)
                }
            }).catch((error) => {
                console.log(error);
                console.warn(error);
            });
    }
}

const connection = new SimiConnection();
export default connection;
