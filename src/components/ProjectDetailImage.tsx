// src/components/ProjectDetailImage.tsx
import Image, { StaticImageData } from 'next/image';
import styles from '../app/styles/ProjectDetail.module.css';

interface ProjectDetailImageProps {
  imageUrl: string | StaticImageData;
  altText: string;
}

const ProjectDetailImage: React.FC<ProjectDetailImageProps> = ({ imageUrl, altText }) => {
  return (
    // Container này dùng để tạo hiệu ứng full-width
    <div className={styles.imageContainer}>
      <Image
        src={imageUrl}
        alt={altText}
        fill
        objectFit="cover"
        quality={90} // Tối ưu chất lượng ảnh
        priority // Ưu tiên tải ảnh này (vì nó là ảnh chính)
        className={styles.projectImage}
      />
    </div>
  );
};

export default ProjectDetailImage;