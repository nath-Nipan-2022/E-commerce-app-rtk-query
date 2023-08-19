import { useParams } from "react-router-dom";
import {
	useGetACategoryQuery,
	useGetSubcategoriesQuery,
} from "../store/apis/categoriesApi";
import { useState } from "react";
import Slider from "../components/Slider";
import ProductsListItem from "../components/ProductsListItem";
import Skeleton from "../components/Skeleton";
import FilterPanel from "../components/FilterPanel";
import { GoFilter } from "react-icons/go";
import Button from "../components/Button";

function CategoriesPage() {
	const { id: name } = useParams();
	const category = `filters[categories]?filters[name][$eq]=${name}`;	
	
	// get the products matching the category
	const {
		data: products,
		isLoading,
		error,
	} = useGetACategoryQuery("?populate=*&" + category);
	
	// get the sub categories associated with the category
	const { data: subCats } = useGetSubcategoriesQuery("?" + category);
	
	// use a state to store the filtered sub categories
	const [filterSubCats, setFilterSubCats] = useState([]);
	// state to know whether priceRange is selected / not
	const [priceRange, setPriceRange] = useState(null);
	// state to store the price order
	const [priceOrder, setPriceOrder] = useState(null);
	// state to store the ratings
	const [ratings, setRatings] = useState(null);

	// for mobile devices to toggle filter panel 
	const [showPanel, setShowFilterPanel] = useState(false);

	// change the sub-categories state 🔥
	const handleSubCatsChange = (value) => {
		if (filterSubCats.includes(value)) {
			setFilterSubCats(filterSubCats.filter((item) => item !== value));
		} else {
			setFilterSubCats([...filterSubCats, value]);
		}
	};

	//Filter the products acc. to the filtered sub-categories 🔥👌
	let filteredProducts = products?.data.filter((product) => {
		if (filterSubCats.length === 0) {
			return true; // No sub-category filter, so all products match
		}

		const subCatNames = new Set(
			product.attributes.sub_categories.data.map((item) => item.attributes.name)
		);

		for (const subCatName of filterSubCats) {
			if (subCatNames.has(subCatName)) {
				return true; // At least one matching sub-category found
			}
		}

		return false; // No matching sub-category found
	});

	// filter by price range
	if (priceRange) {
		filteredProducts = filteredProducts?.filter(product => {
			return product.attributes.price <= priceRange;
		})
	}

	// filter by price order
	if (priceOrder) {
		let order = priceOrder === 'asc' ? 1 : -1;

		filteredProducts = filteredProducts.sort((a, b) => {
			const priceA = a.attributes.price;
			const priceB = b.attributes.price;
			return (priceA - priceB) * order ;
		})
	}

	// filer by ratings
	if (ratings) {
		filteredProducts = filteredProducts?.filter(product => {
			return product.attributes.ratings >= ratings
		})
	}

	// use the filtered values
	let renderCategoryProducts = filteredProducts?.map((product) => {
		return <ProductsListItem key={product.id} product={product} />;
	});

	const maximumPrice = products?.data.reduce((acc, curr) => {
		return Math.max(acc,curr.attributes.price);
	},0);

	return (
		<div className="flex gap-4 flex-col-reverse lg:flex-row items-start">
			<FilterPanel
				subCats={subCats}
				onSubCatsChange={handleSubCatsChange}
				showPanel={showPanel}
				setShowFilterPanel={setShowFilterPanel}
				maximumPrice={maximumPrice}
				setPriceRange={setPriceRange}
				setPriceOrder={setPriceOrder}
				setRatings={setRatings}
			/>

			<div className="px-2">
				<section className=" bg-fuchsia-300 mx-auto rounded-lg overflow-hidden">
					<Slider className={"max-h-52"} />
				</section>
				<section className="mx-auto">
					<h2 className="my-6 flex justify-between items-center">
						<span className="text-2xl font-medium">Trending {name} For You</span>
						{/* FilterPanel Toggler */}
						<Button className="bg-rose-100/50 lg:hidden py-1 px-3.5 rounded-3xl gap-1" onClick={() => setShowFilterPanel(true)}>
							<GoFilter/>
							<span>Filter</span>
						</Button>
					</h2>
					{/* render the filtered data here */}
					<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
						{isLoading ? (
							<Skeleton times={4} className={"h-44 md:h-52 m-2 rounded-md"} />
						) : (
							renderCategoryProducts
						)}
						{error && "Error loading category products"}
					</div>
				</section>
			</div>
		</div>
	);
}

export default CategoriesPage;