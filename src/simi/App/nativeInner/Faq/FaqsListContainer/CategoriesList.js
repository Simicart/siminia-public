import React from 'react';
import CategoryBlock from './CategoryBlock'
import Loader from '../../Loader'
import defaultClasses from './CategoriesList.module.css'

const CategoriesList = props => {
	const classes = defaultClasses;
	const {
		categories,
		searchInput,
		column,
		loading,
		reRender
	} = props

	let filterCategories = JSON.parse(JSON.stringify(categories))
	filterCategories = filterCategories.map(cate => {
		cate.articles.items = cate.articles.items.filter(art => 
			art.name.toLowerCase().includes(searchInput.toLowerCase())
		)
		return cate
	})

	let count = 0; //sau mỗi lần map filterCategories, nếu không có category không trả lại kết quả thì count tăng 1

	let categoryBlocks = filterCategories.map(cate => {
		if(cate.articles.items.length) {
			return <CategoryBlock 
				key={cate.category_id} 
				data={cate} 
				column={column}
				searchInput={searchInput}
			/>
		} else count++;
	})

	if(count === filterCategories.length) {
		categoryBlocks = <div>There is no FAQ match with your search.</div>
	}

	if(!reRender) {
		categoryBlocks = <div></div>
	}

	return (
		<div className={classes.container}>
			{loading ? <Loader/> : ''}
			<div className={classes.section}>
				{categoryBlocks}
			</div>
		</div>
	)
}

export default CategoriesList