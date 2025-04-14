import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../img/AvitoTaskLogo.png";
import { Modal } from "../Modal/Modal";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link to="/issues">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/issues">
          <button className={styles.navItem}>Все задачи</button>
        </Link>
        <Link to="/boards">
          <button className={styles.navItem}>Все проекты</button>
        </Link>
      </nav>
      <button className={styles.createButton} onClick={() => setIsOpen(true)}>
        Создать задачу
      </button>
      {isOpen && <Modal setIsOpen={setIsOpen} />}
    </header>
  );
};
