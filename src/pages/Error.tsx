import { useRouteError, Link } from "react-router-dom";

const Error = () => {
  const error = useRouteError(); // Get the entire error object directly
  console.log(error);

  // Check if the error has a status property
  if (error === 404) {
    return (
      <main className="flex flex-col items-center justify-center gap-5  min-h-screen px-8">
        <h1 className="text-5xl font-semibold sm:text-9xl text-secondary">
          404
        </h1>
        <h2 className="text-5xl font-bold">page not found</h2>
        <p className="text-xl ">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link to="/" className="btn btn-primary mt-5">
          GO BACK HOME
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-5  min-h-screen px-8">
      <h1 className="text-5xl font-semibold sm:text-9xl text-secondary">404</h1>
      <h2 className="text-5xl font-bold">page not found</h2>
      <p className="text-xl ">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link to="/" className="btn btn-primary mt-5">
        GO BACK HOME
      </Link>
    </main>
  );
};

export default Error;
