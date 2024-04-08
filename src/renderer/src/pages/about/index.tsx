interface Props {
  title?: string
}
export const About: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  return <div className="about-container">About</div>
}

export default About
