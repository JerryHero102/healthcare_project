const Home = () => {
  return (
    <>      
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          HealthCare - Chăm sóc sức khỏe toàn diện
        </h1>
        <p className="text-gray-500 mb-6">
          Vui lòng đăng nhập để sử dụng dịch vụ.
        </p>
        <a
          href="fontend/Login"
          className="px-5 py-2 bg-[#e6b800] text-white rounded-md shadow-md hover:bg-[#cc9a00] transition"
        >
          Đăng nhập ngay
        </a>
      </div>
    </>
  );
};

export default Home;
