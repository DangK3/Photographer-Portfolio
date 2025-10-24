// components/ProjectInfo.tsx
import React from 'react'; // Import React khi dùng JSX trong TypeScript
import styles from '../app/styles/ProjectDetail.module.css';


// Định nghĩa interface cho props của ProjectInfo
interface ProjectInfoProps {
  description: string;
  client?: string;   // Dấu '?' cho biết đây là prop tùy chọn (optional)
  year?: string;
  location?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ description, client, year, location }) => {
  return (
    <div className={styles.projectInfo}>
      <p className={styles.description}>{description}</p>
      <div className={styles.credits}>
        {client && <p><strong>Client:</strong> {client}</p>}
        {year && <p><strong>Year:</strong> {year}</p>}
        {location && <p><strong>Location:</strong> {location}</p>}
      </div>
    </div>
  );
};

export default ProjectInfo;