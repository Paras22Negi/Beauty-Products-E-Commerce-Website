import React from "react";

function Support() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you! Your message has been submitted successfully.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-10 md:p-14 w-full max-w-4xl border border-gray-100">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          We’d love to hear from you! Please fill out the form below and our
          support team will reach out to you as soon as possible.
        </p>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 font-semibold mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="What's this about?"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              name="message"
              rows="6"
              required
              placeholder="Type your message here..."
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-pink-600 text-white font-semibold text-lg py-3 px-10 rounded-lg hover:bg-pink-700 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Or email us directly at{" "}
          <a
            href="mailto:support@example.com"
            className="text-pink-600 font-medium hover:underline"
          >
            support@example.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default Support;
