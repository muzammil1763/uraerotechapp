import Link from 'next/link'

const services = [
  {
    title: 'Aircraft Structural Repair',
    description: 'Expert repair and restoration of aircraft structural components including fuselage, wings, and control surfaces.',
    features: [
      'Damage assessment and analysis',
      'Structural component repair',
      'Corrosion treatment',
      'Composite repairs',
      'Metal bonding and riveting'
    ]
  },
  {
    title: 'Aircraft Modification',
    description: 'Custom aircraft modifications to meet specific operational requirements and regulatory compliance.',
    features: [
      'Interior modifications',
      'Avionics upgrades',
      'Performance enhancements',
      'STC installations',
      'Custom engineering solutions'
    ]
  },
  {
    title: 'Service Bulletin Compliance',
    description: 'Comprehensive service bulletin compliance services ensuring your aircraft meets all manufacturer requirements.',
    features: [
      'SB assessment and planning',
      'Mandatory compliance work',
      'Documentation and records',
      'Airworthiness directives',
      'Regulatory compliance'
    ]
  },
  {
    title: 'Tool Rental Services',
    description: 'Professional-grade aviation tools and equipment available for short-term and long-term rental.',
    features: [
      'Specialized aviation tools',
      'Ground support equipment',
      'Testing equipment',
      'Calibrated instruments',
      'Flexible rental terms'
    ]
  },
  {
    title: 'Aviation Parts Supply',
    description: 'Extensive inventory of certified aviation parts and components from trusted manufacturers.',
    features: [
      'OEM and PMA parts',
      'Fast delivery options',
      'Quality assurance',
      'Competitive pricing',
      'Technical support'
    ]
  },
  {
    title: 'Maintenance Support',
    description: 'Comprehensive maintenance support services for aircraft operators and maintenance facilities.',
    features: [
      'Technical consultation',
      'Maintenance planning',
      'Parts sourcing',
      'Documentation support',
      '24/7 AOG support'
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto">
            Comprehensive aircraft repair and maintenance solutions delivered by certified professionals
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us to discuss your specific requirements and get a personalized quote
          </p>
          <Link href="/quote" 
            className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition text-lg">
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
