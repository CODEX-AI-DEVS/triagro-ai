import poultryImage from "../assets/images/event1.png"; // Use your actual image path

const EventPoultryCalendar = () => {
  return (
    <div className="pt-24 pb-16 px-4 md:px-0 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="mb-12">
        {/* Featured Image */}
        <div className="relative mb-8">
          <img
            src={poultryImage}
            alt="2025 Poultry Calendar Release"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
          <div className="absolute top-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-md shadow-lg">
            <p className="text-xs font-semibold uppercase">Event Highlight</p>
          </div>
        </div>

        {/* Title, Date, and Venue */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-800 mb-4">
            2025 Poultry Calendar Release
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Hosted by Ghana Poultry Farmers Association
          </p>
          <p className="text-lg text-gray-600">
            <strong>Date:</strong> March 15, 2025 &bull; <strong>Venue:</strong>{" "}
            Accra International Trade Fair Center
          </p>
        </div>
      </header>

      {/* Event Content */}
      <article className="leading-relaxed text-lg text-gray-700 mb-8">
        <p className="mb-6">
          The **Ghana Poultry Farmers Association** is excited to announce the
          launch of the **2025 Poultry Calendar**. This comprehensive calendar
          provides essential guidance for poultry farmers, agribusiness
          stakeholders, and policymakers, offering detailed insights on optimal
          breeding times, vaccination schedules, and market trends for the
          poultry sector.
        </p>

        <p className="mb-6">
          Poultry farming plays a crucial role in Ghana’s agricultural economy,
          providing income and food security for many households. The release of
          the **2025 Poultry Calendar** is aimed at helping farmers optimize
          production cycles, improve flock health, and enhance profitability.
        </p>

        <p className="mb-6">
          The event will cover key areas, including:
          <ul className="list-disc list-inside ml-6">
            <li>Breeding and hatching timelines for 2025</li>
            <li>Vaccination schedules for disease prevention</li>
            <li>Best practices in feed management and animal care</li>
            <li>Market forecasts and pricing trends</li>
            <li>Poultry farming and climate-smart agriculture</li>
          </ul>
        </p>

        <p className="mb-6">
          This event is designed for poultry farmers, agricultural extension
          officers, and stakeholders across the value chain. Attendees will
          receive both digital and print copies of the **2025 Poultry Calendar**
          and will have access to expert discussions and panel sessions on
          maximizing poultry farming efficiency.
        </p>

        <p className="mb-6">
          The event will also provide valuable networking opportunities with
          industry leaders and poultry experts from across the country, along
          with the chance to explore the latest innovations in poultry farming
          equipment and technologies.
        </p>
      </article>

      {/* Event Highlights Section */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 px-6 py-4 my-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
          Event Highlights
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            Detailed **2025 Poultry Calendar** covering all regions of Ghana
          </li>
          <li className="mb-2">Expert panels and Q&A sessions</li>
          <li className="mb-2">
            Interactive workshops on poultry health and breeding management
          </li>
          <li className="mb-2">
            Market insights and pricing trends for the poultry sector
          </li>
          <li className="mb-2">
            Networking opportunities with industry experts
          </li>
        </ul>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-blue-50 border-l-4 border-blue-600 px-6 py-4 mb-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Register for the Event
        </h2>
        <p className="text-gray-700 mb-4">
          Do not miss this opportunity to gain insights into the **2025 Poultry
          Calendar** and connect with key players in the poultry industry.
          Secure your spot today!
        </p>
        <a
          href="/register"
          className="inline-block bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-700 transition-colors duration-300"
        >
          Register Now
        </a>
      </div>

      {/* Event Details */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-3xl font-semibold text-yellow-800 mb-6">
          Event Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Date</h4>
            <p className="text-gray-600">March 15, 2025</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Venue</h4>
            <p className="text-gray-600">
              Accra International Trade Fair Center
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Organizer</h4>
            <p className="text-gray-600">FSRP </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventPoultryCalendar;
