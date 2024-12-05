import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
    countCartItems,
    totalCartPrice,
    totalCartPriceAfterDiscount
} from '~/redux/selector/cartSelector';
import { WrapperCartScroll } from '../Menu/style';
import { formatVND } from '~/utils/formatVND';
import { cartActions } from '~/redux/slice/cartSlice';
import imageCartNotFound from '~/assets/images/Image_Cart_Not_Found.png';

const Cart = () => {
    const carts = useSelector((state) => state.cart.carts);
    const countCarts = useSelector(countCartItems);
    const cartTotal = useSelector(totalCartPrice);
    const cartTotalAfterSale = useSelector(totalCartPriceAfterDiscount);

    const [shipping, setShipping] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Xử lý tiền vận chuyển
    useEffect(() => {
        const cartShipping = Number(cartTotalAfterSale);
        if (cartShipping < 500000) {
            setShipping(60000);
            setTotalAmount(cartShipping + 60000);
        } else if (cartShipping >= 500000 && cartShipping < 1000000) {
            setShipping(30000);
            setTotalAmount(cartShipping + 30000);
        } else if (cartShipping >= 1000000 && cartShipping < 2000000) {
            setShipping(15000);
            setTotalAmount(cartShipping + 15000);
        } else {
            setShipping(0);
            setTotalAmount(cartShipping);
        }
    }, [cartTotalAfterSale]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = (id) => {
        dispatch(cartActions.removeFromCart(id));
    };

    const onIncrease = (cart) => {
        dispatch(cartActions.setQuantity({ id: cart.id, quantity: cart.quantity + 1 }));
    };

    const onDecrease = (cart) => {
        if (cart.quantity === 1) {
            handleDelete(cart.id);
            return;
        }
        dispatch(cartActions.setQuantity({ id: cart.id, quantity: cart.quantity - 1 }));
    };

    const handleGotoPayment = () => {
        navigate('/payment');
    };

    const handleGoToMenu = () => {
        navigate('/menu');
    };

    // Cuộn lên đầu trang khi chuyển qua trang khác
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className='flex justify-center py-10'>
            {countCarts && countCarts > 0 ? (
                <div className='w-[60%] bg-white py-10 px-5 rounded-xl shadow-lg'>
                    <div className='flex items-center justify-between px-5 py-10 mb-6 text-4xl'>
                        <span className='font-bold uppercase'>Giỏ hàng của bạn</span>
                        <div className='flex items-center gap-2 text-3xl'>
                            <span>{countCarts}</span>
                            <span>phụ tùng</span>
                        </div>
                    </div>
                    <WrapperCartScroll className='flex flex-col gap-10 px-5'>
                        {carts &&
                            carts.length > 0 &&
                            carts.map((cart) => {
                                return (
                                    <div key={cart.id}>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-10'>
                                                <div className='flex items-center justify-center'>
                                                    {cart.sale > 0 ? (
                                                        <Badge.Ribbon
                                                            text={`Giảm giá ${cart.sale}%`}
                                                            color='red'
                                                        >
                                                            <img
                                                                loading='lazy'
                                                                src={
                                                                    cart.part_image
                                                                        ? `/minio${cart.part_image}`
                                                                        : 'https://placehold.co/256x256'
                                                                }
                                                                alt='#Ảnh linh kiện'
                                                                className='rounded-2xl size-64'
                                                            />
                                                        </Badge.Ribbon>
                                                    ) : (
                                                        <div>
                                                            <img
                                                                loading='lazy'
                                                                src={
                                                                    cart.part_image
                                                                        ? `/minio${cart.part_image}`
                                                                        : 'https://placehold.co/256x256'
                                                                }
                                                                alt='#Ảnh linh kiện'
                                                                className='rounded-2xl size-64'
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex flex-col gap-14'>
                                                    <span className='text-2xl font-bold text-[#6699BB]'>
                                                        {cart.part_name}
                                                    </span>
                                                    <span
                                                        className='text-2xl font-bold text-red-500 cursor-pointer hover:text-red-700'
                                                        onClick={() => handleDelete(cart.id)}
                                                    >
                                                        Xóa
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col items-end gap-8 mt-2'>
                                                <div className='flex flex-col gap-2'>
                                                    {cart.sale > 0 ? (
                                                        <div className='flex gap-5'>
                                                            <span className='text-2xl'>
                                                                {formatVND(
                                                                    cart.part_price *
                                                                        (1 - cart.sale / 100)
                                                                )}{' '}
                                                                VNĐ
                                                            </span>
                                                            <span className='text-2xl text-gray-400 line-through'>
                                                                {formatVND(cart.part_price)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className='text-2xl'>
                                                            {formatVND(cart.part_price)} VNĐ
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='flex select-none'>
                                                    <div
                                                        className='cursor-pointer w-[40px] h-[40px] text-xl flex items-center justify-center border border-solid border-gray-200 hover:bg-neutral-100 transition-all ease-out'
                                                        onClick={() => onDecrease(cart)}
                                                    >
                                                        <MinusOutlined />
                                                    </div>
                                                    <div className='w-[40px] h-[40px] text-2xl border-t border-b border-solid border-gray-200'>
                                                        <input
                                                            value={cart.quantity}
                                                            readOnly
                                                            className='w-full h-full text-center outline-none'
                                                        />
                                                    </div>
                                                    <div
                                                        className='cursor-pointer w-[40px] h-[40px] text-xl flex items-center justify-center border border-solid border-gray-200 hover:bg-neutral-100 transition-all ease-out'
                                                        onClick={() => onIncrease(cart)}
                                                    >
                                                        <PlusOutlined />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </WrapperCartScroll>
                    <div className='text-2xl font-[400] flex flex-col justify-end gap-4 px-5 mt-5'>
                        <div className='flex items-center justify-between'>
                            <span>Tổng</span>
                            <span>{formatVND(cartTotal)} VNĐ</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>Giảm khuyến mãi</span>
                            <span>{formatVND(cartTotal - cartTotalAfterSale)} VNĐ</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>Phí vận chuyển </span>
                            <span>{formatVND(shipping)} VNĐ</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>Thành tiền</span>
                            <span>{formatVND(totalAmount)} VNĐ</span>
                        </div>
                        <div
                            className='py-3 text-center text-white bg-black rounded-lg cursor-pointer hover:bg-[#6699BB]'
                            onClick={handleGotoPayment}
                        >
                            Thanh toán
                        </div>
                    </div>
                </div>
            ) : (
                <div className='h-[400px]'>
                    <div className='flex flex-col items-center w-full h-full py-10'>
                        <img
                            loading='lazy'
                            src={imageCartNotFound}
                            alt='#Notfound'
                            className='h-full'
                        />
                        <div
                            className='px-3 py-5 text-2xl font-bold hover:text-[#6699BB] cursor-pointer'
                            onClick={handleGoToMenu}
                        >
                            Tiếp tục chọn sản phẩm
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
