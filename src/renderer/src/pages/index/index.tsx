interface Props {
  title?: string
}
export const Index: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  return <div className="index-container">Index</div>
}

export default Index
