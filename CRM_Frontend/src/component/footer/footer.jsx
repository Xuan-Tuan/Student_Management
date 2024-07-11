import { memo } from "react";

export default memo(function Footer() {
  return (
    <div>
      <footer className="bg-uit pb-2 pt-1 text-white flex  justify-between text-xs lg:text-sm fixed bottom-0 left-0 right-0 h-[50px]">
        <div className="flex justify-between text-center">
          <div className="border-r-2 uppercase pr-6 mr-6">
            Hệ thống <br />
            quản lý sinh viên
          </div>
          <div className="flex flex-col items-center">
            <div>Mọi thắc mắc, tư vấn vấn và sự cố kỹ thuật</div>
            <div>vui lòng xem thông tin liên hệ</div>
          </div>
        </div>
        <div className="flex justify-between px-8">
          <div className="pr-4">Thông tin liên hệ</div>
          <div className="flex flex-col justify-start">
            Phone: 1900 1009 9100 <br /> Email: fiveterabyte@gmail.com
          </div>
        </div>
      </footer>
    </div>
  );
});
