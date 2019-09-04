import React from 'react'
import HomeCatItem from './HomeCatItem';

const HomeCat = props => {
    const { catData, history, isPhone} = props;

    const renderCat = () => {
        if(catData.home.homecategories && catData.home.homecategories.homecategories instanceof Array && catData.home.homecategories.homecategories.length > 0) {
            const dataCat = catData.home.homecategories.homecategories;
            const cate = dataCat.map((item, key) => {
                return (
                    <HomeCatItem isPhone={isPhone} item={item} history={history} key={key}/>
                )
            })

            return (
                <div className="default-list-cate">
                    {cate}
                </div>
            )
            
        }
    }

    return (
        <div className="default-category">
            <div className="container home-container">
                {renderCat()}
            </div>
        </div>
    )
}

export default HomeCat;