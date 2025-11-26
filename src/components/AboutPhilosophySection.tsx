import Image from 'next/image';
import Container from '@/components/Container';
import ProfileImage from '../assets/about/avatar.webp'; 
import PhilosophyBackground from './PhilosophyBackground';
import AnimatedProfileImage from './AnimatedProfileImage';
export default function AboutPhilosophySection() {

  return (
    <section
      id="philosophy"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--to-linear)]"
    >
      {/* LỚP 1: NỀN (HIỆU ỨNG SCROLL TEXT) */}
      <PhilosophyBackground />
      {/* LỚP 2: NỘI DUNG (ẢNH & TRIẾT LÝ) */}
      <Container className="relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          
          {/* CỘT TRÁI (Ảnh) */}
          <div className="md:col-span-2 flex justify-center items-center py-8 md:py-0"> {/* Thêm padding y để cân đối nếu cần */}
            {/* CONTAINER BAO GỒM ẢNH VÀ KHUNG LỆCH */}
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
              {/* KHUNG LỆCH (Nằm phía sau ảnh) */}
              <div
                className="absolute bg-transparent border-2 border-[var(--foreground)]"
                style={{
                  width: '100%',     // Kích thước của khung lệch so với container
                  height: '100%',    // Chiều cao tương đương ảnh
                  top: '-25px',      // Dịch lên trên một chút
                  left: '35px',      // Dịch sang phải một chút
                  zIndex: 0,         // Đảm bảo nó nằm phía sau ảnh chính
                }}
              ></div>

              {/* ẢNH CHÍNH (Nằm phía trước khung lệch) */}
              <div className="relative z-10"> {/* Đảm bảo ảnh nằm trên khung lệch */}
              <AnimatedProfileImage>
                        {/* Component <Image> này vẫn được render trên SERVER
                          và được "truyền" vào <AnimatedProfileImage> như một prop 'children'
                        */}
                        <Image
                          src={ProfileImage}
                          alt="Chân dung Oni, nhiếp ảnh gia Oni Studio"
                          width={600}
                          height={800}
                          className="object-cover aspect-[3/4] w-full " 
                          placeholder="blur"
                        />
                </AnimatedProfileImage>
              </div>
            </div>
          </div>
        
          {/* CỘT PHẢI (Text) */}
          <div className="md:col-span-3">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-[var(--foreground)]">
              Triết Lý Của Tôi
            </h2>
            <div className="text-lg md:text-xl space-y-6">
            <p className="leading-relaxed text-[var(--foreground)]">
              <strong>Ánh sáng</strong> là nền tảng của công việc. Niềm say mê bất tận nằm ở việc khai thác 
              cách ánh sáng <strong>điêu khắc</strong>, làm nổi bật, và <strong>tôn vinh</strong> một chủ thể. 
              Đó vừa là công cụ, là <strong>ngôn ngữ</strong>, vừa là <strong>nguồn cảm hứng chính</strong>.
            </p>

            <p className="leading-relaxed text-[var(--foreground)]">
              Tôi tin rằng một bức ảnh thành công là sự <strong>giao thoa hài hòa</strong> giữa <strong>tầm nhìn nghệ thuật</strong> và <strong>kỹ thuật chính xác</strong>. 
              Từ dự án thương mại phức tạp đến một bức chân dung tối giản, mục tiêu luôn là 
              sự <strong>chỉn chu trong từng chi tiết</strong>, mang lại giá trị vượt trên cả mong đợi.
            </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}