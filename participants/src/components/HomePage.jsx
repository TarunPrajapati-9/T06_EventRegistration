import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/events");
  };

  return (
    <div className="bg-base-200 select-none overflow-hidden">
      <div className="hero min-h-screen bg-base-200 flex items-center justify-center">
        <div className="hero-content grid grid-cols-1 md:grid-cols-2 gap-24 text-center md:text-left">
          {/* Image on the left */}
          <div className="max-w-md mx-auto md:mx-0">
            <img
              src="/lander.png"
              alt="landerImage"
              className="pointer-events-none"
            />
          </div>

          {/* Text on the right */}
          <div className="max-w-md">
            <h1 className="text-5xl font-bold animate-bounce">
              Welcome to the Platform of Future Event Planning!
            </h1>
            <p className="py-6 animate-pulse">
              &quot;Step into a world where every event is an adventure waiting
              to unfold. Discover, connect, and immerse yourself in
              unforgettable experiences with Eventify. Your gateway to a world
              of endless possibilities begins here.&quot;
            </p>
            <button
              className="btn btn-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
              onClick={handleClick}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <img
          src="/diamond.png"
          alt="/diamond"
          className="pointer-events-none"
        />
      </div>
      <div className="flex justify-center w-screen h-full">
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Events</div>
            <div className="stat-value">50+</div>
            <div className="stat-desc">From January 1st to March 1st</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Users</div>
            <div className="stat-value text-secondary">1,200</div>
            <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">New Registers</div>
            <div className="stat-value">200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
