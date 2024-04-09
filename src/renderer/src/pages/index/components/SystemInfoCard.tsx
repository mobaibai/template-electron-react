interface Props {
  children?: React.ReactNode
}
export const SystemInfoCard: React.FC<Props> = ({ children }) => {
  return (
    <div className="system-info-card-component box-border w-full h-full">
      <div className="card w-full h-full p-1 relative rounded-2 text-1.5em bg-[rgba(25,28,41,0.3)]">
        {children}
      </div>
    </div>
  )
}

export default SystemInfoCard
