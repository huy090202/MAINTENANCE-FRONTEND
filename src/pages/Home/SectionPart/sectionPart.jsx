import { Badge, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { partActions } from '~/redux/slice/partSlice';
import { formatVND } from '~/utils/formatVND';
import PartModalDetail from './partModalDetail';

const SectionPart = () => {
    const parts = useSelector((state) => state.part.parts);
    const dispatch = useDispatch();

    const [partsData, setPartsData] = useState([]);

    // Hiển thị modal chi tiết
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectPart, setSelectPart] = useState(null);

    useEffect(() => {
        dispatch(partActions.fetchParts());
    }, []);

    useEffect(() => {
        if (parts.length > 0) {
            setPartsData(parts.slice(0, 5));
        }
    }, [parts]);

    const showModal = (part) => {
        setSelectPart(part);
        setIsModalVisible(true);
    };

    const handelCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className='flex flex-col gap-10 mb-5 px-28'>
            <h1 className='text-3xl font-bold text-center uppercase'>Phụ tùng thay thế mới</h1>
            <div className='flex items-center justify-around'>
                {partsData &&
                    partsData.map((part) => {
                        return part.sale ? (
                            <Badge.Ribbon text={`Giảm giá ${part.sale}%`} color='red' key={part.id}>
                                <div className='flex flex-col gap-4 px-3 py-5 rounded-lg shadow-xl w-96'>
                                    <div className='flex items-center justify-center'>
                                        <img
                                            src={
                                                part.part_image
                                                    ? `/minio${part.part_image}`
                                                    : 'https://placehold.co/384x384'
                                            }
                                            alt='#Ảnh linh kiện'
                                            className='rounded-lg size-80'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-5 my-5'>
                                        <span className='overflow-hidden text-2xl font-bold text-ellipsis whitespace-nowrap'>
                                            {part.part_name}
                                        </span>
                                        <span className='text-2xl'>
                                            <span className='font-bold'>Giá: </span>
                                            <span>{formatVND(part.part_price)} VNĐ</span>
                                        </span>
                                        <span className='text-2xl'>
                                            <span className='font-bold'>Tuổi thọ trung bình: </span>
                                            <span>{part.average_life} tháng</span>
                                        </span>
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <Button
                                            type='light'
                                            className='h-12 text-2xl text-right bg-[#295255] hover:bg-[#577877] text-white'
                                            style={{
                                                fontFamily: 'LXGW WenKai TC',
                                                cursive: 'LXGW Wen'
                                            }}
                                            onClick={() => showModal(part)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </Badge.Ribbon>
                        ) : (
                            <div
                                className='flex flex-col gap-4 px-3 py-5 rounded-lg shadow-xl w-96'
                                key={part.id}
                            >
                                <div className='flex items-center justify-center'>
                                    <img
                                        loading='lazy'
                                        src={
                                            part.part_image
                                                ? `/minio${part.part_image}`
                                                : 'https://placehold.co/384x384'
                                        }
                                        alt='#Ảnh linh kiện'
                                        className='rounded-lg size-80'
                                    />
                                </div>
                                <div className='flex flex-col gap-5 my-5'>
                                    <span className='overflow-hidden text-2xl font-bold text-ellipsis whitespace-nowrap'>
                                        {part.part_name}
                                    </span>
                                    <span className='text-2xl'>
                                        <span className='font-bold'>Giá: </span>
                                        <span>{formatVND(part.part_price)} VNĐ</span>
                                    </span>
                                    <span className='text-2xl'>
                                        <span className='font-bold'>Tuổi thọ trung bình: </span>
                                        <span>{part.average_life} tháng</span>
                                    </span>
                                </div>
                                <div className='flex justify-end w-full'>
                                    <Button
                                        type='light'
                                        className='h-12 text-2xl text-right bg-[#295255] hover:bg-[#577877] text-white'
                                        style={{
                                            fontFamily: 'LXGW WenKai TC',
                                            cursive: 'LXGW Wen'
                                        }}
                                        onClick={() => showModal(part)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className='flex justify-center'>
                <Button
                    type='light'
                    className='h-16 text-2xl text-right bg-[#bf1717] hover:bg-[#e84444] text-white'
                    style={{
                        fontFamily: 'LXGW WenKai TC',
                        cursive: 'LXGW Wen'
                    }}
                >
                    Xem thêm
                </Button>
            </div>
            <PartModalDetail
                isVisible={isModalVisible}
                onCancel={handelCancel}
                selectPart={selectPart}
            />
        </div>
    );
};

export default SectionPart;