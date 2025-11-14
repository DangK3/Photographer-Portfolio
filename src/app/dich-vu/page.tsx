// app/dich-vu/page.tsx
'use client'; // Bắt buộc vì dùng state và hooks

import React, { useState, useEffect, useRef } from 'react';
import Container from '@/components/Container';
import styles from '../styles/DichVu.module.css';
import Image from 'next/image';
import BtsSection from '@/components/BtsSection';
// ROOM IMAGES
import room_A_img from '../../assets/service/section_01/room_A.webp';
import room_B_img from '../../assets/service/section_01/room_B.webp';
import room_C_img from '../../assets/service/section_01/room_C.webp';
import room_D_img from '../../assets/service/section_01/room_D.webp';

// DEVICE IMAGES
import img_godox_dp600 from '../../assets/service/section_02/GODOX-DP600III-V.webp';
import img_godox_dp400 from '../../assets/service/section_02/GODOX-GD-DP400II-V.webp';
import img_godox_qt400 from '../../assets/service/section_02/GODOX-QT400IIIM.webp';
import img_godox_qt600 from '../../assets/service/section_02/GODOX-QT600II.webp';
import img_godox_qs400 from '../../assets/service/section_02/GODOX-QS-400.webp';
import img_godox_qs800 from '../../assets/service/section_02/GODOX-QS-800.webp';
import img_godox_qs1200 from '../../assets/service/section_02/GODOX-QS-1200.webp';
import img_amaran_300c from '../../assets/service/section_02/aputure-amaran-300c.webp';
import img_devices from '../../assets/service/section_02/devices.webp';

// MODIFIER IMAGES
import img_QR_p60t from '../../assets/service/section_02/GODOX-QR-P60T.webp';
import img_QR_p90 from '../../assets/service/section_02/GODOX-QR-P90.webp';
import img_QR_P120 from '../../assets/service/section_02/GODOX-QR-P120.webp';
import img_QR_P150t from '../../assets/service/section_02/GODOX-QR-P150t.webp';

// 1. ĐỊNH NGHĨA CÁC MỤC (Sections) - (Giữ nguyên, đã đúng)
const sections = [
  { id: 'bao-gia', title: 'Báo Giá Phòng', contentId: 'section-01' },
  { id: 'thiet-bi-mien-phi', title: 'Thiết Bị Đi Kèm', contentId: 'section-02' },
  { id: 'thiet-bi-thue-them', title: 'Thiết Bị Thuê Thêm', contentId: 'section-03' },
  { id: 'quy-dinh', title: 'Lưu Ý & Quy Định', contentId: 'section-04' },
];

// 2. COMPONENT "SCENE" (Giữ nguyên)
interface SceneProps {
  children: React.ReactNode;
  id: string;
  onVisible: (id: string) => void;
}

const Scene: React.FC<SceneProps> = ({ children, id, onVisible }) => {
  const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onVisible(id); // Báo cho component cha biết mục này đang active
        }
      },
      {
        rootMargin: '-50% 0px 0% 0px',

        /*
          - threshold: 0
            Chỉ cần 1 pixel (bất kỳ phần nào) của section
            chạm vào vùng đệm trên là sẽ kích hoạt.
        */
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [id, onVisible]);

  return (
    <div ref={ref} id={id} className={styles.sceneContent}>
      {children}
    </div>
  );
};

// 3. COMPONENT TRANG CHÍNH
export default function DichVuPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  
  // Dữ liệu cho Section 02 (Miễn Phí)
  const strobes = [
    { name: 'Godox DP400', img: img_godox_dp400 },
    { name: 'Godox DP600', img: img_godox_dp600 },
    { name: 'Godox QT400', img: img_godox_qt400 },
    { name: 'Godox QT600', img: img_godox_qt600 },
    { name: 'Godox QS400', img: img_godox_qs400 },
    { name: 'Godox QS800', img: img_godox_qs800 },
    { name: 'Godox QS1200', img: img_godox_qs1200 },
    { name: 'Aputure Amaran 300C', img: img_amaran_300c },

  ];

  const modifiers = [
    { name: 'Godox QR P60T', img: img_QR_p60t },
    { name: 'Godox QR P90', img: img_QR_p90 },
    { name: 'Godox QR P120', img: img_QR_P120 },
    { name: 'Godox QR P150T', img: img_QR_P150t },
  ];

  const rentalItems = [
    { name: 'Nanlite FS300B', price: '300k/đèn', note: '(có sẵn 2 đèn)' },
    { name: 'Nanlite FS200B', price: '200k/đèn', note: '(có sẵn 3 đèn)' },
    { name: 'Tolifo 1800W-Bi', price: '400k/đèn', note: '(có sẵn 1 đèn)' },
    { name: 'Nanlite FS150', price: '150k/đèn', note: '(có sẵn 1 đèn)' },
    { name: 'Nanlite Forza 60', price: '50k/đèn', note: '(có sẵn 2 đèn)' },
    { name: 'Tether (dây)', price: '75k/dây' },
    { name: 'iMac 27" 5k', price: '250k/buổi' },
    { name: 'Màn Dell 25"', price: '150k/buổi' },
    { name: 'Phông vải/xanh key (6x6.4m)', price: '200k' },
  ];

  const paperColors = [
    { name: '44 Jet', hex: '#1f1f1f' },
    { name: '04 Neutral Grey', hex: '#7c7f7e' },
    { name: '42 Morning Mist', hex: '#d9dadb' },
    { name: '01 Deep Blue', hex: '#35475e' },
    { name: '41 Marine Blue', hex: '#69819d' },
    { name: '61 Blue Lake', hex: '#4c7da6' },
    { name: '06 Nassau', hex: '#008bc0' },
    { name: '59 Lite Blue', hex: '#70c5d5' },
    { name: '55 Alpine', hex: '#b3d8d6' },
    { name: '67 Nutmeg', hex: '#8e6f5c' },
    { name: '33 Ivorine', hex: '#e5d9bb' },
    { name: '13 Deep Green', hex: '#1e4a42' },
    { name: '10 Leaf', hex: '#485f39' },
    { name: '54 Stinger', hex: '#78a34b' },
    { name: '63 Apple', hex: '#b7d296' },
    { name: '14 Forsythia Yellow', hex: '#f3c421' },
    { name: '83 Yellow-Orange', hex: '#f5822e' },
    { name: '27 Flame', hex: '#d44a3b' },
    { name: '56 Scarlet', hex: '#ba2429' },
    { name: '10 Bright Orange', hex: '#f3642c' },
    { name: '29 Thistle', hex: '#d6a9b9' },
    { name: '17 Carnation Pink', hex: '#f093a5' },
  ];

  // Mảng 2: Phông Vải Trơn
  const fabricColorsPlain = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Đỏ', hex: '#cc3333' },
    { name: 'Xanh', hex: '#006633' },
  ];
  
  // Mảng 3: Phông Vải Loang
  const fabricColorsPatterned = [
    { name: 'Nâu Loang', hex: '#8c7a65' },
    { name: 'Xám Sáng Loang', hex: '#c1c1c1' },
    { name: 'Xám Tối Loang', hex: '#6e6e6e' },
  ];
  
  // Mảng 4: Thảm Nỉ
  const carpetColors = [
    { name: 'Đỏ Đô', hex: '#800000' },
    { name: 'Xanh Navy', hex: '#000080' },
  ];
  return (
    <main>
      <Container className="py-16 md:py-24">
        {/* Tiêu đề chung của trang */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
            Dịch Vụ & Báo Giá
          </h1>
          <p className="text-lg mt-4 text-[var(--sub-text)]">
            Tất cả thông tin về các gói thuê và thiết bị tại studio.
          </p>
        </div>

        {/* BỐ CỤC 2 CỘT */}
        <div className={styles.stickyLayout}>
          {/* CỘT 1: MENU (DÍNH LẠI) */}
          <nav className={styles.stickyNav}>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={activeId === section.id ? styles.active : ''}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CỘT 2: NỘI DUNG (CUỘN) */}
          <main className={styles.contentColumn}>
            {/* === MỤC 01: BÁO GIÁ PHÒNG === */}
            <Scene id="bao-gia" onVisible={setActiveId}>
              <h2 className={styles.contentTitle}>Báo Giá Thuê Phòng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                
                {/* --- THẺ 1: ROOM A --- */}
                <div className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                  <div className="relative w-full h-72">
                    <Image
                      src={room_A_img}
                      alt="Không gian phòng studio A"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                      placeholder="blur"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold mb-4">Room A</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">300k</span>
                      <span className="text-lg text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70 -mt-1">
                        (Áp dụng cho lịch book từ 2 tiếng)
                      </p>
                    </div>
                    <div className="mb-5 p-3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                      <span className="text-2xl font-bold">350k</span>
                      <span className="text-base text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70">
                        (Cho lịch book dưới 2 tiếng)
                      </p>
                    </div>
                    <ul className="space-y-1 text-sm list-disc list-inside mt-auto">
                      <li>60m²</li>
                      <li>(D8,5 x R5,8 x C4,3)</li>
                    </ul>
                  </div>
                </div>

                {/* --- THẺ 2: ROOM B --- */}
                <div className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                  <div className="relative w-full h-72">
                    <Image
                      src={room_B_img}
                      alt="Không gian phòng studio B"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                      placeholder="blur" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold mb-4">Room B</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">300k</span>
                      <span className="text-lg text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70 -mt-1">
                        (Áp dụng cho lịch book từ 2 tiếng)
                      </p>
                    </div>
                    <div className="mb-5 p-3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                      <span className="text-2xl font-bold">350k</span>
                      <span className="text-base text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70">
                        (Cho lịch book dưới 2 tiếng)
                      </p>
                    </div>
                    <ul className="space-y-1 text-sm list-disc list-inside mt-auto">
                      <li>65m²</li>
                      <li>(D9 x R3,7 x C3,8)</li>
                    </ul>
                  </div>
                </div>

                {/* --- THẺ 3: ROOM C --- */}
                <div className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                  <div className="relative w-full h-72">
                    <Image
                      src={room_C_img}
                      alt="Không gian phòng studio C"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                      placeholder="blur" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold mb-4">Room C</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">300k</span>
                      <span className="text-lg text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70 -mt-1">
                        (Áp dụng cho lịch book từ 2 tiếng)
                      </p>
                    </div>
                    <div className="mb-5 p-3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                      <span className="text-2xl font-bold">350k</span>
                      <span className="text-base text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70">
                        (Cho lịch book dưới 2 tiếng)
                      </p>
                    </div>
                    <ul className="space-y-1 text-sm list-disc list-inside mt-auto">
                      <li>60m²</li>
                      <li>(D8,6 x R6 x C3,9)</li>
                    </ul>
                  </div>
                </div>

                {/* --- THẺ 4: ROOM D --- */}
                <div className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                  <div className="relative w-full h-72">
                    <Image
                      src={room_D_img}
                      alt="Không gian phòng studio D"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                      placeholder="blur"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold mb-4">Room D</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">280k</span>
                      <span className="text-lg text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70 -mt-1">
                        (Áp dụng cho lịch book từ 2 tiếng)
                      </p>
                    </div>
                    <div className="mb-5 p-3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                      <span className="text-2xl font-bold">320k</span>
                      <span className="text-base text-[var(--foreground)]/70">/giờ</span>
                      <p className="text-sm text-[var(--foreground)]/70">
                        (Cho lịch book dưới 2 tiếng)
                      </p>
                    </div>
                    <ul className="space-y-1 text-sm list-disc list-inside mt-auto">
                      <li>45m²</li>
                      <li>(D8,2 x R4,6 x C3,3)</li>
                    </ul>
                  </div>
                </div>
              </div> 
              
              <div className="mt-8">
                <div className="p-4 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                  <p className="font-semibold text-center text-sm">
                    * Phụ thu 50k/h nếu có sử dụng đèn LED (đèn quay phim).
                  </p>
                </div>
              </div>
            </Scene>


            <Scene id="thiet-bi-mien-phi" onVisible={setActiveId}>
              <h2 className={styles.contentTitle}>Thiết Bị Đi Kèm (Miễn Phí)</h2>

              {/* 1. ẢNH HERO "WOW FACTOR" */}
              <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-12 border border-[var(--foreground)]/30">
                <Image
                  src={img_devices}
                  alt="Toàn bộ thiết bị tại Oni Studio"
                  fill
                  className="object-cover hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 70vw"
                  placeholder="blur"
                />
                <div className="absolute inset-0" />
              </div>

              {/* 2. GRID ĐÈN STUDIO */}
              <h3 className="text-2xl font-semibold mb-6">Đèn Godox</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {strobes.map((item) => (
                  <div key={item.name} className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                    <div className="relative w-full h-40 bg-white">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-2"
                        placeholder="blur"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-[var(--foreground)]/70 mb-12">
                (Hỗ trợ setup tối đa 4 đèn flash)
              </p>

              {/* 3. GRID TẢN SÁNG */}
              <h3 className="text-2xl font-semibold mb-6">Tản Sáng</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {modifiers.map((item) => (
                  <div key={item.name} className="border border-[var(--foreground)]/30 rounded-lg overflow-hidden bg-[var(--background)] flex flex-col">
                    <div className="relative w-full h-40 bg-white">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-2"
                        placeholder="blur"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. PHÔNG NỀN & PHỤ KIỆN */}
              <h3 className="text-2xl font-semibold mb-6">Phông Nền & Phụ Kiện</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                
                {/* --- CỘT 1: PHÔNG GIẤY & TƯỜNG (Nội dung dài) --- */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Phông Giấy & Tường</h4>
                  
                  {/* Tường Vô Cực */}
                  <div className="mb-4">
                    <h5 className="text-base font-semibold mb-2">Tường Trắng Vô Cực</h5>
                    <div className="flex items-center gap-2">
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: '#ffffff' }}
                      />
                      <span className="text-sm">Sử dụng miễn phí</span>
                    </div>
                  </div>

                  {/* Phông Giấy */}
                  <div>
                    <h5 className="text-base font-semibold mb-2">Phông Giấy (11x2.7m)</h5>
                    <div className="flex flex-wrap gap-x-5 gap-y-3 mt-3">
                      {paperColors.map((color) => (
                        <div
                          key={color.name}
                          className={styles.colorSwatch}
                          style={{ backgroundColor: color.hex }}
                          title={color.name} // Hiện tên khi hover
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phụ Kiện Chung */}
                  <div>
                    <h4 className="text-lg font-semibold my-4">Phụ Kiện Chung</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-sm">
                      <li>Chóa đèn, Bandoor, Dù (đen/trắng/bạc)</li>
                      <li>Tản sáng, Hắt sáng 5-in-1, Poly (đen/trắng)</li>
                      <li>Gel màu, Snoot (gom sáng), Ngàm</li>
                      <li>C-stand, Boom, Chân đèn các loại</li>
                      <li>Bàn chụp sản phẩm, Ghế đôn</li>
                      <li>Bàn ủi hơi nước, Sào treo quần áo</li>
                      <li>Và nhiều phụ kiện khác...</li>
                    </ul>
                  </div>

                </div>

                {/* --- CỘT 2: VẢI, THẢM & PHỤ KIỆN (Nội dung ngắn hơn) --- */}
                <div>
                  {/* Phông Vải & Thảm */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">Phông Vải & Thảm</h4>
                    {/* Phông Vải */}
                    <div className="mb-4">
                      <h5 className="text-base font-semibold mb-2">Phông Vải</h5>
                      <div className="flex gap-12">
                        {/* Vải Trơn */}
                        <div>
                          <h6 className="text-sm font-semibold mb-2 opacity-70">Trơn</h6>
                          <div className="flex flex-wrap gap-x-4 gap-y-3">
                            {fabricColorsPlain.map((color) => (
                              <div
                                key={color.name}
                                className={styles.colorSwatch}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                        {/* Vải Loang */}
                        <div>
                          <h6 className="text-sm font-semibold mb-2 opacity-70">Loang</h6>
                          <div className="flex flex-wrap gap-x-4 gap-y-3">
                            {fabricColorsPatterned.map((color) => (
                              <div
                                key={color.name}
                                className={styles.colorSwatch}
                                style={{ 
                                  background: `radial-gradient(ellipse at center, ${color.hex} 50%, #5c5c5c 100%)`
                                }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Thảm Nỉ */}
                    <div>
                      <h5 className="text-base font-semibold mb-2">Thảm Nỉ (5x3.66m)</h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-3 mb-1">
                        {carpetColors.map((color) => (
                          <div
                            key={color.name}
                            className={styles.colorSwatch}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--foreground)]/70">
                        (Phụ phí setup thảm 100k)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Scene>

            <Scene id="thiet-bi-thue-them" onVisible={setActiveId}>
              <h2 className={styles.contentTitle}>Thiết Bị Thuê (Tính Phí)</h2>
              <p className="text-[var(--foreground)]/70 mb-6">
                Các thiết bị chuyên dụng cho nhu cầu cao hơn, vui lòng liên hệ trước để kiểm tra.
              </p>
              
              {/* Bảng giá trên desktop, layout thẻ trên mobile */}
              <div className="overflow-x-auto border border-[var(--foreground)]/30 rounded-lg">
                <table className="w-full min-w-full text-sm text-left">
                  <thead className="border-b border-[var(--foreground)]/30 bg-[var(--foreground)]/5">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Thiết Bị</th>
                      <th className="py-3 px-4 font-semibold">Giá Thuê</th>
                      <th className="py-3 px-4 font-semibold">Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalItems.map((item) => (
                      <tr key={item.name} className="border-b border-[var(--foreground)]/10">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">{item.price}</td>
                        <td className="py-3 px-4 text-[var(--foreground)]/70">
                          {item.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Scene>
            <Scene id="quy-dinh" onVisible={setActiveId}>
              <h2 className={styles.contentTitle}>Tiện ích & Quy Định Chung</h2>
              
              {/* THAY ĐỔI: Chuyển sang grid-cols-5 để chia 40% (col-span-2) / 60% (col-span-3) */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-6 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg">
                
                {/* Cột 1: Tiện Ích (40%) */}
                <div className="md:col-span-2"> {/* Sửa từ md:col-5 */}
                  <h4 className="text-lg font-semibold mb-4">Tiện ích Studio</h4>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Miễn phí hỗ trợ setup ánh sáng ban đầu.</li>
                    <li>Mini Canteen phục vụ (có tính phí).</li>
                    <li>Khu vực makeup riêng biệt, miễn phí.</li>
                    <li>Hỗ trợ bàn ủi hơi nước.</li>
                  </ul>
                </div>
                
                {/* Cột 2: Lưu Ý (60%) */}
                <div className="md:col-span-3"> {/* Sửa từ md:col-7 */}
                  <h4 className="text-lg font-semibold mb-4">Lưu Ý Chung</h4>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Hỗ trợ tối đa 7 người/ekip, phụ thu 50k/người nếu phát sinh.</li>
                    <li>Hỗ trợ thời gian makeup/chuẩn bị 01 tiếng trước giờ đặt.</li>
                    <li>Makeup/quay phim sử dụng khu vực makeup chung, không hỗ trợ đèn riêng (nếu quá 4 người).</li>
                    <li>Quý khách vui lòng xác nhận lịch và setup. Phí thuê tính từ giờ đã nhận phòng.</li>
                  </ul>
                </div>
              </div>
            </Scene>
          </main>
        </div>
      </Container>
      <BtsSection />
    </main>
  );
}