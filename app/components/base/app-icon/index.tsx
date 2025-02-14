import type { FC } from 'react'
import classNames from 'classnames'
import style from './style.module.css'

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
  src?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
  src = './favicon.ico',
}) => {
  return (
    <span
      className={classNames(
        style.appIcon,
      )}
    >
      {src ? (
        <img
          src={src}
          alt="应用图标"
          className={style.image}
        />
      ) : (
        '🤖'
      )}
    </span>
  )
}

export default AppIcon
