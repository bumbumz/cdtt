import React, { useEffect, useState } from 'react'
import { ProductService } from '../Api';
import { Link } from 'react-router-dom';

function Tops() {
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetch = () => {
        if (!data || !hasMore) return;


        ProductService.getProductsByCategoryId(1, offset)
            .then(response => {
                console.log('Response from API:', response); // In ra phản hồi
                if (response) {
                    setData(prevData => [...prevData, ...response.products]);
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
        fetch();
    }, []);
    console.log("daata", data)

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {data.map((product, index) => (
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
                                <p className="text-gray-600">{product.product_sale}$</p>
                                <p className="text-gray-600 line-through">{product.pricebuy}$</p>
                            </div>
                        </div>
                    </Link>
                ))}

            </div>
            <div className='grid'>
                {hasMore && (
                    <button onClick={fetch} className="mt-4 border border-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
                        Xem thêm
                    </button>
                )}
            </div>
        </div>
    )
}


export default Tops
