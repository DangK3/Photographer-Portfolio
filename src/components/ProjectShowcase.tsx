// src/components/ProjectShowcase.tsx
'use client'; 

import Image from 'next/image';
import Container from './Container';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
// Import ảnh (giữ nguyên)
import projectImg1 from '../assets/section_02/Portfolio_06.png';
import projectImg2 from '../assets/section_02/Portfolio_05.png';
import projectImg3 from '../assets/section_02/Portfolio_04.png';

const featuredProjects = [
  {
    id: 1,
    category: 'Thương mại',
    title: "Khoảnh khắc 'Playful' tại Sự kiện Dior",
    description:
      'Nắm bắt tinh thần trẻ trung, phá cách tại sự kiện độc quyền của Dior. Bức ảnh này là sự giao thoa giữa nét thanh lịch cổ điển của thương hiệu và một chút nổi loạn đương đại, thể hiện qua hình ảnh kẹo cao su.',
    credits: [
      { label: 'Client', value: 'Dior' },
      { label: 'Location', value: 'Pop-up Store, TP.HCM' },
      { label: 'Year', value: '2024' },
    ],
    image: projectImg1,
    link: '/projects/khoanh-khac-playful-dior',
    align: 'left',
  },
  {
    id: 2,
    category: 'Thời trang',
    title: "Hơi thở 'Golden Hour' cho Tạp chí L'Officiel",
    description:
      'Một bộ ảnh editorial khám phá sự kết nối giữa con người và thiên nhiên. Chúng tôi sử dụng ánh sáng vàng óng của buổi chiều tà để tôn lên sự mềm mại của chất liệu vải và trạng thái thư thái, an yên tuyệt đối.',
    credits: [
      { label: 'Magazine', value: "L'Officiel Vietnam" },
      { label: 'Stylist', value: 'Linh Tran' },
      { label: 'Location', value: 'Đồng cỏ lau, Đà Lạt' },
    ],
    image: projectImg2,
    link: '/projects/hoi-tho-golden-hour',
    align: 'right',
  },
  {
    id: 3,
    category: 'Cá nhân',
    title: "Dự án cá nhân: 'Ngọn lửa giữa Tuyết'",
    description:
      'Dự án cá nhân này khám phá sự tương phản giữa cái lạnh buốt của ngoại cảnh và hơi ấm nội tâm. Ngọn lửa tượng trưng cho hy vọng và sức sống mỏng manh trong một khung cảnh cô đơn, rộng lớn và tĩnh lặng.',
    credits: [
      { label: 'Concept', value: 'Oni Studio' },
      { label: 'Model', value: 'H.Dang' },
      { label: 'Location', value: 'Hokkaido, Japan' },
    ],
    image: projectImg3,
    link: '/projects/ngon-lua-giua-tuyet',
    align: 'left',
  },
];


// Component ProjectItem (Mục con)
function ProjectItem({ project }: { project: (typeof featuredProjects)[0] }) {
  const isImageLeft = project.align === 'right';
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ... (logic IntersectionObserver giữ nguyên)
    const item = itemRef.current;
    if (!item) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, 
      }
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      // ... (animation class giữ nguyên)
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center
                  transition-opacity duration-[2000ms] ease-out
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}
    >
      <div
        className={`w-full h-96 md:h-[500px] relative overflow-hidden rounded-lg shadow-lg
                    ${isImageLeft ? 'md:order-1' : 'md:order-2'}
                    transition-transform duration-[2000ms] ease-out
                    ${
                      isVisible
                        ? 'translate-x-0'
                        : isImageLeft
                        ? '-translate-x-40' 
                        : 'translate-x-40' 
                    }
                  `}
      >
        <Image
          src={project.image}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          quality={85}
          className="transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>

      <div
        className={`flex flex-col justify-center
                    ${isImageLeft ? 'md:order-2' : 'md:order-1'}
                    transition-transform duration-[2000ms] ease-out
                    ${
                      isVisible
                        ? 'translate-x-0'
                        : isImageLeft
                        ? 'translate-x-40' 
                        : '-translate-x-40' 
                    }
                  `}
      >
        <span className="text-sm uppercase tracking-widest text-[var(--glow-color)]">
          {project.category}
        </span>

        <h3 className="text-2xl md:text-3xl font-light mt-2 text-[var(--foreground)]">
          {project.title}
        </h3>

        <p className="mt-4 text-[var(--glow-color)]">
          {project.description}
        </p>
        
        <ul className="mt-5 space-y-2 text-sm text-[var(--glow-color)] border-l border-gray-200 dark:border-gray-700 pl-4">
          {project.credits.map((credit) => (
            <li key={credit.label}>
              <strong className="text-[var(--foreground)]">{credit.label}:</strong> {credit.value}
            </li>
          ))}
        </ul>

        <Link
          href={project.link}
          className="mt-6 inline-block font-medium text-[var(--foreground)] group"
        >
          Xem chi tiết dự án
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}

// Component Section chính
export default function ProjectShowcase() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    // ... (logic IntersectionObserver giữ nguyên)
    const title = titleRef.current;
    if (!title) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.5, 
      }
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className={`
        py-16 md:py-24 
        animated-gradient 
        overflow-hidden 
      `} // Nền gradient tự đổi màu (Đã đúng)
      style={{ minHeight: 0, fontSize: 'initial' }}
    >
      <Container>
        <div
          ref={titleRef}
          // ... (animation class giữ nguyên)
          className={`text-center mb-12 md:mb-20
                      transition-all duration-[2000ms] ease-out
                      ${
                        titleVisible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-20'
                      }
                    `}
        >
          {/* SỬA 6: Dùng biến CSS cho tiêu đề section */}
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-[var(--foreground)]">
            Dự Án Tiêu Biểu
          </h2>

          {/* SỬA 7: Dùng biến CSS cho phụ đề section */}
          <p className="text-lg md:text-xl text-[var(--glow-color)] mt-2">
            Câu chuyện và bối cảnh đằng sau những tác phẩm.
          </p>
        </div>

        {/* Danh sách các dự án */}
        <div className="space-y-16 md:space-y-24">
          {featuredProjects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}