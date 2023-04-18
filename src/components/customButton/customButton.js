import styles from './customButton.module.css'

const CustomButton = ({
  backgroundColor = 'navy',
  hoverColor,
  borderColor = 'black',
  textColor = 'white',
  onClick,
  children,
}) => {
  return (
    <button
      className={styles.customButton}
      onClick={onClick}
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        color: textColor,
      }}
    >
      {children}
    </button>
  )
}

export default CustomButton
