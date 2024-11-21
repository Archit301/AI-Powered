import React from "react";

const AboutSection = () => {
  return (
    <div className="container mx-auto p-6 space-y-12 mt-12">
    {/* About Header */}
    <div className="text-center space-y-4">
      <h2 className="text-4xl font-bold text-gray-800">About Me</h2>
      <p className="text-xl text-gray-600">
        A passionate final-year student with a keen interest in technology, development, and solving real-world problems.
      </p>
    </div>

    {/* About Content */}
    <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
      {/* Left Section: Text */}
      <div className="w-full md:w-1/2 space-y-6 text-gray-700">
        <h3 className="text-3xl font-semibold text-gray-800">Who Am I?</h3>
        <p className="text-lg leading-relaxed">
          I am a final-year student pursuing a degree in Computer Science with a focus on web development, data science, and software engineering. My passion for technology drives me to create impactful solutions that improve people's lives. Throughout my academic journey, I have gained hands-on experience in coding, project management, and research.
        </p>

        <h3 className="text-3xl font-semibold text-gray-800">My Journey</h3>
        <p className="text-lg leading-relaxed">
          Over the years, I've worked on numerous projects ranging from simple web applications to complex, full-stack systems. I have a strong foundation in both front-end and back-end technologies like HTML, CSS, JavaScript, React, Node.js, and PHP. I am also proficient in databases like MongoDB, MySQL, and PostgreSQL, and I enjoy tackling problems with innovative solutions.
        </p>

        <h3 className="text-3xl font-semibold text-gray-800">Skills & Expertise</h3>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <span className="text-xl text-blue-600">✔</span>
            <p className="text-lg">Web Development: React, HTML, CSS, Tailwind CSS, JavaScript</p>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-blue-600">✔</span>
            <p className="text-lg">Backend Development: Node.js, Express, PHP, MongoDB</p>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-blue-600">✔</span>
            <p className="text-lg">Database Management: MySQL, PostgreSQL, MongoDB</p>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-blue-600">✔</span>
            <p className="text-lg">Problem Solving: Data Structures & Algorithms (DSA)</p>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-blue-600">✔</span>
            <p className="text-lg">Version Control: Git, GitHub</p>
          </li>
        </ul>

        <h3 className="text-3xl font-semibold text-gray-800">Aspirations</h3>
        <p className="text-lg leading-relaxed">
          As I approach the end of my degree, I am excited to apply my knowledge in real-world scenarios. My goal is to work in a challenging and innovative environment where I can continue to grow as a developer, contribute to impactful projects, and make a meaningful difference through technology.
        </p>
      </div>

      {/* Right Section: Additional Info */}
      <div className="w-full md:w-1/2 space-y-6 text-gray-700">
        <h3 className="text-3xl font-semibold text-gray-800">What Drives Me</h3>
        <p className="text-lg leading-relaxed">
          I am deeply motivated by the opportunity to solve complex problems and improve systems. Whether it's optimizing a piece of code or designing a user-friendly interface, I thrive when I am challenged to think creatively and analytically. My passion for learning and my dedication to excellence fuel my continuous pursuit of self-improvement.
        </p>

        <h3 className="text-3xl font-semibold text-gray-800">In My Spare Time</h3>
        <p className="text-lg leading-relaxed">
          Outside of my academic work, I enjoy exploring new technologies, contributing to open-source projects, and staying up-to-date with industry trends. I am also an avid reader, with a particular interest in books about artificial intelligence, programming, and entrepreneurship. Additionally, I like to stay active by participating in outdoor activities such as hiking and cycling.
        </p>

        <h3 className="text-3xl font-semibold text-gray-800">Let's Connect</h3>
        <p className="text-lg leading-relaxed">
          I am always open to networking, collaborating on interesting projects, and sharing knowledge. Feel free to reach out to me via email or connect with me on LinkedIn. Let's build something great together!
        </p>
      </div>
    </div>
  </div>
  );
};

export default AboutSection;
