import { ActiveLink } from '../ActiveLink';
import { SigInButton } from '../SignInButton';
import styles from './styles.module.scss';


export function Header() {

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo" />
        <nav>
          <ActiveLink href={"/"} activeClassName={styles.active}>
            <a className={styles.active} href="">Home</a>
          </ActiveLink>
          <ActiveLink href={"/posts"} activeClassName={styles.active}>
          <a >Posts</a>
          </ActiveLink>
        </nav>
        <SigInButton />
      </div>
    </header>
  )
}