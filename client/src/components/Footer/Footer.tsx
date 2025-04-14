import { FaVk, FaOdnoklassniki, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.description}>
        AvitoTask — ваша платформа для эффективного управления проектами. Мы
        стремимся сделать процесс планирования, организации и контроля задач
        простым и удобным для всех пользователей.
      </p>
      <div className={styles.socialLinks}>
        <a
          href="https://vk.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaVk className={styles.icon} data-testid="icon-vk" />
        </a>
        <a
          href="https://ok.ru"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaOdnoklassniki className={styles.icon} data-testid="icon-ok" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaYoutube className={styles.icon} data-testid="icon-youtube" />
        </a>
      </div>
    </footer>
  );
};
