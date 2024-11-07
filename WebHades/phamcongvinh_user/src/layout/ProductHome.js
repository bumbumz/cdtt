import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewArrivals from './NewArrivals';
import ProductSale from './ProductSale';
import ProductNew from './ProductNew';
import ProductBestSeal from './ProductBestSeal';
import FilterNavbar from './FilterNavbar';
import { ProductService } from '../Api';
import CateProduct from './CateProduct';
import CateProductView from './CateProductView';
import PostHome from './PostHome';
import ContactUs from './ContactUs';

function ProductHome() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        sortOption: '',
        priceRange: { min: '', max: '' },
        searchTerm: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getList();
            setProducts(response.products);
            setFilteredProducts(response.products); // Set initial filtered products
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Apply filters whenever filterOptions or products change


    const applyFilters = () => {
        let updatedProducts = [...products];

        if (filterOptions.searchTerm) {
            const searchTermLower = filterOptions.searchTerm.toLowerCase(); // Chuyển đổi thành chữ thường
            updatedProducts = updatedProducts.filter((product) =>
                product.name?.toLowerCase().includes(searchTermLower) // Kiểm tra sự tồn tại của chuỗi tìm kiếm trong tên sản phẩm
            );
        }

        // Bộ lọc theo giá
        const { min, max } = filterOptions.priceRange;
        if (min) {
            updatedProducts = updatedProducts.filter((product) => product.pricebuy >= parseFloat(min));
        }
        if (max) {
            updatedProducts = updatedProducts.filter((product) => product.pricebuy <= parseFloat(max));
        }

        // Sắp xếp theo tùy chọn
        if (filterOptions.sortOption) {
            updatedProducts.sort((a, b) => {
                switch (filterOptions.sortOption) {
                    case 'name-asc':
                        return (a.name || '').localeCompare(b.name || '');
                    case 'name-desc':
                        return (b.name || '').localeCompare(a.name || '');
                    case 'price-asc':
                        return a.pricebuy - b.pricebuy;
                    case 'price-desc':
                        return b.pricebuy - a.pricebuy;
                    default:
                        return 0;
                }
            });
        }

        setFilteredProducts(updatedProducts);
        setCurrentPage(1); // Đặt lại trang hiện tại sau khi áp dụng bộ lọc
    };



    const handleFilterChange = (options) => {
        setFilterOptions(options);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    useEffect(() => {
        applyFilters();
    }, [filterOptions, products]);
    return (
        <div>
            <NewArrivals />
            <PostHome />
            <ProductSale />
            <ProductNew />
            <ProductBestSeal />
            <h1 className="text-2xl font-bold my-10 mx-5 place-self-center md:place-self-start">
                Product filter
            </h1>
            <FilterNavbar
                onFilterChange={handleFilterChange}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <div className="grid">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentItems.map((product, index) => (
                        <Link
                            key={`${product.id}-${index}`}
                            to="/detail-product"
                            state={{ product }}
                            className="group border-2 p-2 relative block"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    className="transition-opacity duration-500 w-full group-hover:opacity-0"
                                    src={product.thumbnail}
                                    alt={product.product_name}
                                />
                                <img
                                    className="transition-opacity duration-500 w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                                    src={product.thumbnail}
                                    alt={`${product.product_name} On Hover`}
                                />
                            </div>
                            <div className="mt-2 text-center">
                                <h3 className="font-semibold">{product.name}</h3>
                                <div className="flex place-content-between px-5">

                                    <p className="text-gray-600">{product.pricebuy}$</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <CateProductView />
            <ContactUs/>

        </div>
    );
}

export default ProductHome;
