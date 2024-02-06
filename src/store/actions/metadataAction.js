import {fetchAllCategories, fetchAllProducts} from "../../api";

export const setFilter = (category) => {
	return {
		type: "SET_FILTER",
		category: category,
	}
};

export const clearFilter = () => {
	return {
		type: "CLEAR_FILTER",
	}
};

export const initCatalog = () => dispatch => {
	Promise.all([fetchAllCategories(), fetchAllProducts()]).then(json => {
		dispatch({
			type: "INIT_CATALOG",
			categories: json[0].data,
			products: json[1].data,
		});
	}).catch(() => {
		dispatch({
			type: "INIT_CATALOG",
			categories: ["ALL"],
			products: [],
		});
	});
};

export const setSortBy = (sortBy) => {
	return {
		type: "SET_SORTING",
		sortBy: sortBy,
	}
};