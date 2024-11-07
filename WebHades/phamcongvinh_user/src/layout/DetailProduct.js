import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartReducer';
import { CommentService, ProductService, UserService } from '../Api';
import RelatedProducts from './RelatedProducts';

function DetailProduct() {
    const location = useLocation();
    const product = location.state?.product;
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [commet, setComent] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState([]);
    const commentsPerPage = 3;

    const fetchCommet = () => {
        const product_id = product.id;
        CommentService.getList(product_id)
            .then((res) => {
                setComent(res.comments);
                setHasMore(res.comments.length > 0);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const username = (id) => {
        console.log(`User ID: ${id}`);
        UserService.getId(id)
            .then((res) => {
                setUser(res.user);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log("du lieu nguoi binh luan", user);

    const fetch = () => {
        if (!product || !hasMore) return;

        const { category_id: categoryId, id: currentProductId } = product;
        ProductService.getRelatedProducts(categoryId, currentProductId, offset)
            .then(response => {
                if (response) {
                    setData(prevData => [...prevData, ...response.relatedProducts]);
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
        fetchCommet();
    }, [product]);

    if (!product) {
        return <p>Product not found!</p>;
    }

    const handleBuyNow = () => {
        localStorage.clear();
        setMessage('Mua hàng thành công!');
        setIsSuccess(true);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        setMessage('Added to cart successfully!');
        setIsSuccess(true);
        setTimeout(() => setMessage(''), 3000);
    };

    // Xác định chỉ số bắt đầu và kết thúc của bình luận dựa trên trang hiện tại  
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = commet.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(commet.length / commentsPerPage);

    return (
        <div>
            <div className="flex flex-col md:flex-row h-full p-6">
                <div className="order-1 md:order-2 flex justify-center items-center basis-1/2 overflow-hidden">
                    <div className="w-3/4 md:w-1/2">
                        <img className="w-full rounded-lg shadow-lg" src={product.thumbnail} alt={product.name} />
                    </div>
                </div>
                <div className="order-2 md:order-3 basis-1/4 md:py-20 flex flex-col">
                    <h1 className="text-3xl font-bold font-mono">{product.name}</h1>
                    <p className="text-xl text-black mt-2">{product.pricebuy} VND</p>
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <button
                            className="bg-white w-1/2 border-black border-2 text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="bg-black w-1/2 border-black border-2 text-white px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                    {message && (
                        <p className={`mt-2 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
                <div className='flex flex-col justify-center items-center mt-6 md:mt-0'>
                    <div className='flex flex-col items-center'>
                        <h2 className="font-mono text-3xl">THÔNG TIN</h2>
                        <p
                            className="text-gray-700 font-mono text-sm py-2"
                            dangerouslySetInnerHTML={{
                                __html: product.description.replace(/\-/g, '<br />')
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Hiển thị các bình luận */}
            <div className="mt-6">
                <h2 className="font-mono text-2xl mb-4">Bình luận</h2>
                <div className="flex flex-col space-y-4">
                    {commet.length > 0 ? (
                        currentComments.map((comment) => {

                            return (
                                <div key={comment.id} className="flex gap-4 p-4 border border-gray-300 rounded-md">
                                    <img src={comment.image} alt="User avatar" className="w-16" />
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <img
                                                src={comment.thumbnail}
                                                alt="User Thumbnail"
                                                className='w-10 h-10 rounded-full cursor-pointer'
                                            />
                                            <p className="font-bold">{comment.username || "Unknown User"}</p>
                                        </div>
                                        <p className="text-gray-700">{comment.conten}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Sản phẩm chưa được đánh giá từ khách hàng.</p> // Message when there are no comments
                    )}
                </div>

                {/* Nút điều hướng giữa các trang bình luận */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border border-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                    >
                        Trước
                    </button>
                    <span>{`Trang ${currentPage} / ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border border-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                    >
                        Sau
                    </button>
                </div>
            </div>

            <RelatedProducts data={data} />

            <div className='grid'>
                {hasMore && (
                    <button onClick={fetch} className="mt-4 border border-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
                        Xem thêm
                    </button>
                )}
            </div>
        </div>
    );
}

export default DetailProduct;
