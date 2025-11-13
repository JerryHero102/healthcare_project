const Profile_U = ({ userData }) => {
    const defaultData = {
        full_name: "Trần Văn Nam",
        date_of_birth: "1998-05-22",
        phone_number: "0987654321",
        email: "nam.tv@example.com",
        card_id: "123456789012",
        permanent_address: "456 Đường A, Quận B, TP HCM",
        current_address: "456 Đường Lê Lợi, Quận 1, TP HCM"
    };

    const data = userData || defaultData;

    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100">
            <p className="font-medium text-gray-600">{label}:</p>
            <p className="text-right font-semibold text-gray-800">{value}</p>
        </div>
    );

    return (
        <div className="p-8 bg-[#f5f5f5] h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">Thông tin Cá nhân</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">

                <div className="flex flex-col space-y-1">
                    <DetailRow label="Họ và tên" value={data.full_name} />
                    <DetailRow label="Ngày sinh" value={data.date_of_birth} />
                    <DetailRow label="Số điện thoại" value={data.phone_number} />
                    <DetailRow label="Email" value={data.email || "Chưa cập nhật"} />
                    <DetailRow label="Số CCCD/CMND" value={data.card_id} />
                    <DetailRow label="Địa chỉ thường trú" value={data.permanent_address} />
                    <DetailRow label="Địa chỉ hiện tại" value={data.current_address} />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Chỉnh Sửa</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Đăng Xuất</button>
                </div>
            </div>
        </div>
    );
};

export default Profile_U;
