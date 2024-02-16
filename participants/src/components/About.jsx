import developers from "../constants/developers";

const About = () => {
  return (
    <div className="min-h-screen bg-base-100 select-none">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
          <div className="p-8 rounded-lg">
            <p className="text-lg mb-6">
              Welcome to Eventify! We are thrilled to provide you with a
              platform where you can discover, explore, and participate in a
              wide range of exciting events.
            </p>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-lg mb-6">
              We are a team of passionate individuals dedicated to creating an
              immersive and user-friendly experience for event organizers and
              participants alike. With our combined expertise in web
              development, design, and event management, we strive to bring
              people together through meaningful and memorable events.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg mb-6">
              Our mission is to connect people with events that inspire,
              entertain, and enrich their lives. Whether you&apos;re an event
              organizer looking to showcase your creativity or an enthusiastic
              participant eager to explore new opportunities, we&apos;re here to
              support you every step of the way.
            </p>
            <h2 className="text-2xl font-bold mb-4">Meet the Developers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {developers.map((item, index) => (
                <div className="p-6 rounded-lg shadow-lg" key={index}>
                  <img
                    src={item.imageUrl}
                    alt="Developer"
                    className="w-28 h-28 rounded-full mx-auto mb-4 pointer-events-none"
                  />
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p>Role: {item.role}</p>
                  <hr className="mt-3" />
                  <div className="flex justify-center mt-2  hover:opacity-70">
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/github.svg"
                        className="w-6 h-6 pointer-events-none"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
