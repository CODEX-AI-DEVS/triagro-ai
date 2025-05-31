import climateReportImage from "../assets/images/event3.png"; // Use your actual image path

const EventClimateReportRelease = () => {
  return (
    <div className="pt-24 pb-16 px-4 md:px-0 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="mb-12">
        {/* Featured Image */}
        <div className="relative mb-8">
          <img
            src={climateReportImage}
            alt="2024 Climate Report Release"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
            <p className="text-xs font-semibold uppercase">Event Highlight</p>
          </div>
        </div>

        {/* Title, Date, and Venue */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">
            2024 Climate Report Release
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Global Climate Analysis and Insights
          </p>
          <p className="text-lg text-gray-600">
            <strong>Date:</strong> December 12, 2024 &bull;{" "}
            <strong>Venue:</strong> Virtual Event
          </p>
        </div>
      </header>

      {/* Event Content */}
      <article className="leading-relaxed text-lg text-gray-700 mb-8">
        <p className="mb-6">
          The **2024 Climate Report** will be officially released by the World
          Meteorological Organization (WMO) and various global climate bodies.
          The report provides a comprehensive analysis of the past year climate
          trends, including temperature variations, extreme weather events, and
          progress in global climate initiatives. It highlights the impacts of
          climate change on vulnerable communities and offers predictions for
          future climate patterns.
        </p>

        <p className="mb-6">
          This years report emphasizes **Resilience in a Changing Climate**,
          focusing on strategies for mitigating the impacts of climate change
          and building resilience at both national and global levels. The event
          will bring together **leading climate scientists**, **policy makers**,
          and **environmental experts** to discuss key findings and the path
          forward.
        </p>

        <p className="mb-6">
          Topics covered in the **2024 Climate Report** include:
          <ul className="list-disc list-inside ml-6">
            <li>Global temperature and precipitation trends</li>
            <li>
              Climate-related natural disasters and their socioeconomic impact
            </li>
            <li>Greenhouse gas emissions and their global effects</li>
            <li>Advancements in climate modeling and prediction techniques</li>
            <li>
              Recommendations for climate adaptation and mitigation policies
            </li>
          </ul>
        </p>

        <p className="mb-6">
          Attendees will have access to interactive panel discussions, expert
          Q&A sessions, and downloadable resources, making this an essential
          event for anyone involved in climate science, policy, or sustainable
          development.
        </p>
      </article>

      {/* Event Highlights Section */}
      <div className="bg-blue-50 border-l-4 border-blue-600 px-6 py-4 my-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Key Highlights of the Event
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            Detailed breakdown of global climate trends in 2024
          </li>
          <li className="mb-2">
            Expert discussions on climate resilience and adaptation strategies
          </li>
          <li className="mb-2">
            Virtual panels with international climate scientists and
            policymakers
          </li>
          <li className="mb-2">
            Access to downloadable climate data and in-depth reports
          </li>
          <li className="mb-2">
            Insight into future projections and recommendations for 2025 and
            beyond
          </li>
        </ul>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-green-50 border-l-4 border-green-600 px-6 py-4 mb-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Register for the Climate Report Release
        </h2>
        <p className="text-gray-700 mb-4">
          Do not miss this opportunity to gain access to the latest climate
          data, and engage with global experts. Register for the virtual event
          and receive a free copy of the **2024 Climate Report**.
        </p>
        <a
          href="/register"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
        >
          Register Now
        </a>
      </div>

      {/* Event Details */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-3xl font-semibold text-blue-800 mb-6">
          Event Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Date</h4>
            <p className="text-gray-600">December 12, 2024</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Venue</h4>
            <p className="text-gray-600">
              Virtual Event (Global Participation)
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Organizer</h4>
            <p className="text-gray-600">
              World Meteorological Organization (WMO)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventClimateReportRelease;
