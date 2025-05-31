import calendarImage from "../assets/images/event2.png"; // Add your image path

const EventMajorSeasonCropCalendar = () => {
  return (
    <div className="pt-24 pb-16 px-4 md:px-0 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="mb-12">
        {/* Featured Image */}
        <div className="relative mb-8">
          <img
            src={calendarImage}
            alt="2025 Major Season Crop Calendar Release"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
          <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
            <p className="text-xs font-semibold uppercase">Event Highlight</p>
          </div>
        </div>

        {/* Title, Date, and Venue */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            2025 Major Season Crop Calendar Release
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Hosted by Ghana Meteorological Agency (GMet)
          </p>
          <p className="text-lg text-gray-600">
            <strong>Date:</strong> January 12, 2025 &bull;{" "}
            <strong>Venue:</strong> Accra International Conference Centre
          </p>
        </div>
      </header>

      {/* Event Content */}
      <article className="leading-relaxed text-lg text-gray-700 mb-8">
        <p className="mb-6">
          The Ghana Meteorological Agency (GMet) is proud to announce the
          release of the **2025 Major Season Crop Calendar**. This event aims to
          support farmers, agricultural planners, and policymakers by providing
          timely and accurate information on crop planting schedules and
          expected rainfall patterns for the year. With Ghana’s agricultural
          sector highly dependent on seasonal rainfall, this crop calendar is a
          crucial tool for optimizing production and ensuring food security.
        </p>

        <p className="mb-6">
          The event will cover important topics such as:
          <ul className="list-disc list-inside ml-6">
            <li>Optimal planting periods for major crops in each region</li>
            <li>Rainfall forecasts for the 2025 major season</li>
            <li>
              Strategies for dealing with climate variability in agriculture
            </li>
            <li>Panel discussions with experts on crop resilience</li>
          </ul>
        </p>

        <p className="mb-6">
          The release of the **2025 Major Season Crop Calendar** will also offer
          participants a chance to network with agricultural experts, climate
          scientists, and fellow farmers. The calendar provides key insights on
          when to plant crops like maize, yam, cassava, and rice across Ghana’s
          diverse agro-climatic zones, helping to maximize yields and reduce the
          risk of crop failure due to unpredictable weather.
        </p>

        <p className="mb-6">
          This event is a must-attend for farmers, agricultural extension
          officers, policymakers, and all stakeholders involved in the
          agricultural value chain. Participants will receive printed copies of
          the calendar and have access to digital tools that integrate the
          calendar with live weather forecasts.
        </p>
      </article>

      {/* Key Information Section */}
      <div className="bg-green-50 border-l-4 border-green-600 px-6 py-4 my-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Event Highlights
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            **2025 Major Crop Calendar** for all regions of Ghana
          </li>
          <li className="mb-2">Expert panel discussions and Q&A sessions</li>
          <li className="mb-2">
            Interactive workshops on climate-smart agriculture
          </li>
          <li className="mb-2">
            Networking opportunities with agricultural experts and stakeholders
          </li>
          <li className="mb-2">Free digital tools and access to crop data</li>
        </ul>
      </div>

      {/* Call-to-Action */}
      <div className="bg-blue-50 border-l-4 border-blue-600 px-6 py-4 mb-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Register for the Event
        </h2>
        <p className="text-gray-700 mb-4">
          Do not miss out on the chance to access vital crop planning tools and
          connect with the best minds in agriculture and meteorology. Register
          now to reserve your spot at the **2025 Major Season Crop Calendar
          Release**.
        </p>
        <a
          href="/register"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors duration-300"
        >
          Register Now
        </a>
      </div>

      {/* Event Details */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-3xl font-semibold text-green-800 mb-6">
          Event Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Date</h4>
            <p className="text-gray-600">January 12, 2025</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Venue</h4>
            <p className="text-gray-600">
              Accra International Conference Centre
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Organizer</h4>
            <p className="text-gray-600">Ghana Meteorological Agency (GMet)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventMajorSeasonCropCalendar;
