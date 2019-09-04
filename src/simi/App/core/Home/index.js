import React, { useEffect, useState } from 'react'
import { getHomeData } from 'src/simi/Model/Home';
import Banner from './Banner';
import HomeCat from "./HomeCat";
//import defaultClasses from './style.css';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import { withRouter } from 'react-router-dom';
import ProductList from './ProductList';
import Identify from 'src/simi/Helper/Identify';
import * as Constants from 'src/simi/Config/Constants';
require('./home.scss');
const Home = props => {
    const {  history } = props;
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1024)
    const simiSessId = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID)
    const cached_home = simiSessId?Identify.ApiDataStorage(`home_lite_${simiSessId}`):null

    const [data, setHomeData] = useState(cached_home)

    const resizePhone = () => {
        window.onresize = function () {
            const width = window.innerWidth;
            const newIsPhone = width < 1024
            if(isPhone !== newIsPhone){
                setIsPhone(newIsPhone)
            }
        }
    }
    useEffect(() => {
        if(!data) {
            getHomeData(setData);
        }
        resizePhone();
    },[data, isPhone])

    const setData = (data) => {
        if(!data.errors) {
            if (simiSessId)
                Identify.ApiDataStorage(`home_lite_${simiSessId}`,'update', data)
            setHomeData(data)
        }
    }

    if(!data) {
        return <LoadingSpiner />
    } 

    return (
        <React.Fragment>
            <Banner data={data} history={history} isPhone={isPhone}/>
            <HomeCat catData={data} history={history} isPhone={isPhone}/>
            <ProductList homeData={data} history={history}/>
        </React.Fragment>

    );
}

export default withRouter(Home);