import React, { useState, useEffect } from "react";
import { FaCloudSun, FaGlobe, FaUsers, FaCheckCircle } from "react-icons/fa";

const About = () => {
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const targetUsersCount = 500000;

  // Live counting effect for Active Users
  useEffect(() => {
    const incrementCount = () => {
      if (activeUsersCount < targetUsersCount) {
        setActiveUsersCount((prevCount) =>
          Math.min(
            prevCount + Math.ceil(targetUsersCount / 200),
            targetUsersCount
          )
        );
      }
    };

    const interval = setInterval(incrementCount, 20);

    return () => clearInterval(interval);
  }, [activeUsersCount, targetUsersCount]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="container mx-auto p-8 pt-20">
        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900">
          About Climate Information Service App
        </h1>

        {/* Intro Section */}
        <div className="text-center mb-10">
          <p className="text-lg text-gray-700">
            Our Climate Information Service App offers real-time, accurate, and
            reliable weather data to keep you informed about weather changes
            worldwide. Whether you&apos;re planning a trip, monitoring your
            agricultural activities, or just want to be prepared for the day, we
            have got you covered.
          </p>
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="text-center">
              <FaCloudSun className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Real-Time Weather Data
              </h3>
              <p className="text-gray-600">
                Stay updated with the latest weather reports, including
                temperature, humidity, wind speed, and more, for any location.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <FaGlobe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Global Coverage
              </h3>
              <p className="text-gray-600">
                Our app provides weather updates for thousands of cities across
                more than 150 countries worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <FaCheckCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                High Accuracy
              </h3>
              <p className="text-gray-600">
                We pride ourselves on delivering weather forecasts with an
                accuracy rate of over 90%, helping you make informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-blue-50 p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Our Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            {/* Metric 1: Active Users with Counting Animation */}
            <div>
              <FaUsers className="h-10 w-10 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold text-blue-900">
                {activeUsersCount.toLocaleString()}+
              </h3>
              <p className="text-gray-600">Active Users</p>
            </div>

            {/* Metric 2 */}
            <div>
              <FaGlobe className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold text-blue-900">150+</h3>
              <p className="text-gray-600">Countries Covered</p>
            </div>

            {/* Metric 3 */}
            <div>
              <FaCheckCircle className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold text-blue-900">92%</h3>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Our Mission
          </h2>

          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
            Our mission is to empower individuals, farmers, and businesses with
            the tools to make weather-conscious decisions. Whether it is
            preparing for storms, optimizing agricultural productivity, or
            simply planning a weekend trip, our goal is to ensure you have the
            most accurate weather information at your fingertips.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Join Us Today
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Be part of our growing community and stay ahead of the weather.
            Download our app now and get instant access to reliable and
            up-to-date weather information!
          </p>

          <button className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-800 transition duration-300">
            Download the App
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
