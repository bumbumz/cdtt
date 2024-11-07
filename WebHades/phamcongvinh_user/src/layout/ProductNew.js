import React, { useEffect, useState } from 'react';
import { ProductSaleService } from '../Api';
import { Link } from 'react-router-dom';

function ProductNew() {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 4; 
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (offset) => {
        setLoading(true); 
        try {
            const response = await ProductSaleService.getNew(offset);
            setProducts((prevProducts) => [...prevProducts, ...response.products]);
            setHasMore(response.hasMore); 
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(offset); 
    }, [offset]);

    const loadMore = () => {
        if (!loading && hasMore) { 
            setOffset((prev) => prev + limit);
        }
    };

    return (
        <div className='grid'>
            <h1 className="text-2xl font-bold my-10 mx-5 place-self-center md:place-self-start">
                {products.length === 0 ? "" : "Product New"}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product, index) => (
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
                                alt={product.name}
                            />
                            <img
                                className="transition-opacity duration-500 w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                                src={product.thumbnail}
                                alt={`${product.name} On Hover`}
                            />
                        </div>

                        <div className="mt-2 text-center">
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className='flex place-content-between px-5'>
                                <p className="text-gray-600">{product.pricebuy}$</p>
                             
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {hasMore && !loading && ( 
                <button onClick={loadMore} className="mt-4 border border-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200">  
                Xem thêm  
            </button>
            )}
            {loading && (
                <div className="mt-4 text-center">Đang tải...</div>
            )}
        </div>
    );
}

export default ProductNew;
