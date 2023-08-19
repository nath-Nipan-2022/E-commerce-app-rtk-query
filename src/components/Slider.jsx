import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

function Slider({ images, className }) {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		let timer = setInterval(() => {
			if (currentSlide >= images.length - 1) {
				setCurrentSlide(0);
			} else {
				setCurrentSlide((prev) => prev + 1);
			}
		}, 5000);

		return () => clearInterval(timer);
	}, [currentSlide, images.length]);

	const renderSlides = images.map((slide) => (
		<div
			key={slide.id}
			className={`flex justify-evenly items-center ${className}`}
			style={{ width: 100 / images.length + "%" }}
		>
			<div className="p-2 py-6 md:p-6">
				<h3 className="font-bold text-[4vw] md:text-3xl lg:text-4xl text-slate-700 mb-3 md:mb-6">
					Grab Upto <span className="text-white drop-shadow-lg">50% </span>
					Off <span className="block">On Selected Products</span>
				</h3>
				<Link
					to={"/"}
					className="inline-block rounded-full py-2 px-4 bg-slate-800 text-white text-xs sm:text-base sm:px-6 font-medium hover:bg-slate-700 transition"
				>
					Buy Now
				</Link>
			</div>

			<div className="p-4 lg:p-6 w-32 sm:w-1/4">
				<ProductImage
					className="aspect-auto rounded-2xl shadow-lg"
					url={slide.attributes.url}
					alt={"slider image"}
				/>
			</div>
		</div>
	));

	return (
		<div
			className="flex transition duration-1000"
			style={{
				width: images.length * 100 + "%",
				transform: `translateX(-${currentSlide * (100 / images.length)}%)`,
			}}
		>
			{renderSlides}
		</div>
	);
}
export default Slider;
