import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.jpeg" 
                alt="UR Aerotech Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">UR AEROTECH</h3>
            <p className="text-primary-100">
              Leading provider of aircraft repair services and aviation parts.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-primary-100 hover:text-white transition">Services</Link></li>
              <li><Link href="/products" className="text-primary-100 hover:text-white transition">Products</Link></li>
              <li><Link href="/quote" className="text-primary-100 hover:text-white transition">Get Quote</Link></li>
              <li><Link href="/about" className="text-primary-100 hover:text-white transition">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-primary-100">Aircraft Structural Repair</li>
              <li className="text-primary-100">Aircraft Modification</li>
              <li className="text-primary-100">Service Bulletin Compliance</li>
              <li className="text-primary-100">Tool Rental</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-primary-100">
              <li>Email: info@uraerotech.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: Aviation District, City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-100">
          <p>&copy; {new Date().getFullYear()} UR Aerotech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
