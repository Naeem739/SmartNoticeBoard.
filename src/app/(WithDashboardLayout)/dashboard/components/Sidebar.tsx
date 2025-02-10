import Link from 'next/link'
import { Home, BarChart2, Users, Settings } from 'lucide-react'

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-50`}>
      <Link href="/dashboard" className="text-white flex items-center space-x-2 px-4">
        <BarChart2 className="w-8 h-8" />
        <span className="text-2xl font-extrabold">Dashboard</span>
      </Link>
      <nav>
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Home className="inline-block mr-2 w-5 h-5" /> Home
        </Link>
        <Link href="/dashboard/analytics" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <BarChart2 className="inline-block mr-2 w-5 h-5" /> Analytics
        </Link>
        <Link href="/dashboard/admins" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Users className="inline-block mr-2 w-5 h-5" /> Admins
        </Link>
        <Link href="/dashboard/showNotices" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Settings className="inline-block mr-2 w-5 h-5" />All Notices 
        </Link>
  
        <Link href="/dashboard/creteNoticeInterface" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Settings className="inline-block mr-2 w-5 h-5" />NoticeBoard Interface
        </Link>
       


      </nav>
    </div>
  )
}

export default Sidebar

