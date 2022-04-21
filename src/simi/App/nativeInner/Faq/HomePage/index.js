import React, { Fragment,useState } from 'react';
import SearchBox from '../SearchBox/searchbox'
import CategoriesList from '../FaqsListContainer/CategoriesList'
// import Loader from '../Loader/Loader'
import Loader from '../../Loader'

// import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { Helmet } from 'react-helmet';
import { useHomePage } from '../../talons/Faq/useHomePage'
import { useCategoryList } from '../../talons/Faq/useCategoryList'

const FAQ = props => {
	const { 
		homepageData, 
		homepageLoading, 
		derivedErrorMessage
	} = useHomePage()
	
	const { 
		categoriesData,
		categoriesLoading,
		categoriesError 
	} = useCategoryList()
	const [userInput, setUserInput] = useState('');
	const [searchInput, setSearchInput] = useState('');	
	const [loading, setLoading] = useState(false)

	if(!homepageData || !homepageData.MpMageplazaFaqsGetConfig) {
		return <Loader />;
	}
	if(!categoriesData || !categoriesData.MpMageplazaFaqsCategoryList) {
		return <Loader />;
	}

	const {
		title,
		category_column
	} = homepageData.MpMageplazaFaqsGetConfig.faq_home_page

	const categories = categoriesData.MpMageplazaFaqsCategoryList.items;


	const onChange = (e) => {
		setUserInput(e.target.value)
	}

	const onSearch = () => {
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
			setSearchInput(userInput)
		}, 500)
	}
	const reRender = true
	return (
		<div className="container">
			<Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
            </Helmet>
			<SearchBox
				onChange={onChange}
				userInput={userInput}
				onSearch={onSearch}
			/>
			<CategoriesList 
				loading={loading}
				column={category_column} 
				categories={categories}
				searchInput={searchInput}
				reRender={reRender}
			/>
		</div>
	)
}

export default FAQ;