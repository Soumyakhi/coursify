import { useRef, useState } from "react";

const Videoplayer = ({ videoHQ, videoLQ }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(false);

    return (
        <div className="w-full max-w-xl mx-auto">
            <video
                ref={videoRef}
                controls
                className="w-full h-36 sm:h-[300px] md:h-[300px] rounded-lg shadow object-cover"
                autoPlay
                muted
                onError={() => setError(true)}
            >
                {!error && <source src={videoHQ} type="video/mp4" />}
                {error && <source src={videoLQ} type="video/mp4" />}
                Your browser does not support the video tag.
            </video>

            {error && (
                <p className="text-center text-red-500 mt-2">
                    Failed to load HQ video. Playing low-quality version.
                </p>
            )}
        </div>
    );
};

export default Videoplayer;
