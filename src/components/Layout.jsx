import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div style={{
      
    }}>
      <Navbar />
      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  )
}