import React, { useEffect, useState } from 'react';
import { BrandService, CateService, ProductService } from '../Api';
import { Link } from 'react-router-dom';

function ProductAll() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Lưu tất cả sản phẩm
    const [cate, setCate] = useState([]);
    const [brand, setBrand] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    useEffect(() => {
        const fetchCatename = async () => {
            try {
                const response = await CateService.getList();
                setCate(response.categorys);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const fetchBrandname = async () => {
            try {
                const response = await BrandService.getList();
                setBrand(response.brands);
            } catch (err) {
                console.error("Error fetching brands:", err);
            }
        };

        fetchCatename();
        fetchBrandname();
    }, []);

    const fetchProducts = async () => {
        ProductService.getNew(offset)
            .then(response => {
                if (response) {
                    setAllProducts(prevData => [...prevData, ...response.products]);
                    setProducts(prevData => [...prevData, ...response.products]); // Lưu sản phẩm vào cả hai state
                    setHasMore(response.hasMore);
                    setOffset(prevOffset => prevOffset + 4);
                } else {
                    console.error("Invalid response format:", response);
                    setHasMore(false);
                }
            })
            .catch(error => {
                console.error("Get related products error:", error);
                setHasMore(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCategoryChange = (id) => {
        setSelectedCategories(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleBrandChange = (id) => {
        setSelectedBrands(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    // Lọc sản phẩm dựa trên các điều kiện
    const filteredProducts = allProducts.filter(product => {
        const isCategorySelected = selectedCategories.size === 0 || selectedCategories.has(product.category_id);
        const isBrandSelected = selectedBrands.size === 0 || selectedBrands.has(product.brand_id);
        const isPriceInRange = product.pricebuy >= minPrice && product.pricebuy <= maxPrice;

        return isCategorySelected && isBrandSelected && isPriceInRange;
    });

    return (
        <div className="flex font-sans">
            {/* Left section - Categories, Brands, and price range filter */}
            <div className="w-1/6 p-4">
                <h1 className="text-2xl font-bold my-4 text-gray-800">Categories</h1>
                <div className="flex flex-col gap-2">
                    {cate.map((category) => (
                        <div key={category.id} className="flex flex-row gap-2 items-center">
                            <input
                                type="checkbox"
                                checked={selectedCategories.has(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="h-5 w-5"
                            />
                            <label className="text-gray-700 text-lg">{category.name}</label>
                        </div>
                    ))}
                    <div className="flex flex-row gap-2 items-center">
                        <input
                            type="checkbox"
                            checked={selectedCategories.size === 0}
                            onChange={() => {
                                if (selectedCategories.size === 0) {
                                    setSelectedCategories(new Set(cate.map(cat => cat.id)));
                                } else {
                                    setSelectedCategories(new Set());
                                }
                            }}
                            className="h-5 w-5"
                        />
                        <label className="text-gray-700 text-lg">All Products</label>
                    </div>
                </div>

                <h1 className="text-2xl font-bold my-4 text-gray-800">Brands</h1>
                <div className="flex flex-col gap-2">
                    {brand.map((b) => (
                        <div key={b.id} className="flex flex-row gap-2 items-center">
                            <input
                                type="checkbox"
                                checked={selectedBrands.has(b.id)}
                                onChange={() => handleBrandChange(b.id)}
                                className="h-5 w-5"
                            />
                            <label className="text-gray-700 text-lg">{b.name}</label>
                        </div>
                    ))}
                </div>

                {/* Price Range Filter */}
                <h2 className="text-xl font-semibold my-4 text-gray-800">Price Range</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        <label className="text-gray-700">Min Price:</label>
                        <input
                            type="number"
                            min="0"
                            max="10000000"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="border rounded-md p-1 w-24"
                        />
                        <span>VND</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full"
                    />

                    <div className="flex gap-2 items-center">
                        <label className="text-gray-700">Max Price:</label>
                        <input
                            type="number"
                            min="0"
                            max="10000000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="border rounded-md p-1 w-24"
                        />
                        <span>VND</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Right section - Product display */}
            <div className="w-3/4 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to="/detail-product"
                                state={{ product }}
                                className="group border-2 p-2 rounded-md shadow-sm relative block transition-transform transform hover:scale-105"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        className="transition-opacity duration-500 w-full group-hover:opacity-0"
                                        src={product.thumbnail}
                                        alt={product.name}
                                    />
                                    <img
                                        className="transition-opacity duration-500 w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                                        src={product.thumbnail}
                                        alt={`${product.name} On Hover`}
                                    />
                                </div>
                                <div className="mt-3 text-center">
                                    <h3 className="font-semibold text-xl text-gray-900">{product.name}</h3>
                                    <div className="flex justify-between px-5 mt-2">
                                        <p className="text-gray-600 text-lg font-medium">{formatCurrency(product.pricebuy)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-lg text-gray-700">No products available</p>
                    )}
                </div>
                <div className='grid'>
                    {hasMore && (
                        <button onClick={fetchProducts} className="mt-4 border border-black bg-white text-black py-2 px-4 rounded-md hover:bg-black hover:text-white transition duration-300">
                            Load More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductAll;
