import QuizForm from '../components/QuizForm';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    What are we watching?
                </h1>
                <p className="text-gray-400 mb-10 text-lg">
                    Stop scrolling. Start streaming. Let's find your perfect movie in 3 steps.
                </p>
                <QuizForm />
            </div>
        </div>
    );
};

export default Home;
